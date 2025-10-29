/**
 * Plaatst boomstammen (boomstam.svg) op een land binnen het groene gebied
 * gebaseerd op 'Tree cover loss' data.
 * @param {number} count - aantal stammen
 * @param {"top"|"bottom"} position
 * @param {string} countryName
 * @param {object} countryData
 */
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

    // Maak popup indien nodig
    let popup = document.getElementById("stam-popup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "stam-popup";
      popup.className = "stam-popup";
      document.body.appendChild(popup);
    }

    // 🌲 Stammen genereren
    for (let i = 0; i < count; i++) {
      const stump = document.createElement("img");
      stump.src = "/img/boomstam.svg";
      stump.className = "stam";
      stump.style.left = `${randX()}px`;
      stump.style.top = `${randY()}px`;
      track.appendChild(stump);

      // 📊 Popup met data
      stump.addEventListener("click", (e) => {
        const loss = countryData["Tree cover loss (ha)"]["2021"];
        const forestry = countryData["Forestry production index (2014-2016 = 100)"]["2021"];
        const lossFormatted = Math.round(loss).toLocaleString();
        const forestryFormatted = forestry ? forestry.toFixed(1) : "n.v.t.";

        let story = "";
        let forestryStory = "";

        // Verhaal over bosverlies
        if (loss < 1000) {
          story = `In ${countryName} blijft het bos grotendeels intact. Slechts ${lossFormatted} hectare aan bomen verdween dit jaar.`;
        } else if (loss < 50000) {
          story = `De bossen in ${countryName} krimpen gestaag — ${lossFormatted} hectare aan bomen verdween in het afgelopen jaar.`;
        } else {
          story = `In ${countryName} verdwijnen enorme delen bos: ${lossFormatted} hectare ging verloren. Dit heeft grote gevolgen voor natuur en klimaat.`;
        }

        // Verhaal over de bosbouwindex
       // Verhaal over de bosbouwindex
        if (forestry < 90) {
          forestryStory = `De bosbouwproductie is lager dan in voorgaande jaren (${forestryFormatted}). 
          Een waarde onder 100 betekent dat er minder houtproductie plaatsvindt dan in 2014–2016, mogelijk door duurzaam beleid of bosherstel.`;
        } else if (forestry < 110) {
          forestryStory = `De bosbouwproductie is stabiel gebleven (${forestryFormatted}). 
          Een waarde rond 100 duidt op een vergelijkbaar productieniveau als in 2014–2016.`;
        } else {
          forestryStory = `De bosbouwproductie is toegenomen (${forestryFormatted}). 
          Een waarde boven 100 wijst op intensiever gebruik van bosgrond en een groei in houtproductie.`;
        }


        popup.innerHTML = `
          <button class="close-stam">×</button>
          <div class="popup-content">
            <strong>${countryName.toUpperCase()}</strong><br>
            🌲 Verloren bosgebied: ${lossFormatted} hectare<br>
            🪵 Bosbouwproductie-index: ${forestryFormatted}<br><br>
            <em>${story}</em><br><br>
            <em>${forestryStory}</em>
          </div>
        `;

        // positie & fade
        popup.style.left = Math.min(e.pageX, window.innerWidth - 280) + "px";
        popup.style.top = Math.min(e.pageY, window.innerHeight - 180) + "px";
        popup.style.display = "block";
        popup.classList.add("show");

        // popup blijft binnen scherm
            const popupRect = popup.getBoundingClientRect();
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            let newLeft = e.pageX;
            let newTop = e.pageY;

            // popup blijft binnen scherm
            if (popupRect.width + newLeft > screenWidth - 20) {
            newLeft = screenWidth - popupRect.width - 20;
            }

            // popup blijft binnen scherm
            if (popupRect.height + newTop > screenHeight - 20) {
            newTop = screenHeight - popupRect.height - 20;
            }

            // past de positie aan
            popup.style.left = `${newLeft}px`;
            popup.style.top = `${newTop}px`;


        // Sluitknop
        const closeBtn = popup.querySelector(".close-stam");
        closeBtn.addEventListener("click", () => {
          popup.classList.remove("show");
          setTimeout(() => (popup.style.display = "none"), 300);
        });
      });
    }
  };

  requestAnimationFrame(ensureReady);
}
