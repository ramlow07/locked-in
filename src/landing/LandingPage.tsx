import "./landing.css";

const downloadUrl = "https://github.com/ramlow07/locked-in/releases/latest";

const features = [
  {
    title: "A steady rhythm",
    description: "Set the focus and break lengths that work for you.",
  },
  {
    title: "A clear next step",
    description: "Move from focus to breaks without losing your flow.",
  },
  {
    title: "Private by default",
    description: "Your preferences and daily progress stay on this device.",
  },
];

export function LandingPage() {
  return (
    <main className="landing-page" id="top">
      <header className="site-header page-width">
        <a className="brand" href="/" aria-label="Locked In home">
          <BrandMark />
          <span className="brand-name">
            locked<span>in</span>
          </span>
        </a>

        <a className="header-cta" href={downloadUrl} target="_blank" rel="noreferrer">
          Download for macOS <DownloadIcon />
        </a>
      </header>

      <section className="hero page-width" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="section-kicker">
            <span aria-hidden="true" /> A quieter way to focus
          </p>
          <h1 id="hero-title">
            Make room
            <br />
            <span>to focus.</span>
          </h1>
          <p className="hero-description">
            Locked In is a simple timer for focused work, real breaks, and the rhythm in between.
            <br />
            Made for MacOS users.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href={downloadUrl} target="_blank" rel="noreferrer">
              Download for macOS <DownloadIcon />
            </a>
          </div>
          <p className="hero-note">
            No account needed <span aria-hidden="true">·</span> Your progress stays on this device
          </p>
        </div>

        <div className="hero-product-wrap" aria-hidden="true">
          <div className="timer-preview">
            <div className="preview-header">
              <span className="preview-brand">
                <BrandMark /> LOCKED-IN
              </span>
              <span className="preview-ready"><i /> READY</span>
            </div>

            <div className="preview-mode">FOCUS SESSION</div>
            <div className="preview-clock">
              <div className="preview-ring">
                <div className="preview-ring-inner" />
              </div>
              <div className="preview-time">
                25<span>:00</span>
              </div>
            </div>

            <div className="preview-footer">
              <span>UP NEXT</span>
              <strong>Short break</strong>
              <span className="preview-duration">05 MIN</span>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-strip page-width" aria-label="Locked In features">
        {features.map((feature) => (
          <article className="feature-item" key={feature.title}>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>

      <footer className="site-footer page-width">
        <a className="footer-brand" href="/" aria-label="Locked In home">
          <BrandMark />
          <span>LOCKED-IN</span>
        </a>
        <span>Make room to focus.</span>
        <a href={downloadUrl} target="_blank" rel="noreferrer">
          Download for macOS <DownloadIcon />
        </a>
      </footer>
    </main>
  );
}

function BrandMark() {
  return (
    <span className="brand-mark">
      <span />
      <i />
    </span>
  );
}

function DownloadIcon() {
  return (
    <svg aria-hidden="true" className="download-icon" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 2.75v8.5m0 0 3.25-3.25M9 11.25 5.75 8M3.5 13.25v1.25c0 .55.45 1 1 1h9c.55 0 1-.45 1-1v-1.25"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
