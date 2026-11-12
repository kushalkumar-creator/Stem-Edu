/**
 * Pure STEM Curriculum Master Dataset for Supabase Migration
 * Contains 4 Subjects, 4 Chapters, 16 Lessons, 41+ MCQs, 3 SVG Diagrams, 1 Virtual Lab.
 * Zero dependency on Mongoose.
 */

const diagramsData = [
  {
    title: 'Plant Cell Anatomy',
    titleHindi: 'पादप कोशिका की संरचना',
    subjectCode: 'biology',
    svgViewBox: '0 0 600 400',
    elements: [
      {
        id: 'cell_wall',
        label: 'Cell Wall',
        labelHindi: 'कोशिका भित्ति',
        shape: 'rect',
        attributes: { x: 30, y: 30, width: 540, height: 340, rx: 30, fill: '#DCFCE7', stroke: '#15803D', strokeWidth: 8 },
        explanation: 'Rigid outer layer made of cellulose that provides structural support, shape, and protection to the plant cell.',
        explanationHindi: 'सेल्यूलोज से बनी कठोर बाहरी परत जो पादप कोशिका को संरचनात्मक सहारा, निश्चित आकार और सुरक्षा प्रदान करती है।'
      },
      {
        id: 'cell_membrane',
        label: 'Cell Membrane',
        labelHindi: 'कोशिका झिल्ली',
        shape: 'rect',
        attributes: { x: 44, y: 44, width: 512, height: 312, rx: 22, fill: '#F0FDF4', stroke: '#22C55E', strokeWidth: 3 },
        explanation: 'Selectively permeable membrane that regulates the entry and exit of ions, nutrients, and water.',
        explanationHindi: 'अर्ध-पारगम्य झिल्ली जो कोशिका के अंदर और बाहर पदार्थों के आवागमन को नियंत्रित करती है।'
      },
      {
        id: 'vacuole',
        label: 'Central Vacuole',
        labelHindi: 'केंद्रीय रसधानी',
        shape: 'rect',
        attributes: { x: 180, y: 90, width: 240, height: 180, rx: 40, fill: '#E0F2FE', stroke: '#0284C7', strokeWidth: 4 },
        explanation: 'Large fluid-filled organelle storing water, sugars, and mineral salts; maintains turgor pressure against the cell wall.',
        explanationHindi: 'कोशिका रस से भरी विशाल रसधानी जो जल व खनिजों का संचय करती है तथा कोशिका को स्फीति प्रदान करती है।'
      },
      {
        id: 'nucleus',
        label: 'Nucleus',
        labelHindi: 'केंद्रक',
        shape: 'circle',
        attributes: { cx: 110, y: 150, r: 42, fill: '#F3E8FF', stroke: '#7C3AED', strokeWidth: 4 },
        explanation: 'The control centre of the cell containing genetic material (DNA/chromosomes) that coordinates growth, protein synthesis, and division.',
        explanationHindi: 'कोशिका का नियंत्रण केंद्र जिसमें आनुवंशिक पदार्थ (DNA) होता है, जो कोशिका की समस्त जैविक क्रियाओं को नियंत्रित करता है।'
      },
      {
        id: 'chloroplast_1',
        label: 'Chloroplast',
        labelHindi: 'हरितलवक (क्लोरोप्लास्ट)',
        shape: 'circle',
        attributes: { cx: 470, y: 120, r: 30, fill: '#86EFAC', stroke: '#16A34A', strokeWidth: 3 },
        explanation: 'Contains chlorophyll pigment that traps solar light energy to synthesize food via photosynthesis.',
        explanationHindi: 'इसमें क्लोरोफिल वर्णक होता है जो सौर ऊर्जा को अवशोषित करके प्रकाश संश्लेषण द्वारा भोजन का निर्माण करता है।'
      },
      {
        id: 'chloroplast_2',
        label: 'Chloroplast',
        labelHindi: 'हरितलवक (क्लोरोप्लास्ट)',
        shape: 'circle',
        attributes: { cx: 470, y: 240, r: 30, fill: '#86EFAC', stroke: '#16A34A', strokeWidth: 3 },
        explanation: 'Double-membrane organelle containing thylakoids where the light-dependent reactions of photosynthesis occur.',
        explanationHindi: 'दोहरी झिल्ली वाला अंगक जिसमें प्रकाश संश्लेषण की प्रकाशिक अभिक्रियाएं संपन्न होती हैं।'
      },
      {
        id: 'mitochondrion',
        label: 'Mitochondrion',
        labelHindi: 'माइटोकॉन्ड्रिया',
        shape: 'rect',
        attributes: { x: 90, y: 260, width: 65, height: 35, rx: 17, fill: '#FED7AA', stroke: '#EA580C', strokeWidth: 3 },
        explanation: 'The powerhouse of the cell; produces ATP (cellular energy currency) through cellular aerobic respiration.',
        explanationHindi: 'कोशिका का ऊर्जाघर (Powerhouse); कोशिकीय श्वसन द्वारा ATP के रूप में ऊर्जा उत्पन्न करता है।'
      }
    ]
  },
  {
    title: 'Periodic Table Element Groups',
    titleHindi: 'आवर्त सारणी: प्रमुख तत्व समूह',
    subjectCode: 'chemistry',
    svgViewBox: '0 0 600 400',
    elements: [
      {
        id: 'alkali_metals',
        label: 'Alkali Metals (Group 1)',
        labelHindi: 'क्षार धातुएं (समूह 1)',
        shape: 'rect',
        attributes: { x: 30, y: 50, width: 95, height: 300, rx: 10, fill: '#FEE2E2', stroke: '#DC2626', strokeWidth: 3 },
        explanation: 'Group 1 elements (Lithium, Sodium, Potassium). Soft, highly reactive metals with 1 valence electron, readily forming +1 cations.',
        explanationHindi: 'समूह 1 के तत्व (Li, Na, K)। अत्यधिक क्रियाशील धातुएं जिनमें 1 संयोजी इलेक्ट्रॉन होता है और +1 धनायन बनाती हैं।'
      },
      {
        id: 'alkaline_earth',
        label: 'Alkaline Earth Metals (Group 2)',
        labelHindi: 'क्षारीय मृदा धातुएं (समूह 2)',
        shape: 'rect',
        attributes: { x: 135, y: 110, width: 95, height: 240, rx: 10, fill: '#FFEDD5', stroke: '#EA580C', strokeWidth: 3 },
        explanation: 'Group 2 elements (Magnesium, Calcium). Reactive metals with 2 valence electrons, forming basic hydroxides.',
        explanationHindi: 'समूह 2 के तत्व (Mg, Ca)। इनमें 2 संयोजी इलेक्ट्रॉन होते हैं और क्षारीय हाइड्रॉक्साइड बनाते हैं।'
      },
      {
        id: 'transition_metals',
        label: 'Transition Metals',
        labelHindi: 'संक्रमण तत्व',
        shape: 'rect',
        attributes: { x: 240, y: 160, width: 130, height: 190, rx: 10, fill: '#FEF3C7', stroke: '#D97706', strokeWidth: 3 },
        explanation: 'D-block metals (Iron, Copper, Zinc) that exhibit variable oxidation states, high melting points, and form coloured compounds.',
        explanationHindi: 'd-ब्लॉक के तत्व (Fe, Cu, Zn) जो परिवर्तनीय संयोजकता प्रदर्शित करते हैं और उत्प्रेरक के रूप में उपयोगी हैं।'
      },
      {
        id: 'halogens',
        label: 'Halogens (Group 17)',
        labelHindi: 'हैलोजन (समूह 17)',
        shape: 'rect',
        attributes: { x: 380, y: 70, width: 90, height: 280, rx: 10, fill: '#E0E7FF', stroke: '#4F46E5', strokeWidth: 3 },
        explanation: 'Group 17 non-metals (Fluorine, Chlorine, Bromine, Iodine). Highly electronegative with 7 valence electrons; gain 1 electron to form salts.',
        explanationHindi: 'समूह 17 के अधातु तत्व (F, Cl, Br, I)। 7 संयोजी इलेक्ट्रॉनों के साथ तीव्र ऋणविद्युती तत्व जो लवण बनाते हैं।'
      },
      {
        id: 'noble_gases',
        label: 'Noble Gases (Group 18)',
        labelHindi: 'उत्कृष्ट गैसें (समूह 18)',
        shape: 'rect',
        attributes: { x: 480, y: 50, width: 90, height: 300, rx: 10, fill: '#F3E8FF', stroke: '#9333EA', strokeWidth: 3 },
        explanation: 'Group 18 elements (Helium, Neon, Argon). Completely filled valence electron shells (stable octet); chemically inert under normal conditions.',
        explanationHindi: 'समूह 18 के तत्व (He, Ne, Ar)। पूर्ण अष्टक वाली अक्रिय गैसें जो सामान्य परिस्थितियों में रासायनिक क्रिया नहीं करतीं।'
      }
    ]
  },
  {
    title: 'Simple Electric Circuit',
    titleHindi: 'सरल विद्युत परिपथ',
    subjectCode: 'physics',
    svgViewBox: '0 0 600 400',
    elements: [
      {
        id: 'battery',
        label: 'Battery / Cell Source',
        labelHindi: 'बैटरी / विद्युत सेल',
        shape: 'rect',
        attributes: { x: 250, y: 310, width: 100, height: 40, rx: 8, fill: '#EFF6FF', stroke: '#2563EB', strokeWidth: 4 },
        explanation: 'Chemical power source maintaining an electric potential difference (voltage) across the circuit to drive electron flow.',
        explanationHindi: 'विद्युत स्रोत जो परिपथ के सिरों पर विभवांतर (V) बनाए रखता है जिससे धारा प्रवाहित होती है।'
      },
      {
        id: 'switch_key',
        label: 'Plug Key / Switch',
        labelHindi: 'प्लग कुंजी / स्विच',
        shape: 'circle',
        attributes: { cx: 480, y: 330, r: 24, fill: '#F1F5F9', stroke: '#475569', strokeWidth: 4 },
        explanation: 'A conducting link used to open or close the circuit. When closed, current flows continuously.',
        explanationHindi: 'परिपथ को चालू या बंद करने वाली कुंजी। बंद होने पर धारा निरंतर बहती है।'
      },
      {
        id: 'ammeter',
        label: 'Ammeter (Current Meter)',
        labelHindi: 'एमीटर (धारामापी)',
        shape: 'circle',
        attributes: { cx: 500, y: 190, r: 32, fill: '#FEF3C7', stroke: '#D97706', strokeWidth: 4 },
        explanation: 'Low-resistance instrument always connected in series to measure electric current (I) in Amperes.',
        explanationHindi: 'कम प्रतिरोध वाला उपकरण जिसे परिपथ में श्रेणीक्रम में जोड़कर धारा (एम्पीयर में) मापी जाती है।'
      },
      {
        id: 'resistor',
        label: 'Resistor (Resistance R)',
        labelHindi: 'प्रतिरोधक (प्रतिरोध R)',
        shape: 'rect',
        attributes: { x: 230, y: 40, width: 140, height: 40, rx: 6, fill: '#FEE2E2', stroke: '#DC2626', strokeWidth: 4 },
        explanation: 'Component that opposes the flow of electric charge, converting electrical energy into heat according to V = IR.',
        explanationHindi: 'चालक घटक जो विद्युत धारा के प्रवाह में अवरोध उत्पन्न करता है (V = IR)।'
      },
      {
        id: 'voltmeter',
        label: 'Voltmeter (Voltage Meter)',
        labelHindi: 'वोल्टमीटर (विभवांतरमापी)',
        shape: 'circle',
        attributes: { cx: 300, y: 130, r: 28, fill: '#DCFCE7', stroke: '#16A34A', strokeWidth: 4 },
        explanation: 'High-resistance instrument connected in parallel across the resistor to measure potential difference in Volts.',
        explanationHindi: 'उच्च प्रतिरोध वाला उपकरण जिसे प्रतिरोधक के पार्श्वक्रम में जोड़कर विभवांतर (वोल्ट में) मापा जाता है।'
      },
      {
        id: 'electric_bulb',
        label: 'Electric Bulb / Load',
        labelHindi: 'विद्युत बल्ब',
        shape: 'circle',
        attributes: { cx: 100, y: 190, r: 30, fill: '#FEF08A', stroke: '#CA8A04', strokeWidth: 4 },
        explanation: 'Load device with a thin tungsten filament that glows due to the heating effect of electric current.',
        explanationHindi: 'टंगस्टन तंतु वाला प्रकाश स्रोत जो धारा के तापीय प्रभाव से दीप्त होकर प्रकाश देता है।'
      }
    ]
  }
];

