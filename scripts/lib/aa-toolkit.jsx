// aa-toolkit.jsx — shared React pieces for the tools (tools programme, M0b).
//
// Loaded only on pages that host a tool (dist/lib/aa-toolkit.<hash>.js, listed
// in TOOL_LIBS in page-tools.jsx), never in the shared bundle. Registers
// window.AAToolkit = { DateField, Tablist, toIso, isoToDmy }; the tool-chunk
// prelude reads it on first render.
(function () {
'use strict';
// ---- Dates you can type, paste or pick -------------------------------
// A bare <input type="date"> refuses a pasted "10/02/2026" and hands back
// nothing to copy, which is the first thing anyone working through a list
// of leavers wants to do. This takes the formats people actually hold —
// a spreadsheet cell, an offer letter, an ISO string — and keeps the
// native picker beside it.
const PAD2 = (n) => (n < 10 ? '0' + n : '' + n);
const MON_NUM = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
// Returns an ISO date, '' for empty, or null when it cannot be read.
const toIso = (txt, strict) => {
  let s = String(txt == null ? '' : txt).trim().replace(/,/g, ' ').replace(/\s+/g, ' ');
  // A cell pasted from a spreadsheet or a system export usually drags a time
  // along with it: "01/03/2021 00:00", "2021-03-01 00:00:00", "… 9:30 AM".
  s = s.replace(/[ T]\d{1,2}:\d{2}(:\d{2})?(\.\d+)?\s*([AaPp][Mm])?$/, '').trim();
  if (!s) return '';
  const m = s.match(/^(\d{1,4})[\/\-. ](\d{1,2}|[A-Za-z]{3,9})[\/\-. ](\d{1,4})$/);
  if (!m) return null;
  // While the user is still typing, a 1-3 digit year is an unfinished 4-digit
  // year, not a 2-digit one: without this, "01/03/2021" passes through 2002
  // and 2020 on its way, and the result panel jumps with it.
  if (strict && m[1].length !== 4 && m[3].length !== 4) return null;
  const mid = m[2];
  const mo = /^\d+$/.test(mid) ? Number(mid) : MON_NUM[mid.slice(0, 3).toLowerCase()];
  if (!mo) return null;
  let d, y;
  if (m[1].length === 4) { y = Number(m[1]); d = Number(m[3]); }   // 2026-02-10
  else { d = Number(m[1]); y = Number(m[3]); }                     // 10/02/2026, 10-Feb-26
  if (y < 100) y += y < 70 ? 2000 : 1900;
  if (!(d >= 1 && d <= 31 && mo >= 1 && mo <= 12 && y >= 1900 && y <= 2999)) return null;
  const probe = new Date(Date.UTC(y, mo - 1, d));
  if (probe.getUTCDate() !== d || probe.getUTCMonth() !== mo - 1) return null;   // 31 February
  return y + '-' + PAD2(mo) + '-' + PAD2(d);
};
const isoToDmy = (iso) => { const p = String(iso || '').split('-'); return p.length === 3 && p[0] ? p[2] + '/' + p[1] + '/' + p[0] : ''; };

// Declared once at module level, so its identity is stable across renders: a
// component declared inside a render is a new type on every keystroke, React
// remounts the input, and the field loses focus after one character.
function DateField({ id, value, onIso, style, label, describedBy }) {
  const [txt, setTxt] = React.useState(isoToDmy(value));
  const [bad, setBad] = React.useState(false);
  const pick = React.useRef(null);
  const mine = React.useRef(value);
  // Follow the value when something ELSE sets it — "Use today", the picker —
  // but never overwrite what the user is typing.
  React.useEffect(() => {
    if ((value || '') !== (mine.current || '')) { mine.current = value; setTxt(isoToDmy(value)); setBad(false); }
  }, [value]);
  const emit = (v) => { mine.current = v; if (v !== (value || '')) onIso(v); };
  // An unreadable box must not leave the PREVIOUS date quietly in force: the
  // panel would keep showing money for a date no longer on screen, and the
  // branded statement would print it. Empty out instead, so the result
  // honestly falls back to "—".
  const type = (raw) => {
    setTxt(raw);
    setBad(false);                       // never red mid-keystroke; judged on blur
    const iso = toIso(raw, true);
    emit(iso === null ? '' : iso);
  };
  const blur = () => {
    const iso = toIso(txt);              // relaxed: a 2-digit year is fine now
    if (!txt.trim()) { setBad(false); emit(''); return; }
    if (iso) { setTxt(isoToDmy(iso)); setBad(false); emit(iso); return; }
    setBad(true); emit('');
  };
  const openPicker = () => {
    const el = pick.current;
    if (!el) return;
    try { if (el.showPicker) { el.showPicker(); return; } } catch (e) { /* needs a gesture, or unsupported */ }
    el.focus();
  };
  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id} value={txt} onChange={(e) => type(e.target.value)} onBlur={blur}
        placeholder="dd/mm/yyyy" autoComplete="off" spellCheck={false}
        aria-invalid={bad ? 'true' : undefined}
        aria-describedby={bad ? id + '-err' : describedBy}
        style={{ ...style, paddingRight: 40, border: bad ? '1px solid #C0392B' : (style && style.border) }}
      />
      <input
        ref={pick} type="date" tabIndex={-1} aria-hidden="true" value={value || ''}
        onChange={(e) => { mine.current = e.target.value; onIso(e.target.value); }}
        style={{ position: 'absolute', right: 34, bottom: 6, width: 1, height: 1, opacity: 0, padding: 0, border: 0, pointerEvents: 'none' }}
      />
      <button
        type="button" onClick={openPicker} title="Pick from a calendar"
        aria-label={'Pick ' + (label || 'a date') + ' from a calendar'}
        style={{ position: 'absolute', right: 1, top: 1, bottom: 1, width: 36, minHeight: 0, border: 0, background: 'none', cursor: 'pointer', color: 'var(--aa-steel)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </button>
      {bad ? <p id={id + '-err'} role="alert" style={{ fontSize: 11.5, color: '#C0392B', margin: '5px 0 0', lineHeight: 1.45 }}>That is not a date we can read. Try 30/09/2026, 2026-09-30 or 30 Sep 2026 — or use the calendar.</p> : null}
    </div>
  );
}

// N-tab tablist: the WAI-ARIA tabs pattern with a roving tabindex, so the set
// is one stop in the tab order and Arrow, Home and End move between tabs.
// Tab ids are `${id}-tab-${tab}` and panels `${id}-panel-${tab}`, as the
// gratuity tool used before this was shared. With more than three tabs the row
// scrolls inside itself instead of squeezing labels, so a phone never scrolls
// the page sideways.
function Tablist({ id, label, tabs, value, onChange }) {
  const n = tabs.length;
  const many = n > 3;
  const move = (e, i) => {
    let j = null;
    if (e.key === 'ArrowRight') j = (i + 1) % n;
    else if (e.key === 'ArrowLeft') j = (i - 1 + n) % n;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = n - 1;
    if (j === null) return;
    e.preventDefault();
    onChange(tabs[j].id);
    const el = document.getElementById(id + '-tab-' + tabs[j].id);
    if (el) el.focus();
  };
  const style = (t, i) => ({
    flex: many ? '1 0 auto' : 1, padding: '13px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
    fontFamily: 'var(--aa-font-sans)', textAlign: 'center',
    background: value === t.id ? 'var(--aa-charcoal)' : '#fff',
    color: value === t.id ? '#fff' : 'var(--aa-steel-700)',
    border: '1px solid var(--aa-rule)', borderBottom: value === t.id ? '1px solid var(--aa-charcoal)' : '1px solid var(--aa-rule)',
    borderRight: i < n - 1 ? 'none' : '1px solid var(--aa-rule)',
  });
  return (
    <div role="tablist" aria-label={label} style={many ? { display: 'flex', overflowX: 'auto' } : { display: 'flex' }}>
      {tabs.map((t, i) => (
        <button key={t.id} type="button" role="tab" id={id + '-tab-' + t.id} aria-selected={value === t.id} aria-controls={id + '-panel-' + t.id}
          tabIndex={value === t.id ? 0 : -1} onClick={() => onChange(t.id)} onKeyDown={(e) => move(e, i)} style={style(t, i)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

window.AAToolkit = { DateField: DateField, Tablist: Tablist, toIso: toIso, isoToDmy: isoToDmy };
})();
