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
