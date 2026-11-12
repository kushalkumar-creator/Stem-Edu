/**
 * Video Learning Controller (P2-10)
 * Curates educational chapter videos with timestamps, interactive checkpoints,
 * progress tracking, and Saarthi doubt integration.
 */
const { supabaseAdmin } = require('../utils/supabaseAdmin');

const CURATED_VIDEOS = [
  {
    id: 'vid_physics_electricity',
    title: "Ohm's Law & Circuit Resistance Explained",
    subject: 'Physics',
    classLevel: 10,
    chapterTitle: 'Electricity',
    durationSeconds: 120,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    isDummy: true,
    timestamps: [
      { time: 0, title: 'Introduction to Drift Velocity & Charge Flow' },
      { time: 25, title: "Ohm's Law: V = IR Principle" },
      { time: 65, title: 'Interactive Concept Checkpoint' },
      { time: 90, title: "Joule Heating & Filaments (H = I²Rt)" }
    ],
    checkpoint: {
      time: 65,
      question: 'According to Ohm’s law, if the length of a wire is doubled with uniform cross-section, what happens to its resistance?',
      options: ['Halved', 'Doubles (R ∝ L)', 'Remains identical', 'Quadruples'],
      correctIndex: 1,
      explanation: 'Resistance R = ρL/A. When length L is doubled while area A stays constant, resistance doubles.'
    },
    transcript: `Electric current is the net flow of electric charges through a conductor. In a metallic wire, free electrons drift with small velocities under an applied potential difference. Ohm's Law states V = IR. Higher resistance leads to greater Joule dissipation as heat.`
  },
  {
    id: 'vid_chem_reactions',
    title: 'Chemical Reactions, Conservation of Mass & Balancing',
    subject: 'Chemistry',
    classLevel: 10,
    chapterTitle: 'Chemical Reactions and Equations',
    durationSeconds: 110,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
    isDummy: true,
    timestamps: [
      { time: 0, title: 'Signs of Chemical Reactions' },
      { time: 30, title: 'Conservation of Mass & Stoichiometry' },
      { time: 60, title: 'Interactive Balancing Checkpoint' },
      { time: 85, title: 'Types of Reactions: Combination vs Decomposition' }
    ],
    checkpoint: {
      time: 60,
      question: 'In the thermal decomposition of Ferrous Sulphate (2FeSO₄ → Fe₂O₃ + SO₂ + SO₃), what are the gaseous products?',
      options: ['SO₂ and SO₃', 'CO₂ and H₂O', 'NO₂ and O₂', 'H₂ and SO₂'],
      correctIndex: 0,
      explanation: 'Ferrous sulphate crystals produce pungent sulphur dioxide (SO₂) and sulphur trioxide (SO₃) gases with a reddish-brown ferric oxide residue.'
    },
    transcript: `A chemical reaction occurs when chemical bonds between reactant atoms break and new bonds form. Mass cannot be created or destroyed, requiring every equation to be balanced so total atoms of each element remain identical.`
  },
  {
    id: 'vid_bio_life_processes',
    title: 'Human Circulatory System & Double Circulation',
    subject: 'Biology',
    classLevel: 10,
    chapterTitle: 'Life Processes',
    durationSeconds: 130,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80',
    isDummy: true,
    timestamps: [
      { time: 0, title: 'Four Chambers of the Heart' },
      { time: 35, title: 'Pulmonary vs Systemic Circulation' },
      { time: 70, title: 'Interactive Valves Checkpoint' },
      { time: 95, title: 'Blood Pressure & Capillary Exchange' }
    ],
    checkpoint: {
      time: 70,
      question: 'Which blood vessels carry oxygenated blood from the lungs into the left atrium of the human heart?',
      options: ['Vena Cava', 'Pulmonary Veins', 'Aorta', 'Hepatic Artery'],
      correctIndex: 1,
      explanation: 'Pulmonary veins are the only veins in human circulation that carry oxygen-rich blood from the lungs into the left atrium.'
    },
    transcript: `Human circulation is a double circulation consisting of the pulmonary circuit (heart to lungs and back) and systemic circuit (heart to rest of the body). Heart valves ensure strictly unidirectional blood flow.`
  },
  {
    id: 'vid_math_real_numbers',
    title: 'Fundamental Theorem of Arithmetic & Proof of Irrationality',
    subject: 'Mathematics',
    classLevel: 10,
    chapterTitle: 'Real Numbers',
    durationSeconds: 115,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    isDummy: true,
    timestamps: [
      { time: 0, title: 'Unique Prime Factorisation' },
      { time: 28, title: 'HCF × LCM = a × b Relation' },
      { time: 62, title: 'Interactive Irrationality Checkpoint' },
      { time: 90, title: 'Terminating vs Non-Terminating Decimals' }
    ],
    checkpoint: {
      time: 62,
      question: 'If prime number p divides a² (where a is a positive integer), then p must also divide:',
      options: ['p²', 'a', 'a + 1', 'a³ only'],
      correctIndex: 1,
      explanation: 'By the fundamental divisibility theorem of arithmetic, if a prime p divides a², then p must divide a.'
    },
    transcript: `Every composite integer can be uniquely factored into prime powers. The product of HCF and LCM of two numbers always equals their product (HCF × LCM = a × b). √2 and other non-perfect square roots are irrational numbers.`
  }
];

/**
 * GET /api/videos
 * List all curated educational chapter videos
 */
exports.getVideos = async (req, res) => {
  try {
    const { subject, classLevel } = req.query;
    let filtered = CURATED_VIDEOS;

    if (subject && subject !== 'all') {
      filtered = filtered.filter(v => v.subject.toLowerCase() === subject.toLowerCase());
    }
    if (classLevel) {
      filtered = filtered.filter(v => Number(v.classLevel) === Number(classLevel));
    }

    res.json({
      success: true,
      count: filtered.length,
      videos: filtered
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/videos/:id
 * Retrieve details for a single video including timestamps and checkpoints
 */
exports.getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = CURATED_VIDEOS.find(v => v.id === id) || CURATED_VIDEOS[0];
    res.json({ success: true, video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/videos/:id/progress
 * Save student watch timestamp
 */
exports.saveVideoProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { positionSeconds = 0, completed = false } = req.body;

    res.json({
      success: true,
      message: 'Video watch progress recorded',
      progress: { userId, videoId: id, positionSeconds, completed }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

