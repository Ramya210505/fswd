// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        target.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    });
});

// Hamburger Menu Toggle
const menuIcon = document.getElementById("menu-icon");
const navbar = document.querySelector(".navbar");

menuIcon.addEventListener("click", () => {
    navbar.classList.toggle("active");
    menuIcon.classList.toggle("bx-x"); // Change icon when menu is toggled
});

// Close navbar when clicking on a link (for smaller screens)
navbar.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navbar.classList.remove("active");
        menuIcon.classList.remove("bx-x");
    });
});

// Typing Effect (For dynamic title in Home Section)
const typedText = ["Tech Innovator", "Web Developer", "UI/UX Designer"];
let i = 0, currentText = "";

function typeTextEffect() {
    currentText = typedText[i];
    document.querySelector(".multiple-text").textContent = currentText;
    i = (i + 1) % typedText.length; // Move to the next phrase
    setTimeout(typeTextEffect, 5000); // Change every 5 seconds
}

typeTextEffect();

// Highlight Active Section in Navbar
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar a");

window.addEventListener("scroll", () => {
    let scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 70; // Offset for fixed header
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${sectionId}`) {
                    link.classList.add("active");
                }
            });
        }
    });
});
