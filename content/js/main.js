document.addEventListener('scroll', () => {
    const isScrolled = window.scrollY > 10;
    document.body.classList.toggle('is-scrolled', isScrolled);
});

const menuButtons = document.querySelectorAll('.top-nav-menu-button');
menuButtons.forEach(button => {
    button.addEventListener("click", () => {
        menuButtons.forEach(otherButton => {
            if (otherButton != button) {
                otherButton.classList.remove("open-menu")
            }
        })
        if (button.classList.contains("open-menu")) {
            button.classList.remove("open-menu")
        } else {
            button.classList.add("open-menu")
        }
    })
})

function openMobileMenu() {
    document.getElementById("mobile-menu").classList.add("mobile-menu-open")
    document.getElementById("overlay").classList.add("active")
}

function closeMobileMenu() {
    document.getElementById("mobile-menu").classList.remove("mobile-menu-open")
    document.getElementById("overlay").classList.remove("active")
}

document.getElementById("mobile-menu-button").addEventListener("click", openMobileMenu)
document.getElementById("mobile-menu-close-button").addEventListener("click", closeMobileMenu)

document.addEventListener("click", function (e) {
    if (!e.target.closest('.top-nav-menu-button')) {
        const menuButtons = document.querySelectorAll('.top-nav-menu-button');
        menuButtons.forEach(button => {
            button.classList.remove("open-menu")
        })
    }
    if (!e.target.closest('#mobile-menu') && !e.target.closest('#mobile-menu-button')) {
        closeMobileMenu()
    }
})
