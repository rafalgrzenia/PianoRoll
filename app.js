import PianoRoll from "./pianoroll.js";

const pianoRollContainer = document.querySelector(".pianoRollContainer");
const pianorollMain = document.querySelector(".pianoroll-main");
const pianorollList = document.querySelector(".pianoroll-list");

class PianoRollDisplay {
  constructor(csvURL) {
    this.csvURL = csvURL;
    this.data = null;
    this.isSelecting = false;
    this.selectionEnd = false;
    this.selectionStartPosition = null;
    this.selectionEndPosition = null;
    this.previousNotesColors = [];
    this.noteCount = [];
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

    pianoRollContainer.classList.add("grid");

    // Select Svg element from pianoRollMain

    const svg = pianorollMain.querySelector("svg");

    // Selection events

    svg.addEventListener("mousedown", (e) => {
      this.startSelection(e, svg);
    });

    svg.addEventListener("mousemove", (e) => this.drawSelection(e, svg));

    svg.addEventListener("mouseup", (e) => this.endSelection(e, svg));
  }

  getMousePosition(event, svg) {
    let { clientX, clientY } = event;

    // Return position of the mouse fired on svg element

    const svgPosition = svg.getBoundingClientRect();

    const x = Math.max(clientX - svgPosition.left, 0);
    const y = Math.max(clientY - svgPosition.top, 0);

    return { x, y };
  }
  // Method that starts selection

  startSelection(event, svg) {
    // Reset noteCount

    this.noteCount = [];

    // Reset selection area if previous selection is done
    if (this.selectionEnd) {
      this.resetSelection();
    }
    if (this.isSelecting) return;
    this.isSelecting = true;

    // Get starting click position
    const clickedPosition = this.getMousePosition(event, svg);
    this.selectionStartPosition = clickedPosition;
  }

  // Method that ends selection.
  endSelection(event, svg) {
    if (!this.isSelecting) return;
    this.isSelecting = false;
    this.selectionEnd = true;
    const clickedPosition = this.getMousePosition(event, svg);
    this.selectionEndPosition = clickedPosition;

    // Console Log selection positions

    console.log(`Start Position: x: ${this.selectionStartPosition.x}`);
    console.log(`Start Position: y: ${this.selectionStartPosition.y}`);
    console.log(`End Position: x: ${this.selectionEndPosition.x}`);
    console.log(`End Position: y: ${this.selectionEndPosition.y}`);

    // Check if notes in noteCount array, if so display it's count

    this.noteCount.length > 0
      ? console.log(`Selected Notes: ${this.noteCount.length}`)
      : console.log(`Selected Notes: 0`);
  }

  drawSelection(event, svg) {
    if (!this.isSelecting) return;
    let selection = document.getElementById("selection");
    // Create selection element if it doesn't exist yet.
    if (!selection) {
      selection = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      selection.id = "selection";
      svg.appendChild(selection);
    }
    const svgPos = svg.getBoundingClientRect();

    // Calculate new selection area based on starting position from startSelection function and current cursor position
    const currentPosition = this.getMousePosition(event, svg);
    const minY = Math.min(this.selectionStartPosition.y, currentPosition.y);
    const minX = Math.min(this.selectionStartPosition.x, currentPosition.x);
    const maxY = Math.max(this.selectionStartPosition.y, currentPosition.y);
    const maxX = Math.max(this.selectionStartPosition.x, currentPosition.x);
    const selectionY = minY / svgPos.height;
    const selectionX = minX / svgPos.width;
    const selectionHeight = (maxY - minY) / svgPos.height;
    const selectionWidth = (maxX - minX) / svgPos.width;

    // Set selection attributes
    selection.setAttribute("fill", "rgba(255, 59, 59, 0.31)");
    selection.setAttribute("x", selectionX);
    selection.setAttribute("y", selectionY);
    selection.setAttribute("height", selectionHeight);
    selection.setAttribute("width", selectionWidth);

    // Restore previous colors to notes
    this.resetNotesColors();

    // Recolor notes that are within selected area
    const notes = Array.from(svg.children).filter((e) =>
      e.classList.contains("note-rectangle")
    );

    notes.forEach((note) => {
      const x = note.x.baseVal.value;
      const y = note.y.baseVal.value;
      const height = note.height.baseVal.value;
      const width = note.width.baseVal.value;
      if (
        this.checkIfInSelection(
          x,
          y,
          y + height,
          x + width,
          selectionX,
          selectionY,
          selectionY + selectionHeight,
          selectionX + selectionWidth
        )
      ) {


        // Keep track of colors of selected notes so we can reset them to original colors later.
        this.previousNotesColors.push(note.getAttribute("fill"));
        note.classList.add("selected");
        note.setAttribute("fill", "green");

        // Query selected notes and add them to noteCount

        const selectedNotes = svg.querySelectorAll('[fill*="green"]');
        this.noteCount = selectedNotes;
      }
    });
  }

  // Method that checks if selected area and note are interesecting
  checkIfInSelection(
    x,
    y,
    height,
    width,
    selectionX,
    selectionY,
    selectionHeight,
    selectionWidth
  ) {
    if (
      x < selectionWidth &&
      width > selectionX &&
      y < selectionHeight &&
      height > selectionY
    ) {
      return true;
    }
  }

  // Reset selection area

  resetSelection() {
    this.selectionEnd = false;
    this.isSelecting = false;
    this.resetNotesColors();
    const selection = document.getElementById("selection");
    if (selection) selection.remove();
    this.selectionEndPosition = null;
    this.selectionStartPosition = null;
  }

  // Reset Notes Colors

  resetNotesColors() {
    const svg = pianorollMain.querySelector("svg");
    const notes = Array.from(svg.children).filter((e) =>
      e.classList.contains("selected")
    );
    notes.forEach((note, index) => {
      note.setAttribute("fill", this.previousNotesColors[index]);
    });
    this.previousNotesColors = [];
  }
}

document.getElementById("loadCSV").addEventListener("click", async () => {
  const csvToSVG = new PianoRollDisplay();
  await csvToSVG.generateSVGs();
});
