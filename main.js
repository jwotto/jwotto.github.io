// SVG COMPONENTEN
function getSharpSVG(className = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -22 16 64" class="${className}">
    <line x1="5" y1="0" x2="5" y2="32" stroke="black" stroke-width="2"/>
    <line x1="11" y1="0" x2="11" y2="32" stroke="black" stroke-width="2"/>
    <line x1="0" y1="10" x2="16" y2="6" stroke="black" stroke-width="2"/>
    <line x1="0" y1="22" x2="16" y2="18" stroke="black" stroke-width="2"/>
  </svg>`;
}
function getFlatSVG(className = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-15 -7 16 48" class="${className}">
    <line x1="8" y1="0" x2="8" y2="28" stroke="black" stroke-width="2"/>
    <path d="M8 14 Q20 17 8 28" fill="none" stroke="black" stroke-width="2"/>
  </svg>`;
}
function getNaturalSVG(className = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-16 -10 24 48" class="${className}">
    <path d="M14 30V6M14 22L6 26V2M6 10L14 6" stroke="black" stroke-width="2" fill="none"/>
  </svg>`;
}

const noteNames = [
  "G", "A", "B", "C", "D", "E", "F", "G", "A", "B", "C", "D", "E", "F", "G", "A", "B", "C", "D"
];
const linedPositions = [1, 3, 5, 7, 9, 11, 13, 15, 17];
const dottedPositions = [1, 3, 15, 17];
const stickMiddle = 9;
const positionOffsets = Array.from({ length: 19 }, (_, i) => (i + 1) * (100 / 20));
let idCounter = 0, selectedBox = null, selectedTool = 'circle';
const container = document.getElementById('container');

// Alleen C, D, F, G, Bb, Eb
const keySignaturePositions = {
  C: [],
  G:    [{type: 'sharp', pos: 13}],
  D:    [{type: 'sharp', pos: 13}, {type: 'sharp', pos: 10}],
  F:    [{type: 'flat', pos: 9}],
  Bb:   [{type: 'flat', pos: 9}, {type: 'flat', pos: 12}],
  Eb:   [{type: 'flat', pos: 9}, {type: 'flat', pos: 12}, {type: 'flat', pos: 8}],
};

function getKeySignatureBlock(key) {
  const box = document.createElement('div');
  box.className = "notenblokkie bg-transparent p-1 flex border-4 flex-col items-center border border-transparent opacity-80";
  box.setAttribute('data-keysig', 'true');
  box.style.pointerEvents = "none";

  const staff = document.createElement('div');
  staff.className = "relative h-48 w-14 bg-transparent mb-3";
  staff.style.overflow = "visible";
  staff.innerHTML = getNotenbalkSVG();

  const sigs = keySignaturePositions[key] || [];
  sigs.forEach((sign, idx) => {
    const accidentalDiv = document.createElement('div');
    accidentalDiv.className = "absolute left-[32%] -translate-x-full translate-y-[45%] z-10 pointer-events-none select-none";
    accidentalDiv.style.marginLeft = `${idx * 11}px`;
    accidentalDiv.style.bottom = `calc(${positionOffsets[sign.pos]}%)`;
    if (sign.type === "sharp") {
      accidentalDiv.innerHTML = getSharpSVG("w-8 h-8 sm:w-11 sm:h-11");
    } else {
      accidentalDiv.innerHTML = getFlatSVG("w-8 h-8 sm:w-11 sm:h-11");
    }
    staff.appendChild(accidentalDiv);
  });

  box.appendChild(staff);
  return box;
}

function addKeySignatureBlock() {
  const key = document.getElementById('puzzleKeyInput').value;
  if (container.firstChild && container.firstChild.getAttribute('data-keysig')) {
    container.removeChild(container.firstChild);
  }
  const keyBlock = getKeySignatureBlock(key);
  container.insertBefore(keyBlock, container.firstChild);
}

document.getElementById('puzzleKeyInput').addEventListener('change', function() {
  addKeySignatureBlock();
});

function getNotenbalkSVG(width = 56, height = 192) {
  let svg = `<svg class="notenbalk-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="display:block">`;
  linedPositions.forEach(i => {
    const y = height - (positionOffsets[i] / 100 * height);
    const style = dottedPositions.includes(i)
      ? 'stroke-dasharray:8,8;stroke:#a3a3a3;stroke-width:2'
      : 'stroke:black;stroke-width:2';
    svg += `<line x1="0" x2="${width}" y1="${y}" y2="${y}" style="${style}" />`;
  });
  svg += '</svg>';
  return svg;
}

