// GoWithLaila — working questionnaire: Vehicle Match → Trade-In → Financing → Contact
import React, { useState as useFS, useEffect as useFE, useRef as useFR } from "react";
import { Icon, Wordmark } from "./Chrome.jsx";
const LS_KEY = 'gwl_funnel_v1';

const PHASES = [
  { key: 'match', label: 'Vehicle match' },
  { key: 'trade', label: 'Trade-in' },
  { key: 'finance', label: 'Financing' },
  { key: 'contact', label: 'Your details' },
];

/* Step model. `show` predicate controls conditional steps. */
const ALL_STEPS = [
  { key: 'looking', phase: 'match', type: 'single', grid: 'grid2',
    q: 'What are you looking for?', hint: 'Pick the closest \u2014 we get specific later.',
    options: [
      { v: 'New car', ic: 'car' }, { v: 'New SUV or truck', ic: 'car' },
      { v: 'Used car', ic: 'car' }, { v: 'Used SUV or truck', ic: 'car' },
    ] },
  { key: 'matters', phase: 'match', type: 'multi', grid: 'grid3',
    q: 'What matters most?', hint: 'Choose all that apply.',
    options: ['Reliability', 'Fuel economy', 'Safety', 'Price', 'Tech', 'Comfort', 'Space', 'Resale value'].map(v => ({ v })) },
  { key: 'budget', phase: 'match', type: 'single', grid: 'grid3',
    q: 'What\u2019s your budget?', hint: 'Ballpark is fine. Nothing you enter is shared publicly.',
    options: ['Under $20k', '$20k\u2013$25k', '$25k\u2013$30k', '$30k\u2013$35k', '$35k\u2013$40k', '$40k+'].map(v => ({ v })) },
  { key: 'timeline', phase: 'match', type: 'single',
    q: 'How soon are you looking?', hint: 'Honest answers get you better help.',
    options: [
      { v: 'This week', sub: 'Ready to move now' }, { v: 'This month', sub: 'Actively shopping' },
      { v: 'Within 30 days', sub: 'Getting organized' }, { v: 'Just looking for now', sub: 'No rush at all' },
    ] },

  { key: 'hasTrade', phase: 'trade', type: 'single', grid: 'grid2',
    q: 'Do you have a car to trade in?', hint: 'A trade can lower what you pay. Optional.',
    options: [
      { v: 'Yes, I have a trade', ic: 'tag' }, { v: 'No trade', ic: 'x' },
    ] },
  { key: 'tradeDetails', phase: 'trade', type: 'form-trade',
    q: 'Tell me about your trade.', hint: 'Rough details are fine \u2014 we confirm the value later.',
    show: a => a.hasTrade === 'Yes, I have a trade' },
  { key: 'payoff', phase: 'trade', type: 'single',
    q: 'Where are you on that car\u2019s loan?', hint: 'This helps size up your trade equity.',
    show: a => a.hasTrade === 'Yes, I have a trade',
    options: [
      { v: 'I own it outright' }, { v: 'Still financing it' }, { v: 'Leasing (ending soon)' }, { v: 'Not sure' },
    ] },

  { key: 'payment', phase: 'finance', type: 'single', grid: 'grid3',
    q: 'How would you like to pay?', hint: 'You can change your mind later.',
    options: [
      { v: 'Finance it', ic: 'wallet' }, { v: 'Lease it', ic: 'key' }, { v: 'Pay cash', ic: 'tag' },
    ] },
  { key: 'credit', phase: 'finance', type: 'single', grid: 'grid2',
    q: 'How\u2019s your credit, roughly?', hint: 'A ballpark only \u2014 no credit check happens here, and nothing is shared publicly.',
    show: a => a.payment !== 'Pay cash',
    options: [
      { v: 'Excellent', sub: '720 and up' }, { v: 'Good', sub: '660\u2013719' },
      { v: 'Fair', sub: '600\u2013659' }, { v: 'Rebuilding', sub: 'Under 600' },
      { v: 'Not sure', sub: 'Help me figure it out' },
    ] },
  { key: 'down', phase: 'finance', type: 'single', grid: 'grid3',
    q: 'How much down, roughly?', hint: 'An estimate is plenty.',
    show: a => a.payment !== 'Pay cash',
    options: ['$0', 'Under $2k', '$2k\u2013$5k', '$5k\u2013$10k', '$10k+', 'Not sure'].map(v => ({ v })) },

  { key: 'contact', phase: 'contact', type: 'form-contact',
    q: 'Where should Laila text you?', hint: 'Just a name and number. She texts first \u2014 no calls unless you ask.' },
];

