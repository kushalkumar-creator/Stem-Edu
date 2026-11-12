/**
 * Seed Curriculum MCQs for CBSE Class 10 & 12 (P2-5.1)
 * Expands question bank to >= 15 questions per chapter across core subjects:
 * Physics, Chemistry, Biology, Mathematics.
 */
const { supabaseAdmin } = require('../../utils/supabaseAdmin');

const CHAPTER_QUESTIONS = {
  'Electricity': [
    {
      topic: "Ohm's Law & Resistance",
      difficulty: 'easy',
      question_text: "According to Ohm's law, if the resistance of a conductor is kept constant and the potential difference across it is doubled, the current will:",
      options: ['Be halved', 'Be doubled', 'Remain constant', 'Be quadrupled'],
      correct_option_index: 1,
      explanation: "Ohm's law states that V = IR. Since resistance R is constant, current I is directly proportional to potential difference V (I = V/R). Doubling V doubles the current I."
    },
    {
      topic: "Resistors in Series & Parallel",
      difficulty: 'medium',
      question_text: 'Three resistors of 2 Ω, 3 Ω, and 6 Ω are connected in parallel. What is their effective equivalent resistance?',
      options: ['11 Ω', '1 Ω', '0.5 Ω', '3 Ω'],
      correct_option_index: 1,
      explanation: 'For parallel resistors: 1/R_eq = 1/2 + 1/3 + 1/6 = (3 + 2 + 1)/6 = 6/6 = 1 Ω. Hence, R_eq = 1 Ω.'
    },
    {
      topic: 'Joule Heating & Electric Power',
      difficulty: 'medium',
      question_text: 'An electric heater rated 1000 W operates for 2 hours daily. What is the electrical energy consumed in 30 days?',
      options: ['30 kWh', '60 kWh', '120 kWh', '2000 kWh'],
      correct_option_index: 1,
      explanation: 'Energy = Power × Time. Daily energy = 1 kW × 2 h = 2 kWh. For 30 days, total energy = 2 kWh × 30 = 60 kWh (commercial units).'
    },
    {
      topic: 'Resistivity & Specific Resistance',
      difficulty: 'hard',
      question_text: 'A cylindrical wire of length L and resistance R is stretched uniformly to double its original length. What is its new resistance?',
      options: ['R', '2 R', '4 R', 'R / 2'],
      correct_option_index: 2,
      explanation: 'When stretched uniformly to 2L, volume V = A × L remains constant. So cross-sectional area becomes A/2. New resistance R\' = ρ(2L)/(A/2) = 4(ρL/A) = 4R.'
    },
    {
      topic: 'Electric Potential Difference',
      difficulty: 'easy',
      question_text: 'The work done in moving a unit positive charge from one point to another in an electric circuit is known as:',
      options: ['Electric Current', 'Potential Difference', 'Resistance', 'Capacitance'],
      correct_option_index: 1,
      explanation: 'Potential difference V is defined as work done W per unit charge Q (V = W/Q). The SI unit is the Volt (V).'
    },
    {
      topic: 'Factors Affecting Resistance',
      difficulty: 'easy',
      question_text: 'Which of the following factors does NOT affect the electrical resistance of a uniform metallic conductor?',
      options: ['Length of conductor', 'Area of cross-section', 'Nature of material', 'Shape of the cross-section'],
      correct_option_index: 3,
      explanation: 'Resistance depends on length (L), area of cross-section (A), temperature, and material resistivity (ρ). Shape of cross-section with identical area does not alter R.'
    },
    {
      topic: 'Ammeter & Voltmeter Connections',
      difficulty: 'medium',
      question_text: 'To measure current and potential difference in a circuit, how should an ammeter and voltmeter be connected?',
      options: [
        'Ammeter in series, Voltmeter in parallel',
        'Ammeter in parallel, Voltmeter in series',
        'Both in series',
        'Both in parallel'
      ],
      correct_option_index: 0,
      explanation: 'An ideal ammeter has very low resistance and must be connected in series. A voltmeter has high resistance and must be connected in parallel across the component.'
    },
    {
      topic: 'Domestic Electric Circuits',
      difficulty: 'medium',
      question_text: 'In standard Indian domestic electric wiring, what are the potential difference and frequency of the AC supply?',
      options: ['110 V, 60 Hz', '220 V, 50 Hz', '440 V, 50 Hz', '220 V, 60 Hz'],
      correct_option_index: 1,
      explanation: 'Standard domestic power supply in India is alternating current (AC) with potential difference 220 V (RMS) and frequency 50 Hz.'
    },
    {
      topic: 'Safety Devices & Fuse',
      difficulty: 'easy',
      question_text: 'An electric fuse works on which effect of electric current?',
      options: ['Magnetic effect', 'Chemical effect', 'Heating effect', 'Optical effect'],
      correct_option_index: 2,
      explanation: 'A fuse is a safety wire with low melting point that operates on the heating effect of electric current (H = I²Rt). When current exceeds the safe limit, it melts and breaks the circuit.'
    },
    {
      topic: 'Filament Lamp Physics',
      difficulty: 'medium',
      question_text: 'Why is Tungsten metal predominantly chosen for the filaments of incandescent electric bulbs?',
      options: [
        'High electrical conductivity and low cost',
        'High resistivity and very high melting point (~3380 °C)',
        'Low resistivity and high malleability',
        'High chemical reactivity with argon'
      ],
      correct_option_index: 1,
      explanation: 'Tungsten retains its mechanical strength and glows incandescently without melting at high temperatures due to its very high melting point (~3380 °C) and relatively high resistivity.'
    },
    {
      topic: 'Resistors in Series',
      difficulty: 'easy',
      question_text: 'When two resistors R1 and R2 are connected in series in a circuit, which quantity remains identical through both?',
      options: ['Potential difference', 'Electric current', 'Power consumed', 'Electric charge per minute'],
      correct_option_index: 1,
      explanation: 'In a series circuit, there is only a single conductive pathway for charge carriers, so the electric current I is identical through all components.'
    },
    {
      topic: 'Electric Energy & Commercial Units',
      difficulty: 'easy',
      question_text: '1 kilowatt-hour (1 kWh) of electrical energy is equivalent to how many Joules?',
      options: ['3.6 × 10⁵ J', '3.6 × 10⁶ J', '3.6 × 10⁴ J', '1000 J'],
      correct_option_index: 1,
      explanation: '1 kWh = 1000 W × 3600 s = 3,600,000 J = 3.6 × 10⁶ Joules.'
    },
    {
      topic: "Joule's Law Formula",
      difficulty: 'easy',
      question_text: 'Which equation correctly expresses the heat produced H in a resistor of resistance R carrying current I for time t?',
      options: ['H = V I² t', 'H = I² R t', 'H = I R² t', 'H = V² R t'],
      correct_option_index: 1,
      explanation: "Joule's Law of heating states H = I²Rt = VIt = (V²/R)t."
    },
    {
      topic: 'Short Circuiting & Overloading',
      difficulty: 'medium',
      question_text: 'What happens to the current in an electrical circuit during a direct short circuit?',
      options: ['Reduces substantially', 'Remains unchanged', 'Increases heavily', 'Fluctuates randomly'],
      correct_option_index: 2,
      explanation: 'When live and neutral wires come into direct physical contact, circuit resistance drops almost to zero, causing current to surge abruptly and heavily.'
    },
    {
      topic: 'Earthing & Safety',
      difficulty: 'easy',
      question_text: 'The primary purpose of connecting the metallic casing of high-power appliances to the Earth wire is to:',
      options: [
        'Prevent appliance overheating',
        'Provide a low-resistance path to protect users from severe electric shocks',
        'Increase current supply to the motor',
        'Save electricity units on the meter'
      ],
      correct_option_index: 1,
      explanation: 'Earthing provides a safe low-resistance leakage path directly to the ground if insulation fails, triggering the fuse/breaker and preventing fatal electric shocks.'
    }
  ],

  'Chemical Reactions and Equations': [
    {
      topic: 'Types of Reactions: Combination',
      difficulty: 'easy',
      question_text: 'Quicklime (CaO) reacts vigorously with water to form slaked lime. This reaction is classified as:',
      options: [
        'Endothermic and decomposition',
        'Exothermic and combination',
        'Endothermic and combination',
        'Exothermic and displacement'
      ],
      correct_option_index: 1,
      explanation: 'CaO + H₂O → Ca(OH)₂ + Heat. Two reactants combine into one single product (combination) with large heat evolution (exothermic).'
    },
    {
      topic: 'Redox Reactions',
      difficulty: 'medium',
      question_text: 'In the reaction: CuO + H₂ → Cu + H₂O, which substance acts as the reducing agent?',
      options: ['CuO', 'H₂', 'Cu', 'H₂O'],
      correct_option_index: 1,
      explanation: 'H₂ gains oxygen to become H₂O (gets oxidised), thus H₂ is the reducing agent. CuO loses oxygen to become Cu (is reduced).'
    },
    {
      topic: 'Corrosion & Rancidity',
      difficulty: 'easy',
      question_text: 'Chips and fried snack manufacturers flush plastic bags with which unreactive gas to prevent rancidity?',
      options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
      correct_option_index: 1,
      explanation: 'Nitrogen (N₂) is an inert gas that creates an oxygen-free atmosphere, preventing oxidation of oils and fats (rancidity).'
    },
    {
      topic: 'Thermal Decomposition',
      difficulty: 'medium',
      question_text: 'When green Ferrous Sulphate (FeSO₄·7H₂O) crystals are heated strongly in a dry boiling tube, what are the observed gaseous products?',
      options: ['SO₂ and SO₃', 'CO₂ and H₂O', 'NO₂ and O₂', 'H₂ and SO₂'],
      correct_option_index: 0,
      explanation: '2FeSO₄(s) → Fe₂O₃(s) + SO₂(g) + SO₃(g). Pungent smelling sulphur dioxide and sulphur trioxide gases are liberated with a reddish-brown ferric oxide residue.'
    },
    {
      topic: 'Precipitation Reaction',
      difficulty: 'easy',
      question_text: 'When aqueous solutions of Barium Chloride and Sodium Sulphate are mixed, a white precipitate of which compound is formed?',
      options: ['Barium Sulphate', 'Sodium Chloride', 'Barium Sulphide', 'Sodium Sulphite'],
      correct_option_index: 0,
      explanation: 'BaCl₂(aq) + Na₂SO₄(aq) → BaSO₄(s)↓ + 2NaCl(aq). Insoluble white BaSO₄ precipitate precipitates out.'
    },
    {
      topic: 'Displacement Reaction',
      difficulty: 'easy',
      question_text: 'An iron nail placed in blue copper sulphate solution changes the solution colour to light green due to formation of:',
      options: ['FeSO₄', 'CuSO₄', 'Fe₂O₃', 'CuO'],
      correct_option_index: 0,
      explanation: 'Fe + CuSO₄(blue) → FeSO₄(light green) + Cu(reddish brown). Iron is more reactive than copper and displaces it.'
    },
    {
      topic: 'Balancing Chemical Equations',
      difficulty: 'medium',
      question_text: 'In the balanced equation: a Fe + b H₂O → c Fe₃O₄ + d H₂, the stoichiometric coefficients (a, b, c, d) are:',
      options: ['3, 4, 1, 4', '1, 4, 3, 4', '3, 2, 1, 2', '2, 3, 1, 3'],
      correct_option_index: 0,
      explanation: '3Fe + 4H₂O → Fe₃O₄ + 4H₂. Iron atoms: 3 = 3; Hydrogen: 8 = 8; Oxygen: 4 = 4.'
    },
    {
      topic: 'Electrolysis of Water',
      difficulty: 'medium',
      question_text: 'During electrolysis of acidified water, what is the ratio of volumes of hydrogen to oxygen gases collected at cathode and anode?',
      options: ['1 : 2', '2 : 1', '1 : 1', '8 : 1'],
      correct_option_index: 1,
      explanation: '2H₂O(l) → 2H₂(g) + O₂(g). Two moles of H₂ gas collect at cathode for every one mole of O₂ at anode (volume ratio 2:1).'
    },
    {
      topic: 'Endothermic Reactions',
      difficulty: 'easy',
      question_text: 'Which of the following processes is endothermic in nature?',
      options: [
        'Respiration in living cells',
        'Decomposition of calcium carbonate by heat',
        'Dissolution of sodium hydroxide in water',
        'Burning of natural gas (methane)'
      ],
      correct_option_index: 1,
      explanation: 'CaCO₃(s) + Heat → CaO(s) + CO₂(g). Thermal decomposition absorbs energy from the surroundings, making it endothermic.'
    },
    {
      topic: 'Photochemical Decomposition',
      difficulty: 'medium',
      question_text: 'White Silver Chloride (AgCl) turns grey in sunlight due to photochemical decomposition into:',
      options: ['Silver metal and chlorine gas', 'Silver oxide and chlorine', 'Silver nitrate', 'Silver carbonate'],
      correct_option_index: 0,
      explanation: '2AgCl(s) (white) + Sunlight → 2Ag(s) (grey) + Cl₂(g). Used in black and white photography.'
    },
    {
      topic: 'Double Displacement Reactions',
      difficulty: 'medium',
      question_text: 'A double displacement reaction involves:',
      options: [
        'Exchange of ions between two reactant compounds',
        'Displacement of a less reactive metal by a more reactive metal',
        'Breakdown of a single compound into multiple products',
        'Addition of hydrogen to an element'
      ],
      correct_option_index: 0,
      explanation: 'In double displacement reactions, mutual exchange of positive and negative ions between two aqueous compounds occurs.'
    },
    {
      topic: 'Law of Conservation of Mass',
      difficulty: 'easy',
      question_text: 'Chemical equations are balanced in accordance with which fundamental physical law?',
      options: [
        'Law of Constant Proportions',
        'Law of Conservation of Mass',
        'Law of Multiple Proportions',
        'Avogadro’s Law'
      ],
      correct_option_index: 1,
      explanation: 'Law of Conservation of Mass dictates that mass cannot be created or destroyed in a chemical reaction; total atoms of each element remain identical.'
    },
    {
      topic: 'Oxidation Definition',
      difficulty: 'easy',
      question_text: 'In modern chemical terms, oxidation is defined as:',
      options: ['Gain of electrons', 'Loss of electrons', 'Gain of hydrogen', 'Loss of oxygen'],
      correct_option_index: 1,
      explanation: 'Oxidation is defined as the loss of electrons (OIL: Oxidation Is Loss). In classical terms, it is the gain of oxygen or loss of hydrogen.'
    },
    {
      topic: 'Corrosion Prevention',
      difficulty: 'easy',
      question_text: 'Galvanisation is a method of protecting iron and steel from rusting by coating them with a thin layer of:',
      options: ['Copper', 'Zinc', 'Tin', 'Chromium'],
      correct_option_index: 1,
      explanation: 'Galvanisation deposits a sacrificial layer of Zinc (Zn) over iron surfaces, preventing contact with atmospheric moisture and oxygen.'
    },
    {
      topic: 'Exothermic Reaction Example',
      difficulty: 'easy',
      question_text: 'The process of cellular respiration in human mitochondria is classified as:',
      options: ['Exothermic process', 'Endothermic process', 'Precipitation reaction', 'Neutralisation reaction'],
      correct_option_index: 0,
      explanation: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP (Energy). Cellular breakdown of glucose liberates chemical energy, classifying it as exothermic.'
    }
  ],

  'Life Processes': [
    {
      topic: 'Photosynthesis & Chloroplasts',
      difficulty: 'easy',
      question_text: 'During photosynthesis, oxygen gas is released by the splitting (photolysis) of which molecule?',
      options: ['Carbon dioxide (CO₂)', 'Water (H₂O)', 'Glucose (C₆H₁₂O₆)', 'Chlorophyll'],
      correct_option_index: 1,
      explanation: 'Light energy absorbed by chlorophyll splits water molecules (photolysis): 2H₂O → 4H⁺ + 4e⁻ + O₂. Oxygen comes from water, not CO₂.'
    },
    {
      topic: 'Human Digestive System Enzymes',
      difficulty: 'medium',
      question_text: 'Which digestive enzyme present in pancreatic juice digests emulsified lipids into fatty acids and glycerol?',
      options: ['Amylase', 'Trypsin', 'Lipase', 'Pepsin'],
      correct_option_index: 2,
      explanation: 'Pancreatic lipase hydrolyses emulsified lipid droplets into fatty acids and glycerol in the alkaline lumen of the small intestine.'
    },
    {
      topic: 'Human Circulatory System',
      difficulty: 'easy',
      question_text: 'Which blood vessels carry oxygenated blood from the lungs back to the left atrium of the human heart?',
      options: ['Pulmonary Artery', 'Pulmonary Veins', 'Vena Cava', 'Aorta'],
      correct_option_index: 1,
      explanation: 'Pulmonary veins are the only veins in human circulation that carry oxygen-rich blood from lungs directly into the left atrium.'
    },
    {
      topic: 'Excretory System & Nephron',
      difficulty: 'medium',
      question_text: 'The structural and functional filtration unit of the human kidney is called a:',
      options: ['Neuron', 'Nephron', 'Glomerulus', 'Alveolus'],
      correct_option_index: 1,
      explanation: 'Nephrons are microscopic tubular structures in kidney parenchyma responsible for ultrafiltration, selective reabsorption, and urine excretion.'
    },
    {
      topic: 'Respiration & Anaerobic Glycolysis',
      difficulty: 'medium',
      question_text: 'During vigorous physical exercise, accumulation of which chemical in human muscle cells causes muscle cramps?',
      options: ['Pyruvate', 'Lactic acid', 'Ethanol', 'Carbonic acid'],
      correct_option_index: 1,
      explanation: 'In the lack of sufficient oxygen during vigorous sprints, pyruvate converts into 3-carbon lactic acid, causing localized fatigue and painful cramps.'
    },
    {
      topic: 'Plant Transport: Xylem & Phloem',
      difficulty: 'easy',
      question_text: 'Translocation of soluble photosynthetic products (sucrose) in higher plants takes place through:',
      options: ['Xylem vessels', 'Phloem sieve tubes', 'Cambium', 'Pith'],
      correct_option_index: 1,
      explanation: 'Phloem tissues (sieve tubes and companion cells) transport soluble photosynthates bidirectionally using metabolic ATP energy.'
    },
    {
      topic: 'Stomatal Opening Mechanism',
      difficulty: 'medium',
      question_text: 'The opening and closing of stomatal pores is primarily regulated by:',
      options: [
        'Water content and turgidity of guard cells',
        'Atmospheric oxygen level',
        'Root pressure alone',
        'Soil nitrogen concentration'
      ],
      correct_option_index: 0,
      explanation: 'When water flows into guard cells, they become turgid and bow outward, opening the pore. When they lose water, they become flaccid and close.'
    },
    {
      topic: 'Gastric Secretions',
      difficulty: 'easy',
      question_text: 'What is the physiological role of Hydrochloric Acid (HCl) secreted by parietal cells in gastric juice?',
      options: [
        'Activates inactive pepsinogen into active pepsin and kills ingested pathogens',
        'Digests dietary carbohydrates directly',
        'Emulsifies large lipid globules',
        'Neutralises bile juice in the stomach'
      ],
      correct_option_index: 0,
      explanation: 'Gastric HCl creates an optimal acidic pH (~1.5–2.0) required for pepsinogen activation into pepsin and provides antimicrobial defense.'
    },
    {
      topic: 'Bile Function',
      difficulty: 'easy',
      question_text: 'Bile juice secreted by the liver is stored in the gall bladder. What is its main role in digestion?',
      options: [
        'Chemical digestion of proteins into peptides',
        'Emulsification of large fat globules and alkalinising chime',
        'Breaking starches into maltose',
        'Absorbing dietary water in the colon'
      ],
      correct_option_index: 1,
      explanation: 'Bile salts break large fat droplets into tiny micelles (emulsification), increasing surface area for lipase action, and provide alkaline pH.'
    },
    {
      topic: 'Heart Valves Function',
      difficulty: 'medium',
      question_text: 'Valves in the human heart and systemic veins ensure that:',
      options: [
        'Blood flows under highest possible pressure',
        'Blood flows strictly in a unidirectional manner without backflow',
        'Oxygen and carbon dioxide mix thoroughly',
        'Red blood cells are constantly filtered'
      ],
      correct_option_index: 1,
      explanation: 'Tricuspid, bicuspid (mitral), and semilunar valves prevent backward flow of blood when cardiac chambers contract and relax.'
    },
    {
      topic: 'Alveoli Function in Lungs',
      difficulty: 'easy',
      question_text: 'Human alveoli are surrounded by an extensive network of blood capillaries primarily to:',
      options: [
        'Warm and humidify inhaled air',
        'Provide enormous surface area for gaseous exchange (O₂ and CO₂)',
        'Filter dust particles and pollen',
        'Produce vocal cord sound waves'
      ],
      correct_option_index: 1,
      explanation: 'Millions of thin-walled alveoli provide ~80 m² surface area rich in capillary beds for rapid passive diffusion of oxygen into blood and CO₂ out.'
    },
    {
      topic: 'Blood Components',
      difficulty: 'easy',
      question_text: 'Which blood cellular component is responsible for initiating haemostasis and blood clotting at a cut?',
      options: ['Erythrocytes (RBCs)', 'Platelets (Thrombocytes)', 'Lymphocytes', 'Monocytes'],
      correct_option_index: 1,
      explanation: 'Platelets adhere to damaged endothelial tissue, release thromboplastin, and initiate the enzyme cascade forming a fibrin mesh clot.'
    },
    {
      topic: 'Transpiration Pull',
      difficulty: 'medium',
      question_text: 'The major driving force responsible for continuous upward movement of water in tall trees during the day is:',
      options: ['Root pressure', 'Transpirational suction pull', 'Atmospheric pressure', 'Capillary action alone'],
      correct_option_index: 1,
      explanation: 'Evaporative loss of water vapor from leaf stomata generates negative hydrostatic pressure (transpiration pull) pulling continuous xylem water columns.'
    },
    {
      topic: 'Ultrafiltration in Nephron',
      difficulty: 'hard',
      question_text: 'Glomerular filtration in Bowman’s capsule filters out all of the following EXCEPT:',
      options: ['Glucose', 'Amino acids', 'Urea', 'Large plasma proteins and blood cells'],
      correct_option_index: 3,
      explanation: 'Podocyte filtration slits restrict high molecular weight plasma proteins (albumin) and erythrocytes, allowing only water and small solutes into primary filtrate.'
    },
    {
      topic: 'Autotrophic Nutrition Mode',
      difficulty: 'easy',
      question_text: 'Organisms that synthesise their own organic food from simple inorganic raw materials (CO₂ and H₂O) using sunlight are:',
      options: ['Saprotrophs', 'Autotrophs', 'Heterotrophs', 'Parasites'],
      correct_option_index: 1,
      explanation: 'Green plants and photosynthetic cyanobacteria are autotrophs; they convert inorganic minerals and solar photons into chemical bond energy.'
    }
  ],

  'Real Numbers': [
    {
      topic: 'Fundamental Theorem of Arithmetic',
      difficulty: 'easy',
      question_text: 'Every composite number can be expressed (factorised) uniquely as a product of prime numbers, apart from:',
      options: ['Their magnitude', 'The order in which the prime factors occur', 'Their sign', 'The base number system'],
      correct_option_index: 1,
      explanation: 'The Fundamental Theorem of Arithmetic guarantees uniqueness of prime factorisation of positive integers up to permutation of factor order.'
    },
    {
      topic: 'HCF and LCM Relation',
      difficulty: 'medium',
      question_text: 'For any two positive integers a and b, which relationship between their HCF and LCM is always true?',
      options: ['HCF(a, b) + LCM(a, b) = a × b', 'HCF(a, b) × LCM(a, b) = a × b', 'LCM(a, b) / HCF(a, b) = a + b', 'HCF(a, b) × a = LCM(a, b) × b'],
      correct_option_index: 1,
      explanation: 'For any two positive integers a and b: HCF(a, b) × LCM(a, b) = a × b.'
    },
    {
      topic: 'Irrational Numbers Proof',
      difficulty: 'medium',
      question_text: 'If p is a prime number and p divides a² (where a is a positive integer), then by theorem:',
      options: ['p must divide a', 'a must divide p', 'p² divides a', 'p is composite'],
      correct_option_index: 0,
      explanation: 'By fundamental prime divisibility theorem, if a prime p divides a², then p must also divide a.'
    },
    {
      topic: 'Terminating Decimal Expansion',
      difficulty: 'medium',
      question_text: 'A rational number p/q in simplest form has a terminating decimal expansion if the prime factorisation of q is of the form:',
      options: ['2ⁿ × 3ᵐ', '2ⁿ × 5ᵐ', '3ⁿ × 5ᵐ', '2ⁿ × 7ᵐ'],
      correct_option_index: 1,
      explanation: 'A rational fraction p/q terminates if and only if the denominator q contains no prime factors other than 2 and 5 (q = 2ⁿ × 5ᵐ).'
    },
    {
      topic: 'Euclidean HCF Calculation',
      difficulty: 'easy',
      question_text: 'What is the HCF of two consecutive natural numbers n and n + 1?',
      options: ['0', '1', 'n', 'n(n + 1)'],
      correct_option_index: 1,
      explanation: 'Two consecutive integers share no common divisor greater than 1; their difference is 1, so HCF(n, n + 1) = 1 (they are coprime).'
    },
    {
      topic: 'Irrationality of Root 2',
      difficulty: 'easy',
      question_text: 'Which of the following is an irrational number?',
      options: ['√4', '3.141414... (repeating)', '√2', '22/7'],
      correct_option_index: 2,
      explanation: '√2 cannot be written as a ratio of two integers p/q; its decimal expansion is non-terminating and non-recurring, so it is irrational.'
    },
    {
      topic: 'HCF and LCM Numerical',
      difficulty: 'medium',
      question_text: 'If HCF(306, 657) = 9, what is LCM(306, 657)?',
      options: ['22338', '21338', '22438', '19872'],
      correct_option_index: 0,
      explanation: 'LCM = (306 × 657) / 9 = 34 × 657 = 22,338.'
    },
    {
      topic: 'Sum of Rational and Irrational',
      difficulty: 'easy',
      question_text: 'The sum of a non-zero rational number and an irrational number is always:',
      options: ['A rational number', 'An irrational number', 'An integer', 'Zero'],
      correct_option_index: 1,
      explanation: 'If r is rational and x is irrational, assuming r + x = q (rational) implies x = q - r (rational), which is a contradiction. Hence, r + x is always irrational.'
    },
    {
      topic: 'Prime Factors of Numbers Ending in 0',
      difficulty: 'medium',
      question_text: 'For 6ⁿ to end with the digit 0 for any natural number n, its prime factorisation must contain:',
      options: ['Both 2 and 3', 'Both 2 and 5', 'Both 3 and 5', 'Both 5 and 7'],
      correct_option_index: 1,
      explanation: 'A number ending in digit 0 is divisible by 10 = 2 × 5. Since 6ⁿ = (2 × 3)ⁿ contains only primes 2 and 3, it can never end with 0.'
    },
    {
      topic: 'Product of Coprimes',
      difficulty: 'easy',
      question_text: 'If two numbers a and b are coprime, what is their LCM?',
      options: ['1', 'a + b', 'a × b', 'a / b'],
      correct_option_index: 2,
      explanation: 'Coprime numbers have HCF = 1. Since HCF × LCM = a × b, LCM = (a × b) / 1 = a × b.'
    },
    {
      topic: 'Smallest Prime and Smallest Composite HCF',
      difficulty: 'medium',
      question_text: 'The HCF of the smallest prime number and the smallest composite number is:',
      options: ['1', '2', '4', '8'],
      correct_option_index: 1,
      explanation: 'Smallest prime number is 2. Smallest composite number is 4. HCF(2, 4) = 2.'
    },
    {
      topic: 'Non-terminating Repeating Decimals',
      difficulty: 'medium',
      question_text: 'The fraction 13 / 3125 has a decimal expansion that:',
      options: [
        'Terminates after 5 decimal places',
        'Terminates after 3 decimal places',
        'Is non-terminating non-repeating',
        'Terminates after 4 decimal places'
      ],
      correct_option_index: 0,
      explanation: '3125 = 5⁵ = 2⁰ × 5⁵. Since highest power of 2 or 5 is 5, it terminates after exactly 5 decimal places.'
    },
    {
      topic: 'Real Numbers Classification',
      difficulty: 'easy',
      question_text: 'The set of all Real Numbers consists of:',
      options: [
        'Only Rational numbers',
        'Only Integers and Fractions',
        'Both Rational and Irrational numbers',
        'Only Natural numbers'
      ],
      correct_option_index: 2,
      explanation: 'The real number line R is the complete union of the set of rational numbers Q and irrational numbers Q\'.'
    },
    {
      topic: 'Product of Three Consecutive Integers',
      difficulty: 'hard',
      question_text: 'The product of any three consecutive positive integers is always divisible by:',
      options: ['4', '5', '6', '8'],
      correct_option_index: 2,
      explanation: 'Among three consecutive integers, at least one is divisible by 2 and exactly one is divisible by 3. Since 2 and 3 are coprime, the product is always divisible by 2 × 3 = 6.'
    },
    {
      topic: 'Decimal Form of 1/7',
      difficulty: 'easy',
      question_text: 'The decimal expansion of 1/7 is non-terminating and recurring because the denominator 7:',
      options: ['Is a prime number', 'Cannot be expressed in the form 2ⁿ × 5ᵐ', 'Is greater than 1', 'Is odd'],
      correct_option_index: 1,
      explanation: 'A rational number p/q yields a non-terminating repeating decimal whenever q contains any prime factors other than 2 or 5.'
    }
  ],

  'Electric Charges and Fields': [
    {
      topic: "Coulomb's Law",
      difficulty: 'easy',
      question_text: "According to Coulomb's law, if the distance between two stationary point charges is halved, the electrostatic force between them becomes:",
      options: ['Halved', 'Doubled', 'Four times', 'One-fourth'],
      correct_option_index: 2,
      explanation: 'Coulomb force F ∝ 1/r². If r becomes r/2, F\' = F / (1/2)² = 4F.'
    },
    {
      topic: "Gauss's Law",
      difficulty: 'medium',
      question_text: "Gauss's law states that the total electric flux through any closed Gaussian surface in vacuum is equal to:",
      options: ['q / ε₀', 'q × ε₀', '4π ε₀ q', 'q / (4πε₀)'],
      correct_option_index: 0,
      explanation: 'Total flux Φ = ∮ E · dA = q_enclosed / ε₀, where q_enclosed is the net charge enclosed inside the closed surface.'
    },
    {
      topic: 'Electric Dipole in Uniform Field',
      difficulty: 'medium',
      question_text: 'When an electric dipole with dipole moment p is placed in a uniform electric field E, what are the net force and net torque experienced?',
      options: [
        'Net force = 0, Torque = p × E',
        'Net force = p · E, Torque = 0',
        'Net force = qE, Torque = p × E',
        'Both net force and torque are zero'
      ],
      correct_option_index: 0,
      explanation: 'In a uniform electric field, equal and opposite charges experience equal and opposite collinear forces, so F_net = 0. The non-collinear force pair exerts a torque τ = p × E.'
    },
    {
      topic: 'Field of an Infinite Sheet of Charge',
      difficulty: 'medium',
      question_text: 'The electric field magnitude near an infinite thin plane sheet of uniform surface charge density σ is:',
      options: ['σ / ε₀', 'σ / (2ε₀)', '2σ / ε₀', 'σ / (4πε₀)'],
      correct_option_index: 1,
      explanation: 'Applying Gauss law on a cylindrical pillbox: 2EA = σA / ε₀ ⇒ E = σ / (2ε₀). Notice it is completely independent of distance from the plane.'
    },
    {
      topic: 'Electric Field Inside a Conductor',
      difficulty: 'easy',
      question_text: 'In electrostatic equilibrium, what is the value of the electric field inside a hollow metallic conductor?',
      options: ['Infinite', 'Zero', 'Uniform and non-zero', 'Depends on exterior charge'],
      correct_option_index: 1,
      explanation: 'Free electrons redistribute instantaneously on the outer surface until the internal electrostatic field becomes exactly zero everywhere inside.'
    },
    {
      topic: 'Quantization of Charge',
      difficulty: 'easy',
      question_text: 'The experimental law expressing that electric charge is quantized states that q = ne, where e is:',
      options: ['1.6 × 10⁻¹⁹ C', '9.1 × 10⁻³¹ C', '6.63 × 10⁻³⁴ C', '8.85 × 10⁻¹² C'],
      correct_option_index: 0,
      explanation: 'Elementary charge e carried by an electron or proton has magnitude 1.602 × 10⁻¹⁹ Coulombs.'
    },
    {
      topic: 'Dipole on Axial vs Equatorial Line',
      difficulty: 'hard',
      question_text: 'For a short electric dipole, what is the ratio of electric field on the axial line to that on the equatorial line at the same distance r?',
      options: ['1 : 1', '2 : 1', '1 : 2', '4 : 1'],
      correct_option_index: 1,
      explanation: 'E_axial = 2kp / r³ and E_equatorial = kp / r³. Therefore, E_axial / E_equatorial = 2 : 1.'
    },
    {
      topic: 'Electric Flux Units',
      difficulty: 'easy',
      question_text: 'What is the SI unit of electric flux (Φ)?',
      options: ['N / C', 'N · m² / C', 'V / m', 'C / m²'],
      correct_option_index: 1,
      explanation: 'Electric flux Φ = E · A = (N/C) × m² = N·m²/C (or Volt-meter, V·m).'
    },
    {
      topic: 'Force Between Two Electrons',
      difficulty: 'medium',
      question_text: 'At microscopic scales, the ratio of electrostatic repulsive force to gravitational attractive force between two electrons is on the order of:',
      options: ['10¹⁰', '10²⁴', '10⁴²', '10⁻⁴²'],
      correct_option_index: 2,
      explanation: 'F_e / F_g = (k e²) / (G m_e²) ≈ 4.17 × 10⁴², illustrating why electrostatic forces dominate subatomic interactions.'
    },
    {
      topic: 'Continuous Charge Distributions',
      difficulty: 'easy',
      question_text: 'Linear charge density λ is defined as charge per unit length. Its SI unit is:',
      options: ['C · m', 'C / m', 'C / m²', 'C / m³'],
      correct_option_index: 1,
      explanation: 'λ = dq / dl, measured in Coulombs per meter (C/m).'
    },
    {
      topic: 'Field Lines Properties',
      difficulty: 'easy',
      question_text: 'Why can two electrostatic field lines never intersect each other at any point in space?',
      options: [
        'They are mutually parallel lines',
        'At the intersection point there would be two tangent directions for electric field, which is physically impossible',
        'They always form closed continuous loops',
        'Electrostatic charges absorb field lines'
      ],
      correct_option_index: 1,
      explanation: 'The tangent to a field line gives the unique direction of the electric field vector E. If two lines intersect, two distinct field vectors would exist at one point, which is impossible.'
    },
    {
      topic: 'Dielectric Constant Relation',
      difficulty: 'medium',
      question_text: 'When a medium of dielectric constant K is introduced between two charges, the electrostatic force between them:',
      options: ['Increases by a factor K', 'Decreases by a factor K', 'Remains unchanged', 'Becomes zero'],
      correct_option_index: 1,
      explanation: 'F_medium = F_vacuum / K = F / ε_r. Dielectric polarisation shields and diminishes the net electrostatic interaction.'
    },
    {
      topic: 'Field of a Line of Charge',
      difficulty: 'hard',
      question_text: 'The electric field E due to an infinitely long straight wire carrying uniform linear charge density λ at radial distance r varies as:',
      options: ['1 / r²', '1 / r', '1 / r³', 'Independent of r'],
      correct_option_index: 1,
      explanation: 'From Gauss Law with a cylindrical surface of length L: E(2πrL) = λL / ε₀ ⇒ E = λ / (2πε₀r). Hence E ∝ 1/r.'
    },
    {
      topic: 'Potential Energy of Dipole',
      difficulty: 'medium',
      question_text: 'What is the electrostatic potential energy of an electric dipole p in an external electric field E when it is in stable equilibrium?',
      options: ['+pE', '0', '-pE', '-2pE'],
      correct_option_index: 2,
      explanation: 'Potential energy U = -p · E = -pE cos θ. In stable equilibrium, dipole aligns parallel to field (θ = 0°), giving minimum energy U = -pE.'
    },
    {
      topic: 'Closed Field Loops',
      difficulty: 'easy',
      question_text: 'Electrostatic field lines do not form closed loops because:',
      options: [
        'Electrostatic field is a conservative force field originating from positive charges and terminating on negative charges',
        'Current does not flow in conductors',
        'Magnetic fields oppose them',
        'Charges are always isolated'
      ],
      correct_option_index: 0,
      explanation: 'Electrostatic field is conservative (∮ E · dl = 0). Field lines begin on positive charges and end on negative charges; they do not form closed loops.'
    }
  ],

  'Solutions (Class 12)': [
    {
      topic: "Raoult's Law",
      difficulty: 'medium',
      question_text: "According to Raoult's law for a solution of volatile liquids, the partial vapour pressure of each component is directly proportional to its:",
      options: ['Molarity', 'Molality', 'Mole fraction in the solution', 'Mass percentage'],
      correct_option_index: 2,
      explanation: "Raoult's law states that p₁ = x₁ · p₁°, where p₁ is the partial vapour pressure of component 1 and x₁ is its mole fraction in solution."
    },
    {
      topic: "Henry's Law",
      difficulty: 'easy',
      question_text: "Henry's law constant K_H for solubility of gas in liquid:",
      options: [
        'Increases with increase in temperature, decreasing solubility',
        'Decreases with increase in temperature, increasing solubility',
        'Is constant for all gases at all temperatures',
        'Is independent of temperature'
      ],
      correct_option_index: 0,
      explanation: 'Solubility of gases in liquids is exothermic. K_H increases with temperature; since p = K_H · x, higher K_H at constant pressure implies lower mole fraction (lower solubility).'
    },
    {
      topic: 'Colligative Properties: Osmotic Pressure',
      difficulty: 'medium',
      question_text: 'Which colligative property is widely preferred for determining the molar mass of biomolecules and proteins?',
      options: [
        'Relative lowering of vapour pressure',
        'Elevation of boiling point',
        'Depression of freezing point',
        'Osmotic pressure (Π = CRT)'
      ],
      correct_option_index: 3,
      explanation: 'Osmotic pressure is measured at room temperature, uses molarity instead of molality, and produces significant measurable magnitudes even for dilute solutions of unstable biomolecules.'
    },
    {
      topic: "van 't Hoff Factor",
      difficulty: 'hard',
      question_text: "What is the van 't Hoff factor (i) for a completely dissociated electrolyte of Calcium Nitrate Ca(NO₃)₂ in water?",
      options: ['1', '2', '3', '4'],
      correct_option_index: 2,
      explanation: 'Ca(NO₃)₂ dissociates completely into one Ca²⁺ cation and two NO₃⁻ anions: Ca(NO₃)₂ → Ca²⁺ + 2NO₃⁻. Thus n = 3 particles per formula unit, so i = 3.'
    },
    {
      topic: 'Ideal Solutions',
      difficulty: 'easy',
      question_text: 'For an ideal solution obeying Raoult’s law over the entire range of concentration, which condition is NOT true?',
      options: ['ΔH_mix = 0', 'ΔV_mix = 0', 'ΔS_mix = 0', 'p_total = p_A + p_B'],
      correct_option_index: 2,
      explanation: 'Mixing of two liquids is a spontaneous process, so the entropy of mixing is always positive (ΔS_mix > 0), even for ideal solutions.'
    },
    {
      topic: 'Negative Deviation from Raoult’s Law',
      difficulty: 'medium',
      question_text: 'A mixture of Acetone and Chloroform exhibits negative deviation from Raoult’s law because:',
      options: [
        'A-B interactions are weaker than A-A and B-B interactions',
        'Intermolecular hydrogen bonding forms between Acetone and Chloroform molecules',
        'Both liquids are completely immiscible',
        'Vapour pressure of the mixture increases above predicted values'
      ],
      correct_option_index: 1,
      explanation: 'Chloroform forms a strong intermolecular hydrogen bond with the carbonyl oxygen of acetone (A-B > A-A, B-B), reducing escaping tendency and lowering vapour pressure.'
    },
    {
      topic: 'Azeotropes',
      difficulty: 'medium',
      question_text: 'A binary liquid mixture that boils at a constant temperature without any change in liquid and vapour composition is called an:',
      options: ['Ideal solution', 'Azeotrope (constant boiling mixture)', 'Colloid', 'Emulsion'],
      correct_option_index: 1,
      explanation: 'Azeotropes boil at a single sharp boiling point like a pure chemical compound and cannot be separated into individual components by fractional distillation.'
    },
    {
      topic: 'Elevation in Boiling Point Formula',
      difficulty: 'easy',
      question_text: 'The molal boiling point elevation constant K_b is also called the:',
      options: ['Cryoscopic constant', 'Ebullioscopic constant', 'Henry’s constant', 'Gas constant'],
      correct_option_index: 1,
      explanation: 'K_b is the ebullioscopic constant (from Greek ebullire, to boil). Cryoscopic constant is K_f for freezing point depression.'
    },
    {
      topic: 'Isotonic Solutions',
      difficulty: 'easy',
      question_text: 'Two solutions having identical osmotic pressures at a given temperature are referred to as:',
      options: ['Hypertonic solutions', 'Hypotonic solutions', 'Isotonic solutions', 'Azeotropic solutions'],
      correct_option_index: 2,
      explanation: 'Isotonic solutions have equal molar concentrations and equal osmotic pressure; when separated by a semipermeable membrane, no net osmosis occurs.'
    },
    {
      topic: 'Reverse Osmosis Application',
      difficulty: 'easy',
      question_text: 'Desalination of seawater to obtain potable drinking water is achieved commercially by:',
      options: ['Electrodialysis', 'Reverse Osmosis (RO)', 'Fractional Crystallisation', 'Sedimentation'],
      correct_option_index: 1,
      explanation: 'Applying pressure greater than the osmotic pressure on saline water forces pure water molecules backward through a semipermeable cellulose acetate membrane.'
    },
    {
      topic: 'Molality vs Molarity',
      difficulty: 'medium',
      question_text: 'Why is Molality (m) preferred over Molarity (M) in expressing concentration for thermodynamic and temperature studies?',
      options: [
        'Molality is easier to calculate',
        'Molality is based on mass of solvent and does not change with temperature',
        'Molarity is always larger than molality',
        'Solvents do not evaporate in molal solutions'
      ],
      correct_option_index: 1,
      explanation: 'Molarity depends on solution volume, which expands or contracts with temperature changes. Molality depends on solvent mass (kg), which is temperature-independent.'
    },
    {
      topic: 'Abnormal Molar Mass: Association',
      difficulty: 'hard',
      question_text: 'When Acetic Acid (CH₃COOH) is dissolved in benzene, its observed molar mass is approximately 120 g/mol instead of 60 g/mol because of:',
      options: ['Electrolytic dissociation', 'Dimerisation via intermolecular hydrogen bonding', 'Volatilisation', 'Hydrolysis'],
      correct_option_index: 1,
      explanation: 'In non-polar solvents like benzene, two acetic acid molecules associate via cyclic hydrogen bonds into a dimer (CH₃COOH)₂, halving the effective particle count and doubling observed molecular weight.'
    },
    {
      topic: 'Depression in Freezing Point in Antifreeze',
      difficulty: 'medium',
      question_text: 'Ethylene glycol is added to automobile radiators in sub-zero winter climates primarily to:',
      options: [
        'Act as a lubricant for engine valves',
        'Lower the freezing point of water and prevent radiator bursting',
        'Increase coolant electrical conductivity',
        'Neutralise acid formation'
      ],
      correct_option_index: 1,
      explanation: 'Adding ethylene glycol creates a solution with depressed freezing point (ΔT_f = K_f · m), ensuring cooling water remains liquid well below 0 °C.'
    },
    {
      topic: 'Relative Lowering of Vapour Pressure',
      difficulty: 'medium',
      question_text: 'For a dilute solution containing a non-volatile solute, the relative lowering of vapour pressure (p° - p) / p° is equal to:',
      options: ['Molality of the solute', 'Molarity of the solute', 'Mole fraction of the solute (x₂)', 'Mole fraction of the solvent (x₁)'],
      correct_option_index: 2,
      explanation: 'From Raoult’s law: p = p° · x₁ = p°(1 - x₂) ⇒ (p° - p) / p° = x₂ (mole fraction of non-volatile solute).'
    },
    {
      topic: 'Units of Molality',
      difficulty: 'easy',
      question_text: 'What is the correct SI unit of molality?',
      options: ['mol / L', 'mol / kg', 'g / L', 'kg / mol'],
      correct_option_index: 1,
      explanation: 'Molality is defined as moles of solute per kilogram of solvent (mol/kg).'
    }
  ],

  'Matrices': [
    {
      topic: 'Matrix Multiplication Properties',
      difficulty: 'medium',
      question_text: 'If A and B are two square matrices of the same order, which of the following is generally FALSE?',
      options: ['(AB)ᵀ = Bᵀ Aᵀ', 'AB = BA', '(A + B)ᵀ = Aᵀ + Bᵀ', 'A(BC) = (AB)C'],
      correct_option_index: 1,
      explanation: 'Matrix multiplication is associative and distributive, but generally NOT commutative (AB ≠ BA in general).'
    },
    {
      topic: 'Symmetric and Skew-Symmetric Matrices',
      difficulty: 'easy',
      question_text: 'A square matrix A is called skew-symmetric if and only if:',
      options: ['Aᵀ = A', 'Aᵀ = -A', 'A² = I', 'det(A) = 0'],
      correct_option_index: 1,
      explanation: 'By definition, a matrix A is skew-symmetric if its transpose equals its negative (Aᵀ = -A). All its diagonal entries must be zero.'
    },
    {
      topic: 'Invertibility Condition',
      difficulty: 'easy',
      question_text: 'A square matrix A possesses an inverse A⁻¹ if and only if:',
      options: ['det(A) = 0 (singular)', 'det(A) ≠ 0 (non-singular)', 'A is symmetric', 'A has all positive eigenvalues'],
      correct_option_index: 1,
      explanation: 'A matrix is invertible if and only if it is non-singular (det(A) ≠ 0), because A⁻¹ = (1 / det(A)) · adj(A).'
    },
    {
      topic: 'Determinant of Transpose',
      difficulty: 'easy',
      question_text: 'For any square matrix A of order n, what is det(Aᵀ)?',
      options: ['-det(A)', 'det(A)', '1 / det(A)', 'n · det(A)'],
      correct_option_index: 1,
      explanation: 'Transposing rows into columns does not alter the value of the determinant: det(Aᵀ) = det(A).'
    },
    {
      topic: 'Scalar Multiplication on Determinant',
      difficulty: 'medium',
      question_text: 'If A is a square matrix of order 3 × 3 and det(A) = 5, what is det(2A)?',
      options: ['10', '20', '40', '80'],
      correct_option_index: 2,
      explanation: 'For an n × n matrix, det(k · A) = kⁿ · det(A). For order 3 and k = 2: det(2A) = 2³ × 5 = 8 × 5 = 40.'
    },
    {
      topic: 'Product of Matrix and its Adjoint',
      difficulty: 'hard',
      question_text: 'For any square matrix A of order n, A · adj(A) is equal to:',
      options: ['det(A) · I', 'adj(A) · det(A)', 'I', 'det(A) · A'],
      correct_option_index: 0,
      explanation: 'Fundamental adjoint theorem: A · adj(A) = adj(A) · A = det(A) · I_n.'
    },
    {
      topic: 'Diagonal Elements of Skew-Symmetric Matrix',
      difficulty: 'easy',
      question_text: 'The principal diagonal elements of every skew-symmetric matrix are always:',
      options: ['1', 'All equal to 0', 'Purely imaginary', 'Any non-zero real numbers'],
      correct_option_index: 1,
      explanation: 'Since a_ji = -a_ij, for diagonal elements where i = j: a_ii = -a_ii ⇒ 2 a_ii = 0 ⇒ a_ii = 0.'
    },
    {
      topic: 'Orthogonal Matrix',
      difficulty: 'medium',
      question_text: 'A real square matrix Q is orthogonal if and only if:',
      options: ['Qᵀ = Q', 'Qᵀ Q = I', 'det(Q) = 0', 'Q² = 0'],
      correct_option_index: 1,
      explanation: 'A matrix Q is orthogonal if its transpose equals its inverse (Qᵀ = Q⁻¹), which means Qᵀ Q = Q Qᵀ = I.'
    },
    {
      topic: 'Determinant of Adjoint',
      difficulty: 'hard',
      question_text: 'If A is a non-singular square matrix of order 3 and det(A) = 4, then det(adj(A)) equals:',
      options: ['4', '12', '16', '64'],
      correct_option_index: 2,
      explanation: 'For any n × n matrix: det(adj(A)) = (det(A))^(n - 1). With n = 3 and det(A) = 4: det(adj(A)) = 4^(3 - 1) = 4² = 16.'
    },
    {
      topic: 'Trace of a Matrix',
      difficulty: 'easy',
      question_text: 'The trace of a square matrix is defined as:',
      options: [
        'The product of all elements',
        'The sum of the elements lying on the main diagonal',
        'The determinant of the matrix',
        'The difference between row sums'
      ],
      correct_option_index: 1,
      explanation: 'Trace tr(A) = ∑ a_ii, the scalar sum of all elements along the principal diagonal.'
    },
    {
      topic: 'Identity Matrix Multiplication',
      difficulty: 'easy',
      question_text: 'If I is an identity matrix and A is any conformable matrix, then IA equals:',
      options: ['I', '0', 'A', 'A²'],
      correct_option_index: 2,
      explanation: 'The identity matrix acts as the multiplicative identity element: IA = AI = A.'
    },
    {
      topic: 'Nilpotent Matrix',
      difficulty: 'medium',
      question_text: 'A square matrix A is called nilpotent if:',
      options: ['A² = I', 'A² = A', 'Aᵏ = 0 for some positive integer k', 'det(A) = 1'],
      correct_option_index: 2,
      explanation: 'A matrix is nilpotent if raising it to some positive integer power k yields the null matrix (Aᵏ = O).'
    },
    {
      topic: 'Transpose of a Sum',
      difficulty: 'easy',
      question_text: 'For any two matrices A and B of the same order, (A + B)ᵀ is equal to:',
      options: ['Aᵀ + Bᵀ', 'Bᵀ + Aᵀ', 'Both A and B are correct', 'Aᵀ Bᵀ'],
      correct_option_index: 2,
      explanation: 'Transpose operation is linear: (A + B)ᵀ = Aᵀ + Bᵀ = Bᵀ + Aᵀ.'
    },
    {
      topic: 'Singular Matrix Condition',
      difficulty: 'easy',
      question_text: 'A square matrix A is said to be singular if:',
      options: ['det(A) = 0', 'det(A) = 1', 'det(A) < 0', 'A = Aᵀ'],
      correct_option_index: 0,
      explanation: 'A matrix is singular if its determinant is zero; such matrices do not possess a multiplicative inverse.'
    },
    {
      topic: 'Matrix Decomposition into Symmetric & Skew-Symmetric',
      difficulty: 'medium',
      question_text: 'Any square matrix A can be uniquely expressed as the sum of a symmetric matrix and a skew-symmetric matrix as:',
      options: [
        'A = 1/2 (A + Aᵀ) + 1/2 (A - Aᵀ)',
        'A = (A + Aᵀ) - (A - Aᵀ)',
        'A = 1/2 (A Aᵀ) + 1/2 (Aᵀ A)',
        'A = Aᵀ + A'
      ],
      correct_option_index: 0,
      explanation: 'Since (A + Aᵀ) is symmetric and (A - Aᵀ) is skew-symmetric, A = 1/2(A + Aᵀ) + 1/2(A - Aᵀ) provides the unique canonical decomposition.'
    }
  ]
};

