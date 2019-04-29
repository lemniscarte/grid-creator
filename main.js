// debugging for coordinates

let debugText = "COORDINATES GO HERE";
let debugDiv = document.createElement("div");
let gridElement = document.getElementsByClassName("grid")[0];
debugDiv.innerHTML = debugText;

debugDiv.className = "debugger";

document.body.addEventListener("mousemove", function(e){
	debugText = e.pageX.toString() + ' x ' + e.pageY.toString();
	debugDiv.innerHTML = debugText;
}, false);

document.body.addEventListener("touchstart", function(e){
	debugText = e.pageX.toString() + ' x ' + e.pageY.toString();
	debugDiv.innerHTML = debugText;
}, false);

gridElement.appendChild(debugDiv);

// stackoverflow copy paste of mobile detection
// crossing fingers!

var isMobile = false;
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
}

// formula to convert MIDInote to herz
function midiToFreq(midiNote){
	let midi = [];
	let a = 440; // a is 440 hz
	for (i = 0; i < 127; ++i) {
		midi[i] = (a / 32) * Math.pow(2, ((i - 9) / 12));
	};
	return midi[midiNote];
};

function playTone(freq, isOn) {
	if (isOn === undefined) {
		isOn = true;
	}

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
	}
};

function createGrid(options) {

  let w = options.w;
  let h = options.h;
  let cw = options.cw;
  let ch = options.ch;
  let tag = options.tag;
  let root = options.root;
	let baseClass = options.baseClass;
	let baseNote = options.baseNote;

	// w = cells on x axis
	// h = cells on y axis
	// cw = cell width ('px' is added in the function)
	// ch = cell height ('px' is added in the function)
	// tag = what tag to make cells as (div, button, a, etc)
	// root = what element to attach cell grid to (div, html, body, etc)
	// baseClass = class all cells should have ('keys', 'gridBtn', etc)
	// baseNote = pick the lowest note in the grid

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

	// let's add the container to the DOM
	let rootElement = document.getElementsByClassName(root)[0];

	let containerElement = document.createElement("div");
	containerElement.className = "container";
	containerElement.style.display = "grid";
	containerElement.style.gridTemplateColumns = `repeat(${w}, ${cw}px)`;
	containerElement.style.gridTemplateRows = `repeat(${h}, ${ch}px)`;
	

	// is this a good idea?
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

	allArrays.forEach(innerArray => {
		innerArray.forEach(item => {
			// console.log(item);
			// item.classList.add() ???
		});
	});

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
		newElement.setAttribute("draggable", "false");

		//give different tap/click behaviours depending on user agent

		// newElement.setAttribute("ontouchstart", `playTone(midiToFreq(${i+baseNote}), true)`, false);
		// newElement.setAttribute("ontouchend", `playTone(null, false)`, false);
		// newElement.setAttribute("ontouchmove", `playTone(null, false)`, false);
		// newElement.setAttribute("ontouchcancel", `playTone(null, false)`, false);

		newElement.setAttribute("onmouseup", `playTone(null, false)`, false);
		newElement.setAttribute("onmouseout", `playTone(null, false)`, false);
		
		// if (isMobile) {
		// 	newElement.setAttribute("ontouchstart", `playTone(midiToFreq(${i+baseNote}), true)`, false);
		// 	newElement.setAttribute("ontouchend", `playTone(null, false)`, false);
		// 	newElement.setAttribute("ontouchmove", `playTone(null, false)`, false);
		// 	newElement.setAttribute("ontouchcancel", `playTone(null, false)`, false);
		// };

		// if (!isMobile) {
		// 	newElement.addEventListener("mousedown", function(e){
		// 		let idClass = e.target.classList[1] % 24;
				
		// 		if (idClass != 0) {
		// 			if (allOddRows.includes(idClass)) {
		// 				let note = (idClass + baseNote) - 1;
		// 				// console.log(idClass - 1);
		// 				playTone(midiToFreq(note), true);
		// 			} else {
		// 				// console.log('doesnt include', idClass);
		// 				let note = (idClass + baseNote) - 1;
		// 				playTone(midiToFreq(note), true);
		// 			}
		// 		} else if (idClass == 0) {
		// 			// console.log('doesnt include', idClass);
		// 			let note = (idClass + baseNote) - 1;
		// 			playTone(midiToFreq((24 + baseNote) - 1))
		// 		}
		// 	}, false);

		// 	// newElement.setAttribute("onmousedown", `playTone(midiToFreq(${i+baseNote}), true)`, false);
		// 	newElement.setAttribute("onmouseup", `playTone(null, false)`, false);
		// 	newElement.setAttribute("onmouseout", `playTone(null, false)`, false);
		// };

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
			
			// pertaining to MIDInotes
			let helperIndex = (i % (2 * w));
			let noteIndex = helperIndex + baseNote + (noteAccum % w);

			// mouse events
			newElement.addEventListener("mousedown", function(e){
				playTone(midiToFreq(noteIndex), true)
			}, false);

			newElement.addEventListener("mouseup", function(e){
				playTone(midiToFreq(noteIndex), false)
			}, false);

			newElement.addEventListener("mouseout", function(e){
				playTone(midiToFreq(noteIndex), false)
			}, false);

			newElement.addEventListener("mouseleave", function(e){
				playTone(midiToFreq(noteIndex), false)
			}, false);

			// touch events
			newElement.addEventListener("touchstart", function(e){
				playTone(midiToFreq(noteIndex), true)
			}, false);
			
			newElement.addEventListener("touchend", function(e){
				playTone(midiToFreq(noteIndex), false)
			}, false);
			
			newElement.addEventListener("touchmove", function(e){
				playTone(midiToFreq(noteIndex), false)
			}, false);
			
			newElement.addEventListener("touchcancel", function(e){
				playTone(midiToFreq(noteIndex), false)
			}, false);

			noteAccum += 1;
		};

    if (allEvenRows.includes(i)) {
			newElement.classList.add("allEvenRows");

			// pertaining to MIDInotes
			let helperIndex = (i % (2 * w));
			let noteIndex = (helperIndex == 0 ? (2 * w - 1) : helperIndex - 1) + baseNote + (noteAccum % w) - w;

			// mouse events
			newElement.addEventListener("mousedown", function(e){
				playTone(midiToFreq(noteIndex), true)
			}, false);

			newElement.addEventListener("mouseup", function(e){
				playTone(midiToFreq(noteIndex), false)
			}, false);

			newElement.addEventListener("mouseout", function(e){
				playTone(midiToFreq(noteIndex), false)
			}, false);

			newElement.addEventListener("mouseleave", function(e){
				playTone(midiToFreq(noteIndex), false)
			}, false);

			// touch events
			newElement.addEventListener("touchstart", function(e){
				playTone(midiToFreq(noteIndex), true)
			}, false);
			
			newElement.addEventListener("touchend", function(e){
				playTone(midiToFreq(noteIndex), false)
			}, false);
			
			newElement.addEventListener("touchmove", function(e){
				playTone(midiToFreq(noteIndex), false)
			}, false);
			
			newElement.addEventListener("touchcancel", function(e){
				playTone(midiToFreq(noteIndex), false)
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

	// let thisContainer = document.getElementsByClassName("container");
	// console.log(thisContainer);

	// let cSharpRow = document.getElementsByClassName("allOddRows");
	// console.log(cSharpRow);

	// allOddRows.forEach((item, index) => {
	// 	let cSharpRow = getElementsByClassName("allOddRows");
	// 	let accum = 0;
	// 	(item, index, accum) => {
			
	// 	}	;
	// });
	// console.log()

	// for (j = 0, accum = -1; j < w; j++) {

	// 	console.log(j)
	// // 	let tone = (allOddRows[j] + baseNote) - 1;
	// // 	// allOddRows[j].
	// // 	newElement.addEventListener("mousedown", function(e){
	// // 		let TEST = newElement.classList[1];
	// // 		console.log(TEST);
	// // 	}, false);
	// // 	accum += 
	// }

	rootElement.appendChild(containerElement);

  // uncomment for debugging (or method chaining)
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
let osc = null;

// let envelope = new Tone.Envelope({
// 	"attack" : 0.5,
// 	"decay" : 0.2,
// 	"sustain" : 1,
// 	"release" : 1,
// });

// envelope.connect(audioContext.destination);

createGrid({
  "w": 18,
  "h": 4,
  "cw": 50,
  "ch": 50,
  "tag": "div",
  "root": "grid",
	"baseClass": "key",
	"baseNote": 84
});

createGrid({
  "w": 18,
  "h": 4,
  "cw": 50,
  "ch": 50,
  "tag": "div",
  "root": "grid",
	"baseClass": "key",
	"baseNote": 60
});

createGrid({
  "w": 18,
  "h": 4,
  "cw": 50,
  "ch": 50,
  "tag": "div",
  "root": "grid",
	"baseClass": "key",
	"baseNote": 36
});