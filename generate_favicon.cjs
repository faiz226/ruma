const Jimp = require('jimp');

async function createFavicon() {
  try {
    // Load the logo
    const logo = await Jimp.read('public/logo.png');
    
    // Create a new image with white background (512x512)
    const bg = new Jimp(512, 512, '#FFFFFF');
    
    // Scale logo if it's too big, or just composite it
    // First, let's scale the logo to fit within 400x400 to give it some padding
    logo.scaleToFit(400, 400);
    
    // Calculate center position
    const x = (512 - logo.bitmap.width) / 2;
    const y = (512 - logo.bitmap.height) / 2;
    
    // Composite the logo onto the white background
    bg.composite(logo, x, y);
    
    // Save as favicon.ico and favicon.png
    await bg.writeAsync('public/favicon.png');
    await bg.writeAsync('public/favicon.ico');
    console.log("Successfully created favicon with white background!");
  } catch (err) {
    console.error("Error creating favicon:", err);
  }
}

createFavicon();
