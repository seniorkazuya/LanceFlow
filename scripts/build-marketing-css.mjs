#!/usr/bin/env node
/**
 * Sync html/style.css → apps/web/src/styles/marketing.css (scoped under .marketing-site).
 * Preserves app-specific tail sections after MARKER.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'html', 'style.css');
const targetPath = path.join(root, 'apps', 'web', 'src', 'styles', 'marketing.css');
const MARKER = '/* __MARKETING_APP_EXTENSIONS__ */';

const source = readFileSync(sourcePath, 'utf8');
const existing = readFileSync(targetPath, 'utf8');

const SITE_MENU_START = '/* ---------- Unified site header + menu drawer ---------- */';
const APPLY_START = '/* ---------- Apply form (HIRE-001) ---------- */';

function extractSection(css, startMarker, endMarker) {
  const start = css.indexOf(startMarker);
  if (start === -1) return '';
  const end = endMarker ? css.indexOf(endMarker, start + startMarker.length) : css.length;
  return css.slice(start, end === -1 ? css.length : end).trimEnd() + '\n\n';
}

const siteMenuExtras = extractSection(existing, SITE_MENU_START, '/* ---------- Hero / Slider ---------- */');
let appTailBody = existing.includes(APPLY_START)
  ? existing.slice(existing.indexOf(APPLY_START))
  : '';
const OLD_AUTH_START = '/* ---------- Auth pages ---------- */';
const APP_LAYOUT_START = '/* ---------- App layout (landing-style header + footer) ---------- */';
if (
  appTailBody.includes(OLD_AUTH_START) &&
  appTailBody.includes(APP_LAYOUT_START) &&
  appTailBody.indexOf(OLD_AUTH_START) < appTailBody.indexOf(APP_LAYOUT_START)
) {
  appTailBody =
    appTailBody.slice(0, appTailBody.indexOf(OLD_AUTH_START)) +
    appTailBody.slice(appTailBody.indexOf(APP_LAYOUT_START));
}
const appTail = existing.includes(MARKER)
  ? existing.slice(existing.indexOf(MARKER))
  : appTailBody
    ? `${MARKER}\n${appTailBody}`
    : `${MARKER}\n`;

const HEADER = `/* Auto-synced from html/style.css — run: node scripts/build-marketing-css.mjs */
html:has(.marketing-site),
html.dark:has(.marketing-site),
html:has(.marketing-site) body,
html.dark:has(.marketing-site) body {
  background: #ffffff !important;
  background-image: none !important;
  color: #0e1c3a;
}
html:has(.marketing-site) {
  scroll-behavior: smooth;
}
.marketing-site *,
.marketing-site *::before,
.marketing-site *::after {
  box-sizing: border-box;
}
.marketing-site :where(h1,h2,h3,h4,h5,h6,p,ul,ol,figure,blockquote,dl,dd) {
  margin: 0;
  padding: 0;
}

`;

function prefixSelector(selector) {
  return selector
    .split(',')
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed || trimmed.startsWith('.marketing-site')) return trimmed;
      if (trimmed === 'html' || trimmed === 'body') return '.marketing-site';
      return `.marketing-site ${trimmed}`;
    })
    .join(', ');
}

function scopeSelectorsInCss(css) {
  let result = '';
  let i = 0;

  while (i < css.length) {
    while (i < css.length && /\s/.test(css[i])) {
      result += css[i];
      i += 1;
    }

    if (i >= css.length) break;

    if (css.startsWith('/*', i)) {
      const end = css.indexOf('*/', i + 2);
      const sliceEnd = end === -1 ? css.length : end + 2;
      result += css.slice(i, sliceEnd);
      i = sliceEnd;
      continue;
    }

    if (css[i] === '@') {
      const brace = css.indexOf('{', i);
      if (brace === -1) {
        result += css.slice(i);
        break;
      }
      result += css.slice(i, brace + 1);
      i = brace + 1;

      let depth = 1;
      const innerStart = i;
      while (i < css.length && depth > 0) {
        if (css[i] === '{') depth += 1;
        if (css[i] === '}') depth -= 1;
        i += 1;
      }
      const inner = css.slice(innerStart, i - 1);
      result += scopeSelectorsInCss(inner);
      result += '}';
      continue;
    }

    const brace = css.indexOf('{', i);
    if (brace === -1) {
      result += css.slice(i);
      break;
    }

    const selector = css.slice(i, brace).trim();
    result += selector.startsWith('.marketing-site') ? `${selector}{` : `${prefixSelector(selector)}{`;
    i = brace + 1;

    let depth = 1;
    const bodyStart = i;
    while (i < css.length && depth > 0) {
      if (css[i] === '{') depth += 1;
      if (css[i] === '}') depth -= 1;
      i += 1;
    }
    result += css.slice(bodyStart, i - 1);
    result += '}';
  }

  return result;
}

function scopeCss(css) {
  let prepared = css.replace(/^\*\{[^}]*\}\s*/m, '');
  prepared = prepared.replace(/^html\{[^}]*\}\s*/m, '');

  const bodyMatch = prepared.match(/^body\s*\{([\s\S]*?)\}\s*/m);
  const bodyInner = bodyMatch?.[1]?.trim() ?? '';
  prepared = prepared.replace(/^body\s*\{[\s\S]*?\}\s*/m, '');

  prepared = prepared.replace(/:root\s*\{([\s\S]*?)\}/m, (_, rootInner) => {
    const merged = [rootInner.trim(), bodyInner].filter(Boolean).join('\n');
    return `.marketing-site {\n${merged}\n}\n`;
  });

  return scopeSelectorsInCss(prepared);
}

