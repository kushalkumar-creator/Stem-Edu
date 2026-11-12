/**
 * Community Hub Controller (P2-11)
 * Peer study discussion channels with Saarthi AI Bot Assistant.
 */
const { supabaseAdmin } = require('../utils/supabaseAdmin');

const DEFAULT_CHANNELS = [
  { slug: 'general-chat', name: 'General Discussion', subject: 'All', description: 'General study discussion, announcements, and peer queries' },
  { slug: 'physics-lounge', name: 'Physics Doubts & Concepts', subject: 'Physics', description: 'Mechanics, Electromagnetism, Optics, and CBSE Class 10/12 discussions' },
  { slug: 'chemistry-lab', name: 'Chemistry Reactions & Formulas', subject: 'Chemistry', description: 'Organic, Inorganic, Physical chemistry problem-solving' },
  { slug: 'biology-hub', name: 'Biology Life Sciences', subject: 'Biology', description: 'Diagrams, genetics, human physiology, and botanical concepts' },
  { slug: 'maths-den', name: 'Mathematics Problem Solvers', subject: 'Mathematics', description: 'Calculus, Vectors, Matrices, and CBSE sample papers' }
];

const SEED_MESSAGES = {
  'general-chat': [
    { id: 'm1', user_name: 'Aarav Sharma', content: 'Hey everyone! Has anyone tried the new virtual 3D Ray Optics simulation? It really helped me understand concave mirror sign conventions.', is_bot: false, created_at: new Date(Date.now() - 3600000 * 4).toISOString() },
    { id: 'm2', user_name: 'Priya Patel', content: 'Yes! The ray diagrams update live as you drag the object. Super intuitive!', is_bot: false, created_at: new Date(Date.now() - 3600000 * 2).toISOString() }
  ],
  'physics-lounge': [
    { id: 'm3', user_name: 'Rohan Gupta', content: 'Quick question: in Ohm’s law, why is the condition "temperature remaining constant" so important?', is_bot: false, created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 'm4', user_name: 'Saarthi AI Bot', content: 'Namaste Rohan! In metallic conductors, when temperature rises, lattice ions vibrate more vigorously. This increases the collision frequency of conduction electrons, which increases resistance (R = ρL/A). Thus, V/I remains strictly constant only if temperature is maintained constant!', is_bot: true, created_at: new Date(Date.now() - 3500000).toISOString() }
  ]
};

// In-memory channel messages store for instant peer interactivity
const runtimeMessages = { ...SEED_MESSAGES };

exports.getChannels = async (req, res) => {
  res.json({
    success: true,
    channels: DEFAULT_CHANNELS
  });
};

exports.getMessages = async (req, res) => {
  try {
    const { slug } = req.params;
    const msgs = runtimeMessages[slug] || [];
    res.json({
      success: true,
      channelSlug: slug,
      messages: msgs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.postMessage = async (req, res) => {
  try {
    const { slug } = req.params;
    const { content } = req.body;
    const user = req.user;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message content cannot be empty' });
    }

    const newMsg = {
      id: 'msg_' + Date.now(),
      user_name: user?.name || user?.email?.split('@')[0] || 'Student',
      content: content.trim(),
      is_bot: false,
      created_at: new Date().toISOString()
    };

    if (!runtimeMessages[slug]) runtimeMessages[slug] = [];
    runtimeMessages[slug].push(newMsg);

    // If message mentions @saarthi or asks a question, generate Saarthi bot reply
    if (content.toLowerCase().includes('@saarthi') || content.includes('?')) {
      setTimeout(() => {
        const botReply = {
          id: 'bot_' + Date.now(),
          user_name: 'Saarthi AI Bot',
          content: `Namaste ${newMsg.user_name}! In response to your question: "${content.replace('@saarthi', '').trim()}": Remember that in CBSE Class ${user?.classLevel || 10}, core concepts are grounded in NCERT observations and standard formulas. Check your textbook or ask me in the 1-on-1 Saarthi mentor tab if you want a complete step-by-step breakdown!`,
          is_bot: true,
          created_at: new Date().toISOString()
        };
        runtimeMessages[slug].push(botReply);
      }, 1000);
    }

    res.status(201).json({
      success: true,
      message: newMsg
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
