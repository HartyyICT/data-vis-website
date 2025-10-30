/**
 * plaatst boomstammen op een land binnen het groene gebied
 * gebaseerd op tree cover loss data.
 * @param {number} count - aantal stammen
 * @param {"top"|"bottom"} position
 * @param {string} countryName
 * @param {object} countryData
 */

// pak de meest recente waarde uit de data
function getLatestValue(countryData, indicator, preferredYears = ["2023","2022","2021","2020","2019","2018"]) {
  const series = countryData?.[indicator];
  if (!series || typeof series !== "object") return null;

  for (const y of preferredYears) {
    const v = series[y];
    if (v !== undefined && v !== null && v !== "") return parseFloat(v);
  }

  const years = Object.keys(series)
    .filter(k => !isNaN(Number(k)) && series[k] !== "" && series[k] != null)
    .sort((a,b) => Number(b) - Number(a));
  return years.length ? parseFloat(series[years[0]]) : null;
}

function spawnTreeStumps(count, position, countryName, countryData) {
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
    const GREEN_TOP_RATIO = 0.7;
    const GREEN_BOTTOM_RATIO = 0.8;
    const zoneStart = w * 0.15;
    const zoneEnd = w * 0.18;
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

    let popup = document.getElementById("stam-popup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "stam-popup";
      popup.className = "stam-popup";
      document.body.appendChild(popup);
    }

    // stammen genereren
    for (let i = 0; i < count; i++) {
      const stump = document.createElement("img");
      stump.src = "/img/boomstam.svg";
      stump.className = "stam";
      stump.style.left = `${randX()}px`;
      stump.style.top = `${randY()}px`;
      track.appendChild(stump);

      // popup met data
      stump.addEventListener("click", (e) => {
        const loss = getLatestValue(countryData, "Tree cover loss (ha)");

        if (loss == null) {
          popup.innerHTML = `
            <button class="close-stam">×</button>
            <div class="popup-content">
              <strong>${countryName.toUpperCase()}</strong><br>
              🌲 Geen recente data beschikbaar over bosverlies.
            </div>
          `;
        } else {
          const lossFormatted = Math.round(loss).toLocaleString();
          let story = "";

          if (loss < 1000) {
            story = `In ${countryName} blijft het bos grotendeels intact. Slechts ${lossFormatted} hectare aan bomen verdween dit jaar.`;
          } else if (loss < 50000) {
            story = `De bossen in ${countryName} krimpen gestaag — ${lossFormatted} hectare aan bomen verdween in het afgelopen jaar.`;
          } else {
            story = `In ${countryName} verdwijnen enorme delen bos: ${lossFormatted} hectare ging verloren. Dit heeft grote gevolgen voor natuur en klimaat.`;
          }

          popup.innerHTML = `
            <button class="close-stam">×</button>
            <div class="popup-content">
              <strong>${countryName.toUpperCase()}</strong><br>
              🌲 Verloren bosgebied: ${lossFormatted} hectare<br><br>
              <em>${story}</em>
            </div>
          `;
        }

        // popup binnen scherm
        const popupWidth = 280, popupHeight = 200;
        const left = Math.min(e.pageX, window.innerWidth - popupWidth - 20);
        const top  = Math.min(e.pageY, window.innerHeight - popupHeight - 20);
        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
        popup.style.display = "block";
        popup.classList.add("show");

        popup.querySelector(".close-stam").addEventListener("click", () => {
          popup.classList.remove("show");
          setTimeout(() => (popup.style.display = "none"), 300);
        });
      });
    }
  };

  requestAnimationFrame(ensureReady);
}
