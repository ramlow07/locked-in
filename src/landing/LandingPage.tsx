import "./landing.css";

const features = [
  {
    number: "01",
    title: "Give one thing your attention",
    description:
      "Set a focus block, start the clock, and stay with the task in front of you. No project setup or extra workflow to learn.",
    accent: "cyan",
  },
  {
    number: "02",
    title: "Make breaks part of the plan",
    description:
      "Short and long breaks keep your day moving at a sustainable pace. Choose what happens when each block ends.",
    accent: "pink",
  },
  {
    number: "03",
    title: "Keep your progress close",
    description:
      "See today’s completed focus sessions and tracked time at a glance. Your settings and stats stay on your device.",
    accent: "violet",
  },
];

export function LandingPage() {
  return (
    <main className="landing-page" id="top">
      <div className="landing-ambient landing-ambient-top" aria-hidden="true" />
      <div className="landing-ambient landing-ambient-bottom" aria-hidden="true" />

      <header className="site-header page-width">
        <a className="brand" href="/" aria-label="Locked In home">
          <BrandMark />
          <span className="brand-name">locked<span>in</span></span>
        </a>

        <nav className="site-nav" aria-label="Main navigation">
          <a href="#rhythm">The rhythm</a>
          <a href="#details">The details</a>
        </nav>

        <a className="header-cta" href="/app.html">
          Open the timer <ArrowIcon />
        </a>
      </header>

      <section className="hero page-width" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="section-kicker"><span /> A focus timer for developers</p>
          <h1 id="hero-title">
            Make room
            <br />
            <span>to focus.</span>
          </h1>
          <p className="hero-description">
            A little structure for the work that matters. Set a clear block, settle in, and let Locked In take care of what comes next.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href="/app.html">
              Open the timer <ArrowIcon />
            </a>
            <a className="button-quiet" href="#rhythm">See how it works <span aria-hidden="true">↓</span></a>
          </div>
          <p className="hero-note"><span className="note-check">✓</span> Made for macOS <span className="note-separator">·</span> No account needed</p>
        </div>

        <div className="hero-product-wrap" role="img" aria-label="Locked In timer preview">
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <div className="spark spark-one" aria-hidden="true">✳</div>
          <div className="spark spark-two" aria-hidden="true">✳</div>

          <div className="product-card">
            <div className="product-topline">
              <div className="product-brand"><BrandMark /><span>LOCKED-IN</span></div>
              <span className="ready-label"><i /> READY</span>
            </div>

            <div className="product-modes" aria-label="Timer mode preview">
              <span className="product-mode active">Focus</span>
              <span className="product-mode">Short break</span>
              <span className="product-mode">Long break</span>
            </div>

            <div className="product-clock">
              <div className="clock-halo" aria-hidden="true" />
              <div className="clock-ring"><div className="clock-ring-inner" /></div>
              <div className="clock-copy">
                <span className="clock-time">24<span>:</span>18</span>
                <span className="clock-mode">ONE THING AT A TIME</span>
              </div>
            </div>

            <div className="product-controls">
              <span className="product-start"><span className="play-triangle" /> START SESSION</span>
              <span className="product-reset">↺</span>
              <span className="product-settings">•••</span>
            </div>

            <div className="product-footer">
              <div><span className="footer-label">TODAY</span><strong>4 <small>sessions</small></strong></div>
              <div><span className="footer-label">FOCUSED</span><strong>1h 40m</strong></div>
              <div><span className="footer-label">NEXT UP</span><strong>Short break</strong></div>
            </div>
          </div>

          <div className="floating-note note-top"><span className="note-wave">⌁</span><span>ONE SESSION<br /><strong>AT A TIME</strong></span></div>
          <div className="floating-note note-bottom"><span className="note-ring">◉</span><span>YOUR DAY,<br /><strong>IN RHYTHM</strong></span></div>
        </div>
      </section>

      <section className="rhythm-section page-width" id="rhythm" aria-labelledby="rhythm-title">
        <div className="section-heading">
          <p className="section-kicker"><span /> A simpler kind of productivity</p>
          <h2 id="rhythm-title">Less juggling.<br /><em>More getting into it.</em></h2>
          <p>Locked In keeps the timer and the next step in one quiet place, so your attention can stay on the work.</p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className={`feature-card feature-${feature.accent}`} key={feature.number}>
              <span className="feature-number">{feature.number}</span>
              <div className="feature-mark" aria-hidden="true"><span /></div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="details-section page-width" id="details" aria-labelledby="details-title">
        <div className="details-copy">
          <p className="section-kicker"><span /> Your flow, your call</p>
          <h2 id="details-title">A steady rhythm.<br /><em>On your terms.</em></h2>
          <p>Choose the length of each session, decide whether the next one starts automatically, and let a notification or a soft chime mark the change.</p>
          <a className="text-link" href="/app.html">Find your rhythm <ArrowIcon /></a>
        </div>

        <div className="details-list">
          <div className="detail-row"><span className="detail-icon detail-focus">⌘</span><span><strong>Shortcuts for your flow</strong><small>Start, pause, reset, or switch modes from the keyboard.</small></span><span className="detail-key">⌘ ,</span></div>
          <div className="detail-row"><span className="detail-icon detail-break">◷</span><span><strong>Breaks that fit</strong><small>Set your focus, short break, and long break lengths.</small></span><span className="detail-key">25 / 5</span></div>
          <div className="detail-row"><span className="detail-icon detail-private">⌂</span><span><strong>Private by default</strong><small>Your preferences and daily totals stay on this device.</small></span><span className="detail-key">LOCAL</span></div>
        </div>
      </section>

      <section className="closing-section page-width">
        <div className="closing-glow" aria-hidden="true" />
        <p className="section-kicker"><span /> A good place to begin</p>
        <h2>One block.<br /><em>One thing at a time.</em></h2>
        <a className="button-primary" href="/app.html">Open Locked In <ArrowIcon /></a>
        <p>Start with the next thing in front of you.</p>
      </section>

      <footer className="site-footer page-width">
        <a className="brand" href="/" aria-label="Locked In home"><BrandMark /><span className="brand-name">locked<span>in</span></span></a>
        <span>Make room to focus.</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><span /><i /></span>;
}

function ArrowIcon() {
  return <svg aria-hidden="true" className="arrow-icon" viewBox="0 0 18 18" fill="none"><path d="M3.75 9h10.5m0 0-4.5-4.5M14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
