/**
 * Plaatst willekeurige bomen (boom.svg) op beide landen binnen het groene gebied.
 * @param {number} count - aantal bomen per land
 */
function spawnRandomTrees(count) {
  const track = document.getElementById("compare-track");
  const compareView = document.getElementById("compare-view");
  const img1 = document.getElementById("img1");
  const img2 = document.getElementById("img2");
  if (!track || !compareView || !img1 || !img2) return;

  const ensureReady = () => {
    const w = img1.clientWidth;
    const h = compareView.clientHeight;
    if (w === 0 || h === 0) {
      requestAnimationFrame(ensureReady);
      return;
    }

    const halfH = h / 2;
    const greenZoneHeight = halfH * 0.35; // onderste 35% van elk land
    const greenZoneTop = halfH * 0.65;    // begin van het groen

    // === LAND 1 (bovenste helft) ===
    for (let i = 0; i < count; i++) {
      const tree = document.createElement("img");
      tree.src = "/img/boom.svg";
      tree.className = "tree";

      const x = Math.random() * (w - 48);
      const y = greenZoneTop * 0.9 + Math.random() * (greenZoneHeight * 0.9);
      const scale = 0.8 + Math.random() * 0.8;

      tree.style.left = `${x}px`;
      tree.style.top = `${y}px`;
      tree.style.transform = `scale(${scale})`;
      track.appendChild(tree);
    }

    // === LAND 2 (onderste helft) ===
    for (let i = 0; i < count; i++) {
      const tree = document.createElement("img");
      tree.src = "/img/boom.svg";
      tree.className = "tree";

      const x = Math.random() * (w - 48);
      const y = halfH + greenZoneTop * 0.9 + Math.random() * (greenZoneHeight * 0.9);
      const scale = 0.8 + Math.random() * 0.8;

      tree.style.left = `${x}px`;
      tree.style.top = `${y}px`;
      tree.style.transform = `scale(${scale})`;
      track.appendChild(tree);
    }
  };

  requestAnimationFrame(ensureReady);
}