function Chip({ opt, selected, onClick, multi }) {
  const label = typeof opt === 'string' ? opt : opt.v;
  const sub = opt.sub;
  return (
    <button className={'chip' + (selected ? ' sel' : '')} onClick={onClick} type="button">
      {opt.ic && <Icon name={opt.ic} size={20} className="chip-ic" />}
      <span className="chip-main">{label}{sub && <span className="chip-sub">{sub}</span>}</span>
      {multi
        ? <span className="tick">{selected ? <Icon name="check" size={13} stroke={3} /> : ''}</span>
        : <span className="tick">{selected ? <Icon name="check" size={13} stroke={3} /> : ''}</span>}
    </button>
  );
}

function SummaryRow({ k, v }) {
  return <div className="srow"><span className="k">{k}</span><span className="v">{v || '\u2014'}</span></div>;
}

function Funnel({ onClose, t }) {
  const [answers, setAnswers] = useFS(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (e) { return {}; }
  });
  const [i, setI] = useFS(0);
  const [done, setDone] = useFS(false);
  const [trade, setTrade] = useFS(answers.tradeDetails || { year: '', make: '', model: '', mileage: '' });
  const [contact, setContact] = useFS({ name: '', phone: '', email: '', consent: false });
  const [touched, setTouched] = useFS(false);
  const bodyRef = useFR(null);

  const steps = ALL_STEPS.filter(s => !s.show || s.show(answers));
  const step = steps[i];
  const total = steps.length;

  useFE(() => { try { localStorage.setItem(LS_KEY, JSON.stringify(answers)); } catch (e) {} }, [answers]);
  useFE(() => { if (bodyRef.current) bodyRef.current.scrollTop = 0; }, [i, done]);

  function set(key, val) { setAnswers(a => ({ ...a, [key]: val })); }

  function pickSingle(key, v) {
    set(key, v);
    setTimeout(() => goNext(key), 180);
  }
  function pickMulti(key, v) {
    setAnswers(a => {
      const cur = a[key] || [];
      const next = cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v];
      return { ...a, [key]: next };
    });
  }

  function currentIndexFor(key) { return steps.findIndex(s => s.key === key); }

  function goNext(changedKey) {
    // recompute steps with the new answer so conditionals resolve correctly
    const a2 = changedKey ? { ...answers, [changedKey]: undefined } : answers;
    setTouched(false);
    setI(x => Math.min(x + 1, total - 1));
  }
  function goBack() { setTouched(false); setI(x => Math.max(0, x - 1)); }

  // --- validation ---
  const phoneDigits = contact.phone.replace(/\D/g, '');
  const phoneValid = phoneDigits.length === 10;
  const emailValid = !contact.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email);
  const yearValid = /^(19|20)\d{2}$/.test(trade.year) && +trade.year >= 1990 && +trade.year <= 2026;
  const mileageValid = /^\d{1,7}$/.test(trade.mileage.replace(/,/g, ''));

  function canAdvance() {
    if (!step) return false;
    if (step.type === 'single') return !!answers[step.key];
    if (step.type === 'multi') return (answers[step.key] || []).length > 0;
    if (step.type === 'form-trade') return yearValid && trade.make.trim() && trade.model.trim() && mileageValid;
    if (step.type === 'form-contact') return contact.name.trim() && phoneValid && emailValid && contact.consent;
    return false;
  }

  function submitTrade() {
    setTouched(true);
    if (yearValid && trade.make.trim() && trade.model.trim() && mileageValid) {
      set('tradeDetails', trade);
      goNext();
    }
  }
  function submitContact() {
    setTouched(true);
    if (contact.name.trim() && phoneValid && emailValid && contact.consent) {
      const finalAnswers = { ...answers, contact };
      setAnswers(finalAnswers);
      try {
        const prior = JSON.parse(localStorage.getItem("gwl_leads") || "[]");
        const lead = {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          status: "New",
          type: "Questionnaire",
          contact,
          answers: finalAnswers,
        };
        localStorage.setItem("gwl_leads", JSON.stringify([lead, ...prior]));
      } catch (e) {}
      setDone(true);
    }
  }

  function fmtPhone(v) {
    const d = v.replace(/\D/g, '').slice(0, 10);
    if (d.length > 6) return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
    if (d.length > 3) return `(${d.slice(0,3)}) ${d.slice(3)}`;
    if (d.length > 0) return `(${d}`;
    return '';
  }

  // progress per phase
  function phaseProgress(pk) {
    const phaseSteps = steps.filter(s => s.phase === pk);
    if (!phaseSteps.length) return 0;
    const completedInPhase = phaseSteps.filter(s => steps.indexOf(s) < i || done).length;
    return Math.round((completedInPhase / phaseSteps.length) * 100);
  }
  const activePhase = done ? 'contact' : (step ? step.phase : 'match');
  const phaseOrder = PHASES.map(p => p.key);

  /* ---------- confirmation ---------- */
  if (done) {
    const firstName = (contact.name.trim().split(' ')[0]) || 'there';
    const td = answers.tradeDetails;
    return (
      <div className="funnel">
        <div className="funnel-top"><div className="wrap"><Wordmark onClick={onClose} /><button className="funnel-close" onClick={onClose}><Icon name="x" size={16} />Close</button></div></div>
        <div className="progress-wrap"><div className="wrap"><div className="phase-row">
          {PHASES.map(p => (
            <div className="phase done" key={p.key}><div className="plabel">{p.label}</div><div className="ptrack"><div className="pfill" style={{ width: '100%' }}></div></div></div>
          ))}
        </div></div></div>
        <div className="funnel-body" ref={bodyRef}>
          <div className="confirm">
            <div className="big"><Icon name="check" size={34} stroke={2.5} style={{ color: 'var(--positive)' }} /></div>
            <h2>Got it, {firstName}.</h2>
            <p>Laila will match you to the right cars and text you at <b>{contact.phone}</b> shortly — usually within a couple hours during the day.</p>
            <div className="summary">
              <SummaryRow k="Looking for" v={answers.looking} />
              <SummaryRow k="Matters most" v={(answers.matters || []).join(', ')} />
              <SummaryRow k="Budget" v={answers.budget} />
              <SummaryRow k="Timeline" v={answers.timeline} />
              <SummaryRow k="Trade-in" v={td ? `${td.year} ${td.make} ${td.model} \u00b7 ${(+td.mileage.replace(/,/g,'')).toLocaleString()} mi` : (answers.hasTrade === 'No trade' ? 'None' : '\u2014')} />
              <SummaryRow k="Paying by" v={answers.payment} />
              {answers.payment !== 'Pay cash' && <SummaryRow k="Credit (est.)" v={answers.credit} />}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink-faint)', maxWidth: '46ch', margin: '0 auto 24px' }}>
              Estimates only. Final numbers depend on credit tier, trade value, current incentives, and applicable taxes and fees.
            </p>
            <div className="next-actions">
              <button className="btn btn-primary btn-lg" onClick={onClose}>Back to site</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- active step ---------- */
  return (
    <div className="funnel">
      <div className="funnel-top"><div className="wrap"><Wordmark onClick={onClose} /><button className="funnel-close" onClick={onClose}><Icon name="x" size={16} />Save &amp; close</button></div></div>
      <div className="progress-wrap"><div className="wrap"><div className="phase-row">
        {PHASES.map(p => {
          const ai = phaseOrder.indexOf(activePhase);
          const pi = phaseOrder.indexOf(p.key);
          const cls = pi < ai ? 'done' : (pi === ai ? 'active' : '');
          const fill = pi < ai ? 100 : (pi === ai ? phaseProgress(p.key) : 0);
          return <div className={'phase ' + cls} key={p.key}><div className="plabel">{p.label}</div><div className="ptrack"><div className="pfill" style={{ width: fill + '%' }}></div></div></div>;
        })}
      </div></div></div>

      <div className="funnel-body" ref={bodyRef}>
        <div className="q" key={step.key}>
          <div className="step-n">{PHASES.find(p => p.key === step.phase).label} · step {i + 1} of {total}</div>
          <h2>{step.q}</h2>
          <div className="hint">{step.hint}</div>

          {step.type === 'single' && (
            <div className={'opts' + (step.grid ? ' ' + step.grid : '')}>
              {step.options.map(opt => (
                <Chip key={opt.v} opt={opt} selected={answers[step.key] === opt.v} onClick={() => pickSingle(step.key, opt.v)} />
              ))}
            </div>
          )}

          {step.type === 'multi' && (
            <div className={'opts ' + step.grid}>
              {step.options.map(opt => (
                <Chip key={opt.v} opt={opt} multi selected={(answers[step.key] || []).includes(opt.v)} onClick={() => pickMulti(step.key, opt.v)} />
              ))}
            </div>
          )}

          {step.type === 'form-trade' && (
            <div className="opts">
              <div className="grid-2">
                <div className={'field' + (touched && !yearValid ? ' err' : '')}>
                  <label>Year</label>
                  <input className="tinp" inputMode="numeric" placeholder="2021" maxLength={4}
                    value={trade.year} onChange={e => setTrade({ ...trade, year: e.target.value.replace(/\D/g, '') })} />
                  {touched && !yearValid && <div className="errmsg"><Icon name="x" size={13} />Enter a year between 1990 and 2026</div>}
                </div>
                <div className={'field' + (touched && !mileageValid ? ' err' : '')}>
                  <label>Mileage</label>
                  <input className="tinp" inputMode="numeric" placeholder="28,400"
                    value={trade.mileage} onChange={e => setTrade({ ...trade, mileage: e.target.value.replace(/[^\d,]/g, '') })} />
                  {touched && !mileageValid && <div className="errmsg"><Icon name="x" size={13} />Enter the mileage</div>}
                </div>
              </div>
              <div className="grid-2">
                <div className={'field' + (touched && !trade.make.trim() ? ' err' : '')}>
                  <label>Make</label>
                  <input className="tinp" placeholder="Toyota" value={trade.make} onChange={e => setTrade({ ...trade, make: e.target.value })} />
                  {touched && !trade.make.trim() && <div className="errmsg"><Icon name="x" size={13} />Required</div>}
                </div>
                <div className={'field' + (touched && !trade.model.trim() ? ' err' : '')}>
                  <label>Model</label>
                  <input className="tinp" placeholder="Camry" value={trade.model} onChange={e => setTrade({ ...trade, model: e.target.value })} />
                  {touched && !trade.model.trim() && <div className="errmsg"><Icon name="x" size={13} />Required</div>}
                </div>
              </div>
            </div>
          )}

          {step.type === 'form-contact' && (
            <div className="opts">
              <div className={'field' + (touched && !contact.name.trim() ? ' err' : '')}>
                <label>First name</label>
                <input className="tinp" placeholder="Your first name" value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} />
                {touched && !contact.name.trim() && <div className="errmsg"><Icon name="x" size={13} />Please enter your name</div>}
              </div>
              <div className={'field' + (touched && !phoneValid ? ' err' : '')}>
                <label>Mobile number</label>
                <input className="tinp" inputMode="tel" placeholder="(954) 555-0123"
                  value={contact.phone} onChange={e => setContact({ ...contact, phone: fmtPhone(e.target.value) })} />
                {touched && !phoneValid && <div className="errmsg"><Icon name="x" size={13} />Enter a 10-digit mobile number</div>}
              </div>
              <div className={'field' + (touched && !emailValid ? ' err' : '')}>
                <label>Email <span style={{ color: 'var(--ink-faint)', fontWeight: 400 }}>(optional)</span></label>
                <input className="tinp" inputMode="email" placeholder="you@email.com"
                  value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} />
                {touched && !emailValid && <div className="errmsg"><Icon name="x" size={13} />Enter a valid email or leave blank</div>}
              </div>
              <label className={'consent' + (contact.consent ? ' sel' : '')} onClick={() => setContact({ ...contact, consent: !contact.consent })}>
                <span className="tick">{contact.consent ? <Icon name="check" size={13} stroke={3} /> : ''}</span>
                <span className="txt">It's OK to text me about my car search. Message and data rates may apply. Reply STOP anytime to opt out. (TCPA consent)</span>
              </label>
              {touched && !contact.consent && <div className="errmsg" style={{ marginTop: '-4px' }}><Icon name="x" size={13} />Please check the box so Laila can reach you</div>}
            </div>
          )}

          <div className="funnel-nav">
            <button className="btn btn-ghost" onClick={() => i > 0 ? goBack() : onClose()}>
              {i > 0 ? '\u2190 Back' : 'Cancel'}
            </button>
            {step.type === 'single'
              ? <span className="hint-inline">Tap an answer to continue</span>
              : step.type === 'form-trade'
                ? <button className="btn btn-primary" onClick={submitTrade}>Continue<Icon name="arrowRight" size={18} /></button>
                : step.type === 'form-contact'
                  ? <button className="btn btn-primary" disabled={!canAdvance()} onClick={submitContact}>Send to Laila<Icon name="arrowRight" size={18} /></button>
                  : <button className="btn btn-primary" disabled={!canAdvance()} onClick={() => goNext()}>Next<Icon name="arrowRight" size={18} /></button>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Funnel;
