// doc ready function
$(function(){
  console.log('document loaded');

  getOwners();

  // // listen for a submit event on the form
  $('#owner-form').on('submit', addOwner);
  $('#pet-form').on('submit', addPet);

});

function getOwners () {
  $.ajax({
    url: '/owners',
    type: 'GET',
    success: displayOwners
  });
};

function displayOwners(owners) {
  $('#owner_name').empty();

  owners.forEach(function(owner){
    var $option = $('<option value="' + owner.id + '">' + owner.first_name + ' ' + owner.last_name + '</option>');
    console.log($option);
    $('#owner_name').append($option);
  })

}

function addOwner (event) {
  event.preventDefault();

  var formData = $(this).serialize();
  console.log(formData);

  $.ajax({
    url: '/owners',
    type: 'POST',
    data: formData,
    success: getOwners
  });
}

function addPet (event) {
  event.preventDefault();

  var formData = $(this).serialize();
  console.log(formData);

  $.ajax({
    url: '/pets',
    type: 'POST',
    data: formData,
    // success: getOwners
  });
}
