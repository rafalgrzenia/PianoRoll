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

  openPianoRoll(rollId) {
    // Select all piano roll cards from pianorollList

    const pianoRollCards = Array.from(
      pianorollList.querySelectorAll(".piano-roll-card")
    );

    // Clear Piano Roll Main View

    pianorollMain.innerHTML = "";

    // Reset active class of piano rolls

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
        console.log(
          "🚀 ~ file: app.js:53 ~ PianoRollDisplay ~ pianoRollCards.find ~ card:",
          card
        );
      }
    });

    // Display PianorollMain

    pianorollMain.classList.remove("hide");

    // Set PianoRollContainer display to grid

    pianoRollContainer.style.display = "grid";

    pianoRollContainer.classList.add("hide");

    // ----------------------------------------------------------
  }

  // Select content in .piano-roll-card's main container with selection div

  selection() {
    var svg = pianorollMain.querySelector(".piano-roll-card"),
      x1 = 0,
      y1 = 0,
      x2 = 0,
      y2 = 0;

    const selection = document.createElement("div");
    selection.classList.add("selection");
    selection.hidden = 1;
    svg.append(selection);

    console.log(svg);
    console.log(selection);

    function reCalc() {
      //This will restyle the div
      var x3 = Math.min(x1, x2);
      var x4 = Math.max(x1, x2);
      var y3 = Math.min(y1, y2);
      var y4 = Math.max(y1, y2);
      selection.style.left = x3 + "px";
      selection.style.top = y3 + "px";
      selection.style.width = x4 - x3 + "px";
      selection.style.height = y4 - y3 + "px";
    }

    svg.onmousedown = function (e) {
      selection.hidden = 0;
      x1 = e.clientX;
      y1 = e.clientY;
      reCalc();
    };
    svg.onmousemove = function (e) {
      x2 = e.clientX;
      y2 = e.clientY;
      reCalc();
    };
    svg.onmouseup = function (e) {
      selection.hidden = 1;

      console.log(`Starting x:${x1}, Starting y: ${y1}`);
      console.log(`Ending x:${x2}, Ending y: ${y2}`);
    };
  }

  preparePianoRollCard(rollId) {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("piano-roll-card");
    cardDiv.setAttribute("id", `${rollId}`);

    // Create and append other elements to the card container as needed
    const descriptionDiv = document.createElement("div");
    descriptionDiv.classList.add("description");
    descriptionDiv.textContent = `This is a piano roll number ${rollId}`;
    cardDiv.appendChild(descriptionDiv);
    cardDiv.addEventListener("click", () => {
      this.openPianoRoll(rollId);
      this.selection();
    });

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("piano-roll-svg");
    svg.setAttribute("width", "80%");
    svg.setAttribute("height", "150");

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
