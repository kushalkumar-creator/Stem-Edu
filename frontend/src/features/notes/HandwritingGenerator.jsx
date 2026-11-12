import React, { useState, useEffect, useRef } from 'react';
import {
  PenTool,
  Download,
  FileText,
  Upload,
  Camera,
  RotateCcw,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const FONTS = [
  { id: 'Caveat', name: 'Caveat (Casual Cursive)' },
  { id: 'Patrick Hand', name: 'Patrick Hand (Neat School Print)' },
  { id: 'Homemade Apple', name: 'Homemade Apple (Classic Script)' },
  { id: 'Kalam', name: 'Kalam (Devanagari / Indian Handwriting)' },
  { id: 'Indie Flower', name: 'Indie Flower (Artistic Handwriting)' }
];

const PAPER_STYLES = [
  { id: 'ruled', name: 'Ruled Notebook (Blue Lines + Red Margin)' },
  { id: 'plain', name: 'Plain Clean White' },
  { id: 'graph', name: 'Graph / Coordinate Grid Paper' },
  { id: 'parchment', name: 'Vintage Legal Pad (Yellow)' }
];

const INK_COLORS = [
  { id: '#1e3a8a', name: 'Classic Blue Gel', preview: '#1e3a8a' },
  { id: '#0f172a', name: 'Ballpoint Black', preview: '#0f172a' },
  { id: '#991b1b', name: 'Red Correction Ink', preview: '#991b1b' },
  { id: '#475569', name: 'Pencil Grey', preview: '#475569' }
];

export default function HandwritingGenerator({ initialText = '', initialTitle = '', onSaveNote }) {
  const { user } = useAuth();

  const [text, setText] = useState(
    initialText ||
      `# Ohm's Law and Resistance Notes\n\nAccording to Ohm's Law, the electric current (I) flowing through a metallic conductor is directly proportional to the potential difference (V) applied across its terminals, provided temperature and other physical conditions remain constant.\n\nMathematical Expression:\nV = I * R\n\nWhere:\n- V = Potential difference (measured in Volts, V)\n- I = Electric current (measured in Amperes, A)\n- R = Resistance of the conductor (measured in Ohms, Ω)\n\nFactors affecting resistance:\n1. Length of the conductor (R ∝ L)\n2. Area of cross-section (R ∝ 1/A)\n3. Nature of the material (Resistivity, ρ)\n4. Temperature (Resistance increases with temperature in metals)`
  );
  const [title, setTitle] = useState(initialTitle || "Ohm's Law Handwritten Notes");
  const [subject, setSubject] = useState('Physics');

  // Controls
  const [font, setFont] = useState('Caveat');
  const [fontSize, setFontSize] = useState(24);
  const [lineSpacing, setLineSpacing] = useState(32);
  const [paperStyle, setPaperStyle] = useState('ruled');
  const [inkColor, setInkColor] = useState('#1e3a8a');
  const [humanJitter, setHumanJitter] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // OCR state
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrMessage, setOcrMessage] = useState(null);
  const [savingNote, setSavingNote] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Render text to canvas with page breaks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const PAGE_WIDTH = 800;
    const PAGE_HEIGHT = 1130;
    canvas.width = PAGE_WIDTH;
    canvas.height = PAGE_HEIGHT;

    // Background paper styling
    if (paperStyle === 'parchment') {
      ctx.fillStyle = '#FEF9C3';
    } else {
      ctx.fillStyle = '#FFFFFF';
    }
    ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);

    // Grid paper pattern
    if (paperStyle === 'graph') {
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < PAGE_WIDTH; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, PAGE_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < PAGE_HEIGHT; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(PAGE_WIDTH, y);
        ctx.stroke();
      }
    }

    // Ruled lines pattern
    const marginLeft = 80;
    const marginTop = 90;
    const marginBottom = 60;
    const marginRight = 50;

    if (paperStyle === 'ruled') {
      // Horizontal blue notebook lines
      ctx.strokeStyle = '#BFDBFE';
      ctx.lineWidth = 1;
      for (let y = marginTop; y < PAGE_HEIGHT - marginBottom; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(PAGE_WIDTH, y);
        ctx.stroke();
      }

      // Vertical red margin line
      ctx.strokeStyle = '#FCA5A5';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(marginLeft - 15, 0);
      ctx.lineTo(marginLeft - 15, PAGE_HEIGHT);
      ctx.stroke();
    }

    // Text rendering setup
    ctx.font = `${fontSize}px "${font}", cursive, sans-serif`;
    ctx.fillStyle = inkColor;
    ctx.textBaseline = 'alphabetic';

    const maxLineWidth = PAGE_WIDTH - marginLeft - marginRight;
    const lines = [];

    // Parse paragraphs and wrap words
    const rawParagraphs = text.split('\n');
    for (const p of rawParagraphs) {
      if (p.trim() === '') {
        lines.push('');
        continue;
      }
      const words = p.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxLineWidth) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
    }

    // Pagination calculation
    const linesPerPage = Math.floor((PAGE_HEIGHT - marginTop - marginBottom) / lineSpacing);
    const calculatedPages = Math.max(1, Math.ceil(lines.length / linesPerPage));
    setTotalPages(calculatedPages);

    const safeCurrentPage = Math.min(currentPage, calculatedPages);
    const startIndex = (safeCurrentPage - 1) * linesPerPage;
    const pageLines = lines.slice(startIndex, startIndex + linesPerPage);

    // Draw lines with natural human jitter
    let y = marginTop;
    pageLines.forEach((line, lineIndex) => {
      if (line) {
        ctx.save();

        let x = marginLeft;
        const words = line.split(' ');

        words.forEach((word, wordIndex) => {
          // Slight micro-jitter in baseline and rotation
          const baselineOffset = humanJitter ? (Math.sin((lineIndex * 7 + wordIndex) * 1.5) * 1.4) : 0;
          const rotationAngle = humanJitter ? (Math.cos((lineIndex * 5 + wordIndex) * 2) * 0.008) : 0;

          ctx.save();
          ctx.translate(x, y + baselineOffset);
          if (rotationAngle !== 0) {
            ctx.rotate(rotationAngle);
          }

          ctx.fillText(word, 0, 0);
          ctx.restore();

          const wordWidth = ctx.measureText(word + ' ').width;
          x += wordWidth;
        });

        ctx.restore();
      }
      y += lineSpacing;
    });

    // Page number in header/footer
    ctx.font = `14px "${font}", cursive, sans-serif`;
    ctx.fillStyle = '#94A3B8';
    ctx.fillText(`Page ${safeCurrentPage} of ${calculatedPages}`, PAGE_WIDTH - 120, PAGE_HEIGHT - 30);
  }, [text, font, fontSize, lineSpacing, paperStyle, inkColor, humanJitter, currentPage]);

  // Export current page as PNG
  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = image;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_page_${currentPage}.png`;
    a.click();
  };

  // Export as printable view / PDF
  const handleDownloadPDF = () => {
    window.print();
  };

  // OCR upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setOcrLoading(true);
      setOcrMessage(null);

      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result;
        try {
          const res = await fetch('/api/notes/ocr', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(localStorage.getItem('token') && { Authorization: `Bearer ${localStorage.getItem('token')}` })
            },
            body: JSON.stringify({
              imageBase64: base64Data,
              mimeType: file.type || 'image/jpeg'
            })
          });

          const data = await res.json();
          if (data.success && data.text) {
            setText(data.text);
            setOcrMessage({ type: 'success', text: 'Handwritten notes transcribed accurately! Review and edit below.' });
          } else {
            setOcrMessage({ type: 'error', text: data.message || 'Failed to transcribe image.' });
          }
        } catch (netErr) {
          setOcrMessage({ type: 'error', text: 'Network error performing OCR.' });
        } finally {
          setOcrLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File read error:', err);
      setOcrLoading(false);
    }
  };

  // Save to student notes & RAG
  const handleSaveToNotes = async () => {
    try {
      setSavingNote(true);
      setSaveStatus(null);

      const canvas = canvasRef.current;
      const imageUrl = canvas ? canvas.toDataURL('image/png') : null;

      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') && { Authorization: `Bearer ${localStorage.getItem('token')}` })
        },
        body: JSON.stringify({
          title: title || 'Handwritten Notes',
          content: text,
          subject,
          handwritingConfig: { font, fontSize, lineSpacing, paperStyle, inkColor },
          handwritingImageUrl: imageUrl
        })
      });

      const data = await res.json();
      if (data.success) {
        setSaveStatus({ type: 'success', text: 'Saved to your personal notes and embedded into Saarthi knowledge base!' });
        if (onSaveNote) onSaveNote(data.note);
      } else {
        setSaveStatus({ type: 'error', text: data.message || 'Failed to save note' });
      }
    } catch (err) {
      setSaveStatus({ type: 'error', text: 'Error saving note to database' });
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1fr) minmax(360px, 1.2fr)', gap: '20px', alignItems: 'start' }}>
      {/* Left Column: Editor & Controls */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PenTool size={20} color="var(--color-primary)" />
            Text-to-Handwriting Studio
          </h2>

          {/* OCR Trigger button (P2-6.6) */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={ocrLoading}
              className="btn btn-secondary"
              style={{
                width: 'auto',
                padding: '6px 12px',
                fontSize: '0.82rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--color-primary)',
                border: '1px solid var(--color-primary)'
              }}
            >
              {ocrLoading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
              <span>📸 OCR Photo Notes</span>
            </button>
          </div>
        </div>

        {ocrMessage && (
          <div className={`alert ${ocrMessage.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ fontSize: '0.85rem', padding: '8px 12px' }}>
            {ocrMessage.text}
          </div>
        )}

        {/* Note Metadata */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-muted)' }}>Note Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Newton's Second Law Notes"
              className="input"
              style={{ padding: '8px 10px', fontSize: '0.9rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-muted)' }}>Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input"
              style={{ padding: '8px 10px', fontSize: '0.9rem' }}
            >
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Mathematics">Mathematics</option>
            </select>
          </div>
        </div>

        {/* Text Input Editor */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Type or Paste Note Content</span>
            <span>{text.length} characters</span>
          </label>
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input"
            style={{
              fontFamily: 'monospace',
              fontSize: '0.88rem',
              lineHeight: '1.4',
              resize: 'vertical',
              padding: '10px'
            }}
            placeholder="Type your notes here or use OCR to scan handwritten notebooks..."
          />
        </div>

        {/* Style Controls (P2-6.3) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--color-background)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-muted)' }}>Handwriting Font</label>
            <select value={font} onChange={(e) => setFont(e.target.value)} className="input" style={{ padding: '6px 8px', fontSize: '0.85rem' }}>
              {FONTS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-muted)' }}>Paper Background</label>
            <select value={paperStyle} onChange={(e) => setPaperStyle(e.target.value)} className="input" style={{ padding: '6px 8px', fontSize: '0.85rem' }}>
              {PAPER_STYLES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-muted)' }}>Ink Colour</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              {INK_COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setInkColor(c.id)}
                  title={c.name}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: c.preview,
                    border: inkColor === c.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                    cursor: 'pointer',
                    boxShadow: inkColor === c.id ? '0 0 0 2px white' : 'none'
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-muted)' }}>
              Natural Jitter: {humanJitter ? 'Organic' : 'Uniform'}
            </label>
            <button
              onClick={() => setHumanJitter(!humanJitter)}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '6px 10px', fontSize: '0.8rem', marginTop: '4px' }}
            >
              {humanJitter ? '✓ Human Jitter ON' : 'Uniform Slant ON'}
            </button>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-muted)' }}>Font Size ({fontSize}px)</label>
            <input
              type="range"
              min="18"
              max="32"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-muted)' }}>Line Spacing ({lineSpacing}px)</label>
            <input
              type="range"
              min="26"
              max="44"
              value={lineSpacing}
              onChange={(e) => setLineSpacing(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Actions & Export (P2-6.4) */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleDownloadPNG}
            className="btn btn-secondary"
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <Download size={15} /> Export PNG
          </button>
          <button
            onClick={handleDownloadPDF}
            className="btn btn-secondary"
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <FileText size={15} /> Print / PDF
          </button>
          <button
            onClick={handleSaveToNotes}
            disabled={savingNote}
            className="btn btn-primary"
            style={{ flex: 1.5, padding: '8px 14px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            {savingNote ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
            <span>Save to My Notes</span>
          </button>
        </div>

        {saveStatus && (
          <div className={`alert ${saveStatus.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ fontSize: '0.85rem', padding: '8px 12px' }}>
            {saveStatus.text}
          </div>
        )}
      </div>

      {/* Right Column: Live Handwritten Notebook Page Preview */}
      <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-muted)' }}>
            Handwritten Notebook Preview
          </span>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn btn-secondary"
                style={{ width: '28px', height: '28px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-secondary"
                style={{ width: '28px', height: '28px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* The HTML5 Canvas Canvas Area */}
        <div
          style={{
            width: '100%',
            maxWidth: '460px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
            overflow: 'hidden',
            border: '1px solid #E2E8F0',
            backgroundColor: 'white'
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>
      </div>
    </div>
  );
}
