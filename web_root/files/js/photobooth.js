//
// Used from the component ALPhotoboothComponent
//

var webcam_videoInput, webcam_canvasInput, webcam_cropCanvas, webcam_overlay, webcam_keyboardCatcher;
var webcam_portrait_zoom, webcam_portrait_voffset, webcam_portrait_hoffset, webcam_autoset_area, webcam_video_preview_scale;
var webcam_imgAreaSelect, webcam_dataField;

function increaseZoom() {
	webcam_portrait_zoom += 0.05;
}

function decreaseZoom() {
	webcam_portrait_zoom -= 0.05;
}

function moveDown() {
	webcam_portrait_voffset += 5;
}

function moveUp() {
	webcam_portrait_voffset -= 5;
}

function moveLeft() {
	webcam_portrait_hoffset -= 5;
}

function moveRight() {
	webcam_portrait_hoffset += 5;
}

function headtrackerRedetect() {
	htracker.stop();
	htracker.start()
}

function webcam_warning(text) {
	document.getElementById("webcam_warning").innerHTML = text;
}

function displayVideoDimensions() {
	dimensions.innerHTML = "Actual video dimensions: " + webcam_videoInput.videoWidth +
		"x" + webcam_videoInput.videoHeight + "px.";
}

function takeSnapshot() {
	var selection = webcam_imgAreaSelect.getSelection(false);

	webcam_cropCanvas.width = selection.width;
	webcam_cropCanvas.height = selection.height;
	//	webcam_cropCanvas.style.width = selection.width;
	//	webcam_cropCanvas.style.height = selection.height;
	
	webcam_cropCanvas.getContext("2d").drawImage(
		webcam_videoInput,
		selection.x1,
		selection.y1,
		selection.width,
		selection.height, 0, 0, selection.width, selection.height);
	$(webcam_dataField).val(webcam_cropCanvas.toDataURL("image/jpeg", 0.95));
}



// Canvasse dem realen Video-Format anpassen, einmalig
function onPlayingVideo() {

	var realWidth = webcam_videoInput.videoWidth;
	var realHeight = webcam_videoInput.videoHeight;
	
	// Falls vernünfigte Werte
	if ((realWidth > 0) && (realHeight > 0)) {
		webcam_videoInput.width = realWidth;
		webcam_videoInput.height = realHeight;

		const smallWidth = realWidth*webcam_video_preview_scale;
		const smallHeight = realHeight*webcam_video_preview_scale;

		webcam_videoInput.style.width = smallWidth + "px";
		webcam_videoInput.style.height = smallHeight + "px";

		webcam_canvasInput.width = smallWidth;
		webcam_canvasInput.height = smallHeight;

		webcam_overlay.width = realWidth;
		webcam_overlay.height = realHeight;
		webcam_overlay.style.width = realWidth*webcam_video_preview_scale + "px";
		webcam_overlay.style.height = realHeight*webcam_video_preview_scale + "px";

		webcam_imgAreaSelect.setOptions({
			imageWidth: realWidth,
			imageHeight: realHeight
		});

		webcam_imgAreaSelect.setSelection(0, 0, realWidth, realHeight, false);
		webcam_imgAreaSelect.update();

		webcam_videoInput.removeEventListener("playing", onPlayingVideo);
	}
}