const AUTH_EXTRAS = `
/* Auth pages (signin.html / signup.html) */
.marketing-site .auth-wrap{display:grid;place-items:center}
.marketing-site .auth{
  min-height:calc(100vh - 72px);display:grid;place-items:center;padding:48px 0;
  background:radial-gradient(1000px 480px at 88% -8%,rgba(34,201,193,.14),transparent 60%),
             radial-gradient(900px 460px at 8% 0%,rgba(46,107,255,.12),transparent 58%),var(--bg-soft)
}
.marketing-site .auth-card{width:100%;max-width:480px;background:#fff;border:1px solid var(--line);
  border-radius:var(--radius);box-shadow:var(--shadow);padding:40px 36px}
.marketing-site .auth-card--signin{max-width:440px}
.marketing-site .auth-head{text-align:center;margin-bottom:28px}
.marketing-site .auth-head h1{font-size:1.7rem;margin-bottom:8px}
.marketing-site .auth-head p{color:var(--ink-soft);font-size:.95rem}
.marketing-site .auth-card .btn{width:100%;margin-top:6px}
.marketing-site .btn-social{display:inline-flex;align-items:center;justify-content:center;gap:10px}
.marketing-site .btn-social-icon{width:18px;height:18px;flex:none}
.marketing-site .field-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.marketing-site .field-row label{margin-bottom:0}
.marketing-site .field-row a{font-size:.85rem;font-weight:600;color:var(--brand)}
.marketing-site .remember{display:flex;align-items:center;gap:9px;font-size:.92rem;color:var(--ink-soft);margin:4px 0 20px}
.marketing-site .remember input{width:16px;height:16px;accent-color:var(--brand)}
.marketing-site .auth-divider{display:flex;align-items:center;gap:14px;color:var(--ink-soft);font-size:.82rem;margin:24px 0}
.marketing-site .auth-divider::before,.marketing-site .auth-divider::after{content:"";flex:1;height:1px;background:var(--line)}
.marketing-site .btn-social{background:#fff;color:var(--ink);border-color:var(--line-strong);width:100%;margin-bottom:12px}
.marketing-site .btn-social:hover{border-color:var(--brand-2);color:var(--brand-2)}
.marketing-site .btn-social--unconfigured{opacity:.72;cursor:not-allowed}
.marketing-site .btn-social--unconfigured:hover{transform:none;border-color:var(--line-strong);color:var(--ink)}
.marketing-site .auth-foot{text-align:center;margin-top:24px;font-size:.92rem;color:var(--ink-soft)}
.marketing-site .auth-foot a{color:var(--brand);font-weight:700}
.marketing-site .field-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.marketing-site .role-tabs{display:flex;gap:10px;margin-bottom:18px}
.marketing-site .role-tabs label{flex:1;cursor:pointer;position:relative}
.marketing-site .role-tabs input{position:absolute;opacity:0;width:0;height:0}
.marketing-site .role-pill{display:block;text-align:center;font-weight:700;font-size:.9rem;color:var(--ink-soft);
  padding:11px 10px;border:1px solid var(--line-strong);border-radius:12px;transition:.2s}
.marketing-site .role-tabs input:checked + .role-pill{background:var(--grad);color:#fff;border-color:transparent;
  box-shadow:0 10px 24px -14px rgba(46,107,255,.8)}
.marketing-site .field select{
  width:100%;padding:13px 15px;border:1px solid var(--line-strong);border-radius:12px;font:inherit;
  background:#fff;color:var(--ink);cursor:pointer;appearance:none;-webkit-appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%2346557a' d='M6 8 0 0h12z'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 16px center;padding-right:38px
}
.marketing-site .terms{display:flex;align-items:flex-start;gap:10px;font-size:.88rem;color:var(--ink-soft);margin:6px 0 20px;line-height:1.45}
.marketing-site .terms input{width:16px;height:16px;margin-top:2px;flex:none;accent-color:var(--brand)}
.marketing-site .terms a{color:var(--brand);font-weight:600}
.marketing-site .field-error{display:block;margin-top:6px;font-size:.88rem;font-weight:600;color:#c62828}
.marketing-site .form-banner{padding:12px 14px;border-radius:12px;font-size:.92rem;font-weight:600;line-height:1.5;margin-bottom:16px}
.marketing-site .form-banner-success{background:rgba(43,193,192,.12);border:1px solid rgba(43,193,192,.35);color:var(--ink)}
.marketing-site .form-banner-error{background:rgba(198,40,40,.08);border:1px solid rgba(198,40,40,.25);color:#8b1a1a}
@media(max-width:520px){ .marketing-site .field-grid{grid-template-columns:1fr} }

`;

writeFileSync(
  targetPath,
  HEADER + scopeCss(source) + AUTH_EXTRAS + siteMenuExtras + appTail,
  'utf8'
);
console.log('Wrote', targetPath);
