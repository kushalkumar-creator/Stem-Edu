/**
 * Virtual Learning Topics Data (Task P2-8)
 * Official CBSE Class 10 & 12 interactive simulations across Physics, Chemistry, Biology & Mathematics.
 */

const virtualTopicsData = [
  // 1. PHYSICS: Light & Optics (Ray Optics)
  {
    slug: 'light-and-optics',
    subject: 'physics',
    class_level: 10,
    board: 'CBSE',
    title: 'Light & Optics: Interactive Ray Tracer',
    title_hindi: 'प्रकाश और प्रकाशिकी: किरण आरेख सिमुलेशन',
    description: 'Explore reflection and refraction through spherical mirrors and lenses. Adjust focal length, object position, and view real-time image formations.',
    description_hindi: 'गोलीय दर्पणों और लेंसों द्वारा परावर्तन और अपवर्तन का अन्वेषण करें।',
    type: '3d',
    thumbnail: '/assets/simulations/optics.png',
    status: 'published',
    config: {
      defaultOpticalType: 'concave_mirror',
      focalLength: 30,
      objectDistance: 60,
      objectHeight: 20
    },
    notes: `### CBSE Ray Optics Summary
**Key Mirror Formula:** $\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$
**Lens Formula:** $\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}$
**Magnification:** $m = -\\frac{v}{u}$ (Mirror), $m = +\\frac{v}{u}$ (Lens)

**Rules for Ray Tracing:**
1. A ray parallel to the principal axis passes through (or appears to diverge from) the principal focus after reflection/refraction.
2. A ray passing through the optical center (or center of curvature) continues undeviated.
3. When $u = 2f$ (at $C$), a concave mirror forms a real, inverted image of the same size at $C$ ($v = 2f$).`,
    quiz: [
      {
        question: "Where is the image formed by a concave mirror when the object is placed at the center of curvature (C)?",
        options: ["At infinity", "At the focus (F)", "At the center of curvature (C)", "Between F and C"],
        correctIndex: 2,
        explanation: "When an object is placed at C (u = 2f), the reflected rays converge at C itself, forming a real, inverted image of identical size (m = -1)."
      },
      {
        question: "What is the sign of the focal length for a convex lens according to the Cartesian sign convention?",
        options: ["Negative", "Positive", "Zero", "Variable depending on object position"],
        correctIndex: 1,
        explanation: "By Cartesian sign convention, the principal focus of a convex lens lies behind the lens (to the right of the optical center), so its focal length is always positive."
      },
      {
        question: "If magnification m = -0.5 for a spherical mirror, what is the nature of the image?",
        options: ["Virtual, erect, enlarged", "Real, inverted, diminished", "Real, inverted, enlarged", "Virtual, erect, diminished"],
        correctIndex: 1,
        explanation: "A negative magnification indicates a real and inverted image. Since |m| = 0.5 < 1, the image is diminished to half the object size."
      }
    ]
  },

  // 2. CHEMISTRY: 3D Molecule Viewer & Chemical Bonding
  {
    slug: 'molecule-viewer',
    subject: 'chemistry',
    class_level: 10,
    board: 'CBSE',
    title: '3D Molecular Viewer & VSEPR Geometry',
    title_hindi: '3D आणविक संरचना और बंध कोण दर्शक',
    description: 'Rotate and inspect 3D ball-and-stick representations of fundamental covalent molecules (Methane, Water, Carbon Dioxide, Ammonia, Benzene).',
    description_hindi: 'मीथेन, जल, कार्बन डाइऑक्साइड, अमोनिया और बेंजीन की 3D आणविक संरचना का निरीक्षण करें।',
    type: 'molecule',
    thumbnail: '/assets/simulations/molecules.png',
    status: 'published',
    config: {
      defaultMolecule: 'methane',
      molecules: ['methane', 'water', 'ammonia', 'carbon_dioxide', 'benzene']
    },
    notes: `### Molecular Geometry (VSEPR Theory)
- **Methane ($CH_4$):** $sp^3$ hybridized carbon with 4 single C-H bonds arranged in a symmetric regular tetrahedron. Bond angle: $109.5^\\circ$.
- **Water ($H_2O$):** Central oxygen with 2 bond pairs and 2 lone pairs. Lone pair-lone pair repulsion compresses the H-O-H bond angle to $104.5^\\circ$ (Bent/V-shape).
- **Ammonia ($NH_3$):** Central nitrogen with 3 bond pairs and 1 lone pair. Trigonal pyramidal geometry with a bond angle of $107^\\circ$.
- **Carbon Dioxide ($CO_2$):** Linear geometry ($O=C=O$) with a bond angle of $180^\\circ$ and zero net dipole moment.
- **Benzene ($C_6H_6$):** Planar regular hexagonal ring with delocalized $\\pi$-electron aromatic system. All C-C bond lengths are equal (139 pm).`,
    quiz: [
      {
        question: "What is the H-C-H bond angle in a tetrahedral methane (CH₄) molecule?",
        options: ["90°", "109.5°", "120°", "180°"],
        correctIndex: 1,
        explanation: "In methane, the four sp³ hybrid orbitals point towards the four corners of a regular tetrahedron, giving an optimal bond angle of 109.5° to minimize repulsion."
      },
      {
        question: "Why is the bond angle in Water (H₂O) reduced from 109.5° to 104.5°?",
        options: ["Hydrogen bonding", "Lone pair - lone pair repulsion is stronger than bond pair repulsion", "Attraction between hydrogen atoms", "Triple bond formation"],
        correctIndex: 1,
        explanation: "According to VSEPR theory, lone pair-lone pair repulsion > lone pair-bond pair > bond pair-bond pair. The two lone pairs on oxygen push the two O-H bonds closer."
      },
      {
        question: "What is the net dipole moment of a Carbon Dioxide (CO₂) molecule?",
        options: ["Zero", "1.85 D", "0.5 D", "Undefined"],
        correctIndex: 0,
        explanation: "CO₂ is linear with bond angle 180°. The two equal and opposite C=O bond dipole vectors cancel each other out completely, resulting in a net dipole moment of zero."
      }
    ]
  },

  // 3. MATHEMATICS: Conic Sections 3D Explorer
  {
    slug: 'conic-sections',
    subject: 'mathematics',
    class_level: 11,
    board: 'CBSE',
    title: 'Conic Sections: 3D Cone Slicing Explorer',
    title_hindi: 'शंकु परिच्छेद: 3D शंकु कर्तन सिम्युलेटर',
    description: 'Cut a double circular cone with an adjustable planar angle to generate a circle, ellipse, parabola, and hyperbola in real-time.',
    description_hindi: 'काल्पनिक तल द्वारा द्वि-शंकु काटकर वृत्त, दीर्घवृत्त, परवलय तथा अतिपरवलय का निर्माण देखें।',
    type: '3d',
    thumbnail: '/assets/simulations/conics.png',
    status: 'published',
    config: {
      semiVerticalAngle: 45,
      initialPlaneAngle: 90
    },
    notes: `### CBSE Conic Sections Classification
Let $\\alpha$ be the semi-vertical angle of the double circular cone, and $\\beta$ be the angle between the cutting plane and the cone axis:
1. **Circle:** $\\beta = 90^\\circ$ (Cutting plane is perpendicular to the cone axis). Equation: $x^2 + y^2 = r^2$, eccentricity $e = 0$.
2. **Ellipse:** $\\alpha < \\beta < 90^\\circ$ (Cutting plane cuts through one entire nappe). Equation: $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$, eccentricity $0 < e < 1$.
3. **Parabola:** $\\beta = \\alpha$ (Cutting plane is parallel to a generator line of the cone). Equation: $y^2 = 4ax$, eccentricity $e = 1$.
4. **Hyperbola:** $0 \\le \\beta < \\alpha$ (Cutting plane cuts through both upper and lower nappes). Equation: $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$, eccentricity $e > 1$.`,
    quiz: [
      {
        question: "When the cutting plane angle β equals the cone's semi-vertical angle α (β = α), which conic section is generated?",
        options: ["Circle", "Ellipse", "Parabola", "Hyperbola"],
        correctIndex: 2,
        explanation: "When the plane is parallel to the generator line (β = α), the intersection curve is an open, symmetrical parabola with eccentricity e = 1."
      },
      {
        question: "What is the eccentricity (e) of an ellipse?",
        options: ["e = 0", "0 < e < 1", "e = 1", "e > 1"],
        correctIndex: 1,
        explanation: "An ellipse has an eccentricity strictly between 0 and 1. (e = 0 corresponds to a circle, e = 1 to a parabola, and e > 1 to a hyperbola)."
      },
      {
        question: "Which conic section cuts through both the upper and lower nappes of a double cone?",
        options: ["Parabola", "Hyperbola", "Ellipse", "Circle"],
        correctIndex: 1,
        explanation: "When the plane angle β is less than α (0 ≤ β < α), the cutting plane cuts both nappes, producing two mirrored branches of a hyperbola."
      }
    ]
  },

  // 4. BIOLOGY: Human Heart & Double Circulation
  {
    slug: 'heart-and-circulation',
    subject: 'biology',
    class_level: 10,
    board: 'CBSE',
    title: 'Human Heart & Double Circulatory Cycle',
    title_hindi: 'मानव हृदय और दोहरा परिसंचरण तंत्र',
    description: 'Inspect the 4-chambered human heart in 3D. Control cardiac BPM, trace oxygenated vs deoxygenated blood pathways, and understand systemic vs pulmonary circulation.',
    description_hindi: '3D में 4-कक्षीय मानव हृदय का अन्वेषण करें और ऑक्सीकृत व विऑक्सीकृत रक्त परिसंचरण को समझें।',
    type: '3d',
    thumbnail: '/assets/simulations/heart.png',
    status: 'published',
    config: {
      defaultBpm: 72,
      showLabels: true
    },
    notes: `### Double Circulation in Humans (CBSE Class 10: Life Processes)
Humans have a 4-chambered heart to keep oxygenated and deoxygenated blood completely separate, ensuring high efficiency.

**The Pathway of Blood:**
1. **Deoxygenated Blood:** Vena Cava collects blood from tissues $\\rightarrow$ **Right Atrium** $\\rightarrow$ Tricuspid Valve $\\rightarrow$ **Right Ventricle** $\\rightarrow$ Pulmonary Artery $\\rightarrow$ **Lungs** (oxygenation occurs in alveoli).
2. **Oxygenated Blood:** Pulmonary Veins carry oxygen-rich blood $\\rightarrow$ **Left Atrium** $\\rightarrow$ Bicuspid (Mitral) Valve $\\rightarrow$ **Left Ventricle** $\\rightarrow$ Aorta $\\rightarrow$ Systemic circulation to all body organs.

**Key Definitions:**
- **Systole:** Contraction phase of the heart chambers (pumping blood out).
- **Diastole:** Relaxation phase of the heart chambers (filling with blood).
- **Normal Blood Pressure:** 120/80 mm of Hg (Systolic/Diastolic measured with a sphygmomanometer).`,
    quiz: [
      {
        question: "Which chamber of the human heart has the thickest muscular wall?",
        options: ["Right Atrium", "Right Ventricle", "Left Atrium", "Left Ventricle"],
        correctIndex: 3,
        explanation: "The Left Ventricle has the thickest muscular walls because it must exert high pressure to pump oxygenated blood throughout the entire systemic circulation of the body."
      },
      {
        question: "Which blood vessel carries oxygen-rich blood from the lungs into the left atrium of the heart?",
        options: ["Pulmonary Artery", "Pulmonary Vein", "Vena Cava", "Aorta"],
        correctIndex: 1,
        explanation: "The Pulmonary Vein is an exception among veins: it carries oxygenated blood from the lungs back to the left atrium of the heart."
      },
      {
        question: "Why do heart valves exist between the atria and ventricles?",
        options: ["To speed up heartbeat", "To prevent backflow of blood when ventricles contract", "To filter bacteria", "To mix blood for higher temperature"],
        correctIndex: 1,
        explanation: "Valves (tricuspid and bicuspid/mitral) ensure that blood flows in only one direction and prevents backflow into the atria during ventricular systole."
      }
    ]
  },

  // 5. PHYSICS: Waves & Sound Interference
  {
    slug: 'waves-and-sound',
    subject: 'physics',
    class_level: 10,
    board: 'CBSE',
    title: 'Waves & Sound: Frequency, Amplitude & Pitch',
    title_hindi: 'तरंगें और ध्वनि: आवृत्ति, आयाम और तारत्व',
    description: 'Manipulate frequency, amplitude, and speed of longitudinal sound waves and transverse waves. Visualize compression, rarefaction, and harmonic superposition.',
    description_hindi: 'अनुदैर्ध्य ध्वनि तरंगों और अनुप्रस्थ तरंगों की आवृत्ति और आयाम को बदलकर देखें।',
    type: 'graph',
    thumbnail: '/assets/simulations/waves.png',
    status: 'published',
    config: {
      defaultFrequency: 5,
      defaultAmplitude: 30,
      waveSpeed: 340
    },
    notes: `### Characteristics of Sound Waves
- **Wave Relationship:** $v = \\nu \\cdot \\lambda$ (Speed = Frequency $\\times$ Wavelength).
- **Pitch:** Determined by the **frequency** of vibration (higher frequency = higher pitch / shrill voice).
- **Loudness:** Determined by the **amplitude** of the wave (Loudness $\\propto \\text{Amplitude}^2$).
- **Audible Range for Humans:** $20\\text{ Hz} \\text{ to } 20,000\\text{ Hz}$. Infrasound is below 20 Hz; Ultrasound is above 20 kHz.`,
    quiz: [
      {
        question: "If the amplitude of a sound wave is doubled, what happens to its loudness?",
        options: ["Loudness is halved", "Loudness doubles", "Loudness quadruples (becomes 4 times)", "Loudness remains unchanged"],
        correctIndex: 2,
        explanation: "Loudness is directly proportional to the square of the amplitude (Loudness ∝ A²). Doubling the amplitude increases loudness by 2² = 4 times."
      },
      {
        question: "What is the frequency range of audible sound for normal human hearing?",
        options: ["0 to 100 Hz", "20 Hz to 20,000 Hz", "20 kHz to 200 kHz", "500 Hz to 5,000 Hz"],
        correctIndex: 1,
        explanation: "The human ear detects sound frequencies ranging between 20 Hz and 20,000 Hz (20 kHz)."
      }
    ]
  },

  // 6. MATHEMATICS: Trigonometric Unit Circle
  {
    slug: 'trigonometry-unit-circle',
    subject: 'mathematics',
    class_level: 10,
    board: 'CBSE',
    title: 'Trigonometric Unit Circle & Function Projections',
    title_hindi: 'त्रिकोणमितीय इकाई वृत्त और अनुपात प्रक्षेप',
    description: 'Drag the angle around the unit circle to visualize sine, cosine, and tangent as geometric lengths across all four quadrants.',
    description_hindi: 'इकाई वृत्त पर कोण बदलकर चारों चतुर्थांशों में sin, cos और tan के ज्यामितीय मान देखें।',
    type: 'graph',
    thumbnail: '/assets/simulations/trig.png',
    status: 'published',
    config: {
      radius: 1,
      defaultAngleDeg: 45
    },
    notes: `### Trigonometric Identities on the Unit Circle
On a unit circle where $r = 1$:
- The x-coordinate of the terminal point is $\\cos\\theta$.
- The y-coordinate of the terminal point is $\\sin\\theta$.
- **Pythagorean Identity:** $\\sin^2\\theta + \\cos^2\\theta = 1$.
- **ASTC Quadrant Rule:**
  - Quadrant I (0° to 90°): **All** functions positive.
  - Quadrant II (90° to 180°): **Sin** & Cosec positive.
  - Quadrant III (180° to 270°): **Tan** & Cot positive.
  - Quadrant IV (270° to 360°): **Cos** & Sec positive.`,
    quiz: [
      {
        question: "In which quadrant are both sine and cosine negative, while tangent is positive?",
        options: ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"],
        correctIndex: 2,
        explanation: "In Quadrant III (180° to 270°), both x and y are negative, so sinθ < 0 and cosθ < 0, while tanθ = y/x > 0."
      },
      {
        question: "What is the value of sin²(30°) + cos²(30°)?",
        options: ["0.5", "1", "1.5", "2"],
        correctIndex: 1,
        explanation: "According to the fundamental Pythagorean identity, sin²θ + cos²θ = 1 for any real angle θ."
      }
    ]
  }
];

module.exports = {
  virtualTopicsData
};
