/**
 * Plaatst vissen (vis.svg) in het blauwe gedeelte van elk land
 * gebaseerd op 'Fishing production index (2014-2016 = 100)' data.
 * @param {number} count - aantal vissen
 * @param {"top"|"bottom"} position
 * @param {string} countryName
 * @param {object} countryData
 */
function spawnFish(count, position, countryName, countryData) {
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
    const WATER_TOP_RATIO = 0.58;
    const WATER_BOTTOM_RATIO = 0.8;

    const zoneStart = w * 0.2;
    const zoneEnd = w * 0.38;
    const zoneWidth = Math.max(0, zoneEnd - zoneStart - 48);

    const randX = () => zoneStart + Math.random() * zoneWidth;
    const randY = () => {
      const yMin =
        position === "top"
          ? halfH * WATER_TOP_RATIO
          : halfH + halfH * WATER_TOP_RATIO;
      const yMax =
        position === "top"
          ? halfH * WATER_BOTTOM_RATIO
          : halfH + halfH * WATER_BOTTOM_RATIO;
      return yMin + Math.random() * (yMax - yMin);
    };

    // popup aanmaken
    let popup = document.getElementById("fish-popup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "fish-popup";
      popup.className = "fish-popup";
      document.body.appendChild(popup);
    }

    // 🐟 vissen genereren
    for (let i = 0; i < count; i++) {
      const fish = document.createElement("img");
      fish.src = "/img/vis.svg";
      fish.className = "fish";
      fish.style.left = `${randX()}px`;
      fish.style.top = `${randY()}px`;

      // random richting (links of rechts)
      const flip = Math.random() < 0.5 ? -1 : 1;
      fish.style.transform = `scaleX(${flip})`;

      track.appendChild(fish);

      // klikinteractie
      fish.addEventListener("click", (e) => {
        const fishing = countryData["Fishing production index (2014-2016 = 100)"]["2021"];
        const fishingFormatted = fishing ? fishing.toFixed(1) : "n.v.t.";
        let story = "";

        if (fishing < 90) {
          story = `In ${countryName} is de visserijproductie gedaald (${fishingFormatted}). 
          Dit kan wijzen op overbevissing of strengere milieuregels.`;
        } else if (fishing < 110) {
          story = `De visserij in ${countryName} is stabiel (${fishingFormatted}). 
          Er lijkt een evenwicht te zijn tussen vangst en natuurbehoud.`;
        } else {
          story = `De visserijproductie in ${countryName} is toegenomen (${fishingFormatted}). 
          Dit kan duiden op economische groei, maar ook druk op ecosystemen.`;
        }

        popup.innerHTML = `
          <button class="close-fish">×</button>
          <div class="popup-content">
            <strong>${countryName.toUpperCase()}</strong><br>
            🐟 Visserijproductie-index: ${fishingFormatted}<br><br>
            <em>${story}</em>
          </div>
        `;

        // positie en binnen-scherm correctie
        const popupRect = popup.getBoundingClientRect();
        let newLeft = e.pageX;
        let newTop = e.pageY;

        if (popupRect.width + newLeft > window.innerWidth - 20) {
          newLeft = window.innerWidth - popupRect.width - 20;
        }
        if (popupRect.height + newTop > window.innerHeight - 20) {
          newTop = window.innerHeight - popupRect.height - 20;
        }

        popup.style.left = `${newLeft}px`;
        popup.style.top = `${newTop}px`;
        popup.style.display = "block";
        popup.classList.add("show");

        // sluitknop
        const closeBtn = popup.querySelector(".close-fish");
        closeBtn.addEventListener("click", () => {
          popup.classList.remove("show");
          setTimeout(() => (popup.style.display = "none"), 300);
        });
      });
    }
  };

  requestAnimationFrame(ensureReady);
}
