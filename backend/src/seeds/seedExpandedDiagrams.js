/**
 * Seed Expanded Interactive Diagrams (P2-7)
 * Populates diagrams for Biology, Chemistry, Physics, and Maths.
 */
const { supabaseAdmin } = require('../../utils/supabaseAdmin');

const EXPANDED_DIAGRAMS = [
  {
    title: 'Human Digestive System',
    title_hindi: 'मानव पाचन तंत्र',
    subject_code: 'biology',
    svg_viewbox: '0 0 600 450',
    elements: [
      {
        id: 'mouth',
        label: 'Mouth & Salivary Glands',
        labelHindi: 'मुख एवं लार ग्रंथियां',
        shape: 'rect',
        attributes: { x: 230, y: 20, width: 140, height: 40, rx: 8, fill: '#FCE7F3', stroke: '#DB2777', strokeWidth: 3 },
        explanation: 'Ingestion of food occurs here. Salivary amylase breaks down complex starches into maltose sugar.',
        explanationHindi: 'भोजन का अंतर्ग्रहण। लार ग्रंथि से निकलने वाला एमाइलेज एंजाइम स्टार्च को माल्टोज शर्करा में तोड़ता है।'
      },
      {
        id: 'esophagus',
        label: 'Esophagus (Food Pipe)',
        labelHindi: 'ग्रसिका (भोजन नली)',
        shape: 'rect',
        attributes: { x: 270, y: 70, width: 60, height: 60, rx: 6, fill: '#EDE9FE', stroke: '#7C3AED', strokeWidth: 3 },
        explanation: 'Muscular tube that pushes food bolus into the stomach via wave-like peristaltic contractions.',
        explanationHindi: 'क्रमाकुंचन गतियों द्वारा भोजन को मुख से आमाशय तक पहुंचाने वाली नली।'
      },
      {
        id: 'stomach',
        label: 'Stomach',
        labelHindi: 'आमाशय',
        shape: 'rect',
        attributes: { x: 290, y: 140, width: 130, height: 70, rx: 16, fill: '#FEF3C7', stroke: '#D97706', strokeWidth: 4 },
        explanation: 'J-shaped organ secreting HCl and pepsin enzyme to digest proteins into peptones in an acidic medium.',
        explanationHindi: 'J-आकार का अंग जो प्रोटीन पाचन के लिए HCl अम्ल और पेप्सिन एंजाइम स्रावित करता है।'
      },
      {
        id: 'liver',
        label: 'Liver & Gall Bladder',
        labelHindi: 'यकृत एवं पित्ताशय',
        shape: 'rect',
        attributes: { x: 140, y: 140, width: 130, height: 70, rx: 12, fill: '#FEE2E2', stroke: '#DC2626', strokeWidth: 3 },
        explanation: 'Largest gland; secretes alkaline bile juice to emulsify fats and neutralize acidic gastric chime.',
        explanationHindi: 'शरीर की सबसे बड़ी ग्रंथि जो पित्त रस स्रावित कर वसा का इमल्सीकरण करती है।'
      },
      {
        id: 'pancreas',
        label: 'Pancreas',
        labelHindi: 'अग्न्याशय',
        shape: 'rect',
        attributes: { x: 230, y: 220, width: 140, height: 45, rx: 10, fill: '#ECFDF5', stroke: '#059669', strokeWidth: 3 },
        explanation: 'Secretes pancreatic juice containing trypsin (proteins), lipase (lipids), and amylase (carbohydrates).',
        explanationHindi: 'अग्न्याशयी रस स्रावित करता है जिसमें ट्रिप्सिन, लाइपेज और एमाइलेज एंजाइम होते हैं।'
      },
      {
        id: 'small_intestine',
        label: 'Small Intestine',
        labelHindi: 'क्षुद्रांत्र (छोटी आंत)',
        shape: 'rect',
        attributes: { x: 200, y: 280, width: 200, height: 70, rx: 14, fill: '#E0F2FE', stroke: '#0284C7', strokeWidth: 4 },
        explanation: 'Site of complete digestion of carbohydrates, proteins, and fats. Microscopic villi maximize nutrient absorption.',
        explanationHindi: 'कार्बोहाइड्रेट, प्रोटीन और वसा के पूर्ण पाचन का स्थल; दीर्घरोम (Villi) पोषक तत्वों को अवशोषित करते हैं।'
      },
      {
        id: 'large_intestine',
        label: 'Large Intestine & Rectum',
        labelHindi: 'बृहदांत्र (बड़ी आंत) एवं मलाशय',
        shape: 'rect',
        attributes: { x: 160, y: 360, width: 280, height: 50, rx: 10, fill: '#F1F5F9', stroke: '#475569', strokeWidth: 3 },
        explanation: 'Absorbs unabsorbed water and minerals from indigestible food residues before egestion.',
        explanationHindi: 'अपचित भोजन से जल और आवश्यक लवणों का अवशोषण करता है तथा मल त्याग में सहायता करता है।'
      }
    ]
  },
  {
    title: 'DNA Double Helix Structure',
    title_hindi: 'डीएनए (DNA) की द्विकुंडलिनी संरचना',
    subject_code: 'biology',
    svg_viewbox: '0 0 600 400',
    elements: [
      {
        id: 'sugar_phosphate_backbone',
        label: 'Sugar-Phosphate Backbone',
        labelHindi: 'शर्करा-फॉस्फेट आधार (बैकबोन)',
        shape: 'rect',
        attributes: { x: 40, y: 40, width: 140, height: 320, rx: 14, fill: '#EDE9FE', stroke: '#7C3AED', strokeWidth: 4 },
        explanation: 'Alternating deoxyribose sugar and phosphate units linked by 3\'-5\' phosphodiester bonds forming the outer helical rails.',
        explanationHindi: 'फॉस्फोडाइएस्टर बंधों द्वारा जुड़ी डिऑक्सीराइबोज शर्करा और फॉस्फेट समूह जो डीएनए की बाहरी रीढ़ बनाते हैं।'
      },
      {
        id: 'adenine_thymine',
        label: 'Adenine = Thymine (A = T)',
        labelHindi: 'एडेनिन = थायमिन (A = T)',
        shape: 'rect',
        attributes: { x: 200, y: 80, width: 200, height: 45, rx: 8, fill: '#DCFCE7', stroke: '#16A34A', strokeWidth: 3 },
        explanation: 'Purine Adenine pairs strictly with Pyrimidine Thymine via two complementary hydrogen bonds (A = T).',
        explanationHindi: 'एडेनिन और थायमिन दो हाइड्रोजन बंधों द्वारा परस्पर जुड़े होते हैं।'
      },
      {
        id: 'guanine_cytosine',
        label: 'Guanine ≡ Cytosine (G ≡ C)',
        labelHindi: 'ग्वानिन ≡ साइटोसिन (G ≡ C)',
        shape: 'rect',
        attributes: { x: 200, y: 150, width: 200, height: 45, rx: 8, fill: '#FEF3C7', stroke: '#D97706', strokeWidth: 3 },
        explanation: 'Purine Guanine pairs strictly with Pyrimidine Cytosine via three complementary hydrogen bonds (G ≡ C), providing high thermodynamic stability.',
        explanationHindi: 'ग्वानिन और साइटोसिन तीन हाइड्रोजन बंधों द्वारा जुड़े होते हैं, जिससे अणु को उच्च स्थायित्व मिलता है।'
      },
      {
        id: 'major_groove',
        label: 'Major Groove & Pitch (3.4 nm)',
        labelHindi: 'प्रमुख खांच एवं पिच (3.4 nm)',
        shape: 'rect',
        attributes: { x: 420, y: 60, width: 150, height: 130, rx: 10, fill: '#E0F2FE', stroke: '#0284C7', strokeWidth: 3 },
        explanation: 'One complete helical turn measures 3.4 nm (34 Å) and contains exactly 10 base pairs (0.34 nm per pair) in B-DNA.',
        explanationHindi: 'डीएनए के एक पूर्ण घुमाव की लंबाई 3.4 nm होती है जिसमें 10 न्यूक्लियोटाइड युग्म होते हैं।'
      },
      {
        id: 'hydrogen_bonds',
        label: 'Complementary Hydrogen Bonds',
        labelHindi: 'पूरक हाइड्रोजन बंध',
        shape: 'rect',
        attributes: { x: 200, y: 220, width: 200, height: 45, rx: 8, fill: '#FCE7F3', stroke: '#DB2777', strokeWidth: 3 },
        explanation: 'Non-covalent hydrogen bonding between opposite nitrogenous bases holds the two antiparallel polynucleotide strands together.',
        explanationHindi: 'विपरीत नाइट्रोजन क्षारकों के मध्य बनने वाले दुर्बल हाइड्रोजन बंध दोनों रज्जुकों को जोड़कर रखते हैं।'
      }
    ]
  },
  {
    title: 'Magnetic Field Lines of Bar Magnet',
    title_hindi: 'छड़ चुंबक की चुंबकीय क्षेत्र रेखाएं',
    subject_code: 'physics',
    svg_viewbox: '0 0 600 400',
    elements: [
      {
        id: 'north_pole',
        label: 'North Magnetic Pole (N)',
        labelHindi: 'उत्तरी चुंबकीय ध्रुव (N)',
        shape: 'rect',
        attributes: { x: 180, y: 160, width: 120, height: 80, rx: 6, fill: '#FEE2E2', stroke: '#DC2626', strokeWidth: 4 },
        explanation: 'Field lines emerge outwards from the North pole in the external space surrounding the magnet.',
        explanationHindi: 'बाह्य अंतरिक्ष में चुंबकीय क्षेत्र रेखाएं उत्तरी ध्रुव से बाहर निकलती हैं।'
      },
      {
        id: 'south_pole',
        label: 'South Magnetic Pole (S)',
        labelHindi: 'दक्षिणी चुंबकीय ध्रुव (S)',
        shape: 'rect',
        attributes: { x: 300, y: 160, width: 120, height: 80, rx: 6, fill: '#DBEAFE', stroke: '#2563EB', strokeWidth: 4 },
        explanation: 'Field lines enter and terminate into the South pole externally, continuing internally from South to North to form closed continuous loops.',
        explanationHindi: 'चुंबकीय क्षेत्र रेखाएं दक्षिणी ध्रुव पर प्रवेश करती हैं तथा चुंबक के अंदर S से N की ओर जाकर बंद वक्र बनाती हैं।'
      },
      {
        id: 'field_loop_top',
        label: 'Continuous Magnetic Field Loop',
        labelHindi: 'बंद चुंबकीय क्षेत्र लूप',
        shape: 'circle',
        attributes: { cx: 300, cy: 90, r: 60, fill: '#F8FAFC', stroke: '#059669', strokeWidth: 3 },
        explanation: 'Magnetic field lines are closed continuous curves. The degree of closeness indicates magnetic field strength.',
        explanationHindi: 'क्षेत्र रेखाएं सतत बंद लूप बनाती हैं। ध्रुवों के समीप रेखाओं की सघनता अधिक चुंबकीय क्षेत्र दर्शाती है।'
      },
      {
        id: 'neutral_point',
        label: 'Equatorial Neutral Axis',
        labelHindi: 'निरक्षीय अक्ष (Equatorial Line)',
        shape: 'rect',
        attributes: { x: 260, y: 280, width: 80, height: 60, rx: 8, fill: '#FEF3C7', stroke: '#D97706', strokeWidth: 3 },
        explanation: 'Along the equatorial broadside line, the magnetic field is directed antiparallel to the dipole moment vector.',
        explanationHindi: 'निरक्षीय रेखा पर चुंबकीय क्षेत्र चुंबकीय द्विध्रुव आघूर्ण के विपरीत दिशा में होता है।'
      }
    ]
  },
  {
    title: 'Electrolysis of Water Cell',
    title_hindi: 'जल का विद्युत अपघटन सेल',
    subject_code: 'chemistry',
    svg_viewbox: '0 0 600 400',
    elements: [
      {
        id: 'cathode_h2',
        label: 'Cathode (-): Hydrogen Gas (2 Vol)',
        labelHindi: 'कैथोड (-): हाइड्रोजन गैस (2 आयतन)',
        shape: 'rect',
        attributes: { x: 120, y: 80, width: 150, height: 180, rx: 12, fill: '#DBEAFE', stroke: '#2563EB', strokeWidth: 4 },
        explanation: 'Reduction occurs at the negative cathode: 2H⁺ + 2e⁻ → H₂(g). Twice the volume of gas collects here compared to oxygen.',
        explanationHindi: 'कैथोड पर अपचयन होता है: 2H⁺ + 2e⁻ → H₂। यहां ऑक्सीजन की तुलना में दोगुना आयतन एकत्र होता है।'
      },
      {
        id: 'anode_o2',
        label: 'Anode (+): Oxygen Gas (1 Vol)',
        labelHindi: 'एनोड (+): ऑक्सीजन गैस (1 आयतन)',
        shape: 'rect',
        attributes: { x: 330, y: 80, width: 150, height: 180, rx: 12, fill: '#FEE2E2', stroke: '#DC2626', strokeWidth: 4 },
        explanation: 'Oxidation occurs at the positive anode: 2H₂O → O₂(g) + 4H⁺ + 4e⁻. Oxygen gas supports combustion (relights glowing splint).',
        explanationHindi: 'एनोड पर ऑक्सीकरण होता है: 2H₂O → O₂ + 4H⁺ + 4e⁻। यह दहन में सहायक गैस है।'
      },
      {
        id: 'acidified_electrolyte',
        label: 'Dilute H₂SO₄ Acidified Water',
        labelHindi: 'तनु सल्फ्यूरिक अम्ल युक्त जल (विद्युत अपघट्य)',
        shape: 'rect',
        attributes: { x: 100, y: 280, width: 400, height: 70, rx: 10, fill: '#EDE9FE', stroke: '#7C3AED', strokeWidth: 3 },
        explanation: 'Pure water is a poor conductor of electricity; adding drops of dilute H₂SO₄ provides free hydronium and sulphate ions for current conduction.',
        explanationHindi: 'शुद्ध जल विद्युत का कुचालक है; तनु H₂SO₄ मिलाने से मुक्त आयन उत्पन्न होकर चालकता बढ़ाते हैं।'
      }
    ]
  },
  {
    title: 'Trigonometric Unit Circle',
    title_hindi: 'त्रिकोणमितीय इकाई वृत्त (Unit Circle)',
    subject_code: 'mathematics',
    svg_viewbox: '0 0 600 400',
    elements: [
      {
        id: 'unit_circle_boundary',
        label: 'Unit Circle (r = 1)',
        labelHindi: 'इकाई वृत्त (त्रिज्या r = 1)',
        shape: 'circle',
        attributes: { cx: 300, cy: 200, r: 120, fill: '#F8FAFC', stroke: '#2563EB', strokeWidth: 3 },
        explanation: 'A circle of radius r = 1 centered at origin (0, 0) defined by x² + y² = 1.',
        explanationHindi: 'मूल बिंदु पर केंद्रित वृत्त जिसकी त्रिज्या r = 1 है (x² + y² = 1)।'
      },
      {
        id: 'cos_projection',
        label: 'x-Coordinate = cos(θ)',
        labelHindi: 'x-अक्ष प्रक्षेप = cos(θ)',
        shape: 'rect',
        attributes: { x: 300, y: 195, width: 85, height: 10, rx: 4, fill: '#16A34A', stroke: '#15803D', strokeWidth: 2 },
        explanation: 'The horizontal coordinate of point P on the unit circle corresponds exactly to cos(θ).',
        explanationHindi: 'इकाई वृत्त पर किसी बिंदु P का क्षैतिज x-निर्देशांक cos(θ) के बराबर होता है।'
      },
      {
        id: 'sin_projection',
        label: 'y-Coordinate = sin(θ)',
        labelHindi: 'y-अक्ष प्रक्षेप = sin(θ)',
        shape: 'rect',
        attributes: { x: 380, y: 120, width: 10, height: 80, rx: 4, fill: '#DC2626', stroke: '#B91C1C', strokeWidth: 2 },
        explanation: 'The vertical height of point P above the x-axis corresponds exactly to sin(θ).',
        explanationHindi: 'बिंदु P का ऊर्ध्वाधर y-निर्देशांक sin(θ) के बराबर होता है।'
      },
      {
        id: 'pythagorean_identity',
        label: 'Fundamental Identity: sin²θ + cos²θ = 1',
        labelHindi: 'मूल सर्वसमिका: sin²θ + cos²θ = 1',
        shape: 'rect',
        attributes: { x: 180, y: 340, width: 240, height: 40, rx: 8, fill: '#FEF3C7', stroke: '#D97706', strokeWidth: 3 },
        explanation: 'By the Pythagorean theorem on the reference right triangle: (cos θ)² + (sin θ)² = 1².',
        explanationHindi: 'समकोण त्रिभुज में पाइथागोरस प्रमेय द्वारा: sin²θ + cos²θ = 1।'
      }
    ]
  }
];

