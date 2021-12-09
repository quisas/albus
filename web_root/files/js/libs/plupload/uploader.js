// function seasideCallbackFileUploaded(ajaxParameter) {
// 	// Must be defined dynamically
// }

// function seasideUploadSessionUuid() {
// 	// Must be defined dynamically
//  return 'qwer345qwefqwrqw';
// }

// function seasideAllowedFileExtensions() {
// 	// Must be defined dynamically
//  return 'jpg,gif,png';
// }

// function seasideMaxFileUploads() {
// 	// Must be defined dynamically
//  return 100;
// }

$(document).ready(function() {
	
	var uploader = new plupload.Uploader({
		browse_button: "pluploadBrowseButton",
		url: ("/files/js/libs/plupload/upload_gateway/upload.php?id=" + seasideUploadSessionUuid() ),
		runtimes: "html5",
		multi_selection: false,
		max_retries: 3,

	  filters: {
	    max_file_size: pluploadMaxFileSize,
			max_files_count: 1,
	    mime_types : [
	      { title : "Erlaubte Dateiformate",
					extensions : seasideAllowedFileExtensions() }
	    ]
	  }    
	});


	// After files have been added from the file dialog
	uploader.bind("FilesAdded", function(up, files) {
		
		var html = "";
		plupload.each(files, function(file) {
			html += '<span class="uploadFile" id="' + file.id + '"><span class="uploadStatus"><progress value="0" max="100">0%</progress></span> ' + file.name + ' (' + plupload.formatSize(file.size) + ')</span>';
		});
		document.getElementById("pluploadFile").innerHTML = html;

		$("#pluploadBrowseButton").hide();

		setTimeout(function() {
			up.start();
		}, 700)
//		up.start();

	});

	// When a file is being uploaded
	uploader.bind("UploadProgress", function(up, file) {
		var element = document.getElementById(file.id).querySelector("span.uploadStatus");
		
		// if (file.percent == 100) {
		// 	element.innerHTML = "<span>100%</span>";
		// } else {
		// 	element.innerHTML = "<span>" + file.percent + "%</span>";
		// }

		if (file.percent == 100) {
			element.innerHTML = '<progress value="100" max="100">100%</progress>';
		} else {
			element.innerHTML = '<progress value="' + file.percent + '" max="100">' + file.percent + '%</progress>';
		}

	});

	// After a file is finished uploading
	uploader.bind("FileUploaded", function(up, file, result) {
		if (result.status == 200) {
			var ajaxParameter = result.response + "/" + file.name;
			seasideCallbackFileUploaded(ajaxParameter);
		} else {
			alert("Upload-Fehler!");
		}
	});

	// When all files have been uploaded
	uploader.bind("UploadComplete", function(up, file) {
		setTimeout(function() {
			location.reload();
		}, 700)
	});


	uploader.bind("Error", function(up, err) {
		alert("\nFehler #" + err.code + ": " + err.message);
	});

	uploader.init();

});
