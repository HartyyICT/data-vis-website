/**
 * Plaatst willekeurige dieren (bijv. herten.svg) op beide landen,
 * binnen een bepaald gebied, vergelijkbaar met de bomen.
 * @param {number} count - aantal dieren per land
 * @param {"top"|"bottom"} position - of het bovenste of onderste land is
 * @param {string} countryName - landnaam
 * @param {object} countryData - data-object uit JSON
 */
function spawnAnimals(count, position, countryName, countryData) {
  const track = document.getElementById("compare-track");
  const compareView = document.getElementById("compare-view");
  const img1 = document.getElementById("img1");
  if (!track || !compareView || !img1) return;

  const ensureReady = () => {
    const w = img1.clientWidth;
    const h = compareView.clientHeight;
    if (w === 0 || h === 0) { requestAnimationFrame(ensureReady); return; }

    const halfH = h / 2;
    const GREEN_TOP_RATIO = 0.7;
    const GREEN_BOTTOM_RATIO = 0.6;
    const zoneStart = w * 0.0;
    const zoneEnd = w * 0.16;
    const zoneWidth = Math.max(0, zoneEnd - zoneStart - 48);

    const randX = () => zoneStart + Math.random() * zoneWidth;
    const randScale = () => 0.9 + Math.random() * 0.2;


    const randY = () => {
      const yMin = (position === "top")
        ? halfH * GREEN_TOP_RATIO
        : halfH + halfH * GREEN_TOP_RATIO;
      const yMax = (position === "top")
        ? halfH * GREEN_BOTTOM_RATIO
        : halfH + halfH * GREEN_BOTTOM_RATIO;
      return yMin + Math.random() * (yMax - yMin);
    };

    let popup = document.getElementById("animal-popup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "animal-popup";
      popup.className = "animal-popup";
      document.body.appendChild(popup);
    }

    // 🦌 dieren genereren
    for (let i = 0; i < count; i++) {
      const animal = document.createElement("img");
      animal.src = "/img/hert.svg"; // jouw hert-afbeelding
      animal.className = "animal";
      animal.style.left = `${randX()}px`;
      animal.style.top = `${randY()}px`;
      animal.style.transform = `scale(${randScale()})`;
      track.appendChild(animal);

      // Klikinteractie
      animal.addEventListener("click", (e) => {
        const threatened = countryData["Mammal species, threatened"]["2018"];
        popup.innerHTML = `
          <button class="close-animal">×</button>
          <div class="popup-content">
            <strong>${countryName.toUpperCase()}</strong><br>
            🦌 Bedreigde zoogdieren: <b>${threatened}</b><br><br>
            In ${countryName} staan steeds meer zoogdieren onder druk door ontbossing
            en klimaatverandering. Dit aantal vertegenwoordigt soorten die risico lopen
            op uitsterven.
          </div>
        `;

        popup.style.left = e.pageX + "px";
        popup.style.top = e.pageY + "px";
        popup.style.display = "block";

        const closeBtn = popup.querySelector(".close-animal");
        closeBtn.addEventListener("click", () => {
          popup.style.display = "none";
        });
      });
    }
  };

  requestAnimationFrame(ensureReady);
}
