$(function(){
  console.log('document loaded');
  getVisits();
});

function getVisits() {
  $.ajax({
    url: '/visits',
    type: 'GET',
    success: displayPets
  })
}

function displayPets(visitList) {
  $('#visitsList').empty();
  console.log("visit list", visitList);
  visitList.forEach(function(visit){
    var $row = $('<tr></tr>');
    var dateIn = new Date(visit.check_in).toString().slice(0,21);

    // $row.append('<td>' + visit.first_name + ' ' + visit.last_name + '</td>');
    $row.append('<td>' + visit.name + '</td>');
    $row.append('<td>' + dateIn + '</td>');
    if(visit.check_out == null){
      $row.append('<td>CHECKED IN</td>');
    } else{
      var dateOut = new Date(visit.check_out).toString().slice(0,21);
      $row.append('<td>' + dateOut+ '</td>');
    }

    $('#visitsList').append($row);
  })
}
