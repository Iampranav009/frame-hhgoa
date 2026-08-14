// src/utils/canvasRenderer.js
// Hacker House Goa 2026 — canvas renderers.
//   renderPFP     : PFP frame (uses /pfp-frame.png overlay)
//   renderIDCard  : Builder ID card — uses /builder-id-frame-plate.png as the art,
//                   draws photo behind it + name/role/stack/number/QR/title on top.
//   preloadAssets : loads the plate + PFP frame, waits for fonts. Call once on mount.

const COL = {
  green: '#17703F',
  greenDeep: '#0C4A2D',
  greenDark: '#083420',
  yellow: '#FFD500',
  lime: '#AAD068',
  pink: '#E9227D',
  cream: '#F7F4E8',
  mute: '#B0C8AA',
  ink: '#0A281A',
};

// Fonts — add these to index.css (see note at the bottom of this file).
// They fall back gracefully if not loaded.
const F_MONO = "'JetBrains Mono', ui-monospace, monospace";
const F_BODY = "'Work Sans', system-ui, sans-serif";
const F_NAME = "'Big Shoulders Display', 'Arial Narrow', sans-serif";
const F_NUM = "'Outfit', system-ui, sans-serif";

// ── asset preload ─────────────────────────────────────────────────────────────
// Both files live in /public (Vite serves them at the site root).
const ASSET_SRCS = {
  idPlate: '/builder-id-frame-plate.png', // Builder ID card art (transparent arch)
  pfpFrame: '/pfp-frame.png',              // existing PFP frame overlay
};
const assets = {};
let assetsReady = false;

export function preloadAssets() {
  const load = (src) => new Promise((res) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => res(img);
    img.onerror = () => res(null); // don't hard-fail if one asset is missing
    img.src = encodeURI(src);
  });
  return Promise.all(
    Object.entries(ASSET_SRCS).map(async ([k, src]) => { assets[k] = await load(src); })
  ).then(async () => {
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) { } }
    assetsReady = true;
  });
}

// ── helpers ───────────────────────────────────────────────────────────────────
function setup(canvas, w, h) {
  const S = 2;                       // 2× supersampling for crisp export
  canvas.width = w * S;
  canvas.height = h * S;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(S, 0, 0, S, 0, 0);
  ctx.clearRect(0, 0, w, h);
  return ctx;
}

function roundRect(ctx, x, y, w, h, r) {
  if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); return; }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function archPath(ctx, x, y, w, h, rb) {
  const r = w / 2, cx = x + r, cy = y + r;
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);      // domed top
  ctx.lineTo(x + w, y + h - rb);
  ctx.arcTo(x + w, y + h, x + w - rb, y + h, rb); // bottom-right
  ctx.lineTo(x + rb, y + h);
  ctx.arcTo(x, y + h, x, y + h - rb, rb);         // bottom-left
  ctx.lineTo(x, y + r);
  ctx.closePath();
}

