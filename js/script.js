import { esgData } from './data/data.js';

document.addEventListener("DOMContentLoaded", () => {
    const slidesToLoad = [
        { selector: ".slide.zero", html: "/pages/welcome.html", css: "/css/welcome-styles.css" },
        { selector: ".slide.one",  html: "/pages/page-one.html", css: "/css/page-one-styles.css" }
        // voeg later .two, .three … toe
    ];

    slidesToLoad.forEach(slide => {
        const element = document.querySelector(slide.selector);
        fetch(slide.html)
            .then(r => r.text())
            .then(data => {
                element.innerHTML = data;
                const link = document.createElement("link");
                link.rel = "stylesheet"; link.href = slide.css;
                document.head.appendChild(link);
            })
            .catch(err => console.error(err));
    });

    // carousel activeren zodra alles klaar is
    window.addEventListener("load", () => {
        const steps = document.querySelectorAll(".step");
        const left  = document.querySelector(".arrow.left");
        const right = document.querySelector(".arrow.right");
        if (!steps.length || !left || !right) return;

        let current = 0;
        const show = idx => {
            steps.forEach(s => s.classList.remove("active"));
            steps[idx].classList.add("active");
        };
        right.addEventListener("click", () => {
            current = (current + 1) % steps.length; show(current);
        });
        left.addEventListener("click", () => {
            current = (current - 1 + steps.length) % steps.length; show(current);
        });
        show(0);
    });
});