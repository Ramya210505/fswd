/*==========================
 Mobile Menu
===========================*/

let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {

    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');

};

/*==========================
 Sticky Header
===========================*/

let header = document.querySelector('.header');

window.addEventListener('scroll', () => {

    header.classList.toggle('sticky', window.scrollY > 80);

});

/*==========================
 Active Navigation
===========================*/

let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('.navbar a');

window.onscroll = () => {

    sections.forEach(sec => {

        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height){

            navLinks.forEach(link => {

                link.classList.remove('active');

                document.querySelector('.navbar a[href*=' + id + ']')
                .classList.add('active');

            });

        }

    });

};

/*==========================
 Close Menu on Click
===========================*/

navLinks.forEach(link=>{

    link.addEventListener('click',()=>{

        navbar.classList.remove('active');
        menuIcon.classList.remove('bx-x');

    });

});

/*==========================
 Scroll Reveal Animation
===========================*/

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{
    threshold:0.2
});

document.querySelectorAll(
'.skill-box,.timeline-box,.experience-box,.project-box,.certificate-box,.about-content,.home-content'
).forEach(el=>{

    el.classList.add("hidden");
    observer.observe(el);

});

/*==========================
 Smooth Button Hover
===========================*/

const buttons=document.querySelectorAll(".btn");

buttons.forEach(btn=>{

    btn.addEventListener("mouseenter",()=>{

        btn.style.transform="translateY(-6px) scale(1.05)";

    });

    btn.addEventListener("mouseleave",()=>{

        btn.style.transform="translateY(0) scale(1)";

    });

});

/*==========================
 Contact Form
===========================*/

const form=document.querySelector("form");

form.addEventListener("submit",(e)=>{

    e.preventDefault();

    alert("✅ Thank You! Your message has been sent successfully.");

    form.reset();

});

/*==========================
 Typing Effect
===========================*/

const roles=[

"Software Developer",
"Java Programmer",
"UI/UX Designer",
"Data Analyst",
"Web Developer"

];

let roleIndex=0;
let charIndex=0;
let deleting=false;

const text=document.querySelector(".home-content span");

function typeEffect(){

    let current=roles[roleIndex];

    if(!deleting){

        text.textContent=current.substring(0,charIndex++);

        if(charIndex>current.length){

            deleting=true;

            setTimeout(typeEffect,1500);

            return;

        }

    }
    else{

        text.textContent=current.substring(0,charIndex--);

        if(charIndex===0){

            deleting=false;

            roleIndex++;

            if(roleIndex===roles.length){

                roleIndex=0;

            }

        }

    }

    setTimeout(typeEffect,deleting?50:120);

}

typeEffect();

/*==========================
 Current Year Footer
===========================*/

const footer=document.querySelector(".footer-text p");

const year=new Date().getFullYear();

footer.innerHTML=
`Copyright © ${year} | Designed by <strong>Ramya S</strong> | All Rights Reserved.`;

/*==========================
 Profile Image Rotation
===========================*/

const profile=document.querySelector(".home-img img");

profile.addEventListener("mouseover",()=>{

    profile.style.transform="rotate(5deg) scale(1.05)";

});

profile.addEventListener("mouseleave",()=>{

    profile.style.transform="rotate(0deg) scale(1)";

});
