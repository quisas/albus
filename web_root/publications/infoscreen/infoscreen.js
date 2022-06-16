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


var pages = document.querySelectorAll("div.infoscreenPage");
const pageCount = pages.length;
var currentPage = 0;

function changePage() {
	for (index = 0; index < pages.length; index++) {
		pages[index].style.display = "none";
	}

	pages[currentPage].style.display = "";
	currentPage++;
	if (currentPage >= pageCount) { currentPage = 0 }
	
}

changePage();
setInterval(changePage, 3000);
clockInit(200, "clockWrapper");
setTimeout(reloadSelf, 300000);
