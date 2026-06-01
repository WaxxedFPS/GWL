// GoWithLaila — landing sections
import React, { useState as useSState } from "react";
import { Icon } from "./Chrome.jsx";

const FALLBACK_IMAGES = {
  hero: "/img/hero-1.png",
  about: "/img/hero-2.png",
};

function Stars({ n = 5, size = 14 }) {
  return (
    <span className="stars" aria-label={n + ' stars'}>
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </span>
  );
}

function GBadge({ rating = '5.0', count = '15', label = 'Laila mentions' }) {
  return (
    <div className="g-badge">
      <span className="rate tnum">{rating}</span>
      <Stars n={5} />
      <span className="cnt tnum">{count} {label}</span>
    </div>
  );
}

function safeSrc(src, fallback) {
  return src && src.trim() ? src.trim() : fallback;
}

function PhotoCard({ src, fallback, alt, label, className = "" }) {
  const imageSrc = safeSrc(src, fallback);
  return (
    <div className={"ph-photo asset-photo " + className}>
      <img
        src={imageSrc}
        alt={alt}
        onError={(e) => {
          if (e.currentTarget.src !== new URL(fallback, window.location.href).href) {
            e.currentTarget.src = fallback;
          }
        }}
      />
      {label && <span className="ph-label">{label}</span>}
    </div>
  );
}

function StripImage({ src, fallback, label }) {
  return (
    <div className="es">
      <img
        src={safeSrc(src, fallback)}
        alt={label}
        onError={(e) => {
          if (e.currentTarget.src !== new URL(fallback, window.location.href).href) {
            e.currentTarget.src = fallback;
          }
        }}
      />
      <span className="lbl">{label}</span>
    </div>
  );
}

/* ---------- HERO ---------- */
function Hero({ onStart, t, content, contact, reviews, images }) {
  const headline = content?.headline || HEADLINES[t.headline] || HEADLINES.defaultText;
  const whatsappUrl = contact?.whatsappUrl;
  const [headlineFirst, ...headlineRest] = headline.split("\n");
  const highlight = headlineRest.join(" ") || "";
  return (
    <section className={'hero' + (t.heroLayout === 'editorial' ? ' v-editorial' : '')} id="top">
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><Icon name="mapPin" size={14} stroke={2.2} />{content?.roleLine}</span>
            <h1 className="display-face">
              {headlineFirst}{highlight && <React.Fragment><br /> <span className="hl">{highlight}</span></React.Fragment>}
            </h1>
            <p className="lead">{t.subhead || content?.subhead}</p>
            <div className="cta-row">
              <button className="btn btn-primary btn-lg" onClick={onStart}>{content?.primaryCta}<Icon name="arrowRight" size={18} /></button>
              {whatsappUrl
                ? <a className="btn btn-secondary btn-lg" href={whatsappUrl} target="_blank" rel="noopener">Message Laila on WhatsApp</a>
                : <button className="btn btn-secondary btn-lg" onClick={onStart}>{content?.secondaryCta}</button>}
            </div>
            <div className="hero-trust">
              <GBadge rating={reviews?.rating} count={reviews?.count} label={reviews?.countLabel} />
              <span className="trust-logos"><b>2 minutes</b>, {content?.trustLine}</span>
            </div>
          </div>

          <div className="portrait">
            <div className="portrait-frame">
              <PhotoCard
                src={images?.hero}
                fallback={FALLBACK_IMAGES.hero}
                alt={images?.heroAlt}
                label={images?.heroLabel}
                className="asset-photo--laila"
              />
            </div>
            <div className="portrait-rating">
              <div className="big tnum">{t.rating}</div>
              <div className="stars">★★★★★</div>
            </div>
            <div className="portrait-badge">
              <div className="av">L</div>
              <div>
                <div className="nm">Laila</div>
                <div className="rl">Your point of contact, start to keys</div>
              </div>
            </div>
          </div>
        </div>

        <div className="editorial-strip">
          <StripImage src={images?.strip1} fallback={FALLBACK_IMAGES.hero} label={images?.strip1Label} />
          <StripImage src={images?.strip2} fallback={FALLBACK_IMAGES.about} label={images?.strip2Label} />
          <StripImage src={images?.strip3} fallback={FALLBACK_IMAGES.hero} label={images?.strip3Label} />
        </div>
      </div>
    </section>
  );
}

const HEADLINES = {
  defaultText: "Find your next car.\nNo pressure.",
  default: "Find your next car.\nNo pressure.",
  speed: "Skip the lot.\nStart from your couch.",
  personal: "One person.\nStart to keys.",
  concierge: "Car buying,\nhandled.",
};

