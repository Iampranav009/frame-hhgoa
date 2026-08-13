import React, { useState, useRef, useEffect, useCallback } from 'react';
import { renderPFP } from '../utils/canvasRenderer';

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

export default function AssetGenerator() {
  const [imageEl, setImageEl] = useState(null);
  const [zoom,    setZoom]    = useState(1);
  const [panX,    setPanX]    = useState(0);
  const [panY,    setPanY]    = useState(0);
  const [name,    setName]    = useState('');
  const [dragging, setDragging] = useState(false);
  const [copied,   setCopied]   = useState(false);
  const [shared,   setShared]   = useState(false);

  const canvasRef  = useRef(null);
  const fileRef    = useRef(null);

  // Re-render whenever inputs change
  const render = useCallback(() => {
    if (!canvasRef.current) return;
    renderPFP(canvasRef.current, { imageElement: imageEl, zoom, panX, panY, name });
  }, [imageEl, zoom, panX, panY, name]);

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
    a.href = url;
    a.click();
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
    const text = `Just generated my official Hacker House Goa 2026 PFP! 🏖⚡\n\nIndia's biggest 4-day build-station — Oct 28-31, Goa.\n\nGenerate yours 👇`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=FrameInGoa,HHGoa2026&url=${encodeURIComponent('https://hhgoa.com')}`, '_blank');
    setShared(true); setTimeout(() => setShared(false), 3000);
  };

  return (
    <section id="generator" style={{ padding: '80px 0', background: 'var(--green-dark)' }}>
      <div className="container">

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="section-label">⚡ Shortlisting Task #1</div>
          <h2 className="section-title" style={{ marginBottom: 12 }}>
            Hacker House Goa<br />
            <span style={{ color: 'var(--yellow)', fontStyle: 'italic' }}>PFP Frame Generator</span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'rgba(255,255,255,0.4)',
            maxWidth: 480,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Upload your photo · adjust position · add your name · download &amp; share with <span style={{ color: 'var(--yellow)' }}>#FrameInGoa</span>
          </p>
        </div>

        {/* Two-col grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 380px) 1fr',
          gap: 32,
          alignItems: 'start',
        }}>

          {/* ── LEFT: Controls ───────────────────────────────────────── */}
          <div>

            {/* 1. Upload */}
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--yellow)', textTransform: 'uppercase', marginBottom: 12 }}>
                1. Upload Photo
              </div>

              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); loadImage(e.dataTransfer.files[0]); }}
                style={{
                  border: `2px dashed ${dragging ? 'var(--yellow)' : 'rgba(255,255,255,0.18)'}`,
                  padding: '28px 16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: dragging ? 'rgba(254,225,1,0.04)' : 'rgba(0,0,0,0.15)',
                  transition: 'all 0.15s',
                }}
              >
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => loadImage(e.target.files?.[0])} />
                <div style={{ fontSize: 26, marginBottom: 6 }}>📸</div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: imageEl ? 'var(--yellow)' : 'rgba(255,255,255,0.45)',
                  fontWeight: imageEl ? 700 : 400,
                }}>
                  {imageEl ? '✓ Photo loaded — click to change' : 'Click or drag & drop your photo'}
                </p>
              </div>
            </div>

            {/* 2. Adjust */}
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',
                color: 'var(--yellow)', textTransform: 'uppercase', marginBottom: 16,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
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
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--yellow)', textTransform: 'uppercase', marginBottom: 12 }}>
                3. Your Name <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.3)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
              </div>
              <input
                type="text"
                value={name}
                maxLength={22}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Prayasu"
                style={{ width: '100%' }}
              />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 8, lineHeight: 1.5 }}>
                Appears in small text at the bottom-left of your frame.
              </p>
            </div>

          </div>

          {/* ── RIGHT: Canvas + actions ───────────────────────────────── */}
          <div style={{ position: 'sticky', top: 80 }}>

            {/* Canvas preview */}
            <div style={{
              background: '#000',
              border: '3px solid var(--yellow)',
              boxShadow: '6px 6px 0 #000',
              padding: 10,
              marginBottom: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--yellow)', display: 'inline-block' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>LIVE PREVIEW</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>1080 × 1080</span>
              </div>

              {/* Square aspect-ratio container */}
              <div style={{ width: '100%', paddingBottom: '100%', position: 'relative', background: '#063A1A' }}>
                <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
              </div>
            </div>

            {/* Download */}
            <button
              onClick={download}
              style={{
                width: '100%',
                padding: '16px 24px',
                background: 'var(--yellow)',
                color: '#000',
                border: '3px solid #000',
                fontFamily: 'var(--font-body)',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '5px 5px 0 #000',
                transition: 'all 0.12s',
                marginBottom: 10,
              }}
              onMouseEnter={e => { e.target.style.transform = 'translate(-2px,-2px)'; e.target.style.boxShadow = '7px 7px 0 #000'; }}
              onMouseLeave={e => { e.target.style.transform = ''; e.target.style.boxShadow = '5px 5px 0 #000'; }}
            >
              ↓  Download PNG
            </button>

            {/* Share + Copy */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <button onClick={shareX} style={{
                padding: '13px 14px',
                background: shared ? '#00cc5a' : 'transparent',
                border: `2px solid ${shared ? '#00cc5a' : 'rgba(255,45,120,0.6)'}`,
                color: shared ? '#000' : 'var(--pink)',
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.04em',
              }}>
                {shared ? '✓ Opened!' : '𝕏 Share #FrameInGoa'}
              </button>
              <button onClick={copyImage} style={{
                padding: '13px 14px',
                background: copied ? '#00cc5a' : 'transparent',
                border: `2px solid ${copied ? '#00cc5a' : 'rgba(255,255,255,0.18)'}`,
                color: copied ? '#000' : 'rgba(255,255,255,0.6)',
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.04em',
              }}>
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
