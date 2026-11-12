/**
 * Seed Expanded Virtual Labs (P2-9)
 * Adds Chemistry: Acid-Base Titration Lab & Biology: Compound Microscope Lab
 */
const { supabaseAdmin } = require('../../utils/supabaseAdmin');

async function seed() {
  console.log('--- Seeding Expanded Virtual Labs (P2-9) ---');

  // Fetch subjects to match subject_ids
  const { data: subjects } = await supabaseAdmin.from('subjects').select('id, name');
  const chemSubj = subjects?.find(s => s.name.toLowerCase().includes('chem'));
  const bioSubj = subjects?.find(s => s.name.toLowerCase().includes('bio'));

  const labsToInsert = [
    {
      title: 'Acid-Base Titration Lab (HCl vs NaOH)',
      title_hindi: 'अम्ल-क्षार अनुमापन प्रयोगशाला (HCl बनाम NaOH)',
      experiment_type: 'acid_base_titration',
      subject_id: chemSubj ? chemSubj.id : null,
      description: 'Perform an analytical volumetric titration using a burette with standard NaOH to determine the unknown concentration of hydrochloric acid with phenolphthalein indicator.',
      description_hindi: 'फिनॉल्फथलीन सूचक की उपस्थिति में मानक NaOH विलयन द्वारा हाइड्रोक्लोरिक अम्ल की अज्ञात सांद्रता ज्ञात करने के लिए अनुमापन प्रयोग करें।',
      instructions: [
        'Fill the burette with 0.1 M standard Sodium Hydroxide (NaOH) titrant.',
        'Pipette exactly 20.0 mL of unknown HCl into the conical flask and add 2 drops of phenolphthalein indicator.',
        'Turn the stopcock to dispense NaOH dropwise while observing the flask color.',
        'Detect the sharp endpoint when a faint permanent pink color persists for 30 seconds.',
        'Record the titre volume and calculate the molarity using M₁V₁ = M₂V₂.'
      ],
      instructions_hindi: [
        'ब्यूरेट में 0.1 M मानक सोडियम हाइड्रॉक्साइड (NaOH) भरें।',
        'शंक्वाकार फ्लास्क में 20.0 mL अज्ञात HCl लें और 2 बूंद फिनॉल्फथलीन सूचक डालें।',
        'स्टॉपकॉक खोलकर बूंद-बूंद NaOH मिलाएं और फ्लास्क को हिलाते रहें।',
        'अंतिम बिंदु पहचानें जब हल्का गुलाबी रंग 30 सेकंड तक बना रहे।',
        'M₁V₁ = M₂V₂ सूत्र से अज्ञात अम्ल की मोलरता ज्ञात करें।'
      ],
      variables: [
        { name: 'Titrant (Burette)', value: '0.10 M NaOH', unit: 'mol/L' },
        { name: 'Analyte Volume', value: '20.0', unit: 'mL' },
        { name: 'Indicator', value: 'Phenolphthalein (pH 8.2 - 10.0)', unit: '' },
        { name: 'Equivalence Point', value: '~20.0 mL', unit: 'mL' }
      ],
      quiz: [
        {
          _id: 'q_titr_1',
          question: 'What is the color transition of phenolphthalein indicator at the equivalence point of strong acid - strong base titration?',
          questionHindi: 'प्रबल अम्ल - प्रबल क्षार अनुमापन के अंतिम बिंदु पर फिनॉल्फथलीन सूचक का रंग परिवर्तन क्या होता है?',
          options: [
            'Colorless to faint permanent pink',
            'Pink to completely colorless',
            'Yellow to deep red',
            'Blue to green'
          ],
          optionsHindi: [
            'रंगहीन से हल्का स्थायी गुलाबी',
            'गुलाबी से पूर्णतः रंगहीन',
            'पीले से गहरा लाल',
            'नीले से हरा'
          ],
          correctIndex: 0,
          explanation: 'Phenolphthalein is colorless in acidic solutions (pH < 8.2) and turns faint pink at neutral-to-basic transition.'
        },
        {
          _id: 'q_titr_2',
          question: 'If 20.0 mL of unknown HCl is neutralized by exactly 25.0 mL of 0.1 M NaOH, what is the molarity of the HCl?',
          questionHindi: 'यदि 20.0 mL अज्ञात HCl को उदासीन करने में 0.1 M NaOH का 25.0 mL खर्च होता है, तो HCl की मोलरता क्या है?',
          options: ['0.08 M', '0.125 M', '0.20 M', '0.25 M'],
          optionsHindi: ['0.08 M', '0.125 M', '0.20 M', '0.25 M'],
          correctIndex: 1,
          explanation: 'M₁V₁ = M₂V₂ ⇒ M(HCl) = (0.1 M × 25.0 mL) / 20.0 mL = 2.5 / 20 = 0.125 M.'
        },
        {
          _id: 'q_titr_3',
          question: 'Why should air bubbles in the burette nozzle be removed prior to starting the titration?',
          questionHindi: 'अनुमापन शुरू करने से पहले ब्यूरेट की नोजल से हवा के बुलबुले निकालना क्यों आवश्यक है?',
          options: [
            'To prevent inaccurate volume readings in the titre value',
            'To avoid neutralization of the glass',
            'To increase the pH of the acid',
            'To speed up the flow rate'
          ],
          optionsHindi: [
            'ब्यूरेट के पाठ्यांक में त्रुटि से बचने के लिए',
            'कांच के उदासीनीकरण को रोकने के लिए',
            'अम्ल का pH बढ़ाने के लिए',
            'प्रवाह दर तेज करने के लिए'
          ],
          correctIndex: 0,
          explanation: 'An air bubble occupies volume without containing liquid, leading to overestimation of the consumed titrant volume.'
        }
      ]
    },
    {
      title: 'Compound Microscope Lab (Cell Biology)',
      title_hindi: 'संयुक्त सूक्ष्मदर्शी प्रयोगशाला (कोशिका विज्ञान)',
      experiment_type: 'compound_microscope',
      subject_id: bioSubj ? bioSubj.id : null,
      description: 'Explore biological specimen slides under a compound optical microscope with switchable objective lenses (10x, 40x, 100x), aperture diaphragm, and fine focus adjustment.',
      description_hindi: 'विभिन्न आवर्धन लेंसों (10x, 40x, 100x) और सूक्ष्म फोकस नियंत्रण के साथ प्याज की झिल्ली, गाल की उपकला कोशिकाओं और अमीबा का सूक्ष्मदर्शीय अध्ययन करें।',
      instructions: [
        'Select a biological specimen slide: Onion Peel Cells, Human Cheek Epithelial Cells, or Amoeba.',
        'Switch objective lens magnification: 10x (Scanner), 40x (High Dry), or 100x (Oil Immersion).',
        'Turn the Coarse Focus knob to bring specimen into approximate view.',
        'Use the Fine Focus knob to resolve crisp cellular structures (cell walls, nuclei, cytoplasm).',
        'Inspect labelled organelle callouts and complete the microscopic observation quiz.'
      ],
      instructions_hindi: [
        'एक स्लाइड चुनें: प्याज की झिल्ली की कोशिकाएं, मानव गाल की कोशिकाएं, या अमीबा।',
        'आवर्धन लेंस बदलें: 10x, 40x, या 100x।',
        'मोटे फोकस (Coarse Focus) नॉब से स्लाइड को दृश्य क्षेत्र में लाएं।',
        'सूक्ष्म फोकस (Fine Focus) नॉब से कोशिकांगों को स्पष्ट रूप से देखें।',
        'अंगकों के विवरण पढ़ें और प्रेक्षण क्विज हल करें।'
      ],
      variables: [
        { name: 'Eyepiece Magnification', value: '10x', unit: '' },
        { name: 'Objective Lenses', value: '10x, 40x, 100x', unit: '' },
        { name: 'Total Magnification', value: '100x - 1000x', unit: '' },
        { name: 'Illumination', value: 'Substage Iris Diaphragm', unit: '' }
      ],
      quiz: [
        {
          _id: 'q_micr_1',
          question: 'If the eyepiece lens has 10x magnification and the objective lens is set to 40x, what is the total magnification?',
          questionHindi: 'यदि नेत्रिका (Eyepiece) का आवर्धन 10x है और अभिदृश्यक (Objective) 40x पर है, तो कुल आवर्धन क्या होगा?',
          options: ['50x', '400x', '4000x', '40x'],
          optionsHindi: ['50x', '400x', '4000x', '40x'],
          correctIndex: 1,
          explanation: 'Total Magnification = Eyepiece Magnification × Objective Magnification = 10 × 40 = 400x.'
        },
        {
          _id: 'q_micr_2',
          question: 'Which distinctive cellular structure is clearly visible in Onion Peel cells under high power that is completely absent in Human Cheek cells?',
          questionHindi: 'प्याज की झिल्ली की कोशिकाओं में कौन सी संरचना स्पष्ट दिखाई देती है जो मानव गाल की कोशिकाओं में अनुपस्थित होती है?',
          options: ['Cell Wall', 'Nucleus', 'Cytoplasm', 'Cell Membrane'],
          optionsHindi: ['कोशिका भित्ति (Cell Wall)', 'केंद्रक', 'कोशिका द्रव्य', 'कोशिका झिल्ली'],
          correctIndex: 0,
          explanation: 'Plant cells have a rigid cellulose cell wall outside the plasma membrane; animal cheek cells have only a plasma membrane.'
        },
        {
          _id: 'q_micr_3',
          question: 'Why is Methylene Blue stain commonly applied when preparing human cheek cell temporary mounts?',
          questionHindi: 'मानव गाल की कोशिकाओं की स्लाइड बनाते समय मेथिलीन ब्लू अभिरंजक क्यों डाला जाता है?',
          options: [
            'To selectively stain nuclei deep blue and provide high contrast against transparent cytoplasm',
            'To keep the cells alive and motile',
            'To dissolve the outer cell boundary',
            'To disinfect the slide'
          ],
          optionsHindi: [
            'केंद्रक को गहरा नीला रंग देकर स्पष्ट दृश्यता प्रदान करने के लिए',
            'कोशिकाओं को जीवित रखने के लिए',
            'झिल्ली को घोलने के लिए',
            'स्लाइड को जीवाणुरहित करने के लिए'
          ],
          correctIndex: 0,
          explanation: 'Methylene blue is a basic cationic dye that binds strongly to acidic DNA/RNA in nuclei, rendering them distinct under optical illumination.'
        }
      ]
    }
  ];

  for (const lab of labsToInsert) {
    const { data: existing } = await supabaseAdmin
      .from('labs')
      .select('id')
      .eq('experiment_type', lab.experiment_type)
      .maybeSingle();

    if (existing) {
      console.log(`Lab "${lab.title}" already exists. Updating.`);
      await supabaseAdmin.from('labs').update(lab).eq('id', existing.id);
    } else {
      const { error } = await supabaseAdmin.from('labs').insert(lab);
      if (error) {
        console.error(`Error inserting "${lab.title}":`, error.message);
      } else {
        console.log(`✔ Inserted lab: "${lab.title}"`);
      }
    }
  }

  const { count } = await supabaseAdmin.from('labs').select('id', { count: 'exact', head: true });
  console.log(`Total virtual labs in database now: ${count}`);
}

seed()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal lab seed error:', err);
    process.exit(1);
  });

