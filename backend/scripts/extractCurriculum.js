const fs = require('fs');
const path = require('path');

const diagramsLines = fs.readFileSync(path.join(__dirname, '../utils/seedDiagrams.js'), 'utf8').split('\n');
const diagramsDataStr = diagramsLines.slice(11, 199).join('\n');

const labsLines = fs.readFileSync(path.join(__dirname, '../utils/seedLabs.js'), 'utf8').split('\n');
const labDataStr = labsLines.slice(8, 127).join('\n');

const seedLines = fs.readFileSync(path.join(__dirname, '../utils/seedData.js'), 'utf8').split('\n');
const curriculumDataStr = seedLines.slice(34, 785).join('\n');

const targetPath = path.join(__dirname, '../data/seedCurriculum.js');
const targetContent = `/**
 * Pure STEM Curriculum Master Dataset for Supabase Migration
 * Contains 4 Subjects, 4 Chapters, 16 Lessons, 41+ MCQs, 3 SVG Diagrams, 1 Virtual Lab.
 * Zero dependency on Mongoose.
 */

${diagramsDataStr}

${labDataStr}

${curriculumDataStr}

module.exports = {
  diagramsData,
  labData,
  curriculumData
};
`;

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(targetPath, targetContent, 'utf8');
console.log('Successfully generated:', targetPath);
