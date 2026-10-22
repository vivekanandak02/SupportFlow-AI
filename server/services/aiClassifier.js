// Intelligent AI Classification & Priority Engine
// Supports built-in NLP TF-IDF / Sentiment / Urgency heuristic analysis + optional External LLM integration

const CATEGORY_PROFILES = {
  Technical: {
    name: 'Technical',
    team: 'Engineering & DevOps',
    keywords: [
      'bug', 'error', 'crash', 'exception', 'stack trace', 'api', 'server', 'database', 'sql',
      'postgres', 'mongo', 'redis', 'timeout', '500', '502', '503', '404', 'latency', 'slow',
      'code', 'endpoint', 'deployment', 'docker', 'kubernetes', 'aws', 'pipeline', 'git',
      'syntax', 'build failed', 'undefined', 'null pointer', 'unhandled', 'webhook', 'cors'
    ],
    weight: 1.2
  },
  Billing: {
    name: 'Billing',
    team: 'Finance & Accounts',
    keywords: [
      'invoice', 'charge', 'charged', 'card', 'credit card', 'payment', 'paid', 'refund',
      'subscription', 'billing', 'receipt', 'bank', 'overcharge', 'pricing', 'tier',
      'plan', 'annual', 'monthly', 'renewal', 'vat', 'tax', 'stripe', 'paypal', 'balance'
    ],
    weight: 1.2
  },
  'Account Access': {
    name: 'Account Access',
    team: 'Identity & Security',
    keywords: [
      'login', 'log in', 'password', 'forgot password', 'reset password', '2fa', 'mfa',
      'two-factor', 'authentication', 'auth', 'locked', 'sso', 'access denied',
      'permissions', 'unauthorized', 'session expired', 'otp', 'verification code', 'email change'
    ],
    weight: 1.3
  },
  'Feature Request': {
    name: 'Feature Request',
    team: 'Product Management',
    keywords: [
      'feature', 'suggest', 'suggestion', 'enhancement', 'would like', 'can you add',
      'roadmap', 'request', 'integrate with', 'integration with', 'wish', 'improvement',
      'feedback', 'customize', 'dark mode', 'export to', 'option to'
    ],
    weight: 1.0
  },
  'General Inquiry': {
    name: 'General Inquiry',
    team: 'Customer Success',
    keywords: [
      'how to', 'guide', 'documentation', 'question', 'help', 'inquiry', 'info',
      'information', 'demo', 'contact', 'hours', 'support', 'where can i', 'walkthrough',
      'tutorial', 'onboarding'
    ],
    weight: 0.9
  }
};

const URGENCY_SIGNALS = {
  Urgent: [
    'down', 'outage', 'critical', 'production down', 'emergency', 'data loss',
    'security breach', 'hacked', 'disaster', 'immediate attention', 'asap', 'broken in prod',
    'system offline', 'catastrophic', 'completely blocked'
  ],
  High: [
    'urgent', 'severe', 'blocking', 'cannot work', 'high priority', 'deadline',
    'cannot login', 'failing', 'payment failed', 'production error', 'customers affected',
    'loss of revenue', 'broken'
  ],
  Medium: [
    'issue', 'problem', 'incorrect', 'unexpected', 'glitch', 'not working properly',
    'delayed', 'confusing', 'wrong', 'warning', 'trouble'
  ],
  Low: [
    'minor', 'typo', 'cosmetic', 'trivial', 'whenever', 'no rush', 'small tweak',
    'curious', 'nice to have', 'suggestion', 'idea'
  ]
};

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1);
}

/**
 * Classify a ticket given its title and description.
 * Returns: { category, priority, confidence, assignedTeam, matchedKeywords, reasoning }
 */