function selectTool(tool) {
  selectedTool = tool;
  ['hand','circle', 'square', 'sharp', 'flat', 'natural'].forEach(t => {
    const btn = document.getElementById(`btn-${t}`);
    if (btn) {
      btn.classList.remove('bg-blue-600', 'text-white');
      btn.classList.add('bg-white', 'text-black');
    }
  });
  const activeBtn = document.getElementById(`btn-${tool}`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-white', 'text-black');
    activeBtn.classList.add('bg-blue-600', 'text-white');
  }
}

function addTextbox() {
  const box = document.createElement('div');
  box.className = "notenblokkie bg-transparent p-1 flex border-4 flex-col items-center border border-transparent";
  box.setAttribute('data-id', idCounter++);
  box.setAttribute('data-selected', 'null');
  box.setAttribute('data-shape', 'circle');
  box.setAttribute('data-textonstaff', '');
  box.setAttribute('data-has-staff-input', 'false');
  box.setAttribute('data-omdraai', 'false');

  const staff = document.createElement('div');
  staff.className = "relative h-48 w-14 bg-transparent mb-3 cursor-pointer";
  staff.style.overflow = "visible";
  staff.innerHTML = getNotenbalkSVG();

  const marker = document.createElement('div');
  marker.className = "notemove absolute left-1/2 -translate-x-1/2 translate-y-1/2 w-5 h-5 bg-black border-2 border-black z-10 flex items-center justify-center rounded-full hidden select-none pointer-events-none";
  marker.setAttribute('data-marker', '');
  staff.appendChild(marker);

  const accidental = document.createElement('div');
  accidental.className = "absolute left-[32%] -translate-x-full translate-y-[45%] z-10 pointer-events-none select-none hidden";
  accidental.setAttribute('data-accidental', '');
  staff.appendChild(accidental);

  box.appendChild(staff);

  const bovenruimte = document.createElement('div');
  bovenruimte.className = "h-8 flex items-center justify-center w-full";
  bovenruimte.setAttribute('data-bovenruimte', '');

  const staffInput = document.createElement('input');
  staffInput.type = "text";
  staffInput.maxLength = 12;
  staffInput.className = "input-onstaff";
  staffInput.value = "";
  staffInput.addEventListener('input', function () {
    box.setAttribute('data-textonstaff', staffInput.value);
    updateTextOnStaffAppearance(staffInput);
    updateJSON();
  });
  bovenruimte.appendChild(staffInput);

  box.appendChild(bovenruimte);

  const omdraaiDiv = document.createElement('div');
  omdraaiDiv.setAttribute('data-omdraai', '');
  omdraaiDiv.className = "omdraai-icoon";
  omdraaiDiv.innerHTML = `<span class="omdraai-placeholder"></span>`;
  box.appendChild(omdraaiDiv);

  const input = document.createElement('input');
  input.setAttribute('maxlength', 5);
  input.className = "w-14 border-2 border-black rounded text-center text-base outline-none mt-2 bg-white";
  input.value = "";
  input.addEventListener('input', () => {
    box.setAttribute('data-value', input.value);
    updateJSON();
  });
  box.setAttribute('data-value', '');

  box.appendChild(input);
  container.appendChild(box);

  box.addEventListener('click', function(e) {
    e.stopPropagation();
    selectBox(box);
  });

  staff.addEventListener('mousedown', e => {
    if(selectedTool === 'hand') return;
    handleStaffClick(e, box, staff);
  });

  updateTextOnStaffAppearance(staffInput);
  updateJSON();
  selectBox(box);
  updateOmdraaiIcoon(box);
}

function updateTextOnStaffAppearance(staffInput) {
  if (staffInput.value.trim() !== "") {
    staffInput.className = "input-onstaff filled";
  } else {
    staffInput.className = "input-onstaff";
  }
}

