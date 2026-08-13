import React, { useState } from 'react';

const faqs = [
  {
    q: 'Who can participate in Hacker House Goa?',
    a: 'Anyone with a passion for building! Whether you\'re a developer, designer, product manager, or hardware builder — you\'re welcome here. Teams of 1–3 people are encouraged, but solo participants are also accepted.',
  },
  {
    q: 'How does the selection process work?',
    a: 'First, complete shortlisting tasks like Task #1 (HH Goa Frame Generator). Top performers from Open Trials are waitlisted. Best teams from the waitlist are selected for attending Hacker House Goa in-person.',
  },
  {
    q: 'What should I bring to the event?',
    a: 'Bring your laptop, charger, any hardware you might need, and your creative energy. We provide the workspace, high-speed fiber WiFi, meals, caffeine, and beachfront accommodation.',
  },
  {
    q: 'Is there a registration fee?',
    a: 'No! Participation is completely free. We cover accommodation, meals, and all event amenities during the 4-day residency. You just need to get yourself to Goa.',
  },
  {
    q: 'How are teams formed?',
    a: 'You can come with a pre-formed team of up to 3 people, or find teammates during the team formation session on Day 1. We have networking activities and a matching board to help you find collaborators.',
  },
  {
    q: 'Can I start working on my project before the event?',
    a: 'You can brainstorm and plan, but all code must be written during the hackathon. Using existing open-source libraries, APIs, and frameworks is encouraged — just don\'t bring pre-built solutions.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faqs" style={{ padding: '80px 0', background: 'var(--green-dark)' }}>
      <div className="container" style={{ maxWidth: 800 }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label">Got Questions?</div>
          <h2 className="section-title">
            Frequently <span style={{ color: 'var(--yellow)', fontStyle: 'italic' }}>Asked</span>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                style={{
                  background: isOpen ? 'var(--green-mid)' : 'rgba(255,255,255,0.03)',
                  border: `2px solid ${isOpen ? 'var(--yellow)' : 'rgba(255,255,255,0.08)'}`,
                  transition: 'all 0.2s',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(14px, 1.5vw, 16px)',
                    fontWeight: 700,
                    color: isOpen ? 'var(--yellow)' : '#fff',
                    transition: 'color 0.2s',
                    lineHeight: 1.4,
                  }}>
                    {faq.q}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 18,
                    color: isOpen ? 'var(--yellow)' : 'rgba(255,255,255,0.3)',
                    transform: isOpen ? 'rotate(45deg)' : 'none',
                    transition: 'transform 0.25s, color 0.2s',
                    flexShrink: 0,
                    lineHeight: 1,
                  }}>+</span>
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 24px 20px',
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.6)',
                    lineHeight: 1.75,
                    borderTop: '1px solid rgba(254,225,1,0.15)',
                    paddingTop: 16,
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
