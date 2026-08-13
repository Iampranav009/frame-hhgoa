import React from 'react';

/* Tiny marquee text ticker */
function Marquee({ items }) {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: 'hidden', background: 'var(--yellow)', borderTop: '3px solid #000', borderBottom: '3px solid #000', padding: '10px 0' }}>
      <div style={{
        display: 'flex',
        gap: 60,
        animation: 'marquee 18s linear infinite',
        whiteSpace: 'nowrap',
        width: 'max-content',
      }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: 13,
            color: '#000',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            ✦ {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ── Background: Sunrise illustration ─────────────────────────── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `url('/Sun rise.png') center bottom / cover no-repeat`,
        opacity: 0.3,
        zIndex: 0,
      }} />

      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, var(--green-dark) 0%, rgba(6,26,10,0.55) 50%, rgba(6,26,10,0.95) 100%)',
        zIndex: 1,
      }} />

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: 80, paddingBottom: 100 }}>

        {/* Event badge pill */}
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
          <span className="tag tag-yellow" style={{ fontSize: 12 }}>
            🏖 GOA, INDIA · 28 – 31 OCT 2026
          </span>
        </div>

        {/* Main Hero Image - HACKER HOUSE wordmark */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <img
            src="/Hacker house.png"
            alt="HACKER HOUSE"
            style={{
              height: 'clamp(60px, 10vw, 120px)',
              width: 'auto',
              maxWidth: '100%',
              filter: 'drop-shadow(0 0 60px rgba(254,225,1,0.3))',
              animation: 'float 5s ease-in-out infinite',
            }}
          />
        </div>

        {/* GOA text */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 5vw, 48px)',
          textAlign: 'center',
          color: 'var(--white)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: 8,
          fontWeight: 400,
        }}>
          Asset Generator
        </h1>

        {/* Sub-headline */}
        <p style={{
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(12px, 1.5vw, 15px)',
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: '0.06em',
          maxWidth: 600,
          margin: '0 auto 40px',
          lineHeight: 1.7,
        }}>
          Generate your official HH Goa 2026 PFP frame &amp; builder badge.<br />
          Share on X with <span style={{ color: 'var(--yellow)', fontWeight: 700 }}>#FrameInGoa</span> to get featured on the Celeb Radar.
        </p>

        {/* CTA Row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 64 }}>
          <a href="#generator" className="btn-yellow">
            Create Your Frame ↓
          </a>
          <a
            href="https://hacker-house-goa-2026.devfolio.co/"
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            Apply on Devfolio ↗
          </a>
        </div>

        {/* Stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 2,
          maxWidth: 700,
          margin: '0 auto',
        }}>
          {[
            { n: '247',    label: 'Elite Builders' },
            { n: '4 Days', label: '28 – 31 Oct 2026' },
            { n: 'Goa',    label: 'Beachfront Studio' },
            { n: '$0k+',   label: 'Bounties 2026' },
          ].map(({ n, label }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(254,225,1,0.2)',
              padding: '20px 16px',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 4vw, 36px)',
                color: 'var(--yellow)',
                fontWeight: 400,
                lineHeight: 1.1,
              }}>{n}</div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginTop: 4,
              }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer scene overlay at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
        background: `url('/footer trees.png') center bottom / cover no-repeat`,
        opacity: 0.18,
        zIndex: 2,
        pointerEvents: 'none',
      }} />

      {/* Marquee ticker */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        <Marquee items={[
          'HACKER HOUSE GOA 2026',
          'LESS NOISE. MORE SIGNAL.',
          'GOA BEACHFRONT · OCT 28–31',
          '#FrameInGoa',
          '247 ELITE BUILDERS',
          'TASK #1: PFP FRAME GENERATOR',
          '2:47 PM STUDIO',
        ]} />
      </div>
    </section>
  );
}
