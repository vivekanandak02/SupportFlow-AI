const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const dataStore = require('../services/dataStore');
const { classifyTicket } = require('../services/aiClassifier');

// GET /api/tickets - List all tickets (filtered by role, query params)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { category, priority, status, search } = req.query;
    const tickets = await dataStore.getTickets({
      category,
      priority,
      status,
      search,
      userId: req.user.id,
      role: req.user.role
    });
    res.json({ tickets });
  } catch (error) {
    console.error('Fetch tickets error:', error);
    res.status(500).json({ message: 'Failed to retrieve tickets.' });
  }
});

// GET /api/tickets/:id - Get single ticket
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const ticket = await dataStore.getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    // Role check: If employee, only allow access if they created it
    if (req.user.role === 'employee' && ticket.createdBy?._id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: You can only view your own tickets.' });
    }

    res.json({ ticket });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve ticket details.' });
  }
});

// POST /api/tickets - Create ticket (with automatic AI classification)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, category, priority, assignedTeam } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Ticket title and description are required.' });
    }

    // Run AI classification
    const aiResult = classifyTicket(title, description);

    // Use AI classification if not explicitly overridden
    const finalCategory = category || aiResult.category;
    const finalPriority = priority || aiResult.priority;
    const finalTeam = assignedTeam || aiResult.assignedTeam;

    const ticket = await dataStore.createTicket({
      title,
      description,
      category: finalCategory,
      priority: finalPriority,
      assignedTeam: finalTeam,
      createdBy: {
        _id: req.user.id,
        name: req.user.name,
        email: req.user.email
      },
      aiAnalysis: {
        confidence: aiResult.confidence,
        matchedKeywords: aiResult.matchedKeywords,
        matchedUrgencyWords: aiResult.matchedUrgencyWords,
        reasoning: aiResult.reasoning
      }
    });

    res.status(201).json({
      message: 'Ticket created and automatically routed successfully.',
      ticket
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ message: 'Failed to create ticket.' });
  }
});

// PUT /api/tickets/:id - Update ticket (status, priority, category, assignedTo)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const existing = await dataStore.getTicketById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    // Employees can only cancel/close their own tickets; admins can edit everything
    if (req.user.role === 'employee') {
      if (existing.createdBy?._id !== req.user.id) {
        return res.status(403).json({ message: 'Cannot edit tickets created by others.' });
      }
      // Allow employee to mark closed
      if (req.body.status && req.body.status !== 'closed') {
        return res.status(403).json({ message: 'Employees can only mark their tickets as closed.' });
      }
    }

    const { status, priority, category, assignedTo, assignedTeam } = req.body;
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (category !== undefined) updates.category = category;
    if (assignedTo !== undefined) updates.assignedTo = assignedTo;
    if (assignedTeam !== undefined) updates.assignedTeam = assignedTeam;

    const updatedTicket = await dataStore.updateTicket(req.params.id, updates);
    res.json({
      message: 'Ticket updated successfully',
      ticket: updatedTicket
    });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ message: 'Failed to update ticket.' });
  }
});

// POST /api/tickets/:id/comments - Add comment / activity note
router.post('/:id/comments', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text cannot be empty.' });
    }

    const ticket = await dataStore.getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    // Role check
    if (req.user.role === 'employee' && ticket.createdBy?._id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied to this ticket.' });
    }

    const updated = await dataStore.addTicketComment(req.params.id, {
      author: req.user.name,
      text: text.trim(),
      isAi: false
    });

    res.status(201).json({
      message: 'Comment added',
      ticket: updated
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to post comment.' });
  }
});

// DELETE /api/tickets/:id - Delete ticket (Admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators can delete tickets.' });
    }

    const success = await dataStore.deleteTicket(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    res.json({ message: 'Ticket deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete ticket.' });
  }
});

module.exports = router;