const labData = {
  title: 'Simple Pendulum Experiment',
  titleHindi: 'सरल लोलक प्रयोग: आवर्तकाल की निर्भरता',
  experimentType: 'simple_pendulum',
  description: 'Investigate how the time period of a simple pendulum depends on string length, bob mass, and the local acceleration due to gravity. Verify the simple harmonic motion equation T = 2π√(L/g).',
  descriptionHindi: 'जांचें कि एक सरल लोलक का आवर्तकाल डोरी की लंबाई, गोलक के द्रव्यमान और गुरुत्वीय त्वरण पर कैसे निर्भर करता है। T = 2π√(L/g) सूत्र की पुष्टि करें।',
  instructions: [
    'Adjust the String Length (L) slider from 0.2m to 2.0m and observe how the swing frequency changes.',
    'Vary the Bob Mass (m) from 0.05kg to 1.0kg to test whether mass influences the oscillation duration.',
    'Switch between Earth (9.8 m/s²), Moon (1.62 m/s²), and Jupiter (24.79 m/s²) gravity environments.',
    'Use the Pause / Resume and Slow Motion toggles to inspect the instantaneous position and velocity at the turning points.',
    'Answer the 3 observation quiz questions below to test your scientific deductions.'
  ],
  instructionsHindi: [
    'डोरी की लंबाई (L) को 0.2m से 2.0m तक बदलें और देखें कि दोलन आवृत्ति कैसे बदलती है।',
    'गोलक का द्रव्यमान (m) 0.05kg से 1.0kg तक बदलकर जांचें कि क्या द्रव्यमान आवर्तकाल को प्रभावित करता है।',
    'पृथ्वी (9.8 m/s²), चंद्रमा (1.62 m/s²), और बृहस्पति (24.79 m/s²) के गुरुत्वाकर्षण विकल्पों में तुलना करें।',
    'लोलक की गति को ध्यान से देखने के लिए रोकें / चलाएं और स्लो मोशन का उपयोग करें।',
    'अपने वैज्ञानिक निष्कर्षों की जांच के लिए नीचे दिए गए 3 प्रश्नों के उत्तर दें।'
  ],
  variables: [
    {
      name: 'length',
      label: 'String Length (L)',
      labelHindi: 'डोरी की लंबाई (L)',
      unit: 'm',
      min: 0.2,
      max: 2.0,
      step: 0.05,
      defaultValue: 1.0
    },
    {
      name: 'mass',
      label: 'Bob Mass (m)',
      labelHindi: 'गोलक का द्रव्यमान (m)',
      unit: 'kg',
      min: 0.05,
      max: 1.0,
      step: 0.05,
      defaultValue: 0.2
    },
    {
      name: 'gravity',
      label: 'Gravity (g)',
      labelHindi: 'गुरुत्वीय त्वरण (g)',
      unit: 'm/s²',
      min: 1.62,
      max: 24.79,
      step: 0.01,
      defaultValue: 9.8
    },
    {
      name: 'angle',
      label: 'Release Angle (θ₀)',
      labelHindi: 'प्रारंभिक कोण (θ₀)',
      unit: '°',
      min: 5,
      max: 25,
      step: 1,
      defaultValue: 12
    }
  ],
  observationQuestions: [
    {
      question: 'If you quadruple the length of a pendulum string (from 0.25 m to 1.0 m), what happens to its time period?',
      questionHindi: 'यदि आप लोलक की डोरी की लंबाई 4 गुना कर दें (0.25 m से 1.0 m), तो इसके आवर्तकाल पर क्या प्रभाव पड़ेगा?',
      options: [
        'It is halved',
        'It doubles (increases by 2x)',
        'It quadruples (increases by 4x)',
        'It remains completely unchanged'
      ],
      optionsHindi: [
        'यह आधा हो जाता है',
        'यह दोगुना हो जाता है (2x)',
        'यह चार गुना हो जाता है (4x)',
        'यह पूरी तरह अपरिवर्तित रहता है'
      ],
      correctIndex: 1,
      explanation: 'Because T = 2π√(L/g), the period is directly proportional to √L. If L increases by 4x, T increases by √4 = 2x (it doubles).'
    },
    {
      question: 'How does increasing the mass of the pendulum bob from 50 g to 500 g affect the period of oscillation?',
      questionHindi: 'गोलक के द्रव्यमान को 50 ग्राम से बढ़ाकर 500 ग्राम करने पर दोलन काल पर क्या प्रभाव पड़ता है?',
      options: [
        'Period increases by 10x',
        'Period decreases by 10x',
        'Period remains completely unchanged',
        'Period depends on the bob material density'
      ],
      optionsHindi: [
        'आवर्तकाल 10 गुना बढ़ जाता है',
        'आवर्तकाल 10 गुना घट जाता है',
        'आवर्तकाल पूरी तरह अपरिवर्तित रहता है',
        'आवर्तकाल गोलक के घनत्व पर निर्भर करता है'
      ],
      correctIndex: 2,
      explanation: 'The formula T = 2π√(L/g) contains no mass parameter m. In small-angle simple harmonic motion, period is completely independent of the mass of the bob.'
    },
    {
      question: 'On the Moon, where gravity is ~1/6th that of Earth (1.62 m/s²), how does the pendulum swing compared to Earth?',
      questionHindi: 'चंद्रमा पर, जहां गुरुत्वीय त्वरण पृथ्वी का ~1/6 (1.62 m/s²) है, लोलक पृथ्वी की तुलना में कैसा दोलन करेगा?',
      options: [
        'It swings much faster with a shorter period',
        'It swings much slower with a longer period',
        'It swings at the exact same frequency',
        'It stops oscillating entirely'
      ],
      optionsHindi: [
        'यह बहुत तेजी से और छोटे आवर्तकाल के साथ दोलन करेगा',
        'यह बहुत धीमे और लंबे आवर्तकाल के साथ दोलन करेगा',
        'यह बिल्कुल उसी आवृत्ति पर दोलन करेगा',
        'यह पूरी तरह रुक जाता है'
      ],
      correctIndex: 1,
      explanation: 'Since g is in the denominator under the square root (T ∝ 1/√g), lower gravitational acceleration results in a longer period T, making the pendulum oscillate much slower.'
    }
  ]
};

