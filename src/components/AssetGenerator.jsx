import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import QRCode from 'qrcode';
import * as simpleIcons from 'simple-icons';
import { renderPFP, renderIDCard, preloadAssets } from '../utils/canvasRenderer';

const TITLES = [
  'SUSEGAD SHIPPER', 'TERMINAL WARLORD', 'COCONUT COMPILER', 'MIDNIGHT MERGER',
  'BUG SLAYER OF BAGA', 'TIDE TABLE ARCHITECT', 'THE PROMPT ALCHEMIST', 'SHIP CAPTAIN',
  '10X ENGINEER', 'PORT-CITY PROGRAMMER', 'THE CODE ALCHEMIST', 'SUNRISE SHIPPER',
];

// Build the searchable icon index once. Each entry = { title, slug, hex, path }.
const ALL_ICONS = Object.values(simpleIcons).filter((i) => i && i.path && i.title);

const SOCIALS = {
  instagram: (h) => `https://instagram.com/${h}`,
  x: (h) => `https://x.com/${h}`,
  github: (h) => `https://github.com/${h}`,
  linkedin: (h) => `https://linkedin.com/in/${h}`,
};

function Slider({ label, value, min, max, step, unit, onChange }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--yellow)' }}>
          {Math.round(value * 100) / 100}{unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))} />
    </div>
  );
}

const stepLabel = { fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--yellow)', textTransform: 'uppercase', marginBottom: 12 };

