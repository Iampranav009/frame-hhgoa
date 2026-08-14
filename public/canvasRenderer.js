/**
 * Canvas Renderer — HH Goa 2026 PFP Generator
 * - Draws user photo clipped to a circle
 * - Overlays pfp-frame.png on top
 * - Renders user name in bottom-left corner area
 *
 * Output: 1080 × 1080 px (square, matching the frame PNG)
 */

// The circle center & radius are relative to 1080×1080.
// Measured from the actual pfp-frame.png (visually ~55% wide circle centered horizontally, starts at ~20% from top)
const W = 1080;
const H = 1080;
const CIRCLE_CX = W * 0.5;      // center X
const CIRCLE_CY = H * 0.455;    // center Y  (slightly above midpoint)
const CIRCLE_R  = W * 0.355;    // radius ~383px at 1080

let frameImg = null;

function loadFrame() {
  return new Promise((resolve) => {
    if (frameImg) { resolve(frameImg); return; }
    const img = new Image();
    img.onload = () => { frameImg = img; resolve(img); };
    img.onerror = () => resolve(null);
    img.src = '/pfp-frame.png';
  });
}

/**
 * Main render function.
 * @param {HTMLCanvasElement} canvas
 * @param {{ imageElement: HTMLImageElement|null, zoom: number, panX: number, panY: number, name: string }} opts
 */
export async function renderPFP(canvas, opts) {
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // 1. White/dark background
  ctx.fillStyle = '#063A1A';
  ctx.fillRect(0, 0, W, H);

  // 2. Draw user photo clipped to the circular hole
  if (opts.imageElement) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(CIRCLE_CX, CIRCLE_CY, CIRCLE_R, 0, Math.PI * 2);
    ctx.clip();

    const img = opts.imageElement;
    const zoom  = opts.zoom  || 1;
    const panX  = opts.panX  || 0;
    const panY  = opts.panY  || 0;

    // Cover-fit inside the circle bounding box
    const bw = CIRCLE_R * 2;
    const bh = CIRCLE_R * 2;
    const iAspect = img.width / img.height;
    let drawW, drawH;
    if (iAspect > 1) { drawH = bh * zoom; drawW = drawH * iAspect; }
    else             { drawW = bw * zoom; drawH = drawW / iAspect; }
    if (drawW < bw * zoom) { drawW = bw * zoom; drawH = drawW / iAspect; }
    if (drawH < bh * zoom) { drawH = bh * zoom; drawW = drawH * iAspect; }

    const drawX = CIRCLE_CX - drawW / 2 + panX;
    const drawY = CIRCLE_CY - drawH / 2 + panY;
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  } else {
    // Placeholder circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(CIRCLE_CX, CIRCLE_CY, CIRCLE_R, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = `500 22px 'Space Grotesk', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Upload your photo', CIRCLE_CX, CIRCLE_CY);
    ctx.restore();
  }

  // 3. Overlay the PFP frame on top
  const frame = await loadFrame();
  if (frame) {
    ctx.drawImage(frame, 0, 0, W, H);
  }

  // 4. Draw name in bottom-left corner (inside the bottom area of the frame)
  const name = (opts.name || '').trim();
  if (name) {
    const FONT_SIZE = 28;
    const PADDING_X = 52;
    const PADDING_Y = H - 148; // just above the "#FRAMEINGOA" pill

    // Small dark pill background
    ctx.font = `700 ${FONT_SIZE}px 'Space Grotesk', sans-serif`;
    const textW = ctx.measureText(name).width;
    const pillPad = 14;
    const pillH = FONT_SIZE + pillPad * 2;
    const pillW = textW + pillPad * 3;

    ctx.fillStyle = 'rgba(6,26,10,0.72)';
    ctx.beginPath();
    ctx.roundRect(PADDING_X - pillPad, PADDING_Y - FONT_SIZE - pillPad + 4, pillW, pillH, 6);
    ctx.fill();

    // White name text
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(name, PADDING_X, PADDING_Y);
  }
}

const ID_W = 1080;
const ID_H = 1350;

export async function renderIDCard(canvas, opts) {
  canvas.width = ID_W;
  canvas.height = ID_H;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#063A1A';
  ctx.fillRect(0, 0, ID_W, ID_H);
  
  // Inner border
  ctx.strokeStyle = '#FEE101'; // yellow
  ctx.lineWidth = 12;
  ctx.strokeRect(30, 30, ID_W - 60, ID_H - 60);
  
  // Header text
  ctx.fillStyle = '#FEE101';
  ctx.font = `800 48px 'Space Grotesk', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('HACKER HOUSE GOA 2026', ID_W / 2, 70);

  // Photo
  const photoW = 600;
  const photoH = 600;
  const photoX = (ID_W - photoW) / 2;
  const photoY = 160;

  if (opts.imageElement) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(photoX, photoY, photoW, photoH, 30);
    ctx.clip();
    
    const img = opts.imageElement;
    const zoom  = opts.zoom  || 1;
    const panX  = opts.panX  || 0;
    const panY  = opts.panY  || 0;

    const iAspect = img.width / img.height;
    let drawW, drawH;
    if (iAspect > 1) { drawH = photoH * zoom; drawW = drawH * iAspect; }
    else             { drawW = photoW * zoom; drawH = drawW / iAspect; }
    if (drawW < photoW * zoom) { drawW = photoW * zoom; drawH = drawW / iAspect; }
    if (drawH < photoH * zoom) { drawH = photoH * zoom; drawW = drawH * iAspect; }

    const drawX = photoX + photoW / 2 - drawW / 2 + panX;
    const drawY = photoY + photoH / 2 - drawH / 2 + panY;
    
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.roundRect(photoX, photoY, photoW, photoH, 30);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = `500 24px 'Space Grotesk', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Upload photo', photoX + photoW / 2, photoY + photoH / 2);
  }

  // Photo outline
  ctx.strokeStyle = '#FF2D78'; // pink
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, 30);
  ctx.stroke();

  // Name
  const name = (opts.name || 'YOUR NAME').trim().toUpperCase();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 80px 'Space Grotesk', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(name, ID_W / 2, photoY + photoH + 60);

  // Stack / Role
  const role = (opts.role || 'HACKER').trim().toUpperCase();
  ctx.fillStyle = '#FEE101';
  ctx.font = `600 40px 'Space Mono', monospace`;
  ctx.fillText(role, ID_W / 2, photoY + photoH + 160);

  // Builder Title
  const title = (opts.builderTitle || '10X ENGINEER').trim().toUpperCase();
  ctx.fillStyle = '#FF2D78';
  ctx.font = `600 32px 'Space Mono', monospace`;
  ctx.fillText(`✦ ${title} ✦`, ID_W / 2, photoY + photoH + 240);

  // Footer / Branding
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = `500 28px 'Space Grotesk', sans-serif`;
  ctx.fillText("INDIA'S BIGGEST 4-DAY BUILD-STATION", ID_W / 2, ID_H - 140);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('OCT 28-31, GOA', ID_W / 2, ID_H - 100);
}
