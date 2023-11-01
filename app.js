import PianoRoll from "./pianoroll.js";

const pianoRollContainer = document.querySelector(".pianoRollContainer");
const pianoMainContainer = document.querySelector(".piano-main-container");
const pianorollMain = document.querySelector(".pianoroll-main");
const pianorollSide = document.querySelector(".pianoroll-side");

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

  openPianoRoll(rollId) {
    // Clear Main container

    pianorollMain.innerHTML = "";

    // Select all piano roll cards from roll pianoRollContainer

    const pianoRolls = Array.from(
      pianoRollContainer.querySelectorAll(".piano-roll-card")
    );

    // Find clicked element and append it to Main Container

    pianoRolls.find((el) => {
      const clone = el.cloneNode(true);
      const id = Number(el.getAttribute("id"));
      if (id === rollId) {
        pianorollMain.append(clone);
        el.classList.add("active");
      }
    });

    // Show PianoMainContainer and Hide pianoRollContainer

    pianoMainContainer.classList.add("show");

    pianoRollContainer.classList.add("hide");

    // Clone PianoRolls, add them to side container handle event listener that adds clicked element to main view

    const clonedPianoRolls = [...pianoRolls];

    clonedPianoRolls.forEach((pianoroll) => {
      pianoroll.addEventListener("click", () => {
        pianorollMain.innerHTML = "";
        clonedPianoRolls.forEach((roll) => roll.classList.remove("active"));
        const cloneNode = pianoroll.cloneNode(true);
        pianorollMain.append(cloneNode);
        pianoroll.classList.add("active");
      });
      pianorollSide.append(pianoroll);
    });
  }

  preparePianoRollCard(rollId) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('piano-roll-card');

    // Create and append other elements to the card container as needed
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description');
    descriptionDiv.textContent = `This is a piano roll number ${rollId}`;
    cardDiv.appendChild(descriptionDiv);
    cardDiv.addEventListener("click", () => {
      this.openPianoRoll(rollId);
    });

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('piano-roll-svg');
    svg.setAttribute('width', '80%');
    svg.setAttribute('height', '150');

    // Append the SVG to the card container
    cardDiv.appendChild(svg);

    return { cardDiv, svg }
  }

  async generateSVGs() {
    if (!this.data) await this.loadPianoRollData();
    if (!this.data) return;
    
    const pianoRollContainer = document.getElementById('pianoRollContainer');
    pianoRollContainer.innerHTML = '';
    for (let it = 0; it < 20; it++) {
      const start = it * 60;
      const end = start + 60;
      const partData = this.data.slice(start, end);

      const { cardDiv, svg } = this.preparePianoRollCard(it)

      pianoRollContainer.appendChild(cardDiv);
      const roll = new PianoRoll(svg, partData);
    }
  }
}

document.getElementById('loadCSV').addEventListener('click', async () => {
  const csvToSVG = new PianoRollDisplay();
  await csvToSVG.generateSVGs();
});