export default function AssetGenerator() {
  const [imageEl, setImageEl] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [name, setName] = useState('');
  const [format, setFormat] = useState('pfp');
  const [role, setRole] = useState('');
  const [builderTitle, setBuilderTitle] = useState(TITLES[0]);

  // stack icons + social QR
  const [stack, setStack] = useState([]);      // array of icon objects
  const [stackQ, setStackQ] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [handle, setHandle] = useState('');
  const [qrImage, setQrImage] = useState(null);
  const [builderNo] = useState(() => String(Math.floor(Math.random() * 900) + 100));

  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [assetsOk, setAssetsOk] = useState(false);

  const canvasRef = useRef(null);
  const fileRef = useRef(null);

  const rollTitle = () => setBuilderTitle(TITLES[Math.floor(Math.random() * TITLES.length)]);

  // preload plate/fonts once
  useEffect(() => { preloadAssets().then(() => setAssetsOk(true)); }, []);

  // stack search results
  const results = useMemo(() => {
    const q = stackQ.trim().toLowerCase();
    if (!q) return [];
    return ALL_ICONS
      .filter((i) => i.title.toLowerCase().includes(q) || (i.slug || '').includes(q))
      .slice(0, 8);
  }, [stackQ]);

  const addIcon = (icon) => {
    if (stack.find((s) => s.slug === icon.slug)) return;
    setStack((s) => [...s, icon].slice(-4));   // max 4, keep newest
    setStackQ('');
  };
  const removeIcon = (slug) => setStack((s) => s.filter((i) => i.slug !== slug));

  // regenerate the QR whenever the social handle/platform changes
  useEffect(() => {
    const h = handle.trim().replace(/^@/, '');
    if (!h) { setQrImage(null); return; }
    const url = SOCIALS[platform](h);
    QRCode.toDataURL(url, {
      margin: 0, width: 400, errorCorrectionLevel: 'M',
      color: { dark: '#FFD500', light: '#0C4A2D' },   // yellow on card-panel green
    }).then((dataUrl) => {
      const img = new Image();
      img.onload = () => setQrImage(img);
      img.src = dataUrl;
    }).catch(() => setQrImage(null));
  }, [handle, platform]);

  // re-render on any change
  const render = useCallback(() => {
    if (!canvasRef.current) return;
    if (format === 'pfp') {
      renderPFP(canvasRef.current, { imageElement: imageEl, zoom, panX, panY, name });
    } else {
      renderIDCard(canvasRef.current, {
        imageElement: imageEl, zoom, panX, panY,
        name, role, builderTitle, stack, qrImage, handle: handle.trim().replace(/^@/, ''), builderNo,
      });
    }
  }, [imageEl, zoom, panX, panY, name, format, role, builderTitle, stack, qrImage, handle, builderNo, assetsOk]);

  useEffect(() => { render(); }, [render]);

  const loadImage = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => { setImageEl(img); setZoom(1); setPanX(0); setPanY(0); };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const download = () => {
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = `HHGoa2026-FrameInGoa${name ? '-' + name.replace(/\s+/g, '_') : ''}.png`;
    a.href = url; a.click();
  };

  const copyImage = async () => {
    canvasRef.current.toBlob(async blob => {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true); setTimeout(() => setCopied(false), 2500);
      } catch { download(); }
    });
  };

  const shareX = () => {
    const text = `Just generated my official Hacker House Goa 2026 Builder ID! 🏖⚡\n\nIndia's biggest 4-day build-station — Oct 28-31, Goa.\n\nGenerate yours 👇`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=FrameInGoa,HHGoa2026&url=${encodeURIComponent('https://hhgoa.com')}`, '_blank');
    setShared(true); setTimeout(() => setShared(false), 3000);
  };

  return (
    <section id="generator" style={{ padding: '80px 0', background: 'var(--green-dark)' }}>
      <div className="container">

        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="section-label">⚡ Shortlisting Task #1</div>
          <h2 className="section-title" style={{ marginBottom: 12 }}>
            Hacker House Goa<br />
            <span style={{ color: 'var(--yellow)', fontStyle: 'italic' }}>Frame &amp; Builder ID Generator</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'rgba(255,255,255,0.4)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Upload your photo · add your details · download &amp; share with <span style={{ color: 'var(--yellow)' }}>#FrameInGoa</span>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 380px) 1fr', gap: 32, alignItems: 'start' }}>

          {/* ── LEFT: Controls ───────────────────────────────────────── */}
          <div>

            {/* Format Toggle */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
              {['pfp', 'idcard'].map((f) => (
                <button key={f} onClick={() => setFormat(f)}
                  style={{
                    flex: 1, padding: '12px',
                    background: format === f ? 'var(--yellow)' : 'transparent',
                    color: format === f ? '#000' : 'rgba(255,255,255,0.6)',
                    border: `2px solid ${format === f ? 'var(--yellow)' : 'rgba(255,255,255,0.2)'}`,
                    fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 11, cursor: 'pointer', textTransform: 'uppercase',
                  }}>
                  {f === 'pfp' ? 'PFP Frame' : 'Builder ID Card'}
                </button>
              ))}
            </div>

            {/* 1. Upload */}
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={stepLabel}>1. Upload Photo</div>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); loadImage(e.dataTransfer.files[0]); }}
                style={{
                  border: `2px dashed ${dragging ? 'var(--yellow)' : 'rgba(255,255,255,0.18)'}`,
                  padding: '28px 16px', textAlign: 'center', cursor: 'pointer',
                  background: dragging ? 'rgba(254,225,1,0.04)' : 'rgba(0,0,0,0.15)', transition: 'all 0.15s',
                }}>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => loadImage(e.target.files?.[0])} />
                <div style={{ fontSize: 26, marginBottom: 6 }}>📸</div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: imageEl ? 'var(--yellow)' : 'rgba(255,255,255,0.45)', fontWeight: imageEl ? 700 : 400 }}>
                  {imageEl ? '✓ Photo loaded — click to change' : 'Click or drag & drop your photo'}
                </p>
              </div>
            </div>

            {/* 2. Adjust */}
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ ...stepLabel, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>2. Adjust Photo</span>
                <button onClick={() => { setZoom(1); setPanX(0); setPanY(0); }}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', fontSize: 10, cursor: 'pointer', letterSpacing: '0.08em' }}>
                  RESET ↺
                </button>
              </div>
              <Slider label="Zoom" value={zoom} min={0.5} max={3} step={0.05} unit="×" onChange={setZoom} />
              <Slider label="Move Left / Right" value={panX} min={-350} max={350} step={5} unit="px" onChange={setPanX} />
              <Slider label="Move Up / Down" value={panY} min={-350} max={350} step={5} unit="px" onChange={setPanY} />
            </div>

            {/* 3. Name */}
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={stepLabel}>
                3. Your Name {format === 'pfp' && <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.3)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>}
              </div>
              <input type="text" value={name} maxLength={22} onChange={e => setName(e.target.value)}
                placeholder="e.g. Prayasu" style={{ width: '100%' }} />
              {format === 'pfp' && (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 8, lineHeight: 1.5 }}>
                  Appears in small text at the bottom-left of your frame.
                </p>
              )}
            </div>

            {/* ID-card-only fields */}
            {format === 'idcard' && (
              <>
                {/* 4. Role */}
                <div className="card" style={{ marginBottom: 12 }}>
                  <div style={stepLabel}>4. Role</div>
                  <input type="text" value={role} maxLength={22} onChange={e => setRole(e.target.value)}
                    placeholder="e.g. Frontend Developer" style={{ width: '100%' }} />
                </div>

                {/* 5. Stack (logo search) */}
                <div className="card" style={{ marginBottom: 12 }}>
                  <div style={stepLabel}>5. Stack <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.3)', textTransform: 'none', letterSpacing: 0 }}>(up to 4)</span></div>
                  <input type="text" value={stackQ} onChange={e => setStackQ(e.target.value)}
                    placeholder="Search a tech… react, python, aws" style={{ width: '100%' }} />

                  {results.length > 0 && (
                    <div style={{ marginTop: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.25)', maxHeight: 220, overflowY: 'auto' }}>
                      {results.map((ic) => (
                        <div key={ic.slug} onClick={() => addIcon(ic)}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <svg viewBox="0 0 24 24" width="18" height="18" fill={`#${ic.hex}`}><path d={ic.path} /></svg>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{ic.title}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {stack.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                      {stack.map((ic) => (
                        <div key={ic.slug}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'var(--green-deep, #0C4A2D)', borderRadius: 8 }}>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill={`#${ic.hex}`}><path d={ic.path} /></svg>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>{ic.title}</span>
                          <span onClick={() => removeIcon(ic.slug)} style={{ cursor: 'pointer', color: 'var(--pink)', fontWeight: 700, marginLeft: 2 }}>×</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 6. Social → QR */}
                <div className="card" style={{ marginBottom: 12 }}>
                  <div style={stepLabel}>6. Social <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.3)', textTransform: 'none', letterSpacing: 0 }}>(becomes a scannable QR)</span></div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <select value={platform} onChange={e => setPlatform(e.target.value)}
                      style={{ flex: '0 0 120px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '10px' }}>
                      <option value="instagram">Instagram</option>
                      <option value="x">X</option>
                      <option value="github">GitHub</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                    <input type="text" value={handle} onChange={e => setHandle(e.target.value)}
                      placeholder="@yourhandle" style={{ flex: 1 }} />
                  </div>
                </div>

                {/* 7. Builder Title */}
                <div className="card" style={{ marginBottom: 20 }}>
                  <div style={stepLabel}>7. Builder Title</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ flex: 1, padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--pink)' }}>
                      ✦ {builderTitle} ✦
                    </div>
                    <button onClick={rollTitle} style={{ padding: '0 16px', background: 'var(--pink)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12 }}>
                      RE-ROLL 🎲
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* ── RIGHT: Canvas + actions ───────────────────────────────── */}
          <div style={{ position: 'sticky', top: 80, maxWidth: 420, justifySelf: 'center', width: '100%' }}>
            <div style={{ background: '#000', border: '3px solid var(--yellow)', boxShadow: '6px 6px 0 #000', padding: 10, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--yellow)', display: 'inline-block' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>LIVE PREVIEW</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>
                  {format === 'pfp' ? '1080 × 1080' : '1080 × 1800'}
                </span>
              </div>
              {/* ID card is 3:5 → paddingBottom 166.667%. PFP stays square. */}
              <div style={{ width: '100%', paddingBottom: format === 'pfp' ? '100%' : '166.667%', position: 'relative', background: '#063A1A', transition: 'padding 0.3s' }}>
                <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
              </div>
            </div>

            <button onClick={download}
              style={{ width: '100%', padding: '16px 24px', background: 'var(--yellow)', color: '#000', border: '3px solid #000', fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '5px 5px 0 #000', transition: 'all 0.12s', marginBottom: 10 }}
              onMouseEnter={e => { e.target.style.transform = 'translate(-2px,-2px)'; e.target.style.boxShadow = '7px 7px 0 #000'; }}
              onMouseLeave={e => { e.target.style.transform = ''; e.target.style.boxShadow = '5px 5px 0 #000'; }}>
              ↓  Download PNG
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <button onClick={shareX} style={{ padding: '13px 14px', background: shared ? '#00cc5a' : 'transparent', border: `2px solid ${shared ? '#00cc5a' : 'rgba(255,45,120,0.6)'}`, color: shared ? '#000' : 'var(--pink)', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.04em' }}>
                {shared ? '✓ Opened!' : '𝕏 Share #FrameInGoa'}
              </button>
              <button onClick={copyImage} style={{ padding: '13px 14px', background: copied ? '#00cc5a' : 'transparent', border: `2px solid ${copied ? '#00cc5a' : 'rgba(255,255,255,0.18)'}`, color: copied ? '#000' : 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.04em' }}>
                {copied ? '✓ Copied!' : '⎘ Copy Image'}
              </button>
            </div>

            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.25)', textAlign: 'center', letterSpacing: '0.06em' }}>
              ✦ Post on X with <strong style={{ color: 'var(--yellow)' }}>#FrameInGoa</strong> to appear on the HH Goa Celeb Radar
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          #generator > .container > div:last-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}