function selectBox(box) {
  if (selectedBox && selectedBox !== box) {
    selectedBox.classList.remove('border-blue-500');
  }
  selectedBox = box;
  box.classList.add('border-blue-500');
}

function handleStaffClick(event, box, staff) {
  const bovenruimte = box.querySelector('[data-bovenruimte]');
  const staffInput = bovenruimte.querySelector('input');
  if (['circle','square','sharp','flat','natural'].includes(selectedTool)) {
    const rect = staff.getBoundingClientRect();
    const y = event.clientY - rect.top;
    const pct = 100 * (1 - y / rect.height);

    let closestIndex = 0, minDiff = Infinity;
    positionOffsets.forEach((offset, i) => {
      const diff = Math.abs(pct - offset);
      if (diff < minDiff) { minDiff = diff; closestIndex = i; }
    });

    const marker = staff.querySelector('[data-marker]');
    const accidentalEl = staff.querySelector('[data-accidental]');
    const note = noteNames[closestIndex];

    let shape = (selectedTool === 'square') ? 'square'
      : (selectedTool === 'sharp') ? 'sharp'
      : (selectedTool === 'flat') ? 'flat'
      : (selectedTool === 'natural') ? 'natural'
      : 'circle';

    const prevPos = box.getAttribute('data-selected');
    const prevShape = box.getAttribute('data-shape');
    if (
      prevPos !== null &&
      prevPos !== 'null' &&
      parseInt(prevPos) === closestIndex &&
      prevShape === shape
    ) {
      marker.classList.add('hidden');
      accidentalEl.classList.add('hidden');
      marker.innerHTML = '';
      accidentalEl.innerHTML = '';
      box.setAttribute('data-selected', 'null');
      box.setAttribute('data-shape', 'circle');
      updateJSON();
      return;
    }

    marker.className = "notemove absolute left-1/2 -translate-x-1/2 translate-y-1/2 w-5 h-5 bg-black border-2 border-black z-10 flex items-center justify-center select-none pointer-events-none";
    marker.classList.toggle('rounded-full', ['circle','sharp','flat','natural'].includes(shape));
    marker.classList.toggle('rounded-none', shape === 'square');
    marker.classList.remove('hidden');
    marker.style.bottom = `${positionOffsets[closestIndex]}%`;

    accidentalEl.classList.remove('hidden');
    accidentalEl.style.bottom = `calc(${positionOffsets[closestIndex]}%)`;
    if (shape === 'sharp') {
      accidentalEl.innerHTML = getSharpSVG("w-8 h-8 sm:w-11 sm:h-11");
    } else if (shape === 'flat') {
      accidentalEl.innerHTML = getFlatSVG("w-8 h-8 sm:w-11 sm:h-11");
    } else if (shape === 'natural') {
      accidentalEl.innerHTML = getNaturalSVG("w-8 h-8 sm:w-11 sm:h-11");
    } else {
      accidentalEl.innerHTML = '';
      accidentalEl.classList.add('hidden');
    }

    marker.innerHTML = '';
    const letter = document.createElement('span');
    letter.className = 'notenletter';
    letter.innerText = note;
    marker.appendChild(letter);

    if (shape !== 'text' && shape !== 'square') {
      const stick = document.createElement('div');
      stick.className = 'notenstok';
      stick.style.height = '39px';
      if (closestIndex <= stickMiddle) {
        stick.style.left = '88%';
        stick.style.right = '-9px';
        stick.style.transform = 'translateY(-100%)';
      } else {
        stick.style.left = '-2px';
        stick.style.right = 'auto';
        stick.style.transform = 'translateY(0%) rotate(180deg)';
      }
      stick.style.top = '50%';
      marker.appendChild(stick);
    }

    box.setAttribute('data-selected', closestIndex);
    box.setAttribute('data-shape', shape);
    box.setAttribute('data-textonstaff', staffInput.value);
    updateJSON();
  }
}