async function seed() {
  console.log('--- Seeding Expanded Interactive Diagrams (P2-7) ---');

  let insertedCount = 0;

  for (const d of EXPANDED_DIAGRAMS) {
    const { data: existing } = await supabaseAdmin
      .from('diagrams')
      .select('id')
      .eq('title', d.title)
      .maybeSingle();

    if (existing) {
      console.log(`Diagram "${d.title}" already exists. Updating elements.`);
      await supabaseAdmin.from('diagrams').update({
        elements: d.elements,
        title_hindi: d.title_hindi,
        svg_viewbox: d.svg_viewbox
      }).eq('id', existing.id);
    } else {
      const { error } = await supabaseAdmin.from('diagrams').insert({
        title: d.title,
        title_hindi: d.title_hindi,
        subject_code: d.subject_code,
        svg_viewbox: d.svg_viewbox,
        elements: d.elements
      });
      if (error) {
        console.error(`Error inserting "${d.title}":`, error.message);
      } else {
        console.log(`✔ Inserted diagram: "${d.title}" (${d.subject_code})`);
        insertedCount++;
      }
    }
  }

  const { count } = await supabaseAdmin.from('diagrams').select('id', { count: 'exact', head: true });
  console.log(`Total diagrams in database now: ${count}`);
}

seed()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Diagram seed error:', err);
    process.exit(1);
  });
