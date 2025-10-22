document.addEventListener("DOMContentLoaded", () => {
  const compareBtn = document.getElementById("compare-btn");
  const backBtn = document.getElementById("back-btn");
  const homeScreen = document.querySelector(".home-screen");
  const compareView = document.getElementById("compare-view");
  const track = document.getElementById("compare-track");

  // Mapping van Nederlandse landnamen naar Engelse keys in de JSON
  const countryKey = {
    "nederland": "netherlands",
    "brazilie": "brazil",
    "australie": "australia",
    "verenigde-staten": "united-states",
    "zweden": "sweden",
    "india": "india"
  };

  // Hier is de vergelijk functie
  compareBtn.addEventListener("click", () => {
    const c1 = document.getElementById("country1").value;
    const c2 = document.getElementById("country2").value;

    if (!c1 || !c2) {
      alert("Selecteer twee landen.");
      return;
    }
    if (c1 === c2) {
      alert("Kies twee verschillende landen.");
      return;
    }

    // Hier laat hij de vergelijking zien en gaat de home screen weg
    homeScreen.style.display = "none";
    compareView.style.display = "block";

    // Beide landen op elkaar zetten
    track.innerHTML = `
      <img src="/img/${c1}.svg" alt="${c1}" class="country-img" id="img1" />
      <img src="/img/${c2}.svg" alt="${c2}" class="country-img" id="img2" />
    `;

    // reset scrollpositie
    compareView.scrollTo({ left: 0 });

    // JSON-bestand laden
    fetch("/data/esg-selected-countries.json")
      .then((r) => r.json())
      .then((data) => {
        console.log("✅ ESG-data geladen:", data);

        // Mapping gebruiken voor correcte key in JSON
        const key1 = countryKey[c1];
        const key2 = countryKey[c2];

        // Voor nu toon data in console voor debugging
        console.log(`Data voor ${c1}:`, data[key1]);
        console.log(`Data voor ${c2}:`, data[key2]);

        // later hover-interacties toevoegen:
        // Bijvoorbeeld: hover op land toon specifieke waarde
        const img1 = document.getElementById("img1");
        const img2 = document.getElementById("img2");

        // Wacht even tot DOM echt geladen is
        requestAnimationFrame(() => {
          if (!img1 || !img2) {
            console.error("Afbeeldingen niet gevonden, kan geen eventlistener toevoegen.");
            return;
          }

          img1.addEventListener("mousemove", () => {
            const value = data[key1]["Life expectancy at birth, total (years)"]["2020"];
            console.log(`${c1} - Life expectancy 2020:`, value);
          });

          img2.addEventListener("mousemove", () => {
            const value = data[key2]["Life expectancy at birth, total (years)"]["2020"];
            console.log(`${c2} - Life expectancy 2020:`, value);
          });
        });
      })
      .catch((err) => console.error("Fout bij laden van JSON:", err));

    // horizontaal scrollen inschakelen met muiswiel
    enableHorizontalScroll(compareView);
  });

  // terugknop
  backBtn.addEventListener("click", () => {
    compareView.style.display = "none";
    homeScreen.style.display = "flex";
  });
});

/**
 * Zorgt dat verticale muiswielbeweging horizontaal scrolt.
 * @param {HTMLElement} element - de container waarop gescrold wordt
 */
function enableHorizontalScroll(element) {
  element.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        element.scrollLeft += e.deltaY;
      }
    },
    { passive: false }
  );
}
