// Initialize Firebase
var config = {
  apiKey: "AIzaSyC5yaiVoPynJdJX9pg8IfFJEp98KUdfzic",
  authDomain: "group12-project.firebaseapp.com",
  databaseURL: "https://group12-project.firebaseio.com",
  projectId: "group12-project",
  storageBucket: "group12-project.appspot.com",
  messagingSenderId: "415213458406"
};
firebase.initializeApp(config);
var database = firebase.database();

// Get Elements
const txtEmail = document.getElementById('email');
const txtPassword = document.getElementById('password');
const btnLogin = document.getElementById('login');
const btnSignUp = document.getElementById('signup');
const btnLogout = document.getElementById('logout');
const wrapper = document.getElementById('wrapper');
const container = document.getElementById('container');
const search_again = document.getElementById('search-again');
const google_maps = document.getElementById('google-maps');
const reset_password = document.getElementById('reset-password');
const reset_email = document.getElementById('reset-email');
const submit = document.getElementById('submit');

// Add login event
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  //Get email & password
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();
  $('#email').val("");
  $('#password').val("");
  // Sign in
  const promise = auth.signInWithEmailAndPassword(email, pass);
  promise.catch(e => alert(e.message));
});

// Signup user
btnSignUp.addEventListener('click', e => {
  e.preventDefault();
  // Get email and password
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();
  // Sign in
  const promise = auth.createUserWithEmailAndPassword(email, pass);
  promise.catch(e => alert(e.message));
});

// Logout user
btnLogout.addEventListener('click', e => {
  firebase.auth().signOut();
});

// Add a real time auth listener
firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser){
    console.log(firebaseUser);
    wrapper.classList.add('hide');
    container.classList.remove('hide');
  } 
  else{
    console.log("Not logged in!");
  }
});

// Reset password
reset_password.addEventListener('click', e => {
  reset_email.classList.remove('hide');
  $('#wrapper').hide();
});

submit.addEventListener('click', e => {
  reset_email.classList.add('hide');
  $('#wrapper').show();
  e.preventDefault();
  var auth = firebase.auth();
  var emailAddress = $("#reset-email-input").val().trim();
  auth.sendPasswordResetEmail(emailAddress).then(function() {
  // Email sent
  }, function(error) {
  // An error happened.
  });
});

