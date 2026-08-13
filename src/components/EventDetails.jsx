import React from 'react';

const days = [
  {
    num: '01',
    title: 'Genesis Day',
    sub: 'Where it all begins',
    desc: 'Check-in at the Goa beachfront, team formation, environment setup, and inaugural signal broadcast.',
    color: 'var(--yellow)',
  },
  {
    num: '02',
    title: 'Day of Triangle',
    sub: 'Problem. Solution. Market.',
    desc: 'Architecture deep-dives, partner office hours, mentor feedback, and founding locks.',
    color: 'var(--pink)',
  },
  {
    num: '03',
    title: 'Build Day',
    sub: 'Heads down. Ship or ship.',
    desc: '24-hour sprint. High-speed fiber, no distractions, relentless debugging and shipping.',
    color: 'var(--yellow)',
  },
  {
    num: '04',
    title: 'Launch Day',
    sub: 'The world watches.',
    desc: 'Live mainstage demos, global stream, partner bounty awards and residency acknowledgments.',
    color: 'var(--pink)',
  },
];

const roadmap = [
  { step: 'Registration Opens',   detail: 'Applications open — start your HH GOA journey.' },
  { step: 'Open Trials',          detail: 'Skill-based challenges open to everyone.' },
  { step: 'Alpha Selections',     detail: 'First shortlist from Open Trials performance.' },
  { step: 'Beta Selections',      detail: 'Deeper technical & portfolio review.' },
  { step: 'Charlie Selections',   detail: 'Interviews and team-fit assessment.' },
  { step: 'Delta Selections',     detail: 'Final shortlist confirmed before partner matching.' },
  { step: 'Partner Trials',       detail: 'Selection based on partner requirements.' },
  { step: 'RSVP & Stake',         detail: 'Final confirmation of your team\'s participation.' },
  { step: 'Residency',            detail: '247 builders come together to build, ship, launch in Goa.' },
];

export default function EventDetails() {
  return (
    <>
      {/* ── About Section ──────────────────────────────────────────── */}
      <section id="about" style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '80px 0',
        background: 'var(--green-mid)',
        borderTop: '3px solid rgba(254,225,1,0.2)',
        borderBottom: '3px solid rgba(254,225,1,0.2)',
      }}>
        {/* Hackers illustration on right */}
        <div style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '45%',
          height: '100%',
          background: `url('/hackers.png') right bottom / contain no-repeat`,
          opacity: 0.18,
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: 680 }}>
            <div className="section-label">The Manifesto</div>
            <h2 className="section-title" style={{ marginBottom: 24 }}>
              Less Noise.<br />
              <span style={{ color: 'var(--yellow)', fontStyle: 'italic' }}>More Signal.</span>
            </h2>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(15px, 1.8vw, 18px)',
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.7)',
              marginBottom: 20,
            }}>
              Most hackathons are just hype and no substance. We're changing that. From October 28–31, 2026, we're taking over Goa for the country's biggest build-station.
            </p>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(14px, 1.5vw, 16px)',
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.55)',
              marginBottom: 36,
            }}>
              This is for the developers who live in their terminals and ship things that matter. No fluff, no useless networking — just 247 elite builders, high-speed fiber, and the ocean at your doorstep.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href="https://hacker-house-goa-2026.devfolio.co/" target="_blank" rel="noreferrer" className="btn-yellow">
                Apply on Devfolio ↗
              </a>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'rgba(255,255,255,0.4)',
              }}>
                ✓ Free to join · Meals provided · Beachfront accommodation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4-Day Rhythm ────────────────────────────────────────────── */}
      <section id="rhythm" style={{ padding: '80px 0', background: 'var(--green-dark)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label">Inside the Room</div>
            <h2 className="section-title">
              4 Days.<br />
              <span style={{ color: 'var(--yellow)', fontStyle: 'italic' }}>One Rhythm.</span>
            </h2>
          </div>

          {/* Agenda illustration as wide banner */}
          <div style={{
            width: '100%',
            height: 'clamp(160px, 25vw, 280px)',
            background: `url('/agenda.png') center center / cover no-repeat`,
            border: '3px solid rgba(254,225,1,0.2)',
            marginBottom: 40,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, rgba(6,26,10,0.8) 0%, transparent 40%, transparent 60%, rgba(6,26,10,0.8) 100%)',
            }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(20px, 3vw, 36px)',
                color: 'var(--yellow)',
                letterSpacing: '0.1em',
                textShadow: '0 2px 20px rgba(0,0,0,0.8)',
              }}>EVERYTHING INTENTIONAL</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 2 }}>
            {days.map((d, i) => (
              <div key={i} style={{
                background: 'var(--green-mid)',
                border: '2px solid rgba(255,255,255,0.08)',
                padding: 28,
                transition: 'border-color 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = d.color}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  color: d.color,
                  marginBottom: 8,
                }}>DAY {d.num}</div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 26,
                  color: '#fff',
                  marginBottom: 4,
                  fontWeight: 400,
                }}>{d.title}</h3>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: d.color,
                  marginBottom: 12,
                  fontStyle: 'italic',
                }}>"{d.sub}"</p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.65,
                }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Selection Roadmap ───────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--green-mid)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label">The Path</div>
            <h2 className="section-title">
              Selection <span style={{ color: 'var(--yellow)', fontStyle: 'italic' }}>Roadmap</span>
            </h2>
          </div>

          {/* Details (signpost) illustration */}
          <div style={{
            width: '100%',
            height: 'clamp(120px, 18vw, 200px)',
            background: `url('/details.png') center center / cover no-repeat`,
            border: '2px solid rgba(254,225,1,0.15)',
            marginBottom: 40,
            opacity: 0.65,
          }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 2 }}>
            {roadmap.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '18px 20px',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(254,225,1,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
              >
                <div style={{
                  width: 28,
                  height: 28,
                  background: i === 0 ? 'var(--yellow)' : 'rgba(255,255,255,0.08)',
                  border: `2px solid ${i === 0 ? '#000' : 'rgba(255,255,255,0.15)'}`,
                  color: i === 0 ? '#000' : 'rgba(255,255,255,0.4)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>{i + 1}</div>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    {item.step}
                    {i === 0 && (
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 9,
                        fontWeight: 700,
                        background: 'var(--yellow)',
                        color: '#000',
                        padding: '1px 6px',
                        letterSpacing: '0.1em',
                      }}>OPEN</span>
                    )}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.4)',
                    lineHeight: 1.5,
                  }}>{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
