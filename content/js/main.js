document.addEventListener("scroll", () => {
  const isScrolled = window.scrollY > 10;
  document.body.classList.toggle("is-scrolled", isScrolled);
});

const menuButtons = document.querySelectorAll(".top-nav-menu-button");
menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    menuButtons.forEach((otherButton) => {
      if (otherButton != button) {
        otherButton.classList.remove("open-menu");
      }
    });
    if (button.classList.contains("open-menu")) {
      button.classList.remove("open-menu");
    } else {
      button.classList.add("open-menu");
    }
  });
});

function openMobileMenu() {
  document.getElementById("mobile-menu").classList.add("mobile-menu-open");
  document.getElementById("overlay").classList.add("active");
}

function closeMobileMenu() {
  document.getElementById("mobile-menu").classList.remove("mobile-menu-open");
  document.getElementById("overlay").classList.remove("active");
}

document
  .getElementById("mobile-menu-button")
  .addEventListener("click", openMobileMenu);
document
  .getElementById("mobile-menu-close-button")
  .addEventListener("click", closeMobileMenu);

document.addEventListener("click", function (e) {
  const isMenuButton = e.target.closest(".top-nav-menu-button");
  const isMobileMenu = e.target.closest("#mobile-menu");
  const isMobileMenuButton = e.target.closest("#mobile-menu-button");
  const isGuideToggle = e.target.closest("#guide-menu-toggle");

  if (!isMenuButton) {
    document.querySelectorAll(".top-nav-menu-button").forEach((button) => {
      button.classList.remove("open-menu");
    });
  }

  if (!isMobileMenu && !isMobileMenuButton) {
    document
      .getElementById("mobile-menu")
      ?.classList.remove("mobile-menu-open");
  }

  if (!isGuideToggle) {
    document.getElementById("guide-menu")?.classList.remove("active");
  }

  if (!isMobileMenuButton && !isGuideToggle && !isMobileMenu) {
    document.getElementById("overlay")?.classList.remove("active");
  }
});

const takeOffButton = document.querySelector(".take-off-button");
const takeOffText = document.querySelector(".take-off-button-text");
const takeOffIcon = document.querySelector(".take-off-icon");

takeOffButton.addEventListener("mouseenter", () => {
  takeOffText.style.animation = "none";
  takeOffIcon.style.animation = "none";
  void takeOffText.offsetWidth;
  void takeOffIcon.offsetWidth;
  takeOffText.style.animation = "take-off-text 1s 0.25s";
  takeOffIcon.style.animation = "take-off 2s";
});

// Language toggle functionality - More robust version
document.addEventListener('DOMContentLoaded', function() {
  const languageToggle = document.getElementById('language-toggle');
  
  if (languageToggle) {
    // Remove any existing event listeners to prevent duplicates
    languageToggle.removeEventListener('click', handleLanguageToggle);
    
    // Add the click handler
    languageToggle.addEventListener('click', handleLanguageToggle);
    
    // Keyboard support
    languageToggle.removeEventListener('keydown', handleLanguageKeydown);
    languageToggle.addEventListener('keydown', handleLanguageKeydown);
  }
});

function handleLanguageToggle(event) {
  event.preventDefault();
  event.stopPropagation();
  
  const currentLang = this.getAttribute('data-current-lang');
  const targetUrl = currentLang === 'en' ? this.getAttribute('data-nl-url') : this.getAttribute('data-en-url');
  
  if (targetUrl && targetUrl !== '#') {
    // Add a small delay to show the button press animation
    this.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 150);
  }
}

function handleLanguageKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleLanguageToggle.call(this, event);
  }
}

// Also try to bind the language toggle immediately in case DOMContentLoaded already fired
setTimeout(function() {
  const languageToggle = document.getElementById('language-toggle');
  if (languageToggle && !languageToggle.hasAttribute('data-listener-bound')) {
    languageToggle.addEventListener('click', handleLanguageToggle);
    languageToggle.addEventListener('keydown', handleLanguageKeydown);
    languageToggle.setAttribute('data-listener-bound', 'true');
  }
}, 100);

