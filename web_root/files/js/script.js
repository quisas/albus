/* Author:

*/

// jQuery Extensions
jQuery.fn.isEmpty = function(){ return !this.length }

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

	var isDirtyHelper = {
    isDirty: function ($node, index) {
      if ($node.is('form')) {
        return $node.hasClass('manuallySetDirty');
      }
    }
  };

	$.DirtyForms.helpers.push(isDirtyHelper);

	$("form.dirtycheck").dirtyForms();

	$.fn.extend({
		setDirty: function() {
			return this.each(function() {
				$(this).addClass('manuallySetDirty').addClass('dirty');
			});
		}
	});
	
  // $("textarea").autosize();
  autosize($("textarea"));


  // $.extend( $.fn.dataTable.defaults, {
  //   
  // });
  
  // $('table.dataTable').dataTable({
  //       "dom": "lfrTtip",
  //       "paginate": false,
  //       "lengthChange": false,
  //       "filter": true,
  //       "sort": false,
  //       "info": true,
  //       "autoWidth": false,
  //       "processing": true,
  //       "stateSave": true,

  //       "language": {
  //         "search": "Suche: ",
  //         "zeroRecords": "Nichts gefunden",
  //         "info": "Total _TOTAL_ Einträge",
  //         "infoEmpty": "",
  //         "infoFiltered": "(gefiltert von total _MAX_ Einträgen)"
  //       }

  // });


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

function appendToTextArea(textareaId, text) {
  var currentValue;
  var newValue;
  var taElement;
  
  taElement = $('#' + textareaId)[0];
  
  currentValue = taElement.value;
  
  if (currentValue) {
    newValue = currentValue + "\n" + text;
  } else {
    newValue = text;
  };
  
  taElement.value = newValue;
	autosize.update(taElement)
  taElement.focus();
	
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
	var y = $(document).scrollTop();
	// Kurze Dauer, sonst können sich zuviele anhäufen
	var inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
	Cookies.set("page_scroll_" + id, y, { expires: inFifteenMinutes, SameSite: 'Strict' });
}

function loadScroll(id) {
	var y = Cookies.get("page_scroll_" + id);
	if (!y) {return}
	$(document).scrollTop(y);
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
	$(chozenSelectorString).trigger("chosen:updated.chosen");

	// TODO: Beim neusten dirtyforms gibts diese Funktion nicht mehr:
	// TODO2 Hm weiter unten haben wir das manuell nachgerüstet. Vermutlich gibts das wieder.
	//$(chozenSelectorString).closest('form').setDirty();
}



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

// Function for DataTable
// Function to implement features for our datatables
function dataTableConfig(dataTable, options) {
	dataTableAddColumnFilter(dataTable);
	// addSelectAllCheckbox(dataTable);
}

function dataTableAddColumnFilter(dataTable) {
	var state = dataTable.state.loaded();

//	dataTableAddLinkToNameFunction(dataTable,'Show','Applicant');
				
	// Build HTML filter elements for filterable columns
	dataTable.columns('.withColumnFilter').every( function ( colID ) {
					
		var column = this;			

		if ( state ) {
			var filterValue = state.columns[colID].search['search'];
		}
		
		var select = $('<select><option value="">'+$(this.header()).text()+'</option></select>');
		column.data().unique().sort().each( function ( d, j ) {
			var escapedValue = '^'+$.fn.dataTable.util.escapeRegex( d )+'$';
			if( state && escapedValue == filterValue){
				select.append( '<option value="'+d+'" selected>'+d+'</option>' );
				select.addClass("active");
			}else{
				select.append( '<option value="'+d+'">'+d+'</option>' );
			}
		} );
		select.appendTo( $(column.header()).empty() );

		select.click(function(e){
			e.stopPropagation();
		});
		
		select.change(function () {
			if(select.prop('selectedIndex') != 0){
				select.addClass("active");
			}else{
				select.removeClass("active");
			}
		  var val = $.fn.dataTable.util.escapeRegex( $(this).val() );
			column.search( val ? '^'+val+'$' : '', true, false );
			dataTable.draw();
		} );
	} );
	// console.log('Added column filter to dataTable');
}


function addSelectAllCheckbox(dataTable){

	var columns = dataTable
	    .cells( ':has(input:checkbox.dtRowCheckbox)' )
	    .indexes()
	    .pluck( 'column' )
	    .sort()
	    .unique();
	    
	columns.each(function(colID){
		$(dataTable.column(colID).header())
			.append('<input type="checkbox" name="selectAll" value="'+colID+'" class="dtRowCheckboxSelectAll" >');
	})
	
	$('input:checkbox.dtRowCheckboxSelectAll').on('click', selectAll);
		
	function selectAll(e){
		var rows = dataTable.rows({ 'search': 'applied' }).nodes();
		if(this.checked){
			dataTable.rows({ 'search': 'applied' }).select()
		}else{
			dataTable.rows({ 'search': 'applied' }).deselect()
		}
		e.stopPropagation();
	}
	
	// function selectAllCheck(){
	// 	if(dataTable.rows('.selected').nodes().length === dataTable.rows({ 'search': 'applied' }).nodes().length){
	// 		$('input:checkbox.dtRowCheckboxSelectAll').prop("checked", true);
	// 	}else{
	// 		$('input:checkbox.dtRowCheckboxSelectAll').prop("checked", false);
	// 	}
	// }

	// Seaside-spezifisch, deshalb nicht hier:
	// dataTable.rows(":has(input:checkbox.dtRowCheckbox[checked])").select();

	// dataTable.on("deselect", function (e, dt, type, indexes) {
	// 	dt.rows(indexes).nodes().toJQuery().find("input:checkbox.dtRowCheckbox").prop("checked", false);
 	// 	selectAllCheck();
	// });

	// dataTable.on("select", function (e, dt, type, indexes) {
	// 	dt.rows(indexes).nodes().toJQuery().find("input:checkbox.dtRowCheckbox").prop("checked", true);
	// 	selectAllCheck();
	// });
	
	// Removed to keep "Select-Function" when sorting / filtering
	//	dataTable.on( 'search.dt', selectAll);	
}

function toggleAll(myself, inputSelector, closestElementSelector){
	var all = $(myself).closest(closestElementSelector).find(inputSelector).filter(':enabled');
	var newValue = !(all.first().prop('checked'));

	if (all) {
		all.prop('checked', newValue);
	}
	$(myself).closest('form').setDirty();

}

function preventBackButton(thenCallback) {
	// Hacky method to prevent back button
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = function() {
    window.history.pushState(null, "", window.location.href);
		// or? this.props.history.go(1); see also https://subwaymatch.medium.com/disabling-back-button-in-react-with-react-router-v5-34bb316c99d7
		
		if (thenCallback) {
			thenCallback();
		}
  }

}

function onBackButton(thenCallback) {

	// const params = new URLSearchParams(window.location.search);
	
	// if (params.has('tolerateBackButton')) {
	// 	window.onpopstate = null;
	// 	return;
	// }


	// Hacky method to prevent first back jump. Double the current location on the state.
  window.history.pushState(null, "", window.location.href);

	// Warn once, then do not interfere anymore, so that a second click will go back (?)
  window.onpopstate = function(event) {
		//		window.onpopstate = null;

		thenCallback();
  }

}
