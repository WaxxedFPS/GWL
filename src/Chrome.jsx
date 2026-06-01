// GoWithLaila — shared chrome: icons, header, and footer
import React from "react";

/* ---- Lucide-style icon set ---- */
const ICON_PATHS = {
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
  sparkles: '<path d="M9.94 14.32 8.5 21l-1.44-6.68a2 2 0 0 0-1.38-1.38L-.01 11.5l6.68-1.44a2 2 0 0 0 1.38-1.38L9.5 2l1.44 6.68a2 2 0 0 0 1.38 1.38l6.68 1.44-6.68 1.44a2 2 0 0 0-1.38 1.38z" transform="translate(2 0)"/>',
  handshake: '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  mapPin: '<path d="M20 10c0 4.4-5.4 9.2-7.3 10.7a1 1 0 0 1-1.4 0C9.4 19.2 4 14.4 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  star: '<path d="M11.5 2.6a.5.5 0 0 1 .9 0l2.4 5 5.4.8a.5.5 0 0 1 .3.85l-3.9 3.8.9 5.4a.5.5 0 0 1-.72.53L12 17l-4.8 2.5a.5.5 0 0 1-.72-.53l.9-5.4-3.9-3.8a.5.5 0 0 1 .3-.85l5.4-.8z"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  key: '<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
};
function Icon({ name, size = 22, stroke = 1.75, className, style }) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] || '' }} />
  );
}

function Wordmark({ onClick }) {
  return (
    <div className="brandlock" onClick={onClick}>
      <span className="wm">Go<em>With</em>Laila</span>
    </div>
  );
}

function Header({ onStart, onNav, sections }) {
  return (
    <header className="hdr">
      <div className="wrap">
        <Wordmark onClick={() => onNav('top')} />
        <nav className="nav">
          <span className="navlink" onClick={() => onNav('how')}>How it works</span>
          {sections.reviews && <span className="navlink" onClick={() => onNav('reviews')}>Reviews</span>}
          {sections.about && <span className="navlink" onClick={() => onNav('about')}>About Laila</span>}
          <span className="navlink" onClick={() => onNav('faq')}>FAQ</span>
        </nav>
        <div className="hdr-cta">
          <button className="btn btn-primary" onClick={onStart}>Start now<Icon name="arrowRight" size={18} /></button>
        </div>
      </div>
    </header>
  );
}

function Footer({ onNav, onStart }) {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="top">
          <div>
            <div className="wm">Go<em>With</em>Laila</div>
            <p className="tag">A no-pressure way to organize your car search before you ever set foot in a dealership.</p>
          </div>
          <div className="links">
            <a onClick={() => onNav('how')}>How it works</a>
            <a onClick={() => onNav('reviews')}>Reviews</a>
            <a onClick={() => onNav('faq')}>FAQ</a>
            <a onClick={onStart}>Contact</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
            <a href="#" onClick={(e) => e.preventDefault()}>TCPA</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
          </div>
        </div>
        <p className="legal">
          GoWithLaila is an independent service that helps you organize your vehicle preferences, trade-in details,
          and financing interests before connecting with Laila's team. It is not a lender or a dealership and does not
          make credit decisions. No information shared here is a financing offer, price quote, or guarantee of approval.
          By starting, you consent to be contacted about your request; message and data rates may apply, and you can reply STOP at any time.
          Figures shown anywhere on this site are illustrative and depend on credit tier, trade value, current incentives, and applicable taxes and fees.
          © {new Date().getFullYear()} GoWithLaila. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export { Icon, Wordmark, Header, Footer };
