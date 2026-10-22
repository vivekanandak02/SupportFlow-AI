const fs = require('fs');
const path = require('path');
const { initialUsers, initialTickets } = require('../data/seedData');
const { getStatus } = require('../config/db');
const User = require('../models/User');
const Ticket = require('../models/Ticket');

const DATA_FILE = path.join(__dirname, '..', 'data', 'store.json');

// Initialize local store file if needed
function loadStore() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initialData = {
        users: initialUsers,
        tickets: initialTickets,
        nextTicketNumber: 1006
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading local data store:', err);
    return { users: initialUsers, tickets: initialTickets, nextTicketNumber: 1006 };
  }
}

function saveStore(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local data store:', err);
  }
}

// User operations
async function findUserByEmail(email) {
  if (getStatus()) {
    try {
      const u = await User.findOne({ email: email.toLowerCase() });
      if (u) return u.toObject();
    } catch (e) {
      // fallback
    }
  }
  const store = loadStore();
  return store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

async function findUserById(id) {
  if (getStatus()) {
    try {
      const u = await User.findById(id);
      if (u) return u.toObject();
    } catch (e) {}
  }
  const store = loadStore();
  return store.users.find(u => u._id === id);
}

async function createUser({ name, email, password, role = 'employee', department = 'General' }) {
  if (getStatus()) {
    try {
      const u = new User({ name, email, password, role, department });
      const saved = await u.save();
      return saved.toObject();
    } catch (e) {}
  }
  const store = loadStore();
  const newUser = {
    _id: 'user_' + Date.now(),
    name,
    email: email.toLowerCase(),
    password,
    role,
    department,
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    createdAt: new Date().toISOString()
  };
  store.users.push(newUser);
  saveStore(store);
  return newUser;
}

async function getAllUsers() {
  if (getStatus()) {
    try {
      const list = await User.find().select('-password');
      if (list && list.length) return list.map(l => l.toObject());
    } catch (e) {}
  }
  const store = loadStore();
  return store.users.map(({ password, ...rest }) => rest);
}

// Ticket operations
async function createTicket(ticketData) {
  const store = loadStore();
  const tktNumber = `TKT-${store.nextTicketNumber++}`;
  
  const newTicket = {
    _id: 'tkt_' + Date.now(),
    ticketNumber: tktNumber,
    title: ticketData.title,
    description: ticketData.description,
    category: ticketData.category || 'General Inquiry',
    priority: ticketData.priority || 'Medium',
    status: 'open',
    assignedTeam: ticketData.assignedTeam || 'Customer Support',
    assignedTo: ticketData.assignedTo || 'Unassigned',
    createdBy: ticketData.createdBy,
    aiAnalysis: ticketData.aiAnalysis || {
      confidence: 0.85,
      matchedKeywords: [],
      reasoning: 'Auto-processed ticket.'
    },
    comments: [
      {
        _id: 'c_' + Date.now(),
        author: 'AI Assistant',
        isAi: true,
        text: `Ticket auto-classified into ${ticketData.category} with ${ticketData.priority} priority. Assigned to ${ticketData.assignedTeam || 'Customer Support'}.`,
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (getStatus()) {
    try {
      const t = new Ticket(newTicket);
      await t.save();
    } catch (e) {}
  }

  store.tickets.unshift(newTicket);
  saveStore(store);
  return newTicket;
}

async function getTickets({ category, priority, status, search, userId, role }) {
  const store = loadStore();
  let list = [...store.tickets];

  // If user is employee and not admin, only show their own tickets
  if (role === 'employee' && userId) {
    list = list.filter(t => t.createdBy && t.createdBy._id === userId);
  }

  if (category && category !== 'All') {
    list = list.filter(t => t.category.toLowerCase() === category.toLowerCase());
  }

  if (priority && priority !== 'All') {
    list = list.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
  }

  if (status && status !== 'All') {
    list = list.filter(t => t.status.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const s = search.toLowerCase();
    list = list.filter(t => 
      t.title.toLowerCase().includes(s) ||
      t.ticketNumber.toLowerCase().includes(s) ||
      t.description.toLowerCase().includes(s) ||
      (t.assignedTeam && t.assignedTeam.toLowerCase().includes(s)) ||
      (t.createdBy?.name && t.createdBy.name.toLowerCase().includes(s))
    );
  }

  // Sort: Urgent & High first or newest first
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return list;
}

async function getTicketById(id) {
  const store = loadStore();
  return store.tickets.find(t => t._id === id || t.ticketNumber === id);
}

async function updateTicket(id, updates) {
  const store = loadStore();
  const index = store.tickets.findIndex(t => t._id === id || t.ticketNumber === id);
  if (index === -1) return null;

  const current = store.tickets[index];
  const updated = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  store.tickets[index] = updated;
  saveStore(store);

  if (getStatus()) {
    try {
      await Ticket.findByIdAndUpdate(current._id, updated);
    } catch (e) {}
  }

  return updated;
}

async function addTicketComment(id, { author, text, isAi = false }) {
  const store = loadStore();
  const index = store.tickets.findIndex(t => t._id === id || t.ticketNumber === id);
  if (index === -1) return null;

  const newComment = {
    _id: 'c_' + Date.now(),
    author,
    text,
    isAi,
    createdAt: new Date().toISOString()
  };

  if (!store.tickets[index].comments) {
    store.tickets[index].comments = [];
  }
  store.tickets[index].comments.push(newComment);
  store.tickets[index].updatedAt = new Date().toISOString();

  saveStore(store);
  return store.tickets[index];
}

async function deleteTicket(id) {
  const store = loadStore();
  const index = store.tickets.findIndex(t => t._id === id || t.ticketNumber === id);
  if (index === -1) return false;

  store.tickets.splice(index, 1);
  saveStore(store);
  return true;
}

async function getAnalyticsStats() {
  const store = loadStore();
  const tickets = store.tickets;

  const total = tickets.length;
  const open = tickets.filter(t => t.status === 'open').length;
  const inProgress = tickets.filter(t => t.status === 'in_progress').length;
  const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  const urgentCount = tickets.filter(t => t.priority === 'Urgent').length;
  const highCount = tickets.filter(t => t.priority === 'High').length;

  const byCategory = {};
  const byPriority = { Urgent: 0, High: 0, Medium: 0, Low: 0 };
  const byStatus = { open: 0, in_progress: 0, resolved: 0, closed: 0 };

  tickets.forEach(t => {
    byCategory[t.category] = (byCategory[t.category] || 0) + 1;
    if (byPriority[t.priority] !== undefined) byPriority[t.priority]++;
    if (byStatus[t.status] !== undefined) byStatus[t.status]++;
  });

  const avgConfidence = total > 0
    ? (tickets.reduce((acc, t) => acc + (t.aiAnalysis?.confidence || 0.85), 0) / total * 100).toFixed(1)
    : 92.5;

  return {
    total,
    open,
    inProgress,
    resolved,
    urgentCount,
    highCount,
    resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
    avgConfidence: `${avgConfidence}%`,
    byCategory,
    byPriority,
    byStatus
  };
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  getAllUsers,
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  addTicketComment,
  deleteTicket,
  getAnalyticsStats
};
