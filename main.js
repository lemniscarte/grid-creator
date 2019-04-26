function midiToFreq2(midiNote){
	let midi = [];
	let a = 440; // a is 440 hz
	for (i = 0; i < 127; ++i) {
		midi[i] = (a / 32) * Math.pow(2, ((i - 9) / 12));
	};
	return midi[midiNote];
};

console.log(midiToFreq2(69));

// this one is less accurate??
// function midiToFreq(midiNote) {
// 	return 261 * Math.pow(2, (midiNote-60)/12.0);
// };
// console.log(midiToFreq(69));

function createGrid(options) {

  let w = options.w;
  let h = options.h;
  let cw = options.cw;
  let ch = options.ch;
  let tag = options.tag;
  let root = options.root;
  let baseClass = options.baseClass;

	// w = cells on x axis
	// h = cells on y axis
	// cw = cell width ('px' is added in the function)
	// ch = cell height ('px' is added in the function)
	// tag = what tag to make cells as (div, button, a, etc)
	// root = what element to attach cell grid to (div, html, body, etc)
	// baseClass = class all cells should have ('keys', 'gridBtn', etc)

	let totalCells = w * h;

	let totalCellsArray = [];
	for (i = 1; i <= totalCells; i++) {
		totalCellsArray.push(i);
	}

	let upperLeftCorner = 1;
	let upperRightCorner = w;
	let lowerLeftCorner = totalCells - w + 1;
	let lowerRightCorner = totalCells;

	let allCorners = [
		upperLeftCorner,
		upperRightCorner,
		lowerLeftCorner,
		lowerRightCorner
	];

	let firstRow = [];
	let lastRow = [];
	let firstCol = [];
	let lastCol = [];
	let oddRows = [];
	let evenRows = [];
	let oddCols = [];
	let evenCols = [];

	for (i = 1; i <= w; i++) {
		firstRow.push(i);
	}

	for (i = lowerLeftCorner; i <= lowerRightCorner; i++) {
		lastRow.push(i);
	}

	for (i = 1; i < totalCells; i += w) {
		firstCol.push(i);
	}

	firstCol.map(x => lastCol.push(x + (w - 1)));

	let numsInOddRows = [];
	let numsInEvenRows = [];
	for (i = 0; i < firstCol.length; i++) {
		if ((i + 1) % 2 == 0) {
			numsInEvenRows.push(firstCol[i]);
		} else if ((i + 1) % 2 != 0) {
			numsInOddRows.push(firstCol[i]);
		}
	}

  //these are put together as 2d arrays, but I only use them after flattening
	for (i = 0; i < numsInOddRows.length; i++) {
		let oddRow = [];
		for (j = numsInOddRows[i]; j < numsInOddRows[i] + w; j++) {
			oddRow.push(j);
		}
		oddRows.push(oddRow);
	}

	for (i = 0; i < numsInEvenRows.length; i++) {
		let evenRow = [];
		for (j = numsInEvenRows[i]; j < numsInEvenRows[i] + w; j++) {
			evenRow.push(j);
		}
		evenRows.push(evenRow);
	}

	let allOddRows = [].concat.apply([], oddRows);
	let allEvenRows = [].concat.apply([], evenRows);

	let numsInOddCols = [];
	let numsInEvenCols = [];
	for (i = 0; i < firstRow.length; i++) {
		if ((i + 1) % 2 == 0) {
			numsInEvenCols.push(firstRow[i]);
		} else if ((i + 1) % 2 != 0) {
			numsInOddCols.push(firstRow[i]);
		}
	}

  //these are put together as 2d arrays, but I only use them after flattening
	for (i = 0; i < numsInOddCols.length; i++) {
		let oddCol = [];
		for (j = numsInOddCols[i], accum = j; j < numsInOddCols[i] + h; j++) {
			oddCol.push(accum);
			accum += w;
		}
		oddCols.push(oddCol);
	}

	for (i = 0; i < numsInEvenCols.length; i++) {
		let evenCol = [];
		for (j = numsInEvenCols[i], accum = j; j < numsInEvenCols[i] + h; j++) {
			evenCol.push(accum);
			accum += w;
		}
		evenCols.push(evenCol);
	}

  // these are the flattened 2d arrays
	let allOddCols = [].concat.apply([], oddCols);
	let allEvenCols = [].concat.apply([], evenCols);

	// let's add them to the DOM!
	let rootElement = document.getElementsByClassName(root)[0];

	let containerElement = document.createElement("div");
	containerElement.className = "container";
	containerElement.style.display = "grid";
	containerElement.style.gridTemplateColumns = `repeat(${w}, ${cw}px)`;
  containerElement.style.gridTemplateRows = `repeat(${h}, ${ch}px)`;
  
  // that's what we're here for!
	for (i = 1; i <= totalCellsArray.length; i++) {
    let newElement = document.createElement(tag);
    
    //give each element a base set of style/classes
		newElement.style.width = `${cw}px`;
		newElement.style.height = `${ch}px`;
		newElement.className = baseClass;
		newElement.classList.add([i]);
		newElement.setAttribute("onmouseover", `playTone(${i*10}, true)`, true);
		newElement.setAttribute("onmouseout", `playTone(${i*10}, false)`, true);

    //specific classes
		if (i == upperLeftCorner) {
			newElement.classList.add("upperLeftCorner");
		};
		if (i == upperRightCorner) {
			newElement.classList.add("upperRightCorner");
		};
		if (i == lowerLeftCorner) {
			newElement.classList.add("lowerLeftCorner");
		};
		if (i == lowerRightCorner) {
			newElement.classList.add("lowerRightCorner");
		};
		if (allCorners.includes(i)) {
      newElement.classList.add("allCorners");
    };
    if (firstRow.includes(i)) {
      newElement.classList.add("firstRow");
    };
    if (lastRow.includes(i)) {
      newElement.classList.add("lastRow");
    };
    if (firstCol.includes(i)) {
      newElement.classList.add("firstCol");
    };
    if (lastCol.includes(i)) {
      newElement.classList.add("lastCol");
    };
    if (allOddRows.includes(i)) {
			newElement.classList.add("allOddRows");
			//add event listener for playTone()
			//from 1+(x*12) and up in increments of 2, so it always hits the C#
			//the x can be the octave!
    };
    if (allEvenRows.includes(i)) {
			newElement.classList.add("allEvenRows");
			//add event listener for playTone()
			//from (x*12) and up in increments of 2, so it always hits the C
			//the x can be the octave!
    };
    if (allOddCols.includes(i)) {
      newElement.classList.add("allOddCols");
    };
    if (allEvenCols.includes(i)) {
      newElement.classList.add("allEvenCols");
    };

		containerElement.appendChild(newElement);
	};

	rootElement.appendChild(containerElement);

  // uncomment for debugging
	// return `
  // Attach to: ${rootElement}
  // Total cells: ${totalCells}
  // Tota cells array: ${totalCellsArray}
  // UL corner: ${upperLeftCorner}
  // UR corner: ${upperRightCorner}
  // LL corner: ${lowerLeftCorner}
  // LR corner: ${lowerRightCorner}
  // First row: ${firstRow}
  // Last row: ${lastRow}
  // First col: ${firstCol}
  // Last col: ${lastCol}
  // Odd rows: ${oddRows}
  // Even rows: ${evenRows}
  // Odd cols: ${oddCols}
  // Even cols: ${evenCols}
  // All Odd rows: ${allOddRows}
  // All Even rows: ${allEvenRows}
  // All Odd cols: ${allOddCols}
  // All Even cols: ${allEvenCols}`;
};

let audioContext = new (window.AudioContext || window.webkitAudioContext);
let osc = null

function playTone(freq, bool) {
	if (bool === undefined) bool = true;

	if (bool) {
		osc = audioContext.createOscillator();
		osc.frequency.value = freq;
		osc.start(audioContext.currentTime);
		osc.connect(audioContext.destination);
	} else {
		osc.stop(audioContext.currentTime);
		osc.disconnect(audioContext.destination);
		osc = null;
	}
};

createGrid({
  "w": 12,
  "h": 6,
  "cw": 50,
  "ch": 50,
  "tag": "div",
  "root": "grid",
  "baseClass": "key"
});