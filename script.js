// script.js

// Smooth entry animation for sections
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  sections.forEach((section, i) => {
    section.style.opacity = 0;
    section.style.transform = "translateY(30px)";
    setTimeout(() => {
      section.style.transition = "all 0.8s ease";
      section.style.opacity = 1;
      section.style.transform = "translateY(0)";
    }, 200 + i * 150);
  });
});

// Optional: attempt iframe height auto-resize using postMessage (must be supported by iframe content)
window.addEventListener("message", (event) => {
  if (event.origin.includes("carrd.co") && event.data.height && event.source) {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      if (iframe.contentWindow === event.source) {
        iframe.style.height = `${event.data.height}px`;
      }
    });
  }
});
