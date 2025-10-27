/**
 * Plaatst willekeurige bomen (boom.svg) op een land binnen het groene gebied
 * én binnen een horizontale zone.
 * @param {number} count
 * @param {"top"|"bottom"} position 
 * @param {string} countryName 
 * @param {object} countryData 
 */
function spawnRandomTrees(count, position, countryName, countryData) {
  const track = document.getElementById("compare-track");
  const compareView = document.getElementById("compare-view");
  const img1 = document.getElementById("img1");
  if (!track || !compareView || !img1) return;

  const ensureReady = () => {
    const w = img1.clientWidth;
    const h = compareView.clientHeight;
    if (w === 0 || h === 0) { requestAnimationFrame(ensureReady); return; }

    const halfH = h / 2;
    const GREEN_TOP_RATIO = 0.4;
    const GREEN_BOTTOM_RATIO = 0.3;
    const zoneStart = w * 0.0;
    const zoneEnd = w * 0.16;
    const zoneWidth = Math.max(0, zoneEnd - zoneStart - 48);

    const randX = () => zoneStart + Math.random() * zoneWidth;
    const randScale = () => 0.8 + Math.random() * 0.8;

    const randY = () => {
      const yMin = (position === "top")
        ? halfH * GREEN_TOP_RATIO
        : halfH + halfH * GREEN_TOP_RATIO;
      const yMax = (position === "top")
        ? halfH * GREEN_BOTTOM_RATIO
        : halfH + halfH * GREEN_BOTTOM_RATIO;
      return yMin + Math.random() * (yMax - yMin);
    };

    let popup = document.getElementById("data-popup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "data-popup";
      popup.style.position = "fixed";
      popup.style.background = "rgba(0,0,0,0.8)";
      popup.style.color = "#fff";
      popup.style.padding = "1rem";
      popup.style.borderRadius = "10px";
      popup.style.display = "none";
      popup.style.zIndex = "999";
      document.body.appendChild(popup);
    }

    // bomen genereren
    for (let i = 0; i < count; i++) {
      const tree = document.createElement("img");
      tree.src = "/img/boom.svg";
      tree.className = "tree";
      tree.style.left = `${randX()}px`;
      tree.style.top = `${randY()}px`;
      tree.style.transform = `scale(${randScale()})`;
      track.appendChild(tree);

      // popup
      tree.addEventListener("click", (e) => {
        const forestArea = countryData["Forest area (% of land area)"]["2021"];
        const percentage = forestArea.toFixed(2);
        let storyText = "";

        if (forestArea < 15) {
          storyText = `${countryName} heeft slechts ${percentage}% bosgebied. In grote delen van het land zijn bomen schaars — natuurgebieden worden steeds kleiner, en elke boom die overblijft krijgt meer betekenis.`;
        } else if (forestArea < 40) {
          storyText = `In ${countryName} is ongeveer ${percentage}% van het land bedekt met bos. Er is nog steeds ruimte voor natuur, maar ook hier wordt het evenwicht tussen groei en behoud steeds moeilijker.`;
        } else {
          storyText = `${countryName} is rijk aan bos — met ${percentage}% van het land bedekt door groen. Bossen spelen hier een belangrijke rol in het landschap en in het dagelijks leven van de mensen.`;
        }

        popup.innerHTML = `
          <button id="close-popup" aria-label="Sluit popup">×</button>
          <div class="popup-content">
            <strong>${countryName.toUpperCase()}</strong><br>
            🌳 Bosgebied: ${percentage}%<br><br>
            <em>${storyText}</em>
          </div>
        `;

        const closeBtn = popup.querySelector("#close-popup");
        closeBtn.addEventListener("click", () => {
          popup.classList.remove("show");
          setTimeout(() => (popup.style.display = "none"), 300);
        });

        popup.style.left = e.pageX + "px";
        popup.style.top = e.pageY + "px";
        popup.style.display = "block";

        // Zorg dat popup binnen het scherm blijft
            const popupRect = popup.getBoundingClientRect();
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            let newLeft = e.pageX;
            let newTop = e.pageY;

            // Voorkom dat de popup buiten het scherm aan de rechterkant valt
            if (popupRect.width + newLeft > screenWidth - 20) {
            newLeft = screenWidth - popupRect.width - 20;
            }

            // Voorkom dat de popup buiten het scherm aan de onderkant valt
            if (popupRect.height + newTop > screenHeight - 20) {
            newTop = screenHeight - popupRect.height - 20;
            }

            // Pas de gecorrigeerde positie toe
            popup.style.left = `${newLeft}px`;
            popup.style.top = `${newTop}px`;


        // fade-in animatie
        popup.classList.add("show");
      });
    }
  };

  requestAnimationFrame(ensureReady);
}
