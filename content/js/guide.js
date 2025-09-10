// Add error handling and ensure elements exist before using them
let sections, buttons, topbar, codeBlocks;

try {
  sections = document.querySelectorAll("#content section");
  buttons = document.querySelectorAll(".guide-button");
  topbar = document.querySelector("header");
  codeBlocks = document.querySelectorAll("code");
} catch (error) {
  console.error("Error initializing guide page elements:", error);
}

const getTopOffset = () =>
  window.matchMedia("(max-width: 1170px)").matches ? 80 : 140;

let scrollLock = false;

// Only proceed if buttons exist
if (buttons && buttons.length > 0) {
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      try {
        const targetId = button.getAttribute("data-target");
        const target = document.getElementById(targetId);
        const topOffset = getTopOffset();
        const targetPosition = target.offsetTop - topOffset;

        scrollLock = true;

        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        setTimeout(() => {
          scrollLock = false;
          updateActiveButton();
        }, 1000);
      } catch (error) {
        console.error("Error in button click handler:", error);
      }
    });
  });
}

function updateActiveButton() {
  if (scrollLock) return;

  try {
    const viewportHeight = window.innerHeight;
    const topOffset = getTopOffset();
    let maxVisibleArea = 0;
    let currentSectionId = "";

    if (sections && sections.length > 0) {
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const visibleTop = Math.max(rect.top, topOffset);
        const visibleBottom = Math.min(rect.bottom, viewportHeight);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        if (visibleHeight > maxVisibleArea) {
          maxVisibleArea = visibleHeight;
          currentSectionId = section.id;
        }
      });
    }

    if (buttons && buttons.length > 0) {
      buttons.forEach((button) => {
        button.classList.toggle(
          "active",
          button.getAttribute("data-target") === currentSectionId
        );
      });
    }
  } catch (error) {
    console.error("Error in updateActiveButton:", error);
  }
}

// Only proceed if codeBlocks exist
if (codeBlocks && codeBlocks.length > 0) {
  codeBlocks.forEach((codeBlock) => {
    codeBlock.addEventListener("click", () => {
      try {
        const text = codeBlock.innerText;
        navigator.clipboard
          .writeText(text)
          .then(() => {
            const toast = document.getElementById("toast");
            if (toast) {
              toast.classList.add("toast-visible");
              setTimeout(() => {
                toast.classList.remove("toast-visible");
              }, 2000);
            }
          })
          .catch((err) => console.error("Failed to copy: ", err));
      } catch (error) {
        console.error("Error in codeBlock click handler:", error);
      }
    });
  });
}

window.addEventListener("scroll", updateActiveButton);
window.addEventListener("resize", updateActiveButton);

function toggleMobileGuideMenu() {
  try {
    const guideMenu = document.getElementById("guide-menu");
    const overlay = document.getElementById("overlay");
    
    if (guideMenu) {
      guideMenu.classList.toggle("active");
    }
    if (overlay) {
      overlay.classList.toggle("active");
    }
  } catch (error) {
    console.error("Error in toggleMobileGuideMenu:", error);
  }
}

// Add event listener for guide menu toggle if the element exists
const guideMenuToggle = document.getElementById("guide-menu-toggle");
if (guideMenuToggle) {
  guideMenuToggle.addEventListener("click", toggleMobileGuideMenu);
}