function tracked(ctx, text, cx, y, font, color, spacing, align = 'center') {
  ctx.save();
  ctx.font = font; ctx.fillStyle = color; ctx.textBaseline = 'middle';
  const widths = [...text].map((c) => ctx.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (text.length - 1);
  let x = align === 'center' ? cx - total / 2 : cx;
  [...text].forEach((c, i) => { ctx.fillText(c, x, y); x += widths[i] + spacing; });
  ctx.restore();
  return total;
}

function fitFont(ctx, text, maxW, family, weight, startPx) {
  let px = startPx;
  do { ctx.font = `${weight} ${px}px ${family}`; px -= 2; }
  while (ctx.measureText(text).width > maxW && px > 20);
  return ctx.font;
}

function luminance(hex) {
  const n = parseInt(hex, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function coverDraw(ctx, img, box, zoom, panX, panY) {
  const scale = Math.max(box.w / img.width, box.h / img.height) * (zoom || 1);
  const dw = img.width * scale, dh = img.height * scale;
  const dx = box.x + (box.w - dw) / 2 + (panX || 0);
  const dy = box.y + (box.h - dh) / 2 + (panY || 0);
  ctx.drawImage(img, dx, dy, dw, dh);
}

// stack icon tile (simple-icons object {path, hex})
function drawIconTile(ctx, icon, x, y, size) {
  ctx.save();
  roundRect(ctx, x, y, size, size, size * 0.24);
  ctx.fillStyle = COL.greenDeep; ctx.fill();
  const p = new Path2D(icon.path);
  const s = (size * 0.58) / 24;
  ctx.translate(x + size * 0.21, y + size * 0.21);
  ctx.scale(s, s);
  ctx.fillStyle = luminance(icon.hex) < 0.22 ? COL.cream : ('#' + icon.hex);
  ctx.fill(p);
  ctx.restore();
}

function field(ctx, w, h) {
  ctx.fillStyle = COL.green; ctx.fillRect(0, 0, w, h);
  const g = ctx.createRadialGradient(w / 2, h * 0.45, w * 0.15, w / 2, h * 0.5, w * 0.9);
  g.addColorStop(0, 'rgba(23,112,63,0)');
  g.addColorStop(1, 'rgba(8,52,32,0.85)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
}

// ══════════════════════════════════════════════════════════════════════════════
//  PFP FRAME  (1080×1080)
// ══════════════════════════════════════════════════════════════════════════════
export function renderPFP(canvas, { imageElement, zoom, panX, panY, name }) {
  const W = 1080, H = 1080;
  const ctx = setup(canvas, W, H);

  if (imageElement) {
    coverDraw(ctx, imageElement, { x: 0, y: 0, w: W, h: H }, zoom, panX, panY);
  } else {
    field(ctx, W, H);
    ctx.fillStyle = COL.mute; ctx.textAlign = 'center';
    ctx.font = `700 34px ${F_MONO}`;
    ctx.fillText('UPLOAD A PHOTO', W / 2, H / 2);
    ctx.textAlign = 'left';
  }

  if (assets.pfpFrame) ctx.drawImage(assets.pfpFrame, 0, 0, W, H);

  if (name) {
    ctx.save();
    ctx.fillStyle = COL.yellow;
    ctx.font = `700 26px ${F_MONO}`;
    ctx.fillText(name.toUpperCase(), 54, H - 54);
    ctx.restore();
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  BUILDER ID CARD  (1080×1800)  — plate overlay + live fields
// ══════════════════════════════════════════════════════════════════════════════
export function renderIDCard(canvas, {
  imageElement, zoom, panX, panY,
  name, role, builderTitle,
  stack = [], qrImage = null, handle = '', builderNo = '049',
}) {
  const W = 1080, H = 1800;
  const ctx = setup(canvas, W, H);

  // arch geometry — MUST match the plate PNG
  const aw = W * 0.60, ax = (W - aw) / 2, ay = H * 0.485, ah = H * 0.43, rb = W * 0.03;

  // (a) photo, clipped to the arch, behind the plate
  ctx.save();
  archPath(ctx, ax, ay, aw, ah, rb); ctx.clip();
  if (imageElement) {
    coverDraw(ctx, imageElement, { x: ax, y: ay, w: aw, h: ah }, zoom, panX, panY);
  } else {
    ctx.fillStyle = COL.greenDeep; ctx.fillRect(ax, ay, aw, ah);
    ctx.fillStyle = COL.mute; ctx.textAlign = 'center'; ctx.font = `400 22px ${F_MONO}`;
    ctx.fillText('YOUR PHOTO', ax + aw / 2, ay + ah * 0.5); ctx.textAlign = 'left';
  }
  ctx.restore();

  // (b) the plate art over everything (its transparent arch lets the photo show)
  if (assets.idPlate) ctx.drawImage(assets.idPlate, 0, 0, W, H);
  else field(ctx, W, H); // fallback so it never renders blank

  // (c) DYNAMIC content on top of the plate --------------------------------------

  // ROLE value (left column)
  ctx.fillStyle = COL.cream; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.font = `700 32px ${F_BODY}`;
  const roleWords = (role || 'BUILDER').toUpperCase().split(' ');
  if (roleWords.length > 1) {
    ctx.fillText(roleWords[0], W * 0.135, H * 0.243);
    ctx.fillText(roleWords.slice(1).join(' '), W * 0.135, H * 0.243 + 42);
  } else {
    ctx.fillText(roleWords[0], W * 0.135, H * 0.255);
  }

  // STACK tiles (center column) — up to 4
  const isz = W * 0.062, gap = W * 0.018, sx = W * 0.48, sy = H * 0.231;
  stack.slice(0, 4).forEach((ic, i) => drawIconTile(ctx, ic, sx + i * (isz + gap), sy, isz));

  // BUILDER NO. value
  ctx.fillStyle = COL.yellow; ctx.font = `800 130px ${F_NUM}`; ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(builderNo, W * 0.10, H * 0.406);

  // QR panel (upper-right) — only when a handle exists
  if (qrImage) {
    const qs = W * 0.185, qx = W * 0.72, qy = H * 0.332, qpad = W * 0.026;
    ctx.save();
    roundRect(ctx, qx - qpad, qy - qpad, qs + qpad * 2, qs + qpad * 2, W * 0.03);
    ctx.fillStyle = COL.greenDeep; ctx.fill();
    ctx.drawImage(qrImage, qx, qy, qs, qs);
    tracked(ctx, `SCAN · @${handle}`.slice(0, 22), qx + qs / 2, qy + qs + qpad + 4,
      `700 13px ${F_MONO}`, COL.mute, 1);
    ctx.restore();
  }

  // NAME on the (baked) lime swash — auto-shrink to fit
  ctx.save();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = COL.ink;
  fitFont(ctx, (name || 'YOUR NAME').toUpperCase(), W * 0.60, F_NAME, 700, 95);
  ctx.fillText((name || 'YOUR NAME').toUpperCase(), W / 2, H * 0.493);
  ctx.restore();

  // BUILDER-TITLE pill (over arch bottom)
  const title = (builderTitle || 'SUSEGAD SHIPPER').toUpperCase();
  ctx.save();
  ctx.font = `700 26px ${F_MONO}`;
  const tw = ctx.measureText(title).width;
  const pw = tw + W * 0.10, px0 = W / 2 - pw / 2, pyTop = H * 0.885, pph = W * 0.066;
  roundRect(ctx, px0, pyTop, pw, pph, pph / 2); ctx.fillStyle = COL.pink; ctx.fill();
  roundRect(ctx, px0, pyTop, pw, pph, pph / 2);
  ctx.strokeStyle = COL.yellow; ctx.lineWidth = W * 0.004; ctx.stroke();
  tracked(ctx, title, W / 2, pyTop + pph / 2, `700 26px ${F_MONO}`, COL.yellow, 1);
  ctx.restore();
}

/*  ── index.css: add this line so the canvas fonts match ──────────────────────
@import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@700;800&family=Work+Sans:wght@700&display=swap');
    (If you skip this, it still renders with system fallbacks.)
---------------------------------------------------------------------------- */