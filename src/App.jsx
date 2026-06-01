// GoWithLaila — app shell, routing, and Tweaks
import React, { useState as useAS, useEffect as useAE } from "react";
import { Header, Footer } from "./Chrome.jsx";
import { Hero, HowItWorks, Values, Reviews, About, FAQ, FinalCTA } from "./Sections.jsx";
import Funnel from "./Funnel.jsx";
import { loadSiteContent, resetSiteContent, saveSiteContent } from "./siteContent.js";
import {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRadio,
  TweakColor,
  TweakSelect,
  TweakText,
  TweakToggle,
} from "./tweaks-panel.jsx";

const ACCENTS = {
  '#C8102E': { deep: '#9E0C22', bright: '#E11733', wash: '#FAE7E9', name: 'Signal red' },
  '#B11226': { deep: '#8A0D1D', bright: '#D11832', wash: '#F8E6E9', name: 'Crimson' },
  '#A8331F': { deep: '#822517', bright: '#C24228', wash: '#F8E8E2', name: 'Brick' },
  '#1F3A5F': { deep: '#142847', bright: '#2A4E7E', wash: '#E4EAF1', name: 'Midnight navy' },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "paper",
  "accent": "#C8102E",
  "heroLayout": "split",
  "headline": "default",
  "subhead": "",
  "rating": "5.0",
  "reviewCount": "15",
  "showValues": true,
  "showReviews": true,
  "showAbout": true,
  "displayFont": "Manrope"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [funnel, setFunnel] = useAS(false);
  const [siteContent, setSiteContent] = useAS(loadSiteContent);

  // apply accent + theme + font to :root
  useAE(() => {
    const root = document.documentElement;
    const a = ACCENTS[t.accent] || ACCENTS['#C8102E'];
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-deep', a.deep);
    root.style.setProperty('--accent-bright', a.bright);
    root.style.setProperty('--accent-wash', a.wash);
    root.style.setProperty('--shadow-accent', `0 10px 28px ${hexA(t.accent, .30)}`);
    root.setAttribute('data-theme', t.theme === 'paper' ? '' : t.theme);
    root.style.setProperty('--font-display', `'${t.displayFont}', system-ui, sans-serif`);
  }, [t.accent, t.theme, t.displayFont]);

  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
  }

  function start() { setFunnel(true); }
  function nav(id) {
    if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  }

  if (window.location.pathname === "/admin") {
    return <AdminDashboard siteContent={siteContent} setSiteContent={setSiteContent} />;
  }

  return (
    <React.Fragment>
      <Header onStart={start} onNav={nav} sections={{ reviews: t.showReviews, about: t.showAbout }} />
      <main>
        <Hero onStart={start} t={t} content={siteContent.hero} contact={siteContent.contact} reviews={siteContent.reviews} images={siteContent.images} />
        <HowItWorks onStart={start} content={siteContent.process} />
        {t.showValues && <Values content={siteContent.values} />}
        {t.showReviews && <Reviews t={t} content={siteContent.reviews} />}
        {t.showAbout && <About onStart={start} content={siteContent.about} images={siteContent.images} />}
        <FAQ content={siteContent.faq} />
        <FinalCTA onStart={start} content={siteContent.finalCta} contact={siteContent.contact} hero={siteContent.hero} />
      </main>

      <Footer onNav={nav} onStart={start} />

      {funnel && <Funnel onClose={() => setFunnel(false)} t={t} />}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakRadio label="Base" value={t.theme} options={['paper', 'cool', 'dark']} onChange={v => setTweak('theme', v)} />
        <TweakColor label="Accent" value={t.accent}
          options={['#C8102E', '#B11226', '#A8331F', '#1F3A5F']} onChange={v => setTweak('accent', v)} />
        <TweakSelect label="Display font" value={t.displayFont}
          options={['Manrope', 'Inter']} onChange={v => setTweak('displayFont', v)} />

        <TweakSection label="Hero" />
        <TweakRadio label="Layout" value={t.heroLayout} options={['split', 'editorial']} onChange={v => setTweak('heroLayout', v)} />
        <TweakSelect label="Headline" value={t.headline}
          options={['default', 'speed', 'personal', 'concierge']} onChange={v => setTweak('headline', v)} />
        <TweakText label="Subhead" value={t.subhead} placeholder="Default subhead" onChange={v => setTweak('subhead', v)} />

        <TweakSection label="Social proof" />
        <TweakText label="Rating" value={t.rating} onChange={v => setTweak('rating', v)} />
        <TweakText label="Review count" value={t.reviewCount} onChange={v => setTweak('reviewCount', v)} />

        <TweakSection label="Sections" />
        <TweakToggle label="Why GoWithLaila" value={t.showValues} onChange={v => setTweak('showValues', v)} />
        <TweakToggle label="Reviews" value={t.showReviews} onChange={v => setTweak('showReviews', v)} />
        <TweakToggle label="About Laila" value={t.showAbout} onChange={v => setTweak('showAbout', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

function readLeads() {
  try {
    return JSON.parse(localStorage.getItem("gwl_leads") || "[]");
  } catch (e) {
    return [];
  }
}

function AdminDashboard({ siteContent, setSiteContent }) {
  const [leads, setLeads] = useAS(readLeads);
  const [query, setQuery] = useAS("");
  const [tab, setTab] = useAS("content");
  const filtered = leads.filter((lead) => {
    const haystack = JSON.stringify(lead).toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  function updateSiteContent(next) {
    setSiteContent(next);
    saveSiteContent(next);
  }

  function clearLeads() {
    localStorage.removeItem("gwl_leads");
    setLeads([]);
  }

  return (
    <React.Fragment>
      <Header onStart={() => { window.location.href = "/"; }} onNav={() => { window.location.href = "/"; }} sections={{ reviews: true, about: true }} />
      <main>
        <section className="section">
          <div className="wrap">
            <span className="eyebrow muted">GoWithLaila — Lead Management</span>
            <h1 className="display-face admin-title">Admin Dashboard</h1>
            <p className="admin-sub">Edit the public site, manage contact links, update reviews, and review incoming leads without touching code.</p>

            <div className="admin-tabs">
              <button className={tab === "content" ? "active" : ""} onClick={() => setTab("content")} type="button">Site Editor</button>
              <button className={tab === "leads" ? "active" : ""} onClick={() => setTab("leads")} type="button">Leads</button>
            </div>

            {tab === "content" && (
              <SiteContentEditor
                content={siteContent}
                onChange={updateSiteContent}
                onReset={() => updateSiteContent(resetSiteContent())}
              />
            )}

            {tab === "leads" && (
              <React.Fragment>
                <div className="admin-stats">
                  <div className="value"><h3>{leads.length}</h3><p>Total leads</p></div>
                  <div className="value"><h3>{leads.filter((l) => l.status === "New").length}</h3><p>New leads</p></div>
                  <div className="value"><h3>{leads.filter((l) => l.answers?.hasTrade === "Yes, I have a trade").length}</h3><p>Trade-ins</p></div>
                </div>

                <div className="admin-tools">
                  <input className="tinp" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, phone, email, vehicle..." />
                  <button className="btn btn-secondary" type="button" onClick={clearLeads}>Clear all</button>
                </div>

                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr><th>Created</th><th>Name</th><th>Contact</th><th>Request</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 && (
                        <tr><td colSpan="5">No leads yet. Submit the questionnaire to test the flow.</td></tr>
                      )}
                      {filtered.map((lead) => (
                        <tr key={lead.id}>
                          <td>{new Date(lead.createdAt).toLocaleString()}</td>
                          <td>{lead.contact?.name || "—"}</td>
                          <td>{lead.contact?.phone || "—"}<br />{lead.contact?.email || ""}</td>
                          <td>{lead.answers?.looking || "Vehicle match"} · {lead.answers?.budget || "budget TBD"}</td>
                          <td><span className="admin-pill">{lead.status || "New"}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </React.Fragment>
            )}
          </div>
        </section>
      </main>
      <Footer onNav={() => { window.location.href = "/"; }} onStart={() => { window.location.href = "/"; }} />
    </React.Fragment>
  );
}

function SiteContentEditor({ content, onChange, onReset }) {
  function patch(path, value) {
    const keys = path.split(".");
    const next = structuredClone(content);
    let target = next;
    keys.slice(0, -1).forEach((key) => { target = target[key]; });
    target[keys[keys.length - 1]] = value;
    onChange(next);
  }

  function patchArray(section, index, key, value) {
    const next = structuredClone(content);
    next[section].items[index][key] = value;
    onChange(next);
  }

  function addItem(section, item) {
    const next = structuredClone(content);
    next[section].items = [...next[section].items, item];
    onChange(next);
  }

  function removeItem(section, index) {
    const next = structuredClone(content);
    next[section].items = next[section].items.filter((_, i) => i !== index);
    onChange(next);
  }

  return (
    <div className="editor-stack">
      <div className="editor-card editor-card--notice">
        <div>
          <h2>Site Editor</h2>
          <p>Changes save immediately in this browser. This is the control-panel shape we can later connect to a real database.</p>
        </div>
        <button className="btn btn-secondary" type="button" onClick={onReset}>Reset defaults</button>
      </div>

      <EditorSection title="Hero">
        <TextField label="Role line" value={content.hero.roleLine} onChange={(v) => patch("hero.roleLine", v)} />
        <TextArea label="Headline" help="Use a new line for the red highlighted second line." value={content.hero.headline} onChange={(v) => patch("hero.headline", v)} />
        <TextArea label="Subhead" value={content.hero.subhead} onChange={(v) => patch("hero.subhead", v)} />
        <div className="editor-grid">
          <TextField label="Primary button" value={content.hero.primaryCta} onChange={(v) => patch("hero.primaryCta", v)} />
          <TextField label="Secondary button" value={content.hero.secondaryCta} onChange={(v) => patch("hero.secondaryCta", v)} />
        </div>
        <TextField label="Trust line" value={content.hero.trustLine} onChange={(v) => patch("hero.trustLine", v)} />
      </EditorSection>

      <EditorSection title="Contact Links">
        <TextField label="Real WhatsApp URL" value={content.contact.whatsappUrl} placeholder="Paste the confirmed wa.me link here" onChange={(v) => patch("contact.whatsappUrl", v)} />
      </EditorSection>

      <EditorSection title="Images">
        <div className="editor-grid">
          <TextField label="Hero image path/URL" value={content.images.hero} onChange={(v) => patch("images.hero", v)} />
          <TextField label="Hero label" value={content.images.heroLabel} onChange={(v) => patch("images.heroLabel", v)} />
        </div>
        <TextField label="Hero alt text" value={content.images.heroAlt} onChange={(v) => patch("images.heroAlt", v)} />
        <div className="editor-grid">
          <TextField label="About image path/URL" value={content.images.about} onChange={(v) => patch("images.about", v)} />
          <TextField label="About label" value={content.images.aboutLabel} onChange={(v) => patch("images.aboutLabel", v)} />
        </div>
        <TextField label="About alt text" value={content.images.aboutAlt} onChange={(v) => patch("images.aboutAlt", v)} />
        <div className="editor-grid editor-grid--3">
          <TextField label="Strip image 1" value={content.images.strip1} onChange={(v) => patch("images.strip1", v)} />
          <TextField label="Strip image 2" value={content.images.strip2} onChange={(v) => patch("images.strip2", v)} />
          <TextField label="Strip image 3" value={content.images.strip3} onChange={(v) => patch("images.strip3", v)} />
        </div>
        <div className="editor-grid editor-grid--3">
          <TextField label="Strip label 1" value={content.images.strip1Label} onChange={(v) => patch("images.strip1Label", v)} />
          <TextField label="Strip label 2" value={content.images.strip2Label} onChange={(v) => patch("images.strip2Label", v)} />
          <TextField label="Strip label 3" value={content.images.strip3Label} onChange={(v) => patch("images.strip3Label", v)} />
        </div>
      </EditorSection>

      <EditorSection title="How It Works">
        <TextField label="Eyebrow" value={content.process.eyebrow} onChange={(v) => patch("process.eyebrow", v)} />
        <TextField label="Heading" value={content.process.heading} onChange={(v) => patch("process.heading", v)} />
        <TextArea label="Subhead" value={content.process.subhead} onChange={(v) => patch("process.subhead", v)} />
        <EditableList
          items={content.process.items}
          section="process"
          onField={patchArray}
          onRemove={removeItem}
          fields={[
            ["h", "Step title"],
            ["p", "Step copy"],
          ]}
        />
        <button className="btn btn-secondary" type="button" onClick={() => addItem("process", { n: String(content.process.items.length + 1).padStart(2, "0"), ic: "message", h: "New step", p: "Add step copy here." })}>Add step</button>
      </EditorSection>

      <EditorSection title="Value Cards">
        <TextField label="Eyebrow" value={content.values.eyebrow} onChange={(v) => patch("values.eyebrow", v)} />
        <TextField label="Heading" value={content.values.heading} onChange={(v) => patch("values.heading", v)} />
        <EditableList
          items={content.values.items}
          section="values"
          onField={patchArray}
          onRemove={removeItem}
          fields={[
            ["h", "Card title"],
            ["p", "Card copy"],
          ]}
        />
        <button className="btn btn-secondary" type="button" onClick={() => addItem("values", { ic: "sparkles", h: "New value", p: "Add card copy here." })}>Add value card</button>
      </EditorSection>

      <EditorSection title="Reviews">
        <div className="editor-grid editor-grid--3">
          <TextField label="Rating" value={content.reviews.rating} onChange={(v) => patch("reviews.rating", v)} />
          <TextField label="Count" value={content.reviews.count} onChange={(v) => patch("reviews.count", v)} />
          <TextField label="Count label" value={content.reviews.countLabel} onChange={(v) => patch("reviews.countLabel", v)} />
        </div>
        <TextField label="Review source URL" value={content.reviews.sourceUrl} onChange={(v) => patch("reviews.sourceUrl", v)} />
        <TextField label="Reviews heading" value={content.reviews.heading} onChange={(v) => patch("reviews.heading", v)} />
        <EditableList
          items={content.reviews.items}
          section="reviews"
          onField={patchArray}
          onRemove={removeItem}
          fields={[
            ["name", "Name"],
            ["when", "Source/date"],
            ["body", "Review summary"],
          ]}
        />
        <button className="btn btn-secondary" type="button" onClick={() => addItem("reviews", { name: "New reviewer", init: "N", color: "#1F3A5F", when: "Google review", body: "Add review summary here." })}>Add review</button>
      </EditorSection>

      <EditorSection title="About">
        <TextField label="Eyebrow" value={content.about.eyebrow} onChange={(v) => patch("about.eyebrow", v)} />
        <TextField label="Heading" value={content.about.heading} onChange={(v) => patch("about.heading", v)} />
        <TextArea label="Quote" value={content.about.quote} onChange={(v) => patch("about.quote", v)} />
        <TextArea label="Body" value={content.about.body} onChange={(v) => patch("about.body", v)} />
      </EditorSection>

      <EditorSection title="FAQ">
        <TextField label="Eyebrow" value={content.faq.eyebrow} onChange={(v) => patch("faq.eyebrow", v)} />
        <TextField label="Heading" value={content.faq.heading} onChange={(v) => patch("faq.heading", v)} />
        <EditableList
          items={content.faq.items}
          section="faq"
          onField={patchArray}
          onRemove={removeItem}
          fields={[
            ["q", "Question"],
            ["a", "Answer"],
          ]}
        />
        <button className="btn btn-secondary" type="button" onClick={() => addItem("faq", { q: "New question?", a: "Add answer here." })}>Add FAQ</button>
      </EditorSection>

      <EditorSection title="Final CTA">
        <TextField label="Eyebrow" value={content.finalCta.eyebrow} onChange={(v) => patch("finalCta.eyebrow", v)} />
        <TextField label="Heading" value={content.finalCta.heading} onChange={(v) => patch("finalCta.heading", v)} />
        <TextArea label="Body" value={content.finalCta.body} onChange={(v) => patch("finalCta.body", v)} />
      </EditorSection>
    </div>
  );
}

function EditorSection({ title, children }) {
  return (
    <section className="editor-card">
      <h2>{title}</h2>
      <div className="editor-fields">{children}</div>
    </section>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="editor-field">
      <span>{label}</span>
      <input className="tinp" value={value || ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function TextArea({ label, value, onChange, help }) {
  return (
    <label className="editor-field">
      <span>{label}</span>
      {help && <small>{help}</small>}
      <textarea className="tinp editor-textarea" value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function EditableList({ items, section, fields, onField, onRemove }) {
  return (
    <div className="editable-list">
      {items.map((item, index) => (
        <div className="editable-item" key={`${section}-${index}`}>
          <div className="editable-item__head">
            <strong>{item.name || item.q || `Item ${index + 1}`}</strong>
            <button type="button" onClick={() => onRemove(section, index)}>Remove</button>
          </div>
          {fields.map(([key, label]) => (
            key === "body" || key === "a"
              ? <TextArea key={key} label={label} value={item[key]} onChange={(v) => onField(section, index, key, v)} />
              : <TextField key={key} label={label} value={item[key]} onChange={(v) => onField(section, index, key, v)} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
