document.addEventListener("DOMContentLoaded", () => {
    const slidesToLoad = [
        { selector: ".slide.zero", html: "/pages/slide-start.html", css: "/css/slide-start-styles.css" },
        { selector: ".slide.one", html: "/pages/page-one.html", css: "/css/page-one-styles.css" }
    ];

    slidesToLoad.forEach(slide => {
        const element = document.querySelector(slide.selector);

        fetch(slide.html)
            .then(response => {
                if (!response.ok) throw new Error(`Kan ${slide.html} niet laden`);
                return response.text();
            })
            .then(data => {
                element.innerHTML = data;

                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = slide.css;
                document.head.appendChild(link);
            })
            .catch(error => console.error("Fout bij het laden van de slide:", error));
    });
});
