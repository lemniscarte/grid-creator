// formula to convert MIDInote to herz
function midiToFreq(midiNote){
	let midi = [];
	let a = 440; // a is 440 hz
	for (i = 0; i < 127; ++i) {
		midi[i] = (a / 32) * Math.pow(2, ((i - 9) / 12));
	};
	return midi[midiNote];
};

// play tone from converted MIDInote, using vanilla web audio
function playTone(freq, isOn) {
	if (isOn === undefined) { isOn = true };

	if (isOn) {
		osc = audioContext.createOscillator();
		osc.frequency.value = freq;
		osc.start(audioContext.currentTime);
		// osc.connect(envelope);
		osc.connect(audioContext.destination);
	} else if (osc) {
		osc.stop(audioContext.currentTime);
		// osc.disconnect(envelope);
		osc.disconnect(audioContext.destination);
		osc = null;
	};
};

// ok, here we go
function createGrid(options) {

	let containerName = options.containerName;
  let w = options.w;
  let h = options.h;
  let cw = options.cw;
  let ch = options.ch;
  let tag = options.tag;
  let root = options.root;
	let baseClass = options.baseClass;
	let baseNote = options.baseNote;
	let hueRotation = options.hueRotation;
	let baseHue = options.baseHue;
	let oddRowOffset = options.oddRowOffset;
	let gridColumnGap = options.gridColumnGap;
	let gridRowGap = options.gridRowGap;
	let containerBorder = options.containerBorder;
	let borderRadius = options.borderRadius;
	let containerPadding = options.containerPadding;
	let whiteKeys = options.whiteKeys;
	let blackKeys = options.blackKeys;
	let cellBorderRadius = options.cellBorderRadius;
	let hoverHueRotation = options.hoverHueRotation;

	// containerName = pick the class name for the containing div
	// w = how many cells on x axis
	// h = how many cells on y axis
	// cw = cell width ('px' is added in the function)
	// ch = cell height ('px' is added in the function)
	// tag = what tag to make cells as (div, button, a, etc)
	// root = what element to attach cell grid to (div, html, body, etc)
	// baseClass = class all cells should have ('keys', 'gridBtn', etc)
	// baseNote = pick the lowest note in the grid, in MIDInote
	// hueRotation = after an octave (12 semitones), should the extra keys' hue rotate?
	// baseHue = rotate the hue of the base color
	// gridColumnGap = horizontal gap between cells
	// gridRowGap = vertical gap between cells
	// containerBorder = border of containing div in (Xpx, style, color) format
	// borderRadius = rounded borders? sure!
	// containerPadding = padding of containing div
	// whiteKeys = color for white keys
	// blackKeys = color for black keys
	// cellBorderRadius = border radius for cells
	// hoverHueRotation = hue rotation for hover on cells

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

	// first numbers in respective rows, helper arrays only
	let numsInOddRows = [];
	let numsInEvenRows = [];
	for (i = 0; i < firstCol.length; i++) {
		if ((i + 1) % 2 == 0) {
			numsInEvenRows.push(firstCol[i]);
		} else if ((i + 1) % 2 != 0) {
			numsInOddRows.push(firstCol[i]);
		}
	}

	//these are put together as 2d arrays, but so far I only use them after flattening
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

  // these are the flattened 2d arrays
	let allOddRows = [].concat(...oddRows);
	let allEvenRows = [].concat(...evenRows);

	let numsInOddCols = [];
	let numsInEvenCols = [];
	for (i = 0; i < firstRow.length; i++) {
		if ((i + 1) % 2 == 0) {
			numsInEvenCols.push(firstRow[i]);
		} else if ((i + 1) % 2 != 0) {
			numsInOddCols.push(firstRow[i]);
		}
	}

  //these are put together as 2d arrays, but so far I only use them after flattening
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

	// let's add the container to the DOM
	let rootElement = document.getElementsByClassName(root)[0];

	let containerElement = document.createElement("div");

	// adding classes to the cointaining div
	containerElement.className = containerName;
	containerElement.style.display = "grid";
	containerElement.style.width = `fit-content`;
	containerElement.style.gridTemplateColumns = `repeat(${w}, ${cw}px)`;
	containerElement.style.gridTemplateRows = `repeat(${h}, ${ch}px)`;
	containerElement.style.gridColumnGap = `${gridColumnGap}px`;
	containerElement.style.gridRowGap = `${gridRowGap}px`;
	containerElement.style.border = `${containerBorder}`;
	containerElement.style.borderRadius = `${borderRadius}px`;
	containerElement.style.padding = `${containerPadding}px`;
	containerElement.style.paddingRight = `${oddRowOffset/2 + cw/2}px`;
	containerElement.style.filter = `hue-rotate(${baseHue}deg)`;

	// just in case I need it
	let allArrays = [
		[upperLeftCorner],
		[upperRightCorner],
		[lowerLeftCorner],
		[lowerRightCorner],
		allCorners,
		firstRow,
		lastRow,
		firstCol,
		lastCol,
		allOddRows,
		allEvenRows,
		allOddCols,
		allEvenCols	
	];

	// make keys in rows skip by wholetones (2 MIDInotes)
	let noteAccum = 0;
  
	// loop through all the cells and
	// add general styles and classes,
	// add event listeners for clicks/taps -> playtone(),
	// add specific classes
	for (i = 1; i <= totalCellsArray.length; i++) {
    let newElement = document.createElement(tag);
    
    //give each element a base set of style/classes
		newElement.style.width = `${cw}px`;
		newElement.style.height = `${ch}px`;
		newElement.className = baseClass;
		newElement.classList.add([i]);
		newElement.style.borderRadius = `${cellBorderRadius}`;
		newElement.setAttribute("draggable", "false");

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
			newElement.style.transform = `translateX(${oddRowOffset}px)`;
			
			let helperIndex = (i % (2 * w));

			let helperWhiteKeys = [3, 4, 5, 6, 9, 10, 11, 12];
			let helperBlackKeys = [1, 2, 7, 8];

			if (helperIndex > 12) {
				newElement.style.filter = `hue-rotate(${hueRotation}deg)`;
			};

			if (helperWhiteKeys.includes(helperIndex % 12 == 0 ? 12 : helperIndex % 12)) {
				newElement.style.backgroundColor = `${whiteKeys}`;
			}
			if (helperBlackKeys.includes(helperIndex % 12 == 0 ? 12 : helperIndex % 12)) {
				newElement.style.backgroundColor = `${blackKeys}`;
			};

			let noteIndex = helperIndex + baseNote + (noteAccum % w);

			// mouse events
			newElement.addEventListener("mouseover", function(e) {
				e.preventDefault();
				playTone(midiToFreq(noteIndex), true);
			}, false);

			newElement.addEventListener("mousedown", function(e) {
				e.preventDefault();
				playTone(midiToFreq(noteIndex), true);
			}, false);

			newElement.addEventListener("mouseup", function(e) {
				e.preventDefault();
				playTone(midiToFreq(noteIndex), false);
			}, false);

			newElement.addEventListener("mouseout", function(e) {
				e.preventDefault();
				playTone(midiToFreq(noteIndex), false);
			}, false);

			newElement.addEventListener("mouseleave", function(e) {
				e.preventDefault();
				playTone(midiToFreq(noteIndex), false);
			}, false);

			// touch events
			newElement.addEventListener("touchstart", function(e) {
				e.preventDefault();
				playTone(midiToFreq(noteIndex), true);
			}, false);
			
			newElement.addEventListener("touchend", function(e) {
				e.preventDefault();
				playTone(midiToFreq(noteIndex), false);
			}, false);
			
			newElement.addEventListener("touchmove", function(e) {
				e.preventDefault();
				playTone(midiToFreq(noteIndex), false);
			}, false);
			
			newElement.addEventListener("touchcancel", function(e) {
				e.preventDefault();
				playTone(midiToFreq(noteIndex), false);
			}, false);
			
			newElement.addEventListener("touchleave", function(e) {
				e.preventDefault();
				playTone(midiToFreq(noteIndex), false);
			}, false);

			noteAccum += 1;
		};

    if (allEvenRows.includes(i)) {
			newElement.classList.add("allEvenRows");

			let helperIndex = (i - w) % (2 * w);

			let helperWhiteKeys = [1, 2, 3, 7, 8, 9];
			let helperBlackKeys = [4, 5, 6, 10, 11, 12];

			if (helperIndex > 12) {
				newElement.style.filter = `hue-rotate(${hueRotation}deg)`;
			};

			if (helperWhiteKeys.includes(helperIndex % 12 == 0 ? 12 : helperIndex % 12)) {
				newElement.style.backgroundColor = `${whiteKeys}`;
			}
			if (helperBlackKeys.includes(helperIndex % 12 == 0 ? 12 : helperIndex % 12)) {
				newElement.style.backgroundColor = `${blackKeys}`;
			};

			let noteIndex = helperIndex + baseNote + (noteAccum % w) - 1;
			
			// mouse events
			newElement.addEventListener("mouseover", function(e) {
				e.preventDefault();
				playTone(midiToFreq(noteIndex), true);
			}, false);
			
			newElement.addEventListener("mousedown", function(e) {
				e.preventDefault();
				playTone(midiToFreq(noteIndex), true);
			}, false);

			newElement.addEventListener("mouseup", function(e) {
				e.preventDefault();
				playTone(midiToFreq(noteIndex), false);
			}, false);

			newElement.addEventListener("mouseout", function(e) {
				e.preventDefault();
				playTone(midiToFreq(noteIndex), false);
			}, false);

			newElement.addEventListener("mouseleave", function(e) {
				e.preventDefault();
				playTone(midiToFreq(noteIndex), false);
			}, false);

			// touch events
			newElement.addEventListener("touchstart", function(e) {
				e.preventDefault();
				playTone(midiToFreq(noteIndex), true);
			}, false);
			
			newElement.addEventListener("touchend", function(e) {
				e.preventDefault();
				playTone(midiToFreq(noteIndex), false);
			}, false);
			
			newElement.addEventListener("touchmove", function(e) {
				e.preventDefault();
				playTone(midiToFreq(noteIndex), false);
			}, false);
			
			newElement.addEventListener("touchcancel", function(e) {
				e.preventDefault();
				playTone(midiToFreq(noteIndex), false);
			}, false);
			
			newElement.addEventListener("touchleave", function(e) {
				e.preventDefault();
				playTone(midiToFreq(noteIndex), false);
			}, false);

			noteAccum += 1;
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

	var hover = `.${baseClass}:hover{ filter: hue-rotate(${hoverHueRotation}deg) !important; }`;
	var style = document.createElement('style');

	if (style.styleSheet) {
			style.styleSheet.cssText = hover;
	} else {
			style.appendChild(document.createTextNode(hover));
	}

	document.getElementsByTagName('head')[0].appendChild(style);
};

let audioContext = new (window.AudioContext || window.webkitAudioContext);
let osc = null;

// let envelope = new Tone.Envelope({
// 	"attack" : 0.5,
// 	"decay" : 0.2,
// 	"sustain" : 1,
// 	"release" : 1,
// });
// envelope.connect(audioContext.destination);

window.onload = function() {
	// Page loaded
	// let testDiv = document.getElementsByClassName("grid")[0];
	// console.log(testDiv)
	// testDiv.innerHTML = "test";

	createGrid({
		"containerName": "container1",
		"w": 18,
		"h": 4,
		"cw": 50,
		"ch": 50,
		"tag": "div",
		"root": "grid",
		"baseClass": "key1",
		"baseNote": 84,
		"whiteKeys": "hsl(9, 100%, 64%)",
		"blackKeys": "hsl(49, 83%, 53%)",
		"hueRotation": 0,
		"baseHue": 0,
		"oddRowOffset": 30,
		"gridColumnGap": 10,
		"gridRowGap": 0,
		"containerBorder": "2px firebrick solid",
		"borderRadius": 10,
		"containerPadding": 10,
		"cellBorderRadius": "100%",
		"hoverHueRotation": -200
	});
	
	createGrid({
		"containerName": "container2",
		"w": 18,
		"h": 4,
		"cw": 50,
		"ch": 50,
		"tag": "div",
		"root": "grid",
		"baseClass": "key2",
		"baseNote": 60,
		"whiteKeys": "hsl(9, 100%, 64%)",
		"blackKeys": "hsl(49, 83%, 53%)",
		"hueRotation": 0,
		"baseHue": -30,
		"oddRowOffset": 30,
		"gridColumnGap": 10,
		"gridRowGap": 0,
		"containerBorder": "2px firebrick solid",
		"borderRadius": 10,
		"containerPadding": 10,
		"cellBorderRadius": "100%",
		"hoverHueRotation": -150
	});
	
	createGrid({
		"containerName": "container3",
		"w": 18,
		"h": 6,
		"cw": 50,
		"ch": 50,
		"tag": "div",
		"root": "grid",
		"baseClass": "key3",
		"baseNote": 36,
		"whiteKeys": "hsl(9, 100%, 64%)",
		"blackKeys": "hsl(49, 83%, 53%)",
		"hueRotation": 0,
		"baseHue": -60,
		"oddRowOffset": 30,
		"gridColumnGap": 10,
		"gridRowGap": 0,
		"containerBorder": "2px firebrick solid",
		"borderRadius": 10,
		"containerPadding": 10,
		"cellBorderRadius": "100%",
		"hoverHueRotation": -100
	});
};