document.addEventListener("DOMContentLoaded", () => {
  const compareBtn = document.getElementById("compare-btn");
  const backBtn = document.getElementById("back-btn");
  const homeScreen = document.querySelector(".home-screen");
  const compareView = document.getElementById("compare-view");
  const track = document.getElementById("compare-track");

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
      <img src="/img/${c1}.svg" alt="${c1}" class="country-img" />
      <img src="/img/${c2}.svg" alt="${c2}" class="country-img" />
    `;

    // reset scrollpositie
    compareView.scrollTo({ left: 0 });

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
