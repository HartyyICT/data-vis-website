document.addEventListener("DOMContentLoaded", () => {
  const compareBtn = document.getElementById("compare-btn");
  const backBtn = document.getElementById("back-btn");
  const homeScreen = document.querySelector(".home-screen");
  const compareView = document.getElementById("compare-view");
  const track = document.getElementById("compare-track");

  const countryKey = {
    "nederland": "netherlands",
    "brazilie": "brazil",
    "australie": "australia",
    "verenigde-staten": "united-states",
    "zweden": "sweden",
    "india": "india"
  };

  compareBtn.addEventListener("click", () => {
    const c1 = document.getElementById("country1").value;
    const c2 = document.getElementById("country2").value;

    if (!c1 || !c2) return alert("Selecteer twee landen.");
    if (c1 === c2) return alert("Kies twee verschillende landen.");

    homeScreen.style.display = "none";
    compareView.style.display = "block";

    track.innerHTML = `
      <img src="/img/${c1}.svg" alt="${c1}" class="country-img" id="img1" />
      <img src="/img/${c2}.svg" alt="${c2}" class="country-img" id="img2" />
    `;

    compareView.scrollTo({ left: 0 });

    fetch("/data/esg-selected-countries.json")
      .then((r) => r.json())
      .then((data) => {
        console.log("✅ ESG-data geladen:", data);
        const key1 = countryKey[c1];
        const key2 = countryKey[c2];

        const forest1 = data[key1]["Forest area (% of land area)"]["2021"];
        const forest2 = data[key2]["Forest area (% of land area)"]["2021"];

        const count1 = Math.round((forest1 / 100) * 100);
        const count2 = Math.round((forest2 / 100) * 100);

        console.log(`${c1}: ${forest1}% bosgebied → ${count1} bomen`);
        console.log(`${c2}: ${forest2}% bosgebied → ${count2} bomen`);

        // 🦌 Bedreigde diersoorten → hertenaantal bepalen
        const threatened1 = parseFloat(data[key1]["Mammal species, threatened"]["2018"]);
        const threatened2 = parseFloat(data[key2]["Mammal species, threatened"]["2018"]);

        // Hoe meer bedreigde soorten, hoe minder dieren (1–10 schaal)
        const maxAnimals = 10;
        const minAnimals = 1;
        const maxThreatened = 100; // landen met ~100 bedreigde soorten krijgen het minimum
        const minThreatened = 5;   // landen met ~5 bedreigde soorten krijgen het maximum

        const mapThreatToAnimals = (threatened) => {
          const normalized = Math.max(0, Math.min(1, (maxThreatened - threatened) / (maxThreatened - minThreatened)));
          return Math.round(minAnimals + normalized * (maxAnimals - minAnimals));
        };

        const deerCount1 = mapThreatToAnimals(threatened1);
        const deerCount2 = mapThreatToAnimals(threatened2);

        console.log(`${c1}: ${threatened1} bedreigde soorten → ${deerCount1} herten`);
        console.log(`${c2}: ${threatened2} bedreigde soorten → ${deerCount2} herten`);

        // 🌲 Tree cover loss data verwerken
        const loss1 = parseFloat(data[key1]["Tree cover loss (ha)"]["2021"]);
        const loss2 = parseFloat(data[key2]["Tree cover loss (ha)"]["2021"]);

        const stumpCount1 = Math.min(20, Math.max(3, Math.round(loss1 / 10000)));
        const stumpCount2 = Math.min(20, Math.max(3, Math.round(loss2 / 10000)));

        console.log(`${c1}: ${loss1} verlies → ${stumpCount1} stammen`);
        console.log(`${c2}: ${loss2} verlies → ${stumpCount2} stammen`);

        // 🐿️ Genereer dieren per land
        spawnAnimals(deerCount1, "top", c1, data[key1]);
        spawnAnimals(deerCount2, "bottom", c2, data[key2]);

        // 🌳 Genereer bomen per land
        spawnRandomTrees(count1, "top", c1, data[key1]);
        spawnRandomTrees(count2, "bottom", c2, data[key2]);

        // 🪵 Genereer stammen per land
        spawnTreeStumps(stumpCount1, "top", c1, data[key1]);
        spawnTreeStumps(stumpCount2, "bottom", c2, data[key2]);

        // 🎣 Fishing production index → aantal vissen bepalen
        const fishing1 = data[key1]["Fishing production index (2014-2016 = 100)"]
          ? parseFloat(data[key1]["Fishing production index (2014-2016 = 100)"]["2021"])
          : 0;
        const fishing2 = data[key2]["Fishing production index (2014-2016 = 100)"]
          ? parseFloat(data[key2]["Fishing production index (2014-2016 = 100)"]["2021"])
          : 0;

        const fishCount1 = Math.min(25, Math.max(3, Math.round(fishing1 / 10)));
        const fishCount2 = Math.min(25, Math.max(3, Math.round(fishing2 / 10)));

        console.log(`${c1}: ${fishing1} visserij-index → ${fishCount1} vissen`);
        console.log(`${c2}: ${fishing2} visserij-index → ${fishCount2} vissen`);

        spawnFish(fishCount1, "top", c1, data[key1]);
        spawnFish(fishCount2, "bottom", c2, data[key2]);
      })
      .catch((err) => console.error("Fout bij laden van JSON:", err));

    enableHorizontalScroll(compareView);
  });

  backBtn.addEventListener("click", () => {
    compareView.style.display = "none";
    homeScreen.style.display = "flex";
    document.querySelectorAll(".tree").forEach((t) => t.remove());
  });
});

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
