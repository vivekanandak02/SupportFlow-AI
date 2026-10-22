const bcrypt = require('bcryptjs');

const defaultPasswordHash = bcrypt.hashSync('admin123', 10);
const userPasswordHash = bcrypt.hashSync('user123', 10);

const initialUsers = [
  {
    _id: 'user_admin_1',
    name: 'Sarah Connor (Admin)',
    email: 'admin@supportflow.ai',
    password: defaultPasswordHash,
    role: 'admin',
    department: 'Operations',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-01-10T09:00:00Z').toISOString()
  },
  {
    _id: 'user_agent_1',
    name: 'Alex Rivera (Staff)',
    email: 'alex@supportflow.ai',
    password: userPasswordHash,
    role: 'admin',
    department: 'Engineering & DevOps',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-01-12T10:00:00Z').toISOString()
  },
  {
    _id: 'user_emp_1',
    name: 'David Chen (Employee)',
    email: 'user@supportflow.ai',
    password: userPasswordHash,
    role: 'employee',
    department: 'Sales',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-01-15T11:00:00Z').toISOString()
  },
  {
    _id: 'user_emp_2',
    name: 'Elena Rostova',
    email: 'elena@supportflow.ai',
    password: userPasswordHash,
    role: 'employee',
    department: 'Marketing',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-01-16T12:00:00Z').toISOString()
  }
];

const initialTickets = [
  {
    _id: 'tkt_1001',
    ticketNumber: 'TKT-1001',
    title: 'Production Database Connection Timeout (500 Internal Error)',
    description: 'Our analytics dashboard is failing to connect to the PostgreSQL production cluster. Users are getting intermittent 500 error screens and slow queries.',
    category: 'Technical',
    priority: 'Urgent',
    status: 'in_progress',
    assignedTeam: 'Engineering & DevOps',
    assignedTo: 'Alex Rivera (Staff)',
    createdBy: {
      _id: 'user_emp_1',
      name: 'David Chen (Employee)',
      email: 'user@supportflow.ai'
    },
    aiAnalysis: {
      confidence: 0.96,
      matchedKeywords: ['database', 'timeout', '500', 'error'],
      reasoning: 'Urgent production outage keywords detected. High business continuity risk.'
    },
    comments: [
      {
        _id: 'c_1',
        author: 'AI Router',
        isAi: true,
        text: 'Ticket auto-classified as Technical / Urgent. Dispatched alert to Engineering & DevOps channel.',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        _id: 'c_2',
        author: 'Alex Rivera (Staff)',
        text: 'Investigating connection pool limits on AWS RDS cluster. Applying hotfix.',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    _id: 'tkt_1002',
    ticketNumber: 'TKT-1002',
    title: 'Duplicate charge on corporate credit card for Enterprise tier',
    description: 'We were billed twice ($499 x 2) on our invoice for this month. Please issue a refund for the duplicate transaction and correct the next billing cycle.',
    category: 'Billing',
    priority: 'High',
    status: 'open',
    assignedTeam: 'Finance & Accounts',
    assignedTo: 'Unassigned',
    createdBy: {
      _id: 'user_emp_2',
      name: 'Elena Rostova',
      email: 'elena@supportflow.ai'
    },
    aiAnalysis: {
      confidence: 0.94,
      matchedKeywords: ['billed', 'charge', 'invoice', 'refund', 'credit card'],
      reasoning: 'Direct payment discrepancy requiring prompt financial reconciliation.'
    },
    comments: [
      {
        _id: 'c_3',
        author: 'AI Router',
        isAi: true,
        text: 'Categorized as Billing with High priority due to duplicate payment dispute.',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    _id: 'tkt_1003',
    ticketNumber: 'TKT-1003',
    title: 'Cannot reset 2FA Authenticator on new company phone',
    description: 'I recently switched to a new iPhone and lost access to Google Authenticator. Need administrator reset of MFA tokens to regain portal access.',
    category: 'Account Access',
    priority: 'High',
    status: 'resolved',
    assignedTeam: 'Identity & Security',
    assignedTo: 'Sarah Connor (Admin)',
    createdBy: {
      _id: 'user_emp_1',
      name: 'David Chen (Employee)',
      email: 'user@supportflow.ai'
    },
    aiAnalysis: {
      confidence: 0.95,
      matchedKeywords: ['reset', '2fa', 'authenticator', 'mfa', 'access'],
      reasoning: 'Authentication lockout detected. Routed to Identity & Security.'
    },
    comments: [
      {
        _id: 'c_4',
        author: 'Sarah Connor (Admin)',
        text: 'Identity verified over secure channel. Temporary one-time backup codes dispatched. 2FA reset completed.',
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    _id: 'tkt_1004',
    ticketNumber: 'TKT-1004',
    title: 'Add export to CSV and Excel in monthly reporting',
    description: 'It would be really helpful if we could export the ticket metrics and resolution time breakdown directly into CSV and Excel formats for executive reviews.',
    category: 'Feature Request',
    priority: 'Low',
    status: 'open',
    assignedTeam: 'Product Management',
    assignedTo: 'Unassigned',
    createdBy: {
      _id: 'user_emp_2',
      name: 'Elena Rostova',
      email: 'elena@supportflow.ai'
    },
    aiAnalysis: {
      confidence: 0.91,
      matchedKeywords: ['export', 'helpful', 'feature', 'suggestion'],
      reasoning: 'Non-blocking usability enhancement routed to Product backlog.'
    },
    comments: [],
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    _id: 'tkt_1005',
    ticketNumber: 'TKT-1005',
    title: 'Where can I find the API documentation for webhook integrations?',
    description: 'Looking for the developer guide on setting up custom webhooks when a ticket changes status. Is there an interactive Swagger or Postman collection?',
    category: 'General Inquiry',
    priority: 'Low',
    status: 'resolved',
    assignedTeam: 'Customer Success',
    assignedTo: 'Sarah Connor (Admin)',
    createdBy: {
      _id: 'user_emp_1',
      name: 'David Chen (Employee)',
      email: 'user@supportflow.ai'
    },
    aiAnalysis: {
      confidence: 0.88,
      matchedKeywords: ['documentation', 'guide', 'where can i', 'help'],
      reasoning: 'Informational documentation request handled by Customer Success.'
    },
    comments: [
      {
        _id: 'c_5',
        author: 'Sarah Connor (Admin)',
        text: 'Sent docs link to /api/docs and shared public Postman collection.',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

module.exports = {
  initialUsers,
  initialTickets
};
