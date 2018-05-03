/* Author:

*/

$(document).ready(function() {

  $(".chosen-select").chosen({
    allow_single_deselect:true,
    placeholder_text:" ",
    search_contains:true,
//Evt. nötig wegen Tablets?		hide_results_on_select:false
		hide_results_on_select: true
  });

  $.fn.datepicker.defaults.language = 'de';  
  $.fn.datepicker.defaults.calendarWeeks = true;  
  $.fn.datepicker.defaults.autoclose = true;  
  $.fn.datepicker.defaults.clearBtn = true;  
  $.fn.datepicker.defaults.todayBtn = true;  
  $.fn.datepicker.defaults.todayHighlight = true;  
  $.fn.datepicker.defaults.daysOfWeekHighlighted = [0,6];

  $("input[type=text].datepicker").datepicker();

  $("input[type=text].monthpicker").datepicker({minViewMode: "months", format: "yyyy M"});

  $(".tooltipTitle").tooltip({
    placement: "top",
    delay: 500});
  $(".tooltipTitleBelow").tooltip({
    placement: "bottom",
    delay: 500});
  $(".tooltipTitleRight").tooltip({
    placement: "right",
    delay: 500});
  $(".tooltipTitleLeft").tooltip({
    placement: "left",
    delay: 500});
  $("a[title],img[title]").tooltip({
    placement: "top",
    delay: 500});

  $(".popoverOnClick").popover({
    placement: "bottom"});

  $("form.dirtycheck").dirtyForms();
  $("textarea").autosize();


  // $.extend( $.fn.dataTable.defaults, {
  //   
  // });
  
  $('table.dataTable').dataTable({
        "sDom": "lfrTtip",
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": true,
        "bSort": false,
        "bInfo": true,
        "bAutoWidth": false,
        "bProcessing": true,
        "asStripeClasses": [],
        "bStateSave": true,

        "oLanguage": {
          "sSearch": "Suche: ",
          // "sLengthMenu": "Display _MENU_ records per page",
          "sZeroRecords": "Nichts gefunden",
          "sInfo": "Total _TOTAL_ Einträge",
          "sInfoEmpty": "",
          "sInfoFiltered": "(gefiltert von total _MAX_ Einträgen)"
        }

        // "oTableTools": {
        //   "sSwfPath": "/swf/copy_csv_xls_pdf.swf"
        // }
    });


	$("div.markdownTarget").each(function(index) {
		$(this).html(marked($(this).prev().html()))
	});

	$("input.suppressEnterKey").on("keydown", suppressEnterKey);
	
	
});

function appendToTagList(inputId, text) {
  var currentValue;
  var newValue;
  var inputElement;
  
  inputElement = $('#' + inputId)[0];
  
  currentValue = inputElement.value;
  
  if (currentValue) {
    newValue = currentValue + ', ' + text;
  } else {
    newValue = text;
  };
  
  inputElement.value = newValue;
  inputElement.focus();
  
}

function selectText(elementId) {
    var doc = document,
        text = doc.getElementById(elementId),
        range,
        selection;
        
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function saveScroll(id) {
	var y = $(document.body).scrollTop();
	Cookies.set("page_scroll_" + id, y, { expires: 1 });
}

function loadScroll(id) {
	var y = Cookies.get("page_scroll_" + id);
	if (!y) {return}
	$(document.body).scrollTop(y);
}

function speak(aText) {
	if (window.SpeechSynthesisUtterance !== undefined) {
		var msg = new SpeechSynthesisUtterance(aText);

		msg.lang = 'de-DE';

//Not Safari?		window.speechSynthesis.stop();
		window.speechSynthesis.speak(msg);
	}
}

var bounceTimeout;
function debounce(aFunction, delay) {
	if (!delay) {
		delay = 1000;
	}
  clearTimeout(bounceTimeout);
  bounceTimeout = setTimeout(aFunction, delay);
}

function debouncedSpeak(aText, delay) {
	if (!delay) {
		delay = 500;
	}
	
	debounce(function(){
		speak(aText);
	}, delay);
}

function speakSchoolMark(aText) {
	var phonetic;

	if (aText) {
		phonetic = aText;

		phonetic = phonetic.replace(".00", "");
		phonetic = phonetic.replace(".", ",");
		
		if(phonetic.substr(-1) === '0') {
      phonetic = phonetic.substr(0, phonetic.length - 1);
		}
		debouncedSpeak(phonetic, 600);
	}
}

// Setzt in einem Chozen-Select einen Eintrag auf ausgewählt
function chooseOptionInChozen(text, chozenSelectorString) {
	$(chozenSelectorString + " option:contains(" + text + ")").attr("selected", "selected");
	$(chozenSelectorString).trigger("liszt:updated");
	$(chozenSelectorString).closest('form').setDirty();
}


// document.onclick = function(e) {    
//     if (e.target.className === 'click') {
//         SelectText('selectme');
//     }
// };

// function printElement(jQueryElement) {
// 	jQueryElement.printThis({
//     debug: false,              * show the iframe for debugging
//     importCSS: true,           * import page CSS
//     printContainer: true,      * grab outer container as well as the contents of the selector
//     loadCSS: "path/to/my.css", * path to additional css file
//     pageTitle: "",             * add title to print page
//     removeInline: false        * remove all inline styles from print elements
//   });

// }


function suppressEnterKey(event) {

	if (!event.altKey
			&& !event.ctrlKey
			&& !event.metaKey
			&& event.which === 13) {

		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();

		return false;
	}

}

function handleSessionCheck(responseData) {

	switch (responseData) {
	case 'OK':
		// alert('Session OK');
	  break;
	case 'expired':
		alert('Ihre Sitzung ist wegen Inaktivität abgelaufen.');
		location.reload(true);
		break;
	case 'nearlyExpired':
		$('#sessionNearlyExpired').modal('show');
		break;
	default:
		// alert('Sitzung meldet ' + responseData);
	}
	
}

function copyToClipboard(selector) {
  var isCopied;
	var range = document.createRange();
	var selection = window.getSelection();

	selection.empty();
	
	$(selector).each(function(){
		range.selectNode(this);
		selection.addRange(range);
	})
	
  isCopied = document.execCommand("copy", false, null);

  if (isCopied)
    alert('In die Zwischenablage kopiert!');
  else
    alert('Fehler beim Kopieren in die Zwischenablage. Bitte verwenden Sie einen modernen Browser oder markieren und kopieren Sie den Inhalt manuell.');
}

function scrollToBottom(selector) {
	var e = $(selector).get(0);
	
	e.scrollTop = e.scrollHeight
}