const curriculumData = [
  // ---------------------------------------------------------------
  // 1. PHYSICS: CHAPTER 12 - ELECTRICITY
  // ---------------------------------------------------------------
  {
    subject: {
      name: 'Physics',
      nameHindi: 'भौतिक विज्ञान',
      code: 'physics',
      description: 'Study of matter, energy, electricity, magnetism, and the physical universe.',
      descriptionHindi: 'पदार्थ, ऊर्जा, विद्युत, चुंबकत्व और भौतिक ब्रह्मांड का अध्ययन।',
      icon: 'Atom',
      color: '#2563EB',
      classLevel: 10,
      board: 'CBSE',
      order: 1
    },
    chapter: {
      chapterNumber: 12,
      title: 'Electricity',
      titleHindi: 'विद्युत',
      description: 'Electric current, potential difference, Ohm’s law, resistance, and heating effects.',
      descriptionHindi: 'विद्युत धारा, विभवांतर, ओम का नियम, प्रतिरोध और तापीय प्रभाव।',
      classLevel: 10,
      board: 'CBSE',
      order: 1
    },
    lessons: [
      {
        lessonNumber: 1,
        title: 'Electric Current and Simple Circuits',
        titleHindi: 'विद्युत धारा और सरल विद्युत परिपथ',
        summary: 'Electric current is the rate of flow of electric charges through a conductor.',
        summaryHindi: 'विद्युत आवेश के प्रवाह की दर को विद्युत धारा कहते हैं।',
        contentBlocks: [
          {
            type: 'text',
            content: 'An electric current is expressed by the amount of charge flowing through a particular area in unit time (I = Q / t). In metallic conductors, negatively charged electrons constitute the flow of charge, moving in the direction opposite to conventional electric current.',
            contentHindi: 'विद्युत आवेश के प्रवाह की दर को विद्युत धारा कहते हैं (I = Q / t)। धात्विक तारों में इलेक्ट्रॉनों का प्रवाह ही धारा बनाता है, जो पारंपरिक विद्युत धारा की दिशा के विपरीत गति करते हैं।'
          },
          {
            type: 'formula',
            content: 'I = Q / t  (where I: Current in Amperes [A], Q: Charge in Coulombs [C], t: Time in seconds [s])',
            contentHindi: 'I = Q / t  (I: धारा एम्पीयर [A], Q: आवेश कूलॉम [C], t: समय सेकंड [s])'
          }
        ]
      },
      {
        lessonNumber: 2,
        title: 'Electric Potential and Potential Difference',
        titleHindi: 'विद्युत विभव और विभवांतर',
        summary: 'Potential difference is the work done per unit charge moving between two points.',
        summaryHindi: 'एकांक धन आवेश को एक बिंदु से दूसरे बिंदु तक ले जाने में किया गया कार्य विभवांतर है।',
        contentBlocks: [
          {
            type: 'text',
            content: 'Electric potential difference (V) between two points in an electric circuit carrying some current is defined as the work done (W) to move a unit positive charge (Q) from one point to the other. It is measured in Volts (V) using a Voltmeter connected in parallel.',
            contentHindi: 'दो बिंदुओं के बीच विभवांतर (V) एकांक आवेश (Q) को एक बिंदु से दूसरे तक ले जाने में किए गए कार्य (W) के बराबर होता है। इसे वोल्टमीटर द्वारा समांतर क्रम में मापा जाता है।'
          },
          {
            type: 'formula',
            content: 'V = W / Q  (where V: Potential Difference [V], W: Work Done [Joules], Q: Charge [Coulombs])',
            contentHindi: 'V = W / Q  (V: विभवांतर [V], W: कार्य [J], Q: आवेश [C])'
          }
        ]
      },
      {
        lessonNumber: 3,
        title: 'Ohm’s Law and Resistance',
        titleHindi: 'ओम का नियम और प्रतिरोध',
        summary: 'Current is directly proportional to potential difference across a conductor at constant temperature.',
        summaryHindi: 'नियत ताप पर चालक के सिरों का विभवांतर उसमें प्रवाहित धारा के समानुपाती होता है।',
        contentBlocks: [
          {
            type: 'text',
            content: 'According to Ohm’s Law, the potential difference V across the ends of a metallic wire in an electric circuit is directly proportional to the current I flowing through it, provided its temperature remains constant: V ∝ I, or V = I * R.',
            contentHindi: 'ओम के नियम के अनुसार नियत ताप पर किसी धात्विक तार से प्रवाहित धारा उसके सिरों के बीच विभवांतर के अनुक्रमानुपाती होती है: V = I * R।'
          },
          {
            type: 'formula',
            content: 'V = I * R  and  R = ρ * (L / A)  (where R: Resistance [Ω], ρ: Resistivity [Ω·m], L: Length [m], A: Cross-sectional Area [m²])',
            contentHindi: 'V = I * R  तथा  R = ρ * (L / A)  (R: प्रतिरोध [Ω], ρ: प्रतिरोधकता [Ω·m], L: लंबाई [m], A: अनुप्रस्थ काट क्षेत्रफल [m²])'
          }
        ]
      },
      {
        lessonNumber: 4,
        title: 'Heating Effect and Electric Power',
        titleHindi: 'विद्युत धारा का तापीय प्रभाव और विद्युत शक्ति',
        summary: 'Joule’s law of heating and electrical energy dissipation in resistive circuits.',
        summaryHindi: 'जूल का तापन नियम और विद्युत शक्ति की गणना।',
        contentBlocks: [
          {
            type: 'text',
            content: 'When an electric current flows through a purely resistive circuit, electrical energy is dissipated as heat according to Joule’s law of heating: H = I² * R * t. Electric power P is the rate of electrical energy consumption: P = V * I = I² * R = V² / R.',
            contentHindi: 'जब विद्युत धारा प्रतिरोधक परिपथ से गुजरती है, तो जूल के नियम के अनुसार ऊष्मा उत्पन्न होती है: H = I² * R * t। विद्युत ऊर्जा व्यय की दर को विद्युत शक्ति कहते हैं: P = V * I = I² * R।'
          },
          {
            type: 'formula',
            content: 'H = I² * R * t  and  P = V * I = I² * R = V² / R  (1 kWh = 3.6 × 10⁶ Joules)',
            contentHindi: 'H = I² * R * t  तथा  P = V * I = I² * R = V² / R  (1 kWh = 3.6 × 10⁶ जूल)'
          }
        ]
      }
    ],
    questions: [
      {
        questionText: 'What is the SI unit of electric potential difference?',
        questionTextHindi: 'विद्युत विभवांतर का SI मात्रक क्या है?',
        options: ['Ampere (A)', 'Volt (V)', 'Ohm (Ω)', 'Watt (W)'],
        optionsHindi: ['एम्पीयर (A)', 'वोल्ट (V)', 'ओम (Ω)', 'वाट (W)'],
        correctIndex: 1,
        explanation: 'The SI unit of electric potential difference is the Volt (V), named after Alessandro Volta.'
      },
      {
        questionText: 'According to Ohm’s Law, what is the relationship between V, I, and R at constant temperature?',
        questionTextHindi: 'ओम के नियम के अनुसार नियत ताप पर V, I और R के बीच क्या संबंध है?',
        options: ['V = I / R', 'V = I × R', 'V = R / I', 'I = V × R'],
        optionsHindi: ['V = I / R', 'V = I × R', 'V = R / I', 'I = V × R'],
        correctIndex: 1,
        explanation: 'Ohm’s law states V = I × R; potential difference equals current multiplied by resistance.'
      },
      {
        questionText: 'If the length of a metallic conductor is doubled while its thickness is unchanged, its resistance will:',
        questionTextHindi: 'यदि किसी चालक तार की लंबाई दोगुनी कर दी जाए और मोटाई वही रहे, तो उसका प्रतिरोध:',
        options: ['Halve', 'Double', 'Quadruple', 'Remain unchanged'],
        optionsHindi: ['आधा हो जाएगा', 'दोगुना हो जाएगा', 'चार गुना हो जाएगा', 'अपरिवर्तित रहेगा'],
        correctIndex: 1,
        explanation: 'Resistance is directly proportional to length (R ∝ L), so doubling length doubles resistance.'
      },
      {
        questionText: 'Which instrument is always connected in parallel to measure potential difference across a resistor?',
        questionTextHindi: 'प्रतिरोधक के सिरों का विभवांतर मापने के लिए किस उपकरण को समांतर क्रम में जोड़ा जाता है?',
        options: ['Ammeter', 'Voltmeter', 'Galvanometer', 'Rheostat'],
        optionsHindi: ['एमीटर', 'वोल्टमीटर', 'गैल्वेनोमीटर', 'धारा नियंत्रक'],
        correctIndex: 1,
        explanation: 'A voltmeter has very high resistance and is connected in parallel across the component.'
      },
      {
        questionText: 'Three resistors of 2 Ω, 3 Ω, and 6 Ω are connected in parallel. What is their equivalent resistance?',
        questionTextHindi: '2 Ω, 3 Ω और 6 Ω के तीन प्रतिरोधक समांतर क्रम में जुड़े हैं। उनका तुल्य प्रतिरोध क्या होगा?',
        options: ['1 Ω', '11 Ω', '0.5 Ω', '2 Ω'],
        optionsHindi: ['1 Ω', '11 Ω', '0.5 Ω', '2 Ω'],
        correctIndex: 0,
        explanation: '1/R = 1/2 + 1/3 + 1/6 = (3+2+1)/6 = 6/6 = 1 Ω⁻¹, therefore R = 1 Ω.'
      },
      {
        questionText: 'According to Joule’s law of heating, the heat produced in a resistor is proportional to:',
        questionTextHindi: 'जूल के तापन नियम के अनुसार प्रतिरोधक में उत्पन्न ऊष्मा किसके समानुपाती होती है?',
        options: ['Square of current (I²)', 'Current (I)', 'Square root of current (√I)', 'Inverse of current (1/I)'],
        optionsHindi: ['धारा के वर्ग (I²)', 'धारा (I)', 'धारा के वर्गमूल (√I)', 'धारा के व्युत्क्रम (1/I)'],
        correctIndex: 0,
        explanation: 'Joule’s law states H = I²Rt, so heat produced is directly proportional to the square of current.'
      },
      {
        questionText: 'An electric bulb of rating 220 V, 100 W is operated at 110 V. The power consumed will be:',
        questionTextHindi: '220 V, 100 W का विद्युत बल्ब 110 V पर चलाया जाता है। इसके द्वारा व्यय शक्ति क्या होगी?',
        options: ['100 W', '75 W', '50 W', '25 W'],
        optionsHindi: ['100 W', '75 W', '50 W', '25 W'],
        correctIndex: 3,
        explanation: 'Resistance R = V²/P = (220)²/100 = 484 Ω. At 110 V: P = V²/R = (110)²/484 = 25 W.'
      },
      {
        questionText: 'Commercial unit of electric energy is kilowatt-hour (kWh). How many Joules equal 1 kWh?',
        questionTextHindi: 'विद्युत ऊर्जा का व्यापारिक मात्रक किलोवाट-घंटा (kWh) है। 1 kWh कितने जूल के बराबर होता है?',
        options: ['3.6 × 10⁵ J', '3.6 × 10⁶ J', '1000 J', '3600 J'],
        optionsHindi: ['3.6 × 10⁵ J', '3.6 × 10⁶ J', '1000 J', '3600 J'],
        correctIndex: 1,
        explanation: '1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ Joules.'
      },
      {
        questionText: 'The property of a conductor to resist the flow of electric charges is called:',
        questionTextHindi: 'विद्युत आवेश के प्रवाह का विरोध करने वाले चालक के गुण को क्या कहते हैं?',
        options: ['Conductance', 'Resistance', 'Capacitance', 'Inductance'],
        optionsHindi: ['चालकत्व', 'प्रतिरोध', 'धारिता', 'प्रेरकत्व'],
        correctIndex: 1,
        explanation: 'Resistance (R) is the physical property that opposes the flow of electric charges.'
      },
      {
        questionText: 'What is the rate at which electrical energy is consumed or dissipated in an electrical circuit?',
        questionTextHindi: 'किसी परिपथ में विद्युत ऊर्जा के व्यय होने की दर को क्या कहते हैं?',
        options: ['Electric Potential', 'Electric Current', 'Electric Power', 'Electric Work'],
        optionsHindi: ['विद्युत विभव', 'विद्युत धारा', 'विद्युत शक्ति', 'विद्युत कार्य'],
        correctIndex: 2,
        explanation: 'Electric power P = W/t = VI is the rate of energy dissipation or work done.'
      },
      {
        questionText: 'Why is an ammeter always connected in series in an electric circuit?',
        questionTextHindi: 'विद्युत परिपथ में एमीटर को सदैव श्रेणीक्रम में क्यों जोड़ा जाता है?',
        options: ['It has low resistance so circuit current remains unaltered', 'It has high resistance to save power', 'It measures voltage', 'It protects the battery'],
        optionsHindi: ['इसका प्रतिरोध बहुत कम होता है ताकि कुल धारा अप्रभावित रहे', 'इसका प्रतिरोध अधिक होता है', 'यह विभवांतर मापता है', 'यह बैटरी की रक्षा करता है'],
        correctIndex: 0,
        explanation: 'An ammeter has very low internal resistance so it does not alter the total current when placed in series.'
      }
    ]
  },

  // ---------------------------------------------------------------
  // 2. CHEMISTRY: CHAPTER 1 - CHEMICAL REACTIONS AND EQUATIONS
  // ---------------------------------------------------------------
  {
    subject: {
      name: 'Chemistry',
      nameHindi: 'रसायन विज्ञान',
      code: 'chemistry',
      description: 'Study of elements, compounds, reactions, bonding, and molecular transformations.',
      descriptionHindi: 'तत्वों, यौगिकों, अभिक्रियाओं और रासायनिक परिवर्तनों का अध्ययन।',
      icon: 'FlaskConical',
      color: '#059669',
      classLevel: 10,
      board: 'CBSE',
      order: 2
    },
    chapter: {
      chapterNumber: 1,
      title: 'Chemical Reactions and Equations',
      titleHindi: 'रासायनिक अभिक्रियाएं एवं समीकरण',
      description: 'Balancing chemical equations, types of reactions, redox processes, and corrosion.',
      descriptionHindi: 'रासायनिक समीकरणों का संतुलन, अभिक्रियाओं के प्रकार, उपचयन-अपचयन और संक्षारण।',
      classLevel: 10,
      board: 'CBSE',
      order: 1
    },
    lessons: [
      {
        lessonNumber: 1,
        title: 'Chemical Equations and Balancing',
        titleHindi: 'रासायनिक समीकरण और उनका संतुलन',
        summary: 'Law of conservation of mass states total mass of reactants equals total mass of products.',
        summaryHindi: 'द्रव्यमान संरक्षण के नियम के अनुसार अभिकारकों का कुल द्रव्यमान उत्पादों के कुल द्रव्यमान के बराबर होता है।',
        contentBlocks: [
          {
            type: 'text',
            content: 'A chemical reaction involves breaking old chemical bonds and forming new bonds. In any balanced equation, the number of atoms of each element must remain equal on both sides to satisfy the Law of Conservation of Mass.',
            contentHindi: 'रासायनिक अभिक्रिया में पुराने बंध टूटते हैं और नए बंध बनते हैं। द्रव्यमान संरक्षण के नियम को पूरा करने के लिए समीकरण के दोनों ओर प्रत्येक तत्व के परमाणुओं की संख्या समान होनी चाहिए।'
          },
          {
            type: 'formula',
            content: '3Fe(s) + 4H₂O(g) → Fe₃O₄(s) + 4H₂(g)',
            contentHindi: '3Fe(s) + 4H₂O(g) → Fe₃O₄(s) + 4H₂(g)'
          }
        ]
      },
      {
        lessonNumber: 2,
        title: 'Combination and Decomposition Reactions',
        titleHindi: 'संयोजन एवं वियोजन अभिक्रियाएं',
        summary: 'Combination synthesizes one product; decomposition breaks a reactant into simpler substances.',
        summaryHindi: 'संयोजन में एक उत्पाद बनता है; वियोजन में एक अभिकारक टूटकर कई उत्पाद बनाता है।',
        contentBlocks: [
          {
            type: 'text',
            content: 'In a combination reaction, two or more reactants combine to form a single product (e.g. quicklime with water: CaO + H₂O → Ca(OH)₂ + Heat). In decomposition, a single compound breaks down into two or more simpler products using heat, light, or electricity.',
            contentHindi: 'संयोजन अभिक्रिया में दो या अधिक अभिकारक मिलकर एक एकल उत्पाद बनाते हैं। वियोजन अभिक्रिया में ऊष्मा, प्रकाश या विद्युत द्वारा एकल अभिकारक टूटकर कई सरल उत्पाद बनाता है।'
          },
          {
            type: 'formula',
            content: '2FeSO₄(s) --[Heat]--> Fe₂O₃(s) + SO₂(g) + SO₃(g)',
            contentHindi: '2FeSO₄(s) --[ऊष्मा]--> Fe₂O₃(s) + SO₂(g) + SO₃(g)'
          }
        ]
      },
      {
        lessonNumber: 3,
        title: 'Displacement and Double Displacement',
        titleHindi: 'विस्थापन एवं द्विविस्थापन अभिक्रियाएं',
        summary: 'More reactive metals displace less reactive metals from their salt solutions.',
        summaryHindi: 'अधिक क्रियाशील धातु कम क्रियाशील धातु को उसके लवण के विलयन से विस्थापित कर देती है।',
        contentBlocks: [
          {
            type: 'text',
            content: 'A displacement reaction occurs when a more reactive element displaces a less reactive element (e.g. Fe + CuSO₄ → FeSO₄ + Cu, turning the blue solution green). In double displacement, ions are exchanged between two ionic compounds, often forming an insoluble precipitate.',
            contentHindi: 'विस्थापन अभिक्रिया में अधिक अभिक्रियाशील तत्व कम अभिक्रियाशील तत्व को हटा देता है। द्विविस्थापन अभिक्रिया में आयनों का परस्पर आदान-प्रदान होता है, जिससे प्रायः एक अवक्षेप बनता है।'
          },
          {
            type: 'formula',
            content: 'Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s)↓ + 2NaCl(aq)',
            contentHindi: 'Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s)↓ + 2NaCl(aq)'
          }
        ]
      },
      {
        lessonNumber: 4,
        title: 'Oxidation, Reduction, and Corrosion',
        titleHindi: 'उपचयन, अपचयन, संक्षारण और विकृतगंधिता',
        summary: 'Redox reactions involve simultaneous gain and loss of oxygen or electrons.',
        summaryHindi: 'रेडॉक्स अभिक्रियाओं में उपचयन और अपचयन साथ-साथ होते हैं।',
        contentBlocks: [
          {
            type: 'text',
            content: 'Oxidation is the gain of oxygen or loss of hydrogen. Reduction is the loss of oxygen or gain of hydrogen. Corrosion is the slow degradation of metals due to atmospheric gases (e.g. rusting of iron: hydrated ferric oxide). Rancidity is the oxidation of fats and oils causing foul odor.',
            contentHindi: 'ऑक्सीजन का जुड़ना उपचयन और ऑक्सीजन का निकलना अपचयन कहलाता है। वायु तथा नमी के संपर्क में आकर धातुओं का धीरे-धीरे नष्ट होना संक्षारण कहलाता है। वसायुक्त भोजन का उपचयित होना विकृतगंधिता है।'
          },
          {
            type: 'formula',
            content: 'CuO + H₂ --[Heat]--> Cu + H₂O  (CuO is reduced to Cu; H₂ is oxidized to H₂O)',
            contentHindi: 'CuO + H₂ --[ऊष्मा]--> Cu + H₂O  (CuO का Cu में अपचयन; H₂ का H₂O में उपचयन)'
          }
        ]
      }
    ],
    questions: [
      {
        questionText: 'What type of reaction is: CaO(s) + H₂O(l) → Ca(OH)₂(aq) + Heat?',
        questionTextHindi: 'CaO(s) + H₂O(l) → Ca(OH)₂(aq) + ऊष्मा किस प्रकार की अभिक्रिया है?',
        options: ['Combination and Exothermic', 'Decomposition and Endothermic', 'Displacement', 'Double displacement'],
        optionsHindi: ['संयोजन और ऊष्माक्षेपी', 'वियोजन और ऊष्माशोषी', 'विस्थापन', 'द्विविस्थापन'],
        correctIndex: 0,
        explanation: 'Quicklime combines with water into slaked lime and releases large heat: combination and exothermic.'
      },
      {
        questionText: 'What is the color of the precipitate formed when sodium sulfate reacts with barium chloride?',
        questionTextHindi: 'सोडियम सल्फेट और बेरियम क्लोराइड की अभिक्रिया से बनने वाले अवक्षेप का रंग क्या होता है?',
        options: ['White precipitate of BaSO₄', 'Yellow precipitate of BaCl₂', 'Blue precipitate of Na₂SO₄', 'Black precipitate of BaS'],
        optionsHindi: ['BaSO₄ का सफेद अवक्षेप', 'BaCl₂ का पीला अवक्षेप', 'Na₂SO₄ का नीला अवक्षेप', 'BaS का काला अवक्षेप'],
        correctIndex: 0,
        explanation: 'Barium sulfate (BaSO₄) forms an insoluble white precipitate: Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl.'
      },
      {
        questionText: 'Which gas is evolved when zinc granules react with dilute sulfuric acid?',
        questionTextHindi: 'जिंक के दानों पर तनु सल्फ्यूरिक अम्ल डालने पर कौन सी गैस उत्सर्जित होती है?',
        options: ['Oxygen (O₂)', 'Hydrogen (H₂)', 'Sulfur dioxide (SO₂)', 'Carbon dioxide (CO₂)'],
        optionsHindi: ['ऑक्सीजन (O₂)', 'हाइड्रोजन (H₂)', 'सल्फर डाइऑक्साइड (SO₂)', 'कार्बन डाइऑक्साइड (CO₂)'],
        correctIndex: 1,
        explanation: 'Zn + H₂SO₄ → ZnSO₄ + H₂↑. Hydrogen gas burns with a characteristic pop sound.'
      },
      {
        questionText: 'In the reaction: CuO + H₂ → Cu + H₂O, which substance acts as the reducing agent?',
        questionTextHindi: 'CuO + H₂ → Cu + H₂O अभिक्रिया में अपचायक कौन है?',
        options: ['CuO', 'H₂', 'Cu', 'H₂O'],
        optionsHindi: ['CuO', 'H₂', 'Cu', 'H₂O'],
        correctIndex: 1,
        explanation: 'Hydrogen (H₂) gains oxygen (is oxidized) and reduces copper oxide to copper; hence H₂ is the reducing agent.'
      },
      {
        questionText: 'What chemical substance is responsible for the green coating that forms on copper when exposed to moist air?',
        questionTextHindi: 'नम वायु के संपर्क में आने पर तांबे पर बनने वाली हरी परत का रासायनिक नाम क्या है?',
        options: ['Copper oxide', 'Basic copper carbonate [CuCO₃·Cu(OH)₂]', 'Copper sulfate', 'Copper nitrate'],
        optionsHindi: ['कॉपर ऑक्साइड', 'क्षारीय कॉपर कार्बोनेट [CuCO₃·Cu(OH)₂]', 'कॉपर सल्फेट', 'कॉपर नाइट्रेट'],
        correctIndex: 1,
        explanation: 'Copper reacts with atmospheric CO₂ and moisture to form green basic copper carbonate.'
      },
      {
        questionText: 'Why are bags of potato chips flushed with nitrogen gas before sealing?',
        questionTextHindi: 'आलू के चिप्स की थैली में नाइट्रोजन गैस क्यों भरी जाती है?',
        options: ['To prevent rancidity by blocking oxidation of fats', 'To make chips crispy', 'To add nitrogen flavor', 'To prevent color change'],
        optionsHindi: ['वसा के उपचयन को रोककर विकृतगंधिता से बचाने के लिए', 'चिप्स को कुरकुरा बनाने के लिए', 'नाइट्रोजन स्वाद के लिए', 'रंग बदलने से रोकने के लिए'],
        correctIndex: 0,
        explanation: 'Nitrogen is an inert unreactive gas that prevents fats and oils from oxidizing and turning rancid.'
      },
      {
        questionText: 'The decomposition of silver chloride into silver and chlorine by sunlight is used in:',
        questionTextHindi: 'सूर्य के प्रकाश में सिल्वर क्लोराइड का सिल्वर और क्लोरीन में वियोजन किसमें प्रयुक्त होता है?',
        options: ['Black and white photography', 'Welding metals', 'Electroplating gold', 'Etching glass'],
        optionsHindi: ['श्वेत-श्याम (ब्लैक एंड व्हाइट) फोटोग्राफी', 'वेल्डिंग में', 'सोने के विद्युत लेपन में', 'कांच पर नक्काशी में'],
        correctIndex: 0,
        explanation: 'Photolytic decomposition of silver halides (2AgCl → 2Ag + Cl₂) was the foundation of photographic film.'
      },
      {
        questionText: 'Respiration is scientifically classified as which kind of chemical reaction?',
        questionTextHindi: 'श्वसन क्रिया को वैज्ञानिक रूप से किस प्रकार की अभिक्रिया माना जाता है?',
        options: ['Endothermic reaction', 'Exothermic reaction', 'Decomposition reaction', 'Displacement reaction'],
        optionsHindi: ['ऊष्माशोषी अभिक्रिया', 'ऊष्माक्षेपी अभिक्रिया', 'वियोजन अभिक्रिया', 'विस्थापन अभिक्रिया'],
        correctIndex: 1,
        explanation: 'Glucose breakdown in cells releases chemical energy (ATP) and heat; hence respiration is exothermic.'
      },
      {
        questionText: 'When an iron nail is immersed in blue copper sulfate solution for 30 minutes, the solution turns:',
        questionTextHindi: 'लोहे की कील को नीले कॉपर सल्फेट विलयन में 30 मिनट तक रखने पर विलयन का रंग कैसा हो जाता है?',
        options: ['Light green due to FeSO₄ formation', 'Colorless', 'Deep yellow', 'Remains unchanged blue'],
        optionsHindi: ['FeSO₄ बनने के कारण हल्का हरा', 'रंगहीन', 'गहरा पीला', 'नीला ही रहता है'],
        correctIndex: 0,
        explanation: 'Iron displaces copper: Fe + CuSO₄ (blue) → FeSO₄ (light green) + Cu (brown deposit).'
      },
      {
        questionText: 'Which law of physics and chemistry dictates that every chemical equation must be balanced?',
        questionTextHindi: 'भौतिकी और रसायन का कौन सा नियम यह निर्धारित करता है कि प्रत्येक समीकरण संतुलित होना चाहिए?',
        options: ['Law of Multiple Proportions', 'Law of Conservation of Mass', 'Law of Definite Proportions', 'Avogadro’s Law'],
        optionsHindi: ['गुणित अनुपात का नियम', 'द्रव्यमान संरक्षण का नियम', 'स्थिर अनुपात का नियम', 'आवोगाद्रो का नियम'],
        correctIndex: 1,
        explanation: 'Matter cannot be created nor destroyed in a chemical reaction: atoms in reactants must equal atoms in products.'
      }
    ]
  },

  // ---------------------------------------------------------------
  // 3. BIOLOGY: CHAPTER 6 - LIFE PROCESSES
  // ---------------------------------------------------------------
  {
    subject: {
      name: 'Biology',
      nameHindi: 'जीव विज्ञान',
      code: 'biology',
      description: 'Study of living organisms, cellular systems, physiology, genetics, and ecology.',
      descriptionHindi: 'जीवों, कोशिकीय तंत्रों, शरीर क्रिया विज्ञान और आनुवंशिकी का अध्ययन।',
      icon: 'HeartPulse',
      color: '#16A34A',
      classLevel: 10,
      board: 'CBSE',
      order: 3
    },
    chapter: {
      chapterNumber: 6,
      title: 'Life Processes',
      titleHindi: 'जैव प्रक्रम',
      description: 'Nutrition, cellular respiration, human circulation, and nephron excretion.',
      descriptionHindi: 'पोषण, कोशिकीय श्वसन, मानव परिसंचरण और वृक्क उत्सर्जन।',
      classLevel: 10,
      board: 'CBSE',
      order: 1
    },
    lessons: [
      {
        lessonNumber: 1,
        title: 'Autotrophic and Heterotrophic Nutrition',
        titleHindi: 'स्वपोषी और विषमपोषी पोषण',
        summary: 'Photosynthesis in plants and holozoic nutrition in human digestive system.',
        summaryHindi: 'पौधों में प्रकाश संश्लेषण और मानव पाचन तंत्र की कार्यप्रणाली।',
        contentBlocks: [
          {
            type: 'text',
            content: 'Life processes maintain organismic structures. Autotrophs (green plants) synthesize glucose from carbon dioxide and water using chlorophyll and solar energy. Heterotrophs ingest organic material, broken down by digestive enzymes (salivary amylase, pepsin, trypsin, lipase).',
            contentHindi: 'जैव प्रक्रम जीवों के अस्तित्व को बनाए रखते हैं। स्वपोषी पौधे सौर ऊर्जा और क्लोरोफिल की सहायता से प्रकाश संश्लेषण करते हैं। विषमपोषी पाचक एंजाइमों द्वारा भोजन का पाचन करते हैं।'
          },
          {
            type: 'formula',
            content: '6CO₂ + 12H₂O --[Chlorophyll, Sunlight]--> C₆H₁₂O₆ + 6O₂ + 6H₂O',
            contentHindi: '6CO₂ + 12H₂O --[क्लोरोफिल, सूर्य का प्रकाश]--> C₆H₁₂O₆ + 6O₂ + 6H₂O'
          }
        ]
      },
      {
        lessonNumber: 2,
        title: 'Respiration and Energy Transfer',
        titleHindi: 'श्वसन और ऊर्जा उत्पादन',
        summary: 'Aerobic versus anaerobic pathways in cytoplasm and cellular mitochondria.',
        summaryHindi: 'वायवीय और अवायवीय श्वसन: माइटोकॉन्ड्रिया में ATP ऊर्जा का निर्माण।',
        contentBlocks: [
          {
            type: 'text',
            content: 'Respiration releases cellular energy by breaking down glucose. Glycolysis in cytoplasm converts glucose into pyruvate. In presence of oxygen (mitochondria), aerobic respiration generates 38 ATP molecules. In absence of oxygen, fermentation produces ethanol (yeast) or lactic acid (muscle fatigue).',
            contentHindi: 'श्वसन में ग्लूकोज टूटकर ऊर्जा (ATP) मुक्त करता है। कोशिकाद्रव्य में ग्लूकोज से पायरुवेट बनता है। ऑक्सीजन की उपस्थिति में माइटोकॉन्ड्रिया में 38 ATP बनते हैं; अनुपस्थिति में लैक्टिक अम्ल या एथेनॉल बनता है।'
          },
          {
            type: 'formula',
            content: 'Glucose (6C) → Pyruvate (3C) --[+O₂, Mitochondria]--> 6CO₂ + 6H₂O + Energy (38 ATP)',
            contentHindi: 'ग्लूकोज (6C) → पायरुवेट (3C) --[+O₂, माइटोकॉन्ड्रिया]--> 6CO₂ + 6H₂O + 38 ATP'
          }
        ]
      },
      {
        lessonNumber: 3,
        title: 'Transportation in Animals and Plants',
        titleHindi: 'मानव एवं पादपों में वहन तंत्र',
        summary: 'Double circulation in human four-chambered heart; xylem and phloem in plants.',
        summaryHindi: 'मानव हृदय का दोहरा परिसंचरण; पौधों में जाइलम और फ्लोएम द्वारा परिवहन।',
        contentBlocks: [
          {
            type: 'text',
            content: 'Humans feature double circulation through a four-chambered heart to separate oxygenated blood (left atrium/ventricle) from deoxygenated blood (right atrium/ventricle). In plants, xylem conducts water and minerals unidirectionally via transpiration pull, while phloem translocates sucrose bidirectionally.',
            contentHindi: 'मानव हृदय के 4 कोष्ठ शुद्ध और अशुद्ध रक्त को अलग रखते हैं। पौधों में जाइलम जल और खनिजों का परिवहन करता है, जबकि फ्लोएम पत्तियों में बने भोजन को सभी भागों में पहुंचाता है।'
          }
        ]
      },
      {
        lessonNumber: 4,
        title: 'Excretion and Nephron Filtration',
        titleHindi: 'उत्सर्जन तंत्र और नेफ्रॉन की संरचना',
        summary: 'Kidney glomerulus ultrafiltration, selective tubular reabsorption, and urine formation.',
        summaryHindi: 'वृक्क में नेफ्रॉन द्वारा रक्त का निस्पंदन और मूत्र निर्माण की प्रक्रिया।',
        contentBlocks: [
          {
            type: 'text',
            content: 'The human urinary system consists of a pair of kidneys, ureters, urinary bladder, and urethra. Nephrons are the structural filtration units. Blood under high pressure in the glomerulus undergoes ultrafiltration into Bowman’s capsule; essential nutrients and water are reabsorbed in tubules.',
            contentHindi: 'मानव उत्सर्जन तंत्र में वृक्क, मूत्रवाहिनी, मूत्राशय और मूत्रमार्ग होते हैं। नेफ्रॉन वृक्क की निस्पंदन इकाई है, जहां बोमन संपुट में रक्त छनता है और उपयोगी पदार्थों का पुनरावशोषण होता है।'
          }
        ]
      }
    ],
    questions: [
      {
        questionText: 'What is the structural and functional filtration unit of the human kidney?',
        questionTextHindi: 'मानव वृक्क की संरचनात्मक और क्रियात्मक निस्पंदन इकाई क्या है?',
        options: ['Neuron', 'Nephron', 'Alveolus', 'Villus'],
        optionsHindi: ['न्यूरॉन', 'नेफ्रॉन', 'कूपिका', 'दीर्घरोम'],
        correctIndex: 1,
        explanation: 'Nephrons are microscopic tubular filtering units that filter metabolic nitrogenous waste from blood.'
      },
      {
        questionText: 'Which chamber of the human heart pumps oxygen-rich blood to the entire systemic body?',
        questionTextHindi: 'मानव हृदय का कौन सा कोष्ठ पूरे शरीर में ऑक्सीजन युक्त रक्त पंप करता है?',
        options: ['Right Atrium', 'Right Ventricle', 'Left Atrium', 'Left Ventricle'],
        optionsHindi: ['दायाँ आलिंद', 'दायाँ निलय', 'बायाँ आलिंद', 'बायाँ निलय'],
        correctIndex: 3,
        explanation: 'The left ventricle has thick muscular walls to pump oxygenated blood through the aorta to all organs.'
      },
      {
        questionText: 'During photosynthesis, oxygen released into the atmosphere originates from the photolysis of:',
        questionTextHindi: 'प्रकाश संश्लेषण के दौरान वायुमंडल में मुक्त होने वाली ऑक्सीजन किसके अपघटन से आती है?',
        options: ['Carbon dioxide (CO₂)', 'Water (H₂O)', 'Glucose (C₆H₁₂O₆)', 'Chlorophyll'],
        optionsHindi: ['कार्बन डाइऑक्साइड (CO₂)', 'जल (H₂O)', 'ग्लूकोज (C₆H₁₂O₆)', 'क्लोरोफिल'],
        correctIndex: 1,
        explanation: 'Light energy splits water molecules (photolysis) to release protons, electrons, and O₂ gas.'
      },
      {
        questionText: 'Which enzyme present in human saliva begins the chemical digestion of dietary starch into maltose?',
        questionTextHindi: 'मानव लार में मौजूद कौन सा एंजाइम स्टार्च को माल्टोज में तोड़ना शुरू करता है?',
        options: ['Salivary Amylase (Ptyalin)', 'Pepsin', 'Trypsin', 'Lipase'],
        optionsHindi: ['लार एमाइलेज (टायलिन)', 'पेप्सिन', 'ट्रिप्सिन', 'लाइपेज'],
        correctIndex: 0,
        explanation: 'Salivary amylase breaks complex starches down into simpler disaccharide sugars in the mouth.'
      },
      {
        questionText: 'The accumulation of which acid in human muscle cells causes cramps during sudden vigorous sprint exercise?',
        questionTextHindi: 'अचानक अत्यधिक व्यायाम करने पर पेशियों में किस अम्ल के जमा होने से ऐंठन होती है?',
        options: ['Pyruvic acid', 'Lactic acid', 'Acetic acid', 'Citric acid'],
        optionsHindi: ['पायरुविक अम्ल', 'लैक्टिक अम्ल', 'एसिटिक अम्ल', 'साइट्रिक अम्ल'],
        correctIndex: 1,
        explanation: 'Anaerobic respiration in muscle cells due to oxygen deficiency breaks pyruvate into lactic acid.'
      },
      {
        questionText: 'Plant tissue specialized for conducting water and dissolved mineral salts from roots to leaves is:',
        questionTextHindi: 'जड़ों से पत्तियों तक जल और खनिज लवणों का संवहन करने वाला पादप ऊतक कौन सा है?',
        options: ['Phloem', 'Xylem', 'Parenchyma', 'Collenchyma'],
        optionsHindi: ['फ्लोएम', 'जाइलम', 'पैरेन्काइमा', 'कोलेंकाइमा'],
        correctIndex: 1,
        explanation: 'Xylem vessels and tracheids transport water unidirectionally driven by transpiration pull.'
      },
      {
        questionText: 'In which cellular organelle does aerobic breakdown of pyruvate into CO₂, water, and ATP take place?',
        questionTextHindi: 'कोशिका के किस अंगक में पायरुवेट का ऑक्सीकरण होकर CO₂, जल और ATP बनते हैं?',
        options: ['Cytoplasm', 'Mitochondria', 'Ribosome', 'Golgi Apparatus'],
        optionsHindi: ['कोशिकाद्रव्य', 'माइटोकॉन्ड्रिया', 'राइबोसोम', 'गॉल्जी उपकरण'],
        correctIndex: 1,
        explanation: 'Mitochondria are the powerhouses of eukaryotic cells where aerobic Krebs cycle and oxidative phosphorylation occur.'
      },
      {
        questionText: 'What is the role of bile juice secreted by the liver in human digestion?',
        questionTextHindi: 'मानव पाचन में यकृत द्वारा स्रावित पित्त रस की क्या भूमिका है?',
        options: ['Emulsifies large fat globules and alkalinizes food', 'Digests starch', 'Breaks down proteins into amino acids', 'Absorbs water'],
        optionsHindi: ['वसा की बड़ी गोलिकाओं का इमल्सीकरण और भोजन को क्षारीय बनाना', 'स्टार्च का पाचन', 'प्रोटीन का पाचन', 'जल का अवशोषण'],
        correctIndex: 0,
        explanation: 'Bile salts emulsify dietary fats into tiny micelles and create an alkaline pH for pancreatic enzymes.'
      },
      {
        questionText: 'Tiny pores present primarily on the underside of plant leaves for gas exchange and transpiration are:',
        questionTextHindi: 'गैसों के विनिमय और वाष्पोत्सर्जन के लिए पत्तियों की सतह पर पाए जाने वाले सूक्ष्म छिद्र कहलाते हैं:',
        options: ['Hydathodes', 'Stomata', 'Lenticels', 'Guard cells'],
        optionsHindi: ['जल रंध्र', 'रंध्र (स्टोमेटा)', 'वात रंध्र', 'द्वार कोशिकाएं'],
        correctIndex: 1,
        explanation: 'Stomata regulated by turgid guard cells govern CO₂ intake and transpirational water loss.'
      },
      {
        questionText: 'Which blood vessels carry deoxygenated blood from bodily tissues back into the right atrium of the heart?',
        questionTextHindi: 'शरीर के अंगों से अशुद्ध (ऑक्सीजन रहित) रक्त को हृदय के दाएं आलिंद में कौन सी रक्त वाहिकाएं लाती हैं?',
        options: ['Pulmonary arteries', 'Vena Cava (Veins)', 'Aorta', 'Pulmonary veins'],
        optionsHindi: ['फुफ्फुस धमनी', 'महाशिरा (शिराएं)', 'महाधमनी', 'फुफ्फुस शिरा'],
        correctIndex: 1,
        explanation: 'Superior and inferior Vena Cava collect deoxygenated venous blood from all tissues back to the right atrium.'
      }
    ]
  },

  // ---------------------------------------------------------------
  // 4. MATHEMATICS: CHAPTER 1 - REAL NUMBERS
  // ---------------------------------------------------------------
  {
    subject: {
      name: 'Mathematics',
      nameHindi: 'गणित',
      code: 'mathematics',
      description: 'Study of numbers, geometry, algebra, trigonometry, and arithmetic proofs.',
      descriptionHindi: 'संख्याओं, ज्यामिति, बीजगणित, त्रिकोणमिति और अंकगणितीय उपपत्तियों का अध्ययन।',
      icon: 'Calculator',
      color: '#CA8A04',
      classLevel: 10,
      board: 'CBSE',
      order: 4
    },
    chapter: {
      chapterNumber: 1,
      title: 'Real Numbers',
      titleHindi: 'वास्तविक संख्याएं',
      description: 'Fundamental Theorem of Arithmetic, HCF and LCM, and proofs of irrationality.',
      descriptionHindi: 'अंकगणित की आधारभूत प्रमेय, HCF और LCM, तथा अपरिमेय संख्याओं का सत्यापन।',
      classLevel: 10,
      board: 'CBSE',
      order: 1
    },
    lessons: [
      {
        lessonNumber: 1,
        title: 'Fundamental Theorem of Arithmetic',
        titleHindi: 'अंकगणित की आधारभूत प्रमेय',
        summary: 'Every composite number can be uniquely expressed as a product of prime factors.',
        summaryHindi: 'प्रत्येक भाज्य संख्या को अभाज्य संख्याओं के एक अद्वितीय गुणनफल के रूप में व्यक्त किया जा सकता है।',
        contentBlocks: [
          {
            type: 'text',
            content: 'The Fundamental Theorem of Arithmetic asserts that every composite integer greater than 1 can be represented uniquely as a product of prime powers, irrespective of the order in which prime factors are written. It underpins prime factorization algorithms.',
            contentHindi: 'अंकगणित की आधारभूत प्रमेय के अनुसार प्रत्येक भाज्य संख्या को अभाज्य संख्याओं के गुणनफल के रूप में अद्वितीय रूप से व्यक्त किया जा सकता है, गुणनखंडों के क्रम को छोड़कर।'
          },
          {
            type: 'formula',
            content: 'N = p₁ᵃ¹ × p₂ᵃ² × p₃ᵃ³ ... × pₖᵃᵏ  (Unique Prime Factorization)',
            contentHindi: 'N = p₁ᵃ¹ × p₂ᵃ² × p₃ᵃ³ ... × pₖᵃᵏ  (अद्वितीय अभाज्य गुणनखंड)'
          }
        ]
      },
      {
        lessonNumber: 2,
        title: 'HCF and LCM Relationships',
        titleHindi: 'महत्तम समापवर्तक (HCF) और लघुत्तम समापवर्त्य (LCM)',
        summary: 'Product of two positive integers equals the product of their HCF and LCM.',
        summaryHindi: 'दो धनात्मक पूर्णांकों का गुणनफल उनके HCF और LCM के गुणनफल के बराबर होता है।',
        contentBlocks: [
          {
            type: 'text',
            content: 'For any two positive integers a and b: HCF(a, b) is the product of the smallest power of each common prime factor, while LCM(a, b) is the product of the greatest power of each prime factor. The golden theorem states: HCF(a, b) × LCM(a, b) = a × b.',
            contentHindi: 'किन्हीं दो धनात्मक पूर्णांकों a और b के लिए: HCF उभयनिष्ठ अभाज्य गुणनखंडों की सबसे छोटी घातों का गुणनफल है, और LCM सभी अभाज्य गुणनखंडों की सबसे बड़ी घातों का गुणनफल है। HCF(a, b) × LCM(a, b) = a × b।'
          },
          {
            type: 'formula',
            content: 'HCF(a, b) × LCM(a, b) = a × b',
            contentHindi: 'HCF(a, b) × LCM(a, b) = a × b'
          }
        ]
      },
      {
        lessonNumber: 3,
        title: 'Revisiting Irrational Numbers',
        titleHindi: 'अपरिमेय संख्याओं का पुनर्भ्रमण',
        summary: 'Proof of irrationality by contradiction: √2, √3, √5 cannot be written as p/q.',
        summaryHindi: 'विरोधाभास द्वारा सत्यापन: √2, √3, √5 को p/q के रूप में नहीं लिखा जा सकता।',
        contentBlocks: [
          {
            type: 'text',
            content: 'A real number is irrational if it cannot be expressed in the form p/q, where p and q are integers and q ≠ 0. We prove √p is irrational by contradiction: assuming √2 = a/b where a and b are coprime integers leads to the contradiction that both a and b share a common factor of 2.',
            contentHindi: 'वह संख्या जिसे p/q (q ≠ 0) के रूप में व्यक्त न किया जा सके, अपरिमेय कहलाती है। हम सिद्ध करते हैं कि √2, √3, √5 अपरिमेय संख्याएं हैं।'
          },
          {
            type: 'formula',
            content: 'If prime p divides a², then p must also divide a (where a is a positive integer)',
            contentHindi: 'यदि अभाज्य संख्या p, a² को विभाजित करती है, तो p, a को भी विभाजित करेगी।'
          }
        ]
      },
      {
        lessonNumber: 4,
        title: 'Decimal Expansions of Rational Numbers',
        titleHindi: 'परिमेय संख्याओं के दशमलव प्रसार',
        summary: 'Terminating decimals possess denominators of the form 2ⁿ · 5ᵐ.',
        summaryHindi: 'सांत दशमलव प्रसार वाले परिमेय संख्याओं के हर का रूप 2ⁿ · 5ᵐ होता है।',
        contentBlocks: [
          {
            type: 'text',
            content: 'Let x = p/q be a rational number in simplest irreducible form (coprime p, q). The decimal expansion of x terminates if and only if the prime factorization of q has the form 2ⁿ · 5ᵐ, where n and m are non-negative integers. Otherwise, it is non-terminating recurring.',
            contentHindi: 'यदि परिमेय संख्या p/q में हर q के अभाज्य गुणनखंड केवल 2ⁿ · 5ᵐ के रूप के हों, तो उसका दशमलव प्रसार सांत होता है; अन्यथा असांत आवर्ती होता है।'
          },
          {
            type: 'formula',
            content: 'q = 2ⁿ · 5ᵐ  (where n, m ≥ 0)  ⇒  Terminating Decimal',
            contentHindi: 'q = 2ⁿ · 5ᵐ  (जहाँ n, m ≥ 0)  ⇒  सांत दशमलव प्रसार'
          }
        ]
      }
    ],
    questions: [
      {
        questionText: 'If HCF(a, b) = 4 and a × b = 96, what is LCM(a, b)?',
        questionTextHindi: 'यदि HCF(a, b) = 4 तथा a × b = 96 हो, तो LCM(a, b) क्या होगा?',
        options: ['12', '24', '48', '384'],
        optionsHindi: ['12', '24', '48', '384'],
        correctIndex: 1,
        explanation: 'LCM = (a × b) / HCF = 96 / 4 = 24.'
      },
      {
        questionText: 'Express 140 as a product of its prime factors:',
        questionTextHindi: '140 को अभाज्य गुणनखंडों के गुणनफल के रूप में व्यक्त कीजिए:',
        options: ['2 × 5 × 7', '2² × 5 × 7', '2 × 5² × 7', '2³ × 5'],
        optionsHindi: ['2 × 5 × 7', '2² × 5 × 7', '2 × 5² × 7', '2³ × 5'],
        correctIndex: 1,
        explanation: '140 = 2 × 70 = 2 × 2 × 35 = 2² × 5 × 7.'
      },
      {
        questionText: 'Which of the following is an irrational number?',
        questionTextHindi: 'निम्नलिखित में से कौन सी एक अपरिमेय संख्या है?',
        options: ['√4', '√9', '√7', '0.25'],
        optionsHindi: ['√4', '√9', '√7', '0.25'],
        correctIndex: 2,
        explanation: '√7 is irrational because 7 is a prime number and cannot be simplified into a ratio of integers.'
      },
      {
        questionText: 'The decimal expansion of the rational number 23 / (2³ × 5²) will terminate after how many decimal places?',
        questionTextHindi: 'परिमेय संख्या 23 / (2³ × 5²) का दशमलव प्रसार कितने स्थानों के बाद समाप्त होगा?',
        options: ['1 place', '2 places', '3 places', '4 places'],
        optionsHindi: ['1 स्थान', '2 स्थान', '3 स्थान', '4 स्थान'],
        correctIndex: 2,
        explanation: 'The maximum power of 2 and 5 in the denominator is max(3, 2) = 3, so it terminates after 3 decimal places (0.115).'
      },
      {
        questionText: 'For two coprime integers p and q, their HCF(p, q) is always equal to:',
        questionTextHindi: 'दो सह-अभाज्य पूर्णांकों p और q के लिए, उनका HCF(p, q) सदैव बराबर होता है:',
        options: ['0', '1', 'p × q', 'p + q'],
        optionsHindi: ['0', '1', 'p × q', 'p + q'],
        correctIndex: 1,
        explanation: 'Coprime integers share no common positive divisors other than 1; hence HCF = 1.'
      },
      {
        questionText: 'What is the sum of exponents of prime factors in the prime factorization of 196?',
        questionTextHindi: '196 के अभाज्य गुणनखंडन में अभाज्य गुणनखंडों की घातों का योग क्या है?',
        options: ['2', '3', '4', '5'],
        optionsHindi: ['2', '3', '4', '5'],
        correctIndex: 2,
        explanation: '196 = 2² × 7². The sum of the exponents is 2 + 2 = 4.'
      },
      {
        questionText: 'What can be said about the number (3 + 2√5)?',
        questionTextHindi: 'संख्या (3 + 2√5) के बारे में क्या कहा जा सकता है?',
        options: ['It is a rational number', 'It is an irrational number', 'It is a negative integer', 'It is an imaginary number'],
        optionsHindi: ['यह एक परिमेय संख्या है', 'यह एक अपरिमेय संख्या है', 'यह एक ऋणात्मक पूर्णांक है', 'यह एक काल्पनिक संख्या है'],
        correctIndex: 1,
        explanation: 'The sum and product of a non-zero rational number and an irrational number is always irrational.'
      },
      {
        questionText: 'If two positive integers a and b are written as a = x³y² and b = xy³, where x, y are prime numbers, then HCF(a, b) is:',
        questionTextHindi: 'यदि दो धनात्मक पूर्णांक a = x³y² तथा b = xy³ हों, जहाँ x, y अभाज्य संख्याएं हैं, तो HCF(a, b) क्या होगा?',
        options: ['xy', 'xy²', 'x³y³', 'x²y²'],
        optionsHindi: ['xy', 'xy²', 'x³y³', 'x²y²'],
        correctIndex: 1,
        explanation: 'HCF is the product of smallest powers of common prime factors: x¹ × y² = xy².'
      },
      {
        questionText: 'For the integers a = x³y² and b = xy³, what is their LCM(a, b)?',
        questionTextHindi: 'पूर्णांकों a = x³y² तथा b = xy³ के लिए, उनका LCM(a, b) क्या होगा?',
        options: ['xy²', 'x²y²', 'x³y³', 'x⁴y⁵'],
        optionsHindi: ['xy²', 'x²y²', 'x³y³', 'x⁴y⁵'],
        correctIndex: 2,
        explanation: 'LCM is the product of highest powers of all prime factors: x³ × y³ = x³y³.'
      },
      {
        questionText: 'Which statement correctly summarizes the Fundamental Theorem of Arithmetic?',
        questionTextHindi: 'अंकगणित की आधारभूत प्रमेय का सही सारांश कौन सा कथन प्रस्तुत करता है?',
        options: ['All integers are prime', 'Every composite number can be uniquely factored into primes', 'Zero is a prime number', 'HCF is always greater than LCM'],
        optionsHindi: ['सभी पूर्णांक अभाज्य होते हैं', 'प्रत्येक भाज्य संख्या को अभाज्य गुणनखंडों में अद्वितीय रूप से तोड़ा जा सकता है', 'शून्य एक अभाज्य संख्या है', 'HCF सदैव LCM से बड़ा होता है'],
        correctIndex: 1,
        explanation: 'Every composite integer greater than 1 has a unique prime factorization apart from factor rearrangement.'
      }
    ]
  }
];

module.exports = {
  diagramsData,
  labData,
  curriculumData
};