function toggleOmdraai() {
  if (!selectedBox) return;
  const omdraaiDiv = selectedBox.querySelector('[data-omdraai]');
  if (!omdraaiDiv) return;
  if (selectedBox.getAttribute('data-omdraai') !== 'true') {
    selectedBox.setAttribute('data-omdraai', 'true');
    omdraaiDiv.innerHTML = `
      <svg width="28" height="28" viewBox="0 0 28 28">
        <path d="M5 13c0-3.87 3.13-7 7-7h4" stroke="black" stroke-width="2" fill="none"/>
        <polygon points="15,3 19,6 15,9" fill="black"/>
        <path d="M23 15c0 3.87-3.13 7-7 7h-4" stroke="black" stroke-width="2" fill="none"/>
        <polygon points="13,25 9,22 13,19" fill="black"/>
      </svg>
    `;
  } else {
    selectedBox.setAttribute('data-omdraai', 'false');
    omdraaiDiv.innerHTML = `<span class="omdraai-placeholder"></span>`;
  }
  updateJSON();
}

function updateOmdraaiIcoon(box) {
  const omdraaiDiv = box.querySelector('[data-omdraai]');
  if (!omdraaiDiv) return;
  if (box.getAttribute('data-omdraai') === "true") {
    omdraaiDiv.innerHTML = `
      <svg width="28" height="28" viewBox="0 0 28 28">
        <path d="M5 13c0-3.87 3.13-7 7-7h4" stroke="black" stroke-width="2" fill="none"/>
        <polygon points="15,3 19,6 15,9" fill="black"/>
        <path d="M23 15c0 3.87-3.13 7-7 7h-4" stroke="black" stroke-width="2" fill="none"/>
        <polygon points="13,25 9,22 13,19" fill="black"/>
      </svg>
    `;
  } else {
    omdraaiDiv.innerHTML = `<span class="omdraai-placeholder"></span>`;
  }
}

function clearNoteBlock() {
  if (!selectedBox) return;
  const staff = selectedBox.querySelector('.relative');
  const marker = staff.querySelector('[data-marker]');
  const accidentalEl = staff.querySelector('[data-accidental]');
  marker.classList.add('hidden');
  accidentalEl.classList.add('hidden');
  marker.innerHTML = '';
  accidentalEl.innerHTML = '';
  selectedBox.setAttribute('data-selected', 'null');
  selectedBox.setAttribute('data-shape', 'circle');
  const bovenruimte = selectedBox.querySelector('[data-bovenruimte]');
  if (bovenruimte) {
    const staffInput = bovenruimte.querySelector('input');
    if (staffInput) {
      staffInput.value = '';
      updateTextOnStaffAppearance(staffInput);
      selectedBox.setAttribute('data-textonstaff', '');
    }
  }
  const input = selectedBox.querySelector('input.w-14');
  if (input) {
    input.value = '';
    selectedBox.setAttribute('data-value', '');
  }
  selectedBox.setAttribute('data-omdraai', 'false');
  updateOmdraaiIcoon(selectedBox);
  updateJSON();
}

function updateJSON() {
  const puzzleName = document.getElementById('puzzleNameInput')?.value || '';
  const puzzleAnswer = document.getElementById('puzzleAnswerInput')?.value || '';
  const puzzleLevel = document.getElementById('puzzleLevelInput')?.value || '';
  const puzzleKey = document.getElementById('puzzleKeyInput')?.value || '';
  const puzzleTip = document.getElementById('puzzleTipInput')?.value || '';

  const values = Array.from(container.children)
    .filter(el => !el.getAttribute('data-keysig'))
    .map(el => ({
      answer: el.getAttribute('data-value') || "",
      notePosition: (el.getAttribute('data-shape') === 'text') ? null : (parseInt(el.getAttribute('data-selected')) || null),
      noteShape: el.getAttribute('data-shape'),
      label: el.querySelector('[data-bovenruimte] input') ? el.querySelector('[data-bovenruimte] input').value : "",
      repeatMark: el.getAttribute('data-omdraai') === "true"
    }));
  const jsonObj = {
    puzzleName,
    puzzleAnswer,
    puzzleLevel,
    puzzleKey,
    puzzleTip,
    blocks: values
  };
  window._currentPuzzelJSON = JSON.stringify(jsonObj, null, 2);
}

