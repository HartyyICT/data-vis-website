/**
 * Plaatst willekeurige bomen (boom.svg) op een land binnen het groene gebied
 * én binnen een horizontale zone.
 * @param {number} count
 * @param {"top"|"bottom"} position
 */
function spawnRandomTrees(count, position) {
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

    for (let i = 0; i < count; i++) {
      const tree = document.createElement("img");
      tree.src = "/img/boom.svg";
      tree.className = "tree";
      tree.style.left = `${randX()}px`;
      tree.style.top = `${randY()}px`;
      tree.style.transform = `scale(${randScale()})`;
      track.appendChild(tree);
    }
  };

  requestAnimationFrame(ensureReady);
}