$("#btn").on("click", function(event) {
  event.preventDefault();
  // Reset our Firebase database at the at each submission (currently not storing any info)
  database.ref().set({
    result: 0 
  });

	//Grab text the user typed into the search input
	var input = $("#phone").val().trim();
  $("#phone").val("");

  // Storing our Whitepages API URL 
	var queryURL ="https://proapi.whitepages.com/3.0/phone.json?api_key=97f347b40b8c46dca3e5401c14d513e2&phone="+ input;
  // Perfoming an AJAX GET request to our queryURL
	$.ajax({
    url: queryURL,
    method: "GET"
  })
  // Set the response into our Firebase Database
  .done(function(response) {
    database.ref().set({
      result: response
    })
  });
  // Hide form once input has been submitted
  $('#form').hide();
  // Create a div to display results
  var display = $('<div>');
  display.attr('id', 'display');
  // Store phone number and append to appropriate div
  var phoneRef = database.ref('result/phone_number');
  phoneRef.on('value', function(snapshot){
    var telnum = snapshot.val();
    var format = '';
    char = { 0: '(', 3: ') ', 6: ' - ' };// Format the user's input
      for (var i = 0; i < telnum.length; i++) {
          format += (char[i] || '') + telnum[i];
      }
    $('#check').text(format);
  },function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  // Store name, gender, and age-range data and append to dynamically created div
  var nameRef = database.ref('result/belongs_to/0');
  nameRef.on('value', function(data){
    var name = "<strong>Name</strong>: " + data.val().name;
    var gender = "<strong>Gender</strong>: " + data.val().gender;
    var age = "<strong>Age Range</strong>: " + data.val().age_range;
    display.prepend("<strong><span style='color:#2F6FB9'>BELONGS TO</span></strong><br>" + name + "<br>" + gender + "<br>" + age + "<br>");
    $('#result').prepend(display);
  },function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  // Store known associates data and append to our dynamically created div
  var knownAssociatesRef = database.ref('result/associated_people/0');
  knownAssociatesRef.on('value', function(data){
    var name = "<br><strong><span style='color:#2F6FB9'>KNOWN ASSOCIATES</span></strong><br><strong>Name</strong>: " + data.val().name;
    var relation = "<strong>Relation</strong>: " + data.val().relation;
    display.append(name + "<br>" + relation + "<br>");
    $('#result').append(display);
  },function(errorObject) {
  console.log("The read failed: " + errorObject.code);
  });
  // Store additional known associates data and append to our dynamically created div
  var knownAssociatesRef = database.ref('result/associated_people/2');
  knownAssociatesRef.on('value', function(data){
    var name = "<br><strong>Name</strong>: " + data.val().name;
    var relation = "<strong>Relation</strong>: " + data.val().relation;
    display.append(name + "<br>" + relation + "<br>");
    $('#result').append(display);
  },function(errorObject) {
  console.log("The read failed: " + errorObject.code);
  });
  // Store address data and append to our dynamically created div
  var addressRef = database.ref('result/current_addresses/0');
  addressRef.on('value', function(data){
    var address = "<br><strong><span style='color:#2F6FB9'>KNOWN ADDRESSES</span></strong><br><strong>Address 1</strong>: " + data.val().street_line_1 + ", " + data.val().city + " " + data.val().state_code + " " + data.val().postal_code;
    display.append(address + "<br>");
    $('#result').append(display);
  },function(errorObject) {
  console.log("The read failed: " + errorObject.code);
  });
  // Store address data and append to our dynamically created div
  var addressRef = database.ref('result/current_addresses/1');
  addressRef.on('value', function(data){
    var address = "<strong>Address 2</strong>: " + data.val().street_line_1 + ", " + data.val().city + " " + data.val().state_code + " " + data.val().postal_code;
    display.append(address + "<br>");
    $('#result').append(display);
  },function(errorObject) {
  console.log("The read failed: " + errorObject.code);
  });
  // Store warning data and append to our dynamically created div
  var warningRef = database.ref('result/warnings/0');
  warningRef.on('value', function(snapshot){
    var val = snapshot.val();
    if (val){
      var invalidInput = snapshot.val();
      display.html("<strong><span style='color:orange'>" + invalidInput + "</span></strong><br>");
      $('#check').html("<strong><span style='color:#fff'>WARNING</span></strong><br>");
      $('#result').html(display);
      google_maps.classList.add('hide');
    $('#search-again').html("Try Again?");
    }
  },function(errorObject) {
  console.log("The read failed: " + errorObject.code);
  });
  // Use classList method to remove the class of "hide" from the appropriate elements
  google_maps.classList.remove('hide');
  search_again.classList.remove('hide');
});
//Google maps function
function initMap() {
  //check for the most current address and pass the long. and lat into the function
  database.ref('result/current_addresses/1').on('value', function(snapshot){
    if (snapshot.child('lat_long').exists()) {
      var lat_longRef = database.ref('result/current_addresses/1/lat_long');
    }
    else {
      var lat_longRef = database.ref('result/current_addresses/0/lat_long');
    }
    // Store lat-long info and plug into our Google Maps functions
    lat_longRef.on('value', function(snapshot){
      var lati = snapshot.val().latitude;
      var long = snapshot.val().longitude;
      var uluru = {lat: lati, lng: long};
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: uluru
      });
      var marker = new google.maps.Marker({
        position: uluru,
        map: map
      })
    });
  });
}
//event listener to intiate the init function for google maps
google_maps.addEventListener('click', e => {
  initMap();
});



 




 




	
	


        

     

          




	






	