/* ---------- HOW IT WORKS ---------- */
function HowItWorks({ onStart, content }) {
  const steps = content?.items || [];
  return (
    <section className="section" id="how">
      <div className="wrap">
        <div className="section-head center">
          <span className="eyebrow muted">{content?.eyebrow}</span>
          <h2 style={{ marginTop: '14px' }}>{content?.heading}</h2>
          <p className="sub">{content?.subhead}</p>
        </div>
        <div className="steps">
          {steps.map(s => (
            <div className="stepcard" key={s.n}>
              <div className="n tnum">{s.n}</div>
              <div className="ic"><Icon name={s.ic} size={24} /></div>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button className="btn btn-primary btn-lg" onClick={onStart}>Find my match<Icon name="arrowRight" size={18} /></button>
        </div>
      </div>
    </section>
  );
}

/* ---------- VALUE PROPS ---------- */
function Values({ content }) {
  const vals = content?.items || [];
  return (
    <section className="section band">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow muted">{content?.eyebrow}</span>
          <h2 style={{ marginTop: '14px' }}>{content?.heading}</h2>
        </div>
        <div className="values">
          {vals.map(v => (
            <div className="value" key={v.h}>
              <div className="ic"><Icon name={v.ic} size={24} /></div>
              <h3>{v.h}</h3>
              <p>{v.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- REVIEWS ---------- */
function Reviews({ t, content }) {
  const reviews = content?.items || [];
  const sourceUrl = content?.sourceUrl || "#";
  return (
    <section className="section" id="reviews">
      <div className="wrap">
        <div className="section-head center">
          <span className="eyebrow muted">What buyers say</span>
          <h2 style={{ marginTop: '14px' }}>{content?.heading}</h2>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '22px' }}>
            <a href={sourceUrl} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}><GBadge rating={content?.rating} count={content?.count} label={content?.countLabel} /></a>
          </div>
        </div>
        <div className="reviews-grid">
          {reviews.map((r, i) => (
            <div className="review" key={i}>
              <Stars n={5} size={15} />
              <p className="body">{r.body}</p>
              <div className="who">
                <div className="av" style={{ background: r.color }}>{r.init}</div>
                <div>
                  <div className="nm">{r.name}</div>
                  <div className="meta">{r.when} · Toyota of Hollywood</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 'var(--s-6)' }}>
          <a className="btn btn-secondary btn-lg" href={sourceUrl} target="_blank" rel="noopener">Read more buyer reviews<Icon name="arrowRight" size={18} /></a>
        </div>
      </div>
    </section>
  );
}

/* ---------- ABOUT LAILA ---------- */
function About({ onStart, content, images }) {
  return (
    <section className="section band about" id="about">
      <div className="wrap">
        <div className="about-grid">
          <div className="about-photo">
            <PhotoCard
              src={images?.about}
              fallback={FALLBACK_IMAGES.about}
              alt={images?.aboutAlt}
              label={images?.aboutLabel}
              className="asset-photo--dealership"
            />
          </div>
          <div>
            <span className="eyebrow muted">{content?.eyebrow}</span>
            <h2 style={{ marginTop: '14px' }}>{content?.heading}</h2>
            <p className="quote">
              {content?.quote}
            </p>
            <p style={{ color: 'var(--ink-muted)', fontSize: '16px', lineHeight: 1.6 }}>
              {content?.body}
            </p>
            <div className="credrow">
              <div className="cred"><div className="num">Toyota</div><div className="lab">of Hollywood</div></div>
              <div className="cred"><div className="num">New &amp; used</div><div className="lab">cars, trucks &amp; SUVs</div></div>
              <div className="cred"><div className="num">1</div><div className="lab">point of contact</div></div>
            </div>
            <div style={{ marginTop: '30px' }}>
              <button className="btn btn-primary btn-lg" onClick={onStart}>Start with Laila<Icon name="arrowRight" size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FAQ({ content }) {
  const [open, setOpen] = useSState(0);
  const faqs = content?.items || [];
  return (
    <section className="section" id="faq">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow muted">{content?.eyebrow}</span>
          <h2 style={{ marginTop: '14px' }}>{content?.heading}</h2>
        </div>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <div className={'faq-item' + (open === i ? ' open' : '')} key={i}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                {f.q}<Icon name="plus" size={20} className="pm" stroke={2.2} />
              </button>
              <div className="faq-a"><p>{f.a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FINAL CTA ---------- */
function FinalCTA({ onStart, content, contact, hero }) {
  const whatsappUrl = contact?.whatsappUrl;
  return (
    <section className="section">
      <div className="wrap">
        <div className="cta-band">
          <span className="eyebrow" style={{ color: '#fff', opacity: .8 }}>{content?.eyebrow}</span>
          <h2 className="display-face" style={{ marginTop: '14px' }}>{content?.heading}</h2>
          <p>{content?.body}</p>
          <div className="cta-row">
            <button className="btn btn-primary btn-lg" onClick={onStart}>Start the questionnaire<Icon name="arrowRight" size={18} /></button>
            {whatsappUrl
              ? <a className="btn btn-secondary btn-lg" href={whatsappUrl} target="_blank" rel="noopener">Message Laila on WhatsApp</a>
              : <button className="btn btn-secondary btn-lg" onClick={onStart}>{hero?.secondaryCta}</button>}
          </div>
          <div className="chev-wm" aria-hidden="true">»</div>
        </div>
      </div>
    </section>
  );
}

export { Hero, HowItWorks, Values, Reviews, About, FAQ, FinalCTA, Stars, GBadge };
