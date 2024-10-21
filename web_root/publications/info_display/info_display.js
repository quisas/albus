// JS library for info screen
// No external dependencies in here! Just plain JavaScript.


// LIB ==============================================================

// Reload whole page, but if Kiosk is visible wait and try again
function niceReload() {
	if (kioskIsVisible()) {
		setTimeout(niceReload, 5000);
	} else {
		reloadSelf();
	}
}

function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

// CLOCK ============================================================

function clockInit(size, canvasWrapperId) {
	
	const canvas = document.createElement("canvas");
	const halfsize = size / 2;
	const pi = Math.PI;
	
	canvas.id = 'clockCanvas'
	canvas.width = size;
	canvas.height = size;
	
	document.getElementById(canvasWrapperId).appendChild(canvas);
	const ctx = canvas.getContext("2d");

	// Move origin to center, easier for circle-ish stuff, and flip y-axis to be a natural x/y system
	ctx.setTransform(1, 0, 0, -1, halfsize, halfsize);
	ctx.strokeStyle = '#000';
	ctx.fillStyle = '#fff';
	ctx.lineCap = 'round';
	
	function drawCircle(x, y, r, w, stroke = true, fill = false) {
		ctx.lineWidth = w;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * pi);
		stroke && ctx.stroke();
		fill && ctx.fill();
	}
	
	 function drawLine(x1, y1, x2, y2, w, stroke = true, fill = false, closePath = false) {
		ctx.lineWidth = w;
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		stroke && ctx.stroke();
		fill && ctx.fill();
		closePath && ctx.closePath();
	}
	
	function drawClockFace() {
		// white background, whitespace around clock
		drawCircle(0, 0, 0.5 * size, 0.10 * size, false, true);
		
		// black circle, clock's border
		drawCircle(0, 0, 0.39 * size, 0.10 * size, true, true);
	}
	
	function drawClockHand() {
		const d = new Date(),
					h = d.getHours(),
					m = d.getMinutes();

		const hFrac = (h + m / 60);
		
		// white clear all hands
		drawCircle(0, 0, 0.35 * size, 0.01 * size, false, true);

		const thickness = 0.06 * size;
		const hLength = 0.19 * size;
		const mLength = 0.30 * size;
		
		drawLine(hLength * Math.sin(hFrac * pi/6),
						 hLength * Math.cos(hFrac * pi/6),
						 0, 0, thickness);
		drawLine(mLength * Math.sin(m * pi/30),
						 mLength * Math.cos(m * pi/30),
						 0, 0, thickness);
	}
	
	drawClockFace();
	drawClockHand();
	setInterval(drawClockHand, 5000);
}


// KIOSK ===============================================

var kioskUrls, kioskDelay, kioskDuration;
var kioskIframe;
var kioskCurrentIndex = 0;

function kioskInit(urls, delay, duration) {
	kioskUrls = urls;
	kioskDelay = delay;
	kioskDuration = duration;
	shuffleArray(kioskUrls);

	kioskIframe = document.getElementById('kioskIframe');

	// Always after page has loaded make it visible and start the hide-timer
	kioskIframe.onload = function() {
		if ( kioskIframe.src || kioskIframe.srcdoc ) {
			kioskIframe.style.visibility = 'visible';
			kioskIframe.style.opacity = 100;
			setTimeout(kioskHide, kioskDuration);
		}
	}
	
	kioskHide();
}

function kioskShowNext() {

	kioskCurrentIndex++;
	if ( kioskCurrentIndex >= kioskUrls.length ) { kioskCurrentIndex = 0 }	
	const url = kioskUrls[kioskCurrentIndex];
  
  const extension = getFileExtension(url); 
  const imageExtensions = ['jpg', 'jpeg', 'gif', 'png', 'webp'];
  const isImage = imageExtensions.includes(extension);

  if (isImage) {
	  kioskIframe.removeAttribute('src');
    kioskIframe.setAttribute('srcdoc', '<img style="width:100%" src="' + url + '"></img>');
  } else {
    kioskIframe.removeAttribute('srcdoc');
	  kioskIframe.setAttribute('src', url);
  }

}

function kioskHide() {
	kioskIframe.style.visibility = 'hidden';
	kioskIframe.style.opacity = 0;
	setTimeout(kioskShowNext, kioskDelay);
}

function kioskIsVisible() {
	return kioskIframe.style.visibility == 'visible'
}


// MAIN ===================================================

setTimeout(niceReload, 300000);
