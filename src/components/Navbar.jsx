import React, { useState } from 'react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(6,26,10,0.96)',
      backdropFilter: 'blur(12px)',
      borderBottom: '2px solid rgba(254,225,1,0.25)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo */}
        <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/Hacker house.png" alt="HH Goa" style={{ height: 28, width: 'auto' }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--yellow)',
            letterSpacing: '0.15em',
            fontWeight: 700,
          }}>ASSET GENERATOR</span>
        </a>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
          {[
            ['#generator', 'Generator'],
            ['#about', 'About'],
            ['#rhythm', '4-Day Rhythm'],
            ['#faqs', 'FAQs'],
          ].map(([href, label]) => (
            <a key={href} href={href} style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--yellow)'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}>
              {label}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a
            href="https://hacker-house-goa-2026.devfolio.co/"
            target="_blank"
            rel="noreferrer"
            className="btn-yellow"
            style={{ padding: '9px 18px', fontSize: 13, boxShadow: '3px 3px 0 #000' }}
          >
            Apply Now ↗
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
