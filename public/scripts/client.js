// doc ready function
$(function(){
  console.log('document loaded');

  getOwners();
  getPetList();

  // // listen for a submit event on the form
  $('#owner-form').on('submit', addOwner);
  $('#pet-form').on('submit', addPet);
  $('#pet_list').on('click', '.delete', deletePet);
  $('#pet_list').on('click', '.update', updatePet);
  $('#pet_list').on('click', '.checkInOut', checkPetInOut);

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
  // console.log(formData);

  $.ajax({
    url: '/pets',
    type: 'POST',
    data: formData,
    success: getPetList
  });
}

function getPetList (event) {

  $.ajax({
    url: '/pets',
    type: 'GET',
    success: displayPetList
  });
}

function displayPetList (petList) {
  // console.log(petList);
  $('#pet_list').empty();
  console.log("pet list", petList);
  petList.forEach(function(pet){

    var $row = $('<tr></tr>');

    $row.append('<td>' + pet.first_name + ' ' + pet.last_name + '</td>');
    $row.append('<td><input type = "text" name = "name" value ="' + pet.name + '"/></td>');
    $row.append('<td><input type = "text" name = "breed" value ="' + pet.breed + '"/></td>');
    $row.append('<td><input type = "text" name = "color" value ="' + pet.color + '"/></td>');
    $row.append('<td><button class="update" data-id="' + pet.pets_id + '"> GO! </button></td>');
    $row.append('<td><button class="delete" data-id="' + pet.pets_id + '"> Delete! </button></td>');
    if (pet.check_in == null){
      $row.append('<td><button class="checkInOut" data-id="' + pet.pets_id + '" data-status="in">Check Dog In!</button></td>');
    } else {
      $row.append('<td><button class="checkInOut" data-id="' + pet.pets_id + '" data-status="out">Check Dog Out!</button></td>');
    }
    $("#pet_list").append($row);

  })
}
function updatePet(event){
  event.preventDefault();
  var $button = $(this);
  var $form = $button.closest('tr');
  var data = $form.find('input').serialize();
  console.log($form.find('input'));
  $.ajax({
    url: '/pets/' + $button.data('id'),
    type: 'PUT',
    data: data,
    success: getPetList
  });


}
function deletePet(event){
  event.preventDefault();
  var $button = $(this);
  $.ajax({
    url: '/pets/' + $button.data('id'),
    type: 'DELETE',
    success: getPetList
  });
}

function checkPetInOut(event){
  event.preventDefault();
  var $button = $(this);
  var today ={date : new Date().toISOString()};

  if($button.data('status') == "in"){
    $.ajax({
      url: '/visits/in/' + $button.data('id'),
      type: 'PUT',
      data: today,
      success: getPetList
    })
  } else {

    $.ajax({
      url: '/visits/out/' + $button.data('id'),
      type: 'PUT',
      data: today,
      success: getPetList

    })




  }

}
