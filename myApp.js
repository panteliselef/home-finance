(function() {
var msg;
divContainer = $('.body-container');
function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}

function createRecord(id) {
  divContainer.append('<div id="'+ id +'" class="record">'
  + '<div id="date" class="grid-item">OS</div>'
  +'<div id="paid" class="grid-item">Paid</div>'
  +'<div id="remain" class="grid-item">Remain</div>'
  +'<div id="water" class="grid-item">Νερό</div>'
  +'<div id="water-paid" class="grid-item"></div>'
  +'<div id="water-remain" class="grid-item"></div>'
  +'<div id="electricity" class="grid-item">Ρευμα</div>'
  +'<div id="electricity-paid" classs="grid-item"></div>'
  +'<div id="electricity-remain" class="grid-item"></div>'
  +'<div id="rent" class="grid-item">Ενοίκιο</div>'
  +'<div id="rent-paid" class="grid-item"></div>'
  +'<div id="rent-remain" class="grid-item"></div>'
  +'<div id="edit" class="grid-item">Edit</div>'
  +'<div id="more" class="grid-item">More</div>'
  +'</div>');
  console.log("OK");
}

// divJson = document.getElementById('json');
addButton = $('#add-record');
var database = firebase.database();

db = database.ref();
db.once("value", function(data) {
  $('.record #edit').on('click', function () {
    parRecId = $(this).parent().attr('id');
    $('#editModal').css('display','block');
    $('#editModal #date').text($("#"+parRecId+" #date").text())
    $('#editModal .edit-card input').each(function() {
      // console.log($(this).attr('id'));
      currentId = $(this).attr('id');
      currentContent = $("#"+parRecId+" #"+currentId).text();
      currentContent = currentContent.slice(0, -2);
      $(this).val(currentContent);
    })
  });

  $('.edit-card #cancel').on('click', function() {
    $('#editModal').css('display','none');
  });

  $('.edit-card #update').on('click', function() {
    db.child(parRecId).update({
      "electricityPaid": $("#editModal #electricity-paid").val(),
      "rentPaid": $("#editModal #rent-paid").val(),
      "waterPaid": $("#editModal #water-paid").val(),
      "electricityRemain": $("#editModal #electricity-remain").val(),
      "rentRemain": $("#editModal #rent-remain").val(),
      "waterRemain": $("#editModal #water-remain").val()
    },function(error){
      if(error){
        console.log("Data could not be saved." + error);
      }else {
        console.log("Data saved successfully.");
      }
    });
    $('#editModal').css('display','none');
  });

  $('.record #more').on('click', function() {

  });
});

db.on('child_added', function(data) {
  recordKey = data.key;
  recordValue = data.val();
  createRecord(recordKey);
  $('.record:last #date').text(recordValue.date);
  $('.record:last #water-paid').html(recordValue.waterPaid + " &#8364");
  $('.record:last #water-remain').html(recordValue.waterRemain + " &#8364");
  $('.record:last #electricity-paid').html(recordValue.electricityPaid + " &#8364");
  $('.record:last #electricity-remain').html(recordValue.electricityRemain + " &#8364");
  $('.record:last #rent-paid').html(recordValue.rentPaid + " &#8364");
  $('.record:last #rent-remain').html(recordValue.rentRemain + " &#8364");


});

/*
 * TODO: Fix the following function
 *       Doesn't work for the .record that changed
*/

db.on("child_changed", function(snapshot) {
  var changedPost = snapshot.val();
  $('#'+snapshot.key+' #date').text(changedPost.date);
  $('#'+snapshot.key+' #water-paid').html(changedPost.waterPaid + " &#8364");
  $('#'+snapshot.key+' #water-remain').html(changedPost.waterRemain + " &#8364");
  $('#'+snapshot.key+' #electricity-paid').html(changedPost.electricityPaid + " &#8364");
  $('#'+snapshot.key+' #electricity-remain').html(changedPost.electricityRemain + " &#8364");
  $('#'+snapshot.key+' #rent-paid').html(changedPost.rentPaid + " &#8364");
  $('#'+snapshot.key+' #rent-remain').html(changedPost.rentRemain + " &#8364");
  console.log("The updated post title is " + changedPost.date);
});

db.on('child_removed', function(data) {
  $('.record#'+data.key).remove();
  // deleteComment(postElement, data.key);
});

addButton.on('click', function() {
  $('#myModal').css('display','block');
  // db.push({
  //   date: "Dec 13",
  //   waterPaid: 20,
  //   waterRemain: 0,
  //   rentPaid: 230,
  //   rentRemain: 0,
  //   electricityPaid: 72,
  //   electricityRemain: 1,
  // });
});



$('.modal #btnClose').on('click', function() {
  $('.modal').css('display','none');
});

$('#btnSubmit').on('click', function () {
  if(isNaN($('#input-water-paid').val()) || $('#input-water-paid').val() == "" ) {
    $('#input-water-paid').css('border-color','red');
    dontSubmit = 1;
  }else {
    inputWaterPaid = $('#input-water-paid').val();
    $('#input-water-paid').css('border-color','green');
    dontSubmit = 0;
  }
  if(isNaN($('#input-rent-paid').val()) || $('#input-rent-paid').val() == "" ) {
    $('#input-rent-paid').css('border-color','red');
    dontSubmit = 1;
  }else {
    inputRentPaid = $('#input-rent-paid').val();
    $('#input-rent-paid').css('border-color','green');
    dontSubmit = 0;
  }
  if(isNaN($('#input-electricity-paid').val()) || $('#input-electricity-paid').val() == "" ) {
    $('#input-electricity-paid').css('border-color','red');
    dontSubmit = 1;
  }else {
    inputElectricityPaid = $('#input-electricity-paid').val();
    $('#input-electricity-paid').css('border-color','green');
    dontSubmit = 0;
  }
  // if(dontSubmit == 1){
  //   alert("Fill all the fields correctly");
  // }

  inputWaterRemain = $('#input-water-remain').val();
  inputRentRemain = $('#input-rent-remain').val();
  inputElectricityRemain = $('#input-electricity-remain').val();

  if(!(dontSubmit)){
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    var date = new Date();

    db.push({
      date: monthNames[date.getMonth()] + " " + date.getDate(),
      timeStamp: date.getTime(),
      waterPaid: inputWaterPaid,
      waterRemain: ((inputWaterRemain == "") ? 0 : inputWaterRemain),
      rentPaid: inputRentPaid,
      rentRemain: ((inputRentRemain == "") ? 0 : inputRentRemain),
      electricityPaid: inputElectricityPaid,
      electricityRemain: ((inputElectricityRemain == "") ? 0 : inputElectricityRemain),
    });

  }
  // console.log("Water",inputWaterPaid);
  // console.log("Rent",inputRentPaid);
  // console.log("Electricity",inputElectricityPaid);
});

$('#label-water-remain').on('click', function () {
  $('#input-water-remain').fadeIn(0);
  $(this).fadeOut(0);
});

$('#label-rent-remain').on('click', function () {
  $('#input-rent-remain').fadeIn(0);
  $(this).fadeOut(0);
});

$('#label-electricity-remain').on('click', function () {
  $('#input-electricity-remain').fadeIn(0);
  $(this).fadeOut(0);
});

// postNotes.on('value', function(notesSnapshot) {
//     notesSnapshot.forEach(function(noteSnapshot) {
//         console.log(noteSnapshot.val());
//     });
// });


}());
