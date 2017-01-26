// doc ready function
$(function(){
  console.log('document loaded');

  getOwners();

  // // listen for a submit event on the form
  // $('#book-form').on('submit', addBook);
  // $('#book-list').on('click', '.save', updateBook);
  // $('#book-list').on('click', '.delete', deleteBook);

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
