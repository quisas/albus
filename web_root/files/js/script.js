/* Author:

*/

// jQuery Extensions
jQuery.fn.isEmpty = function(){ return !this.length }

$(document).ready(function() {

  $(".chosen-select").chosen({
    allow_single_deselect:true,
    placeholder_text:" ",
    search_contains:true,
//Evt. nötig wegen Tablets?   hide_results_on_select:false
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
    msg.rate = 0.8;

//Not Safari?   window.speechSynthesis.stop();
    window.speechSynthesis.speak(msg);
  }
}

// var bounceTimeout;
// function debounce(aFunction, delay = 1000) {
//   clearTimeout(bounceTimeout);
//   bounceTimeout = setTimeout(aFunction, delay);
// }

// Returns a function which encapsulates the debounced call to another func
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}


// function debouncedSpeak(aText, delay) {

//  if (!delay) {
//    delay = 500;
//  }
  
//  const func = debounce(function(){
//    speak(aText);
//  }, delay);

//  func();
// }


const debouncedSpeak = debounce(function(aText) {
  speak(aText);
}, 300);

function speakSchoolMark(aText) {
  var phonetic;

  if (aText) {
    phonetic = aText;

    phonetic = phonetic.replace(".00", "");
    phonetic = phonetic.replace(".", ",");
    
    if(phonetic.substr(-1) === '0') {
      phonetic = phonetic.substr(0, phonetic.length - 1);
    }
    window.speechSynthesis.cancel();
    debouncedSpeak(phonetic);
  }
}

// Setzt in einem Chozen-Select einen Eintrag auf ausgewählt
function chooseOptionInChozen(text, chozenSelectorString) {
  $(chozenSelectorString + " option:contains(" + text + ")").attr("selected", "selected");
  $(chozenSelectorString).trigger("chosen:updated.chosen");

  // TODO: Beim neusten dirtyforms gibts diese Funktion nicht mehr:
  // TODO2 Hm weiter unten haben wir das manuell nachgerüstet. Vermutlich gibts das wieder.
  $(chozenSelectorString).closest('form').setDirty();
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
      alert('Ihre Sitzung ist wegen Inaktivität abgelaufen. Sie wurden ausgeloggt.');
      // window.location.reload();
      // reload without URL query part
      window.location.replace(window.location.pathname);
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

//  dataTableAddLinkToNameFunction(dataTable,'Show','Applicant');
        
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
  //  if(dataTable.rows('.selected').nodes().length === dataTable.rows({ 'search': 'applied' }).nodes().length){
  //    $('input:checkbox.dtRowCheckboxSelectAll').prop("checked", true);
  //  }else{
  //    $('input:checkbox.dtRowCheckboxSelectAll').prop("checked", false);
  //  }
  // }

  // Seaside-spezifisch, deshalb nicht hier:
  // dataTable.rows(":has(input:checkbox.dtRowCheckbox[checked])").select();

  // dataTable.on("deselect", function (e, dt, type, indexes) {
  //  dt.rows(indexes).nodes().toJQuery().find("input:checkbox.dtRowCheckbox").prop("checked", false);
  //  selectAllCheck();
  // });

  // dataTable.on("select", function (e, dt, type, indexes) {
  //  dt.rows(indexes).nodes().toJQuery().find("input:checkbox.dtRowCheckbox").prop("checked", true);
  //  selectAllCheck();
  // });
  
  // Removed to keep "Select-Function" when sorting / filtering
  //  dataTable.on( 'search.dt', selectAll);  
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
  //  window.onpopstate = null;
  //  return;
  // }


  // Hacky method to prevent first back jump. Double the current location on the state.
  window.history.pushState(null, "", window.location.href);

  // Warn once, then do not interfere anymore, so that a second click will go back (?)
  window.onpopstate = function(event) {
    //    window.onpopstate = null;

    thenCallback();
  }

}


function simpleCrypt(salt, text) {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

  return text
    .split("")
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join("");
};

function simpleDecrypt(salt, encoded) {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
  return encoded
    .match(/.{1,2}/g)
    .map((hex) => parseInt(hex, 16))
    .map(applySaltToChar)
    .map((charCode) => String.fromCharCode(charCode))
    .join("");
};


function truncateString(str, num) {
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + '...'
}

// Captures long texts in text areas, which should not be lost, due to browser handling. Save them in sessionStorage.
function installTextareaAutosaver(textareaId, semanticId, label) {

  const textarea = document.getElementById(textareaId);
  
  const storageKey = "albusAutosaveTextarea" + semanticId;
  const storageValue = sessionStorage.getItem(storageKey);

  if (storageValue) {
    var savedObject;
    try {
      savedObject = JSON.parse(simpleDecrypt(semanticId, storageValue))
    } catch (e) {
      savedObject = null
    };

    // Autodelete if old
    // -12 hours
    const dueTimestamp = (new Date()).getTime() - (12 * 60 * 60 * 1000);
    if (savedObject) {
      if (savedObject.timestamp < dueTimestamp) {
        savedObject = null
      }
    }
    
    // See if we have an autosave value
    if (savedObject && (savedObject.text != textarea.value) ) {
      if (confirm("ACHTUNG: \nMöglicherweise haben Sie einen bereits eingetippten Text noch nicht gespeichert? Soll der folgende Feldinhalt wiederhergestellt werden? \n\nFormularfeld: " + label + "\nText: " + truncateString(savedObject.text, 500) )) {
        textarea.value = savedObject.text;
      } else {
        sessionStorage.removeItem(storageKey);
      };
    }
  }
  
  // Listen for changes in the text field
  textarea.addEventListener("input", debounce(function() {
    const object = { text: textarea.value, timestamp: new Date().getTime() }
    const confusedObjectString = simpleCrypt(semanticId, JSON.stringify(object) );
    sessionStorage.setItem(storageKey, confusedObjectString);
  }, 1000));

  // Remove value, if form is submitted
  textarea.form.addEventListener("submit", function() {
    sessionStorage.removeItem(storageKey);
  });
  
}

function initUiInteractionBlocker(secondsToGo, secondsToStay) {
  const blocker = document.getElementById('uiInteractionBlocker');

//  secondsToGo = 1; // Testing!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  blocker.onclick = function(e) {
    blocker.classList.add('clicked');
  }
  
  function activateMe() {
    blocker.style.display = '';
    setTimeout(deactivateMe, secondsToStay * 1000);
  }

  function deactivateMe() {
    blocker.style.display = 'none';
  }

  // If negative or zero means, backup is running right now
  if (secondsToGo > 0) {
    setTimeout(activateMe, secondsToGo * 1000);
  } else {
    activateMe();
  }
  
}

// Remove a lot of meaningless chars in a text. Used for sanitizing text which comes pasted from Word etc.
// Use it as a javascript event handler
function sanitizeTextareaPaste(event) {

  event.preventDefault();

  let pasteText = (event.clipboardData || window.clipboardData).getData("text");

  // const re = /[\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]/g;
  const re = /[\0-\x09\x0B-\x0C\x0E-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]/g;
  pasteText = pasteText.replaceAll(re, '');

  //  const selection = window.getSelection();
  //  if (!selection.rangeCount) return;

  let textarea = event.target;

  const inputValue = textarea.value;

  const selStart = textarea.selectionStart;
  const selEnd = textarea.selectionEnd;
  const nextSelectionEnd = selStart + pasteText.length;

  // Insert the text at the given location within the input.
  textarea.value = inputValue.slice(0, selStart) + pasteText + inputValue.slice(selEnd);

  // Advance the text selection to just after the inserted text.
  textarea.selectionStart = nextSelectionEnd;
  textarea.selectionEnd = nextSelectionEnd;
  textarea.focus();
}