async function seed() {
  console.log('--- Seeding Expanded Curriculum MCQs (P2-5.1) ---');

  // Check whether questions table currently has topic column
  let hasTopicCol = true;
  const testCol = await supabaseAdmin.from('questions').select('topic').limit(1);
  if (testCol.error && testCol.error.code === '42703') {
    hasTopicCol = false;
    console.log('Notice: topic column is pending migration 006. Omitting topic column from direct insert.');
  }

  // Fetch all chapters to match IDs by title
  const { data: chapters, error: cErr } = await supabaseAdmin
    .from('chapters')
    .select('id, title, class_level, board');

  if (cErr) {
    console.error('Error fetching chapters:', cErr);
    process.exit(1);
  }

  const chapterMap = new Map();
  chapters.forEach(c => chapterMap.set(c.title.trim().toLowerCase(), c));

  let totalInserted = 0;

  for (const [chapTitle, qList] of Object.entries(CHAPTER_QUESTIONS)) {
    const matched = chapterMap.get(chapTitle.trim().toLowerCase());
    if (!matched) {
      console.warn(`Chapter "${chapTitle}" not found in database. Skipping.`);
      continue;
    }

    console.log(`Processing chapter "${chapTitle}" (ID: ${matched.id}, Class: ${matched.class_level})...`);

    for (const q of qList) {
      // Check if duplicate question already exists
      const { data: existing } = await supabaseAdmin
        .from('questions')
        .select('id')
        .eq('chapter_id', matched.id)
        .eq('question_text', q.question_text)
        .maybeSingle();

      if (existing) {
        continue;
      }

      const row = {
        chapter_id: matched.id,
        question_text: q.question_text,
        question_text_hindi: q.question_text,
        options: q.options,
        options_hindi: q.options,
        correct_option_index: q.correct_option_index,
        explanation: q.explanation,
        explanation_hindi: q.explanation,
        difficulty: q.difficulty,
        marks: 1,
        class_level: matched.class_level,
        board: matched.board || 'CBSE',
        language: 'en'
      };

      if (hasTopicCol) {
        row.topic = q.topic;
        row.status = 'approved';
      }

      const { error: insErr } = await supabaseAdmin.from('questions').insert(row);
      if (insErr) {
        console.error(`Failed to insert question "${q.question_text.slice(0, 30)}...":`, insErr.message);
      } else {
        totalInserted++;
      }
    }
  }

  console.log(`Successfully seeded ${totalInserted} curriculum MCQs across Class 10 & 12!`);

  const { count } = await supabaseAdmin.from('questions').select('id', { count: 'exact', head: true });
  console.log(`Total questions in database now: ${count}`);
}

seed()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal seed error:', err);
    process.exit(1);
  });
