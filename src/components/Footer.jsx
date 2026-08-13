import React from 'react';

export default function Footer() {
  return (
    <footer style={{ position: 'relative', overflow: 'hidden', background: 'var(--green-dark)' }}>

      {/* Footer trees illustration */}
      <div style={{
        width: '100%',
        height: 'clamp(140px, 20vw, 240px)',
        background: `url('/footer trees.png') center bottom / cover no-repeat`,
        borderTop: '3px solid rgba(254,225,1,0.15)',
        opacity: 0.55,
      }} />

      {/* Bottom yellow stripe */}
      <div style={{
        background: 'var(--yellow)',
        borderTop: '3px solid #000',
        padding: '28px 0',
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}>

            {/* Left: logo + tagline */}
            <div>
              <img src="/Hacker house.png" alt="Hacker House" style={{ height: 28, width: 'auto', display: 'block', marginBottom: 4 }} />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 700,
                color: 'rgba(0,0,0,0.5)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}>ASSET GENERATOR · 2:47 PM STUDIO</span>
            </div>

            {/* Center: links */}
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[
                { href: 'https://hacker-house-goa-2026.devfolio.co/', label: 'Apply on Devfolio' },
                { href: 'https://x.com/247pmstudio', label: '@247pmstudio' },
                { href: 'https://t.me/twofourtysevenpm', label: 'Telegram' },
                { href: 'https://hhgoa.com/terms', label: 'Terms' },
                { href: 'mailto:satapathyprayasu@gmail.com', label: 'Contact' },
              ].map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#000',
                    textDecoration: 'none',
                    letterSpacing: '0.05em',
                    opacity: 0.65,
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={e => e.target.style.opacity = 1}
                  onMouseLeave={e => e.target.style.opacity = 0.65}
                >
                  {link.label} ↗
                </a>
              ))}
            </div>

            {/* Right: hashtag */}
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 400,
              color: '#000',
              letterSpacing: '0.02em',
            }}>
              #FrameInGoa
            </div>

          </div>

          {/* Bottom line */}
          <div style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: '2px solid rgba(0,0,0,0.15)',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'rgba(0,0,0,0.4)',
            letterSpacing: '0.1em',
            textAlign: 'center',
          }}>
            © 2026 HH-GOA · ALL RIGHTS RESERVED · GOA, INDIA · 28–31 OCT 2026
          </div>
        </div>
      </div>

    </footer>
  );
}