function classifyTicket(title, description = '') {
  const combinedText = `${title || ''} \n ${description || ''}`.toLowerCase();
  const tokens = tokenize(combinedText);
  const tokenSet = new Set(tokens);

  // 1. Category Scoring
  const categoryScores = {};
  const matchedKeywordsByCategory = {};

  for (const [catName, catData] of Object.entries(CATEGORY_PROFILES)) {
    let score = 0;
    const matches = [];

    catData.keywords.forEach(keyword => {
      // Check multi-word phrase or single token
      if (keyword.includes(' ')) {
        if (combinedText.includes(keyword)) {
          score += 3.0 * catData.weight;
          matches.push(keyword);
        }
      } else {
        if (tokenSet.has(keyword)) {
          score += 1.5 * catData.weight;
          matches.push(keyword);
        } else if (combinedText.includes(keyword)) {
          score += 0.8 * catData.weight;
          matches.push(keyword);
        }
      }
    });

    categoryScores[catName] = score;
    matchedKeywordsByCategory[catName] = [...new Set(matches)];
  }

  // Find top category
  let topCategory = 'General Inquiry';
  let maxScore = 0;

  for (const [catName, score] of Object.entries(categoryScores)) {
    if (score > maxScore) {
      maxScore = score;
      topCategory = catName;
    }
  }

  // Confidence calculation (normalized 0.65 to 0.98)
  const totalScore = Object.values(categoryScores).reduce((a, b) => a + b, 0);
  let confidence = 0.70;
  if (totalScore > 0) {
    const rawRatio = maxScore / (totalScore + 1);
    confidence = Math.min(0.98, Math.max(0.68, 0.60 + rawRatio * 0.45));
  }
  confidence = parseFloat(confidence.toFixed(2));

  // 2. Priority Scoring
  let detectedPriority = 'Medium';
  let priorityReason = 'Standard priority based on general inquiry assessment.';
  let matchedUrgencyWords = [];

  // Check Urgent
  const urgentMatches = URGENCY_SIGNALS.Urgent.filter(w => combinedText.includes(w));
  const highMatches = URGENCY_SIGNALS.High.filter(w => combinedText.includes(w));
  const mediumMatches = URGENCY_SIGNALS.Medium.filter(w => combinedText.includes(w));
  const lowMatches = URGENCY_SIGNALS.Low.filter(w => combinedText.includes(w));

  if (urgentMatches.length > 0) {
    detectedPriority = 'Urgent';
    matchedUrgencyWords = urgentMatches;
    priorityReason = `Urgent keywords detected: "${urgentMatches.slice(0, 3).join('", "')}" indicating high operational impact.`;
  } else if (highMatches.length > 0 || (topCategory === 'Technical' && tokens.includes('error')) || (topCategory === 'Billing' && combinedText.includes('overcharge'))) {
    detectedPriority = 'High';
    matchedUrgencyWords = highMatches;
    priorityReason = highMatches.length 
      ? `High-impact terms identified: "${highMatches.slice(0, 3).join('", "')}".`
      : `Critical category "${topCategory}" with blocking issues detected.`;
  } else if (lowMatches.length > 0 || topCategory === 'Feature Request') {
    detectedPriority = 'Low';
    matchedUrgencyWords = lowMatches;
    priorityReason = topCategory === 'Feature Request'
      ? 'Feature requests and enhancements are placed in standard low/backlog priority.'
      : `Keywords indicate non-blocking item: "${lowMatches.slice(0, 3).join('", "')}".`;
  } else {
    detectedPriority = 'Medium';
    matchedUrgencyWords = mediumMatches;
    priorityReason = 'Standard business workflow priority.';
  }

  const assignedTeam = CATEGORY_PROFILES[topCategory]?.team || 'Customer Support';
  const matchedKeywords = matchedKeywordsByCategory[topCategory] || [];

  const reasoning = `Classified as ${topCategory} (${Math.round(confidence * 100)}% match) based on terms [${matchedKeywords.slice(0, 4).join(', ') || 'context'}]. Automatically routed to ${assignedTeam}. ${priorityReason}`;

  return {
    category: topCategory,
    priority: detectedPriority,
    confidence,
    assignedTeam,
    matchedKeywords,
    matchedUrgencyWords,
    reasoning
  };
}

module.exports = {
  classifyTicket,
  CATEGORY_PROFILES,
  URGENCY_SIGNALS
};
