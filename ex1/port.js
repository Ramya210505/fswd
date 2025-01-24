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

// Typing Effect
const typedText = ["Tech Innovator", "Web Developer", "UI/UX Designer"];
let i = 0, currentText = "", letterIndex = 0;

function typeTextEffect() {
    currentText = typedText[i];
    document.querySelector(".multiple-text").textContent = currentText.slice(0, ++letterIndex);
    
    if (letterIndex === currentText.length) {
        letterIndex = 0;
        i = (i + 1) % typedText.length; // Loop to next text
        setTimeout(typeTextEffect, 2000); // Wait before restarting
    } else {
        setTimeout(typeTextEffect, 100);
    }
}

typeTextEffect();

// Active Section Highlight
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

// Contact Form Submission
const contactForm = document.querySelector(".contact-form");
contactForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent actual form submission
    const name = contactForm.querySelector("input[type='text']").value.trim();
    const email = contactForm.querySelector("input[type='email']").value.trim();
    const message = contactForm.querySelector("textarea").value.trim();

    if (name && email && message) {
        alert("Thank you for contacting me! I'll get back to you soon.");
        contactForm.reset(); // Clear the form
    } else {
        alert("Please fill out all the fields before submitting.");
    }
});
