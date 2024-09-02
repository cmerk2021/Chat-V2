
async function Fingerprint() {
  try {

    // Create a canvas element and draw a pattern
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = "rgb(255,0,255)";
  ctx.beginPath();
  ctx.rect(20, 20, 150, 100);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.fillStyle = "rgb(0,255,255)";
  ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  // Draw text and rectangle
  const txt = "abz190#$%^@£éú";
  ctx.textBaseline = "top";
  ctx.font = '17px "Arial 17"';
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgb(255,5,5)";
  ctx.rotate(0.03);
  ctx.fillText(txt, 4, 17);
  ctx.fillStyle = "rgb(155,255,5)";
  ctx.shadowBlur = 8;
  ctx.shadowColor = "red";
  ctx.fillRect(20, 12, 100, 5);

    // Get the canvas data URL
    const canvasData = canvas.toDataURL();

    // Calculate a hash
    const hash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(canvasData & canvasData)
    );

    // Convert the hash to a hexadecimal string
    const fingerprint = Array.from(new Uint8Array(hash))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');

    await fingerprint;
    return fingerprint;
  } catch (error) {
    console.error('Error getting canvas fingerprint:', error);
    return null;
  }
}

export default Fingerprint;