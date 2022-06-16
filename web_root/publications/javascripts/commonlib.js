// Gemeinsame JS Library für publizierte HTML Dateien

function getWorkdayDates(count) {
  var current_day = new Date();
  var workday_dates = new Array();

  while (workday_dates.length < count) {
    // Wenn aktueller Tag nicht Sa. (=6) oder So. (=0)
    if (current_day.getDay() != 6 && current_day.getDay() != 0) {
      // Add new Date copy to the list
      workday_dates.push(new Date(current_day));
    }

    current_day.setDate(current_day.getDate()+1);
  }
  return workday_dates;
}

function reloadSelf() {
  document.location.reload();
}