function moveSelected(dir) {
  if (!selectedBox) return;
  const boxes = Array.from(container.children).filter(el => !el.getAttribute('data-keysig'));
  const index = boxes.indexOf(selectedBox);
  const newIndex = index + dir;
  if (newIndex < 0 || newIndex >= boxes.length) return;
  const refBox = boxes[newIndex];
  container.removeChild(selectedBox);
  container.insertBefore(selectedBox, dir === 1 ? refBox.nextSibling : refBox);
  updateJSON();
  selectBox(selectedBox);
}

function removeSelected() {
  if (selectedBox) {
    container.removeChild(selectedBox);
    selectedBox = null;
    updateJSON();
  }
}

function downloadJSON() {
  updateJSON();
  const puzzleName = document.getElementById('puzzleNameInput')?.value || '';
  const puzzleLevel = document.getElementById('puzzleLevelInput')?.value || '';
  let filename = "puzzel.json";
  if (puzzleName.trim() && puzzleLevel.trim()) {
    filename = `${puzzleName.trim().replace(/[^a-zA-Z0-9_-]/g, "_")}_${puzzleLevel.trim().replace(/[^a-zA-Z0-9_-]/g, "_")}.json`;
  } else if (puzzleName.trim()) {
    filename = `${puzzleName.trim().replace(/[^a-zA-Z0-9_-]/g, "_")}.json`;
  }
  const dataStr = window._currentPuzzelJSON;
  const blob = new Blob([dataStr], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function loadJSONFile(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const obj = JSON.parse(e.target.result);
      document.getElementById('puzzleNameInput').value = obj.puzzleName || '';
      document.getElementById('puzzleAnswerInput').value = obj.puzzleAnswer || '';
      document.getElementById('puzzleLevelInput').value = obj.puzzleLevel || '';
      document.getElementById('puzzleKeyInput').value = obj.puzzleKey || '';
      document.getElementById('puzzleTipInput').value = obj.puzzleTip || '';
      if(obj.blocks && Array.isArray(obj.blocks)){
        loadBlocksFromJSON(obj.blocks);
      } else {
        loadBlocksFromJSON(Array.isArray(obj) ? obj : []);
      }
      addKeySignatureBlock();
    } catch (err) {
      alert("Kon bestand niet laden (geen geldig JSON)");
    }
  };
  reader.readAsText(file);
}

