// This is a utility script to generate favicon files using the browser
// You can run this in the browser console after opening the SVG

function generateFavicon() {
  const canvas = document.createElement("canvas");
  const sizes = [16, 32, 48, 64, 128, 192, 512];

  sizes.forEach((size) => {
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    // Draw the favicon from the SVG
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);

      // Convert to data URL and log (you can download from here)
      const dataUrl = canvas.toDataURL("image/png");
      console.log(`Size ${size}x${size}:`, dataUrl);

      // Create download link
      const link = document.createElement("a");
      link.download = `favicon-${size}x${size}.png`;
      link.href = dataUrl;
      link.click();
    };
    img.src = "favicon.svg";
  });
}

// Uncomment to run the generator
// generateFavicon();
