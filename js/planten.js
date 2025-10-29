/**
 * Plaatst planten (planten.svg) op een land binnen het groene gebied
 * gebaseerd op de waarde van "Agriculture, forestry, and fishing, value added (% of GDP)".
 * @param {number} count - aantal planten
 * @param {"top"|"bottom"} position
 * @param {string} countryName
 * @param {object} countryData
 */
function spawnPlants(count, position, countryName, countryData) {
  const track = document.getElementById("compare-track");
  const compareView = document.getElementById("compare-view");
  const img1 = document.getElementById("img1");
  if (!track || !compareView || !img1) return;

  const ensureReady = () => {
    const w = img1.clientWidth;
    const h = compareView.clientHeight;
    if (w === 0 || h === 0) {
      requestAnimationFrame(ensureReady);
      return;
    }

    const halfH = h / 2;
    const GREEN_TOP_RATIO = 0.75;
    const GREEN_BOTTOM_RATIO = 0.85;
    const zoneStart = w * 0.18;
    const zoneEnd = w * 0.23;
    const zoneWidth = Math.max(0, zoneEnd - zoneStart - 48);

    const randX = () => zoneStart + Math.random() * zoneWidth;
    const randY = () => {
      const yMin =
        position === "top"
          ? halfH * GREEN_TOP_RATIO
          : halfH + halfH * GREEN_TOP_RATIO;
      const yMax =
        position === "top"
          ? halfH * GREEN_BOTTOM_RATIO
          : halfH + halfH * GREEN_BOTTOM_RATIO;
      return yMin + Math.random() * (yMax - yMin);
    };

    // Popup aanmaken
    let popup = document.getElementById("plant-popup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "plant-popup";
      popup.className = "plant-popup";
      document.body.appendChild(popup);
    }

    // 🌿 Planten genereren
    for (let i = 0; i < count; i++) {
      const plant = document.createElement("img");
      plant.src = "/img/planten.svg";
      plant.className = "plant";
      plant.style.left = `${randX()}px`;
      plant.style.top = `${randY()}px`;
      track.appendChild(plant);

      // Klik → popup
      plant.addEventListener("click", (e) => {
        const forestryValue =
          countryData["Agriculture, forestry, and fishing, value added (% of GDP)"]["2021"];
        const formattedValue = forestryValue ? forestryValue.toFixed(2) : "n.v.t.";
        let story = "";

        if (forestryValue < 2) {
          story = `${countryName} heeft een zeer kleine bijdrage uit landbouw, bosbouw en visserij (${formattedValue}%). 
          Dit wijst op een sterk geïndustrialiseerde of dienstgerichte economie.`;
        } else if (forestryValue < 10) {
          story = `In ${countryName} speelt landbouw en bosbouw een bescheiden maar stabiele rol in de economie (${formattedValue}%). 
          Er is vaak sprake van duurzaam beheer van natuurlijke hulpbronnen.`;
        } else {
          story = `Landbouw, bosbouw en visserij vormen een groot deel van de economie van ${countryName} (${formattedValue}%). 
          Dit duidt op een sterke afhankelijkheid van natuurlijke hulpbronnen.`;
        }

        popup.innerHTML = `
          <button class="close-plant">×</button>
          <div class="popup-content">
            <strong>${countryName.toUpperCase()}</strong><br>
            🌾 Landbouw, bosbouw & visserij: ${formattedValue}% van het BBP<br><br>
            <em>${story}</em>
          </div>
        `;

        // popuppositie binnen het scherm houden
        popup.style.left = Math.min(e.pageX, window.innerWidth - 280) + "px";
        popup.style.top = Math.min(e.pageY, window.innerHeight - 180) + "px";
        popup.style.display = "block";
        popup.classList.add("show");

        const closeBtn = popup.querySelector(".close-plant");
        closeBtn.addEventListener("click", () => {
          popup.classList.remove("show");
          setTimeout(() => (popup.style.display = "none"), 300);
        });
      });
    }
  };

  requestAnimationFrame(ensureReady);
}
