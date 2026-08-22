function scaleToFit() {
  const wrapper = document.getElementById('page-wrapper');
  
  // Base design dimensions
  const baseWidth = 600;
  const baseHeight = 800;
  
  // Current browser window dimensions
  const winWidth = window.innerWidth;
  const winHeight = window.innerHeight;
  
  // Determine the best scale factor (maintaining aspect ratio)
  const scale = Math.min(winWidth / baseWidth, winHeight / baseHeight);
  
  // Apply the CSS transform scale
  wrapper.style.transform = `scale(${scale})`;
}

// Run on load and whenever the window is resized
window.addEventListener('resize', scaleToFit);
window.addEventListener('DOMContentLoaded', scaleToFit);