function loadBlocksFromJSON(arr) {
  Array.from(container.children)
    .filter(el => !el.getAttribute('data-keysig'))
    .forEach(el => container.removeChild(el));
  selectedBox = null;
  arr.forEach(item => {
    const box = document.createElement('div');
    box.className = "notenblokkie bg-transparent p-1 flex border-4 flex-col items-center border border-transparent";
    box.setAttribute('data-id', idCounter++);
    box.setAttribute('data-selected', (item.notePosition === null ? 'null' : item.notePosition));
    box.setAttribute('data-shape', item.noteShape || 'circle');
    box.setAttribute('data-textonstaff', item.label || '');
    box.setAttribute('data-omdraai', item.repeatMark ? 'true' : 'false');
    box.setAttribute('data-value', item.answer || '');

    const staff = document.createElement('div');
    staff.className = "relative h-48 w-14 bg-transparent mb-3 cursor-pointer";
    staff.style.overflow = "visible";
    staff.innerHTML = getNotenbalkSVG();

    const marker = document.createElement('div');
    marker.className = "notemove absolute left-1/2 -translate-x-1/2 translate-y-1/2 w-5 h-5 bg-black border-2 border-black z-10 flex items-center justify-center rounded-full hidden select-none pointer-events-none";
    marker.setAttribute('data-marker', '');
    staff.appendChild(marker);

    const accidental = document.createElement('div');
    accidental.className = "absolute left-[32%] -translate-x-full translate-y-[45%] z-10 pointer-events-none select-none hidden";
    accidental.setAttribute('data-accidental', '');
    staff.appendChild(accidental);

    if (item.notePosition !== null && !isNaN(item.notePosition)) {
      let shape = item.noteShape || 'circle';
      marker.classList.remove('hidden');
      marker.classList.toggle('rounded-full', ['circle','sharp','flat','natural'].includes(shape));
      marker.classList.toggle('rounded-none', shape === 'square');
      marker.style.bottom = `${positionOffsets[item.notePosition]}%`;
      accidental.classList.remove('hidden');
      accidental.style.bottom = `calc(${positionOffsets[item.notePosition]}%)`;
      if (shape === 'sharp') {
        accidental.innerHTML = getSharpSVG("w-8 h-8 sm:w-11 sm:h-11");
      } else if (shape === 'flat') {
        accidental.innerHTML = getFlatSVG("w-8 h-8 sm:w-11 sm:h-11");
      } else if (shape === 'natural') {
        accidental.innerHTML = getNaturalSVG("w-8 h-8 sm:w-11 sm:h-11");
      } else {
        accidental.innerHTML = '';
        accidental.classList.add('hidden');
      }
      marker.innerHTML = '';
      const letter = document.createElement('span');
      letter.className = 'notenletter';
      letter.innerText = noteNames[item.notePosition];
      marker.appendChild(letter);
      if (shape !== 'text' && shape !== 'square') {
        const stick = document.createElement('div');
        stick.className = 'notenstok';
        stick.style.height = '39px';
        if (item.notePosition <= stickMiddle) {
          stick.style.left = '88%';
          stick.style.right = '-9px';
          stick.style.transform = 'translateY(-100%)';
        } else {
          stick.style.left = '-2px';
          stick.style.right = 'auto';
          stick.style.transform = 'translateY(0%) rotate(180deg)';
        }
        stick.style.top = '50%';
        marker.appendChild(stick);
      }
    }

    box.appendChild(staff);

    const bovenruimte = document.createElement('div');
    bovenruimte.className = "h-8 flex items-center justify-center w-full";
    bovenruimte.setAttribute('data-bovenruimte', '');

    const staffInput = document.createElement('input');
    staffInput.type = "text";
    staffInput.maxLength = 12;
    staffInput.className = (item.label && item.label.trim() !== "") ? "input-onstaff filled" : "input-onstaff";
    staffInput.value = item.label || "";
    staffInput.addEventListener('input', function () {
      box.setAttribute('data-textonstaff', staffInput.value);
      updateTextOnStaffAppearance(staffInput);
      updateJSON();
    });
    bovenruimte.appendChild(staffInput);
    box.appendChild(bovenruimte);

    const omdraaiDiv = document.createElement('div');
    omdraaiDiv.setAttribute('data-omdraai', '');
    omdraaiDiv.className = "omdraai-icoon";
    if (item.repeatMark) {
      omdraaiDiv.innerHTML = `
        <svg width="28" height="28" viewBox="0 0 28 28">
          <path d="M5 13c0-3.87 3.13-7 7-7h4" stroke="black" stroke-width="2" fill="none"/>
          <polygon points="15,3 19,6 15,9" fill="black"/>
          <path d="M23 15c0 3.87-3.13 7-7 7h-4" stroke="black" stroke-width="2" fill="none"/>
          <polygon points="13,25 9,22 13,19" fill="black"/>
        </svg>
      `;
    } else {
      omdraaiDiv.innerHTML = `<span class="omdraai-placeholder"></span>`;
    }
    box.appendChild(omdraaiDiv);

    const input = document.createElement('input');
    input.setAttribute('maxlength', 5);
    input.className = "w-14 border-2 border-black rounded text-center text-base outline-none mt-2 bg-white";
    input.value = item.answer || "";
    input.addEventListener('input', () => {
      box.setAttribute('data-value', input.value);
      updateJSON();
    });
    box.appendChild(input);

    box.addEventListener('click', function(e) {
      e.stopPropagation();
      selectBox(box);
    });
    staff.addEventListener('mousedown', e => {
      if(selectedTool === 'hand') return;
      handleStaffClick(e, box, staff);
    });

    container.appendChild(box);
    updateTextOnStaffAppearance(staffInput);
  });
  updateJSON();
}

window.addEventListener('DOMContentLoaded', () => {
  addKeySignatureBlock();
  addTextbox();
  selectTool('circle');
});
