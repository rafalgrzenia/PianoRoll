import PianoRoll from "./pianoroll.js";

const pianoRollContainer = document.querySelector(".pianoRollContainer");
const pianorollMain = document.querySelector(".pianoroll-main");
const pianorollList = document.querySelector(".pianoroll-list");

class PianoRollDisplay {
  constructor(csvURL) {
    this.csvURL = csvURL;
    this.data = null;
  }

  async loadPianoRollData() {
    try {
      const response = await fetch("https://pianoroll.ai/random_notes");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      this.data = await response.json();
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  async generateSVGs() {
    if (!this.data) await this.loadPianoRollData();
    if (!this.data) return;

    pianorollList.innerHTML = "";
    for (let it = 0; it < 20; it++) {
      const start = it * 60;
      const end = start + 60;
      const partData = this.data.slice(start, end);

      const { cardDiv, svg } = this.preparePianoRollCard(it);

      pianorollList.appendChild(cardDiv);
      const roll = new PianoRoll(svg, partData);
    }
  }

  preparePianoRollCard(rollId) {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("piano-roll-card");

    // Set Id to cardDiv

    cardDiv.setAttribute("id", `${rollId}`);

    // Create and append other elements to the card container as needed
    const descriptionDiv = document.createElement("div");
    descriptionDiv.classList.add("description");
    descriptionDiv.textContent = `Piano Roll Number: ${rollId}`;
    cardDiv.addEventListener("click", () => {
      this.openPianoRoll(rollId);
    });

    cardDiv.appendChild(descriptionDiv);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("piano-roll-svg");

    // Append the SVG to the card container
    cardDiv.appendChild(svg);

    return { cardDiv, svg };
  }

  openPianoRoll(rollId) {
    // Select all piano roll cards from pianorollList

    const pianoRollCards = Array.from(
      pianorollList.querySelectorAll(".piano-roll-card")
    );

    // Clear Piano Roll Main View

    pianorollMain.innerHTML = "";

    // Remove active class from pianoRolls

    pianoRollCards.forEach((rolls) => rolls.classList.remove("active"));

    // Change PianoRoll list to one column view

    pianorollList.classList.add("column");

    // Find clicked element clone it and append it to Main Container and add active class to it

    pianoRollCards.find((card) => {
      const id = Number(card.getAttribute("id"));
      if (id === rollId) {
        const clone = card.cloneNode(true);
        pianorollMain.append(clone);
        card.classList.add("active");
      }
    });

    // Display PianorollMain

    pianorollMain.classList.remove("hide");

    // Set PianoRollContainer display to grid

    pianoRollContainer.style.display = "grid";

    // Select Svg element from pianoRollMain

    const svg = pianorollMain.querySelector("svg");

    // Selection events

    svg.addEventListener("mousedown", (e) => {
      this.startSelection(e, svg);
    });

    svg.addEventListener("mousemove", (e) => this.drawSelection(e, svg));

    svg.addEventListener("mouseup", (e) => this.endSelection(e, svg));


    // Append the SVG to the card container
    cardDiv.appendChild(svg);

    return { cardDiv, svg };
  }

  async generateSVGs() {
    if (!this.data) await this.loadPianoRollData();
    if (!this.data) return;

    pianoRollContainer.innerHTML = "";
    for (let it = 0; it < 20; it++) {
      const start = it * 60;
      const end = start + 60;
      const partData = this.data.slice(start, end);

      const { cardDiv, svg } = this.preparePianoRollCard(it);

      pianoRollContainer.appendChild(cardDiv);
      const roll = new PianoRoll(svg, partData);
    }
  }
}

document.getElementById("loadCSV").addEventListener("click", async () => {
  const csvToSVG = new PianoRollDisplay();
  await csvToSVG.generateSVGs();
});
