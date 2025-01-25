// Toggle Hamburger Menu in Mobile View
const menuIcon = document.getElementById('menu-icon');
const sideMenu = document.getElementById('side-menu');
const navbar = document.querySelector('.navbar');

// Open/close the side menu on hamburger click (Mobile)
menuIcon.addEventListener('click', () => {
    const isOpen = sideMenu.style.right === '0px';
    sideMenu.style.right = isOpen ? '-250px' : '0px'; // Slide out/in
    navbar.classList.toggle('active'); // Toggle navbar active class for mobile view
});

// Add smooth scrolling for desktop view
document.querySelectorAll('.navbar a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Highlight Active Section on Scroll (Desktop)
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