// Arguments from the component
function initPhotobooth(camId, captureId, cropId, dataFieldId, overlayId, cameraHeight, cameraWidth, aspectRatio, submitButtonId, imageWidth, imageHeight, videoPreviewScale, verticalDefaultOffset, keyboardCatcherId, isSelfie) {

	webcam_videoInput = document.getElementById(camId);
	webcam_canvasInput = document.getElementById(captureId);
	webcam_cropCanvas = document.getElementById(cropId);
	webcam_overlay = document.getElementById(overlayId);
	webcam_keyboardCatcher = document.getElementById(keyboardCatcherId);
	webcam_dataField = document.getElementById(dataFieldId);

	webcam_portrait_zoom = 1.6;
	webcam_portrait_voffset = verticalDefaultOffset;
	webcam_portrait_hoffset = 0;
	webcam_autoset_area = !isSelfie;
	webcam_video_preview_scale = videoPreviewScale;

	document.addEventListener("headtrackrStatus", function(event) {
		var messagep = document.getElementById("webcam_trackerStatus");
		if (messagep) {
			messagep.innerHTML = event.status;
		}

		if (event.status == "no getUserMedia") {
			alert("Ihr Browser unterstützt keine Kameraeinbindung. Verwenden Sie bitte den Chrome Browser.");
		}
	}, true);


	webcam_videoInput.addEventListener("playing", onPlayingVideo);

	var htracker = new headtrackr.Tracker({
		calcAngles: false,
		ui: false,
		headPosition: false,
		detectionInterval: 100
	});

	htracker.init(webcam_videoInput, webcam_canvasInput);
	htracker.start();

	document.addEventListener("facetrackingEvent", function(event) {

		var webcam_portrait_x0, webcam_portrait_y0, webcam_portrait_x1, webcam_portrait_y1, webcam_portrait_width, webcam_portrait_height;
		
		var faceWidth = event.width / webcam_video_preview_scale;
		var faceHeight = event.height / webcam_video_preview_scale;
		var faceX = event.x / webcam_video_preview_scale;
		var faceY = event.y / webcam_video_preview_scale;


		if (event.detection == "CS") {
			var tooSmallFaceWarning = (faceWidth / imageWidth) < 0.6;

			webcam_portrait_width = Math.max(imageWidth, (faceWidth * webcam_portrait_zoom));
			webcam_portrait_height = webcam_portrait_width / aspectRatio;
			
			webcam_portrait_x0 = webcam_portrait_hoffset + faceX - (webcam_portrait_width / 2);
			webcam_portrait_y0 = webcam_portrait_voffset + faceY - (webcam_portrait_height / 2);


			webcam_portrait_x1 = webcam_portrait_x0 + webcam_portrait_width;
			webcam_portrait_y1 = webcam_portrait_y0 + webcam_portrait_height;

			if (webcam_autoset_area) {
				webcam_imgAreaSelect.setSelection(webcam_portrait_x0, webcam_portrait_y0, webcam_portrait_x1, webcam_portrait_y1, false);
				webcam_imgAreaSelect.update();
			}
			
			if (tooSmallFaceWarning) {
				webcam_warning("Gesicht zu klein! Bitte näher an die Kamera.");
			} else {
				webcam_warning("");
			}
			
		}
	});

	webcam_imgAreaSelect = $(webcam_overlay).imgAreaSelect({
		instance: true,
		handles: true,
		show: true,
		aspectRatio: "', self aspectRatioString,'",
		zIndex: 100,
		movable: true,
		imageWidth: cameraWidth,
		imageHeight: cameraHeight,
		minWidth: imageWidth,
		minHeight: imageHeight
	});

	if (webcam_keyboardCatcher) {
		$(webcam_keyboardCatcher).keydown(function(event) {
			// console.log(event.which);
			switch (event.which) {
			case 32:
				event.preventDefault();
				takeSnapshot();
				break;
			case 13:
				event.preventDefault();
				document.getElementById(submitButtonId).click();
				break;
			case 82:
				headtrackerRedetect();
				break;
			case 187: case 107: case 49:
				increaseZoom();
				break;
			case 189: case 109:
				decreaseZoom();
				break;
			case 38:
				event.preventDefault();
				moveUp();
				break;
			case 40:
				event.preventDefault();
				moveDown();
				break;
			case 39:
				event.preventDefault();
				moveRight();
				break;
			case 37:
				event.preventDefault();
				moveLeft();
				break;
			default:
			}
		});

		$(webcam_keyboardCatcher).focus();
	}

	
}
