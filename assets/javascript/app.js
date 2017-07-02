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
  database.ref().onDisconnect().set({
    result:0,
  });

  //Get Elements
  const txtEmail = document.getElementById('email');
  const txtPassword = document.getElementById('password');
  const btnLogin = document.getElementById('login');
  const btnSignUp = document.getElementById('signup');
  const btnLogout = document.getElementById('logout');
  const wrapper = document.getElementById('wrapper');
  const container = document.getElementById('container');
  const search_again = document.getElementById('search-again');

  //Add login event
  btnLogin.addEventListener('click', e => {
    e.preventDefault();
    
    //Get email
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    $('#email').val("");
    $('#password').val("");

    //Sign in
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => alert(e.message));
  });

  //Signup user
  btnSignUp.addEventListener('click', e => {
    e.preventDefault();
    
  //Get email
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();

  //Sign in
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => alert(e.message));
  });

  //Logout user
  btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
  });

  //Add a real time listener
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser){
      console.log(firebaseUser);
      wrapper.classList.add('hide');
      container.classList.remove('hide');

    } else{
      console.log("Not logged in!");
    }
  })


  // auth.singInWithEmailAndPassword(email, pass);
  // auth.createUserWithEmailAndPassword(email, pass);


  var login_attempts=3;
  function check_form() {
    var name=document.getElementById("name").value;
    var pass=document.getElementById("pass").value;
      if(name=="talkerscode" && pass=="talkerscode"){
        alert("SuccessFully Logged In");
        document.getElementById("name").value="";
        document.getElementById("pass").value="";
      }
      else{
        if(login_attempts==0){
          alert("No Login Attempts Available");
        }
        else{
          login_attempts=login_attempts-1;
          alert("Login Failed Now Only "+login_attempts+" Login Attempts Available");
            if(login_attempts==0){
            document.getElementById("name").disabled=true;
            document.getElementById("pass").disabled=true;
            document.getElementById("form1").disabled=true;
            }
        }
      }
    return false;
  } 


$("#btn").on("click", function(event) {
  event.preventDefault();

	// Grabbing text the user typed into the search input
	var input = $("#phone").val().trim();
  $("#phone").val("");
	var queryURL ="https://proapi.whitepages.com/3.0/phone.json?api_key=dd6cf1d08eeb47038e757269a297655e&phone="+ input;

	$.ajax({
    url: queryURL,
    method: "GET"
  })
  .done(function(response) {
    database.ref().set({
      result: response
    })
  });

  $('#form').hide();

  var nameRef = database.ref('result/belongs_to/0');
  nameRef.on('value', function(data){
    var name = "<strong>Name</strong>: " + data.val().name;
    var gender = "<strong>Gender</strong>: " + data.val().gender;
    var age = "<strong>Age Range</strong>: " + data.val().age_range;

    var display = $('<div>');
    display.attr('id', 'display');
    display.prepend("<strong><span style='color:#2F6FB9'>IDENTITY</span></strong><br>" + name + "<br>" + gender + "<br>" + age);
    $('#result').prepend(display);
    $('#check').html("Results");
  },function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  var knownAssociatesRef = database.ref('result/associated_people/0');
  knownAssociatesRef.on('value', function(data){
    var name = "<br><strong><span style='color:#2F6FB9'>KNOWN ASSOCIATES</span></strong><br><strong>Name</strong>: " + data.val().name;
    var relation = "<strong>Relation</strong>: " + data.val().relation;
    var display = $('<div>');
    display.attr('id', 'display');
    display.append(name + "<br>" + relation);
    $('#result').append(display);
  },function(errorObject) {
  console.log("The read failed: " + errorObject.code);
  });

  var knownAssociatesRef = database.ref('result/associated_people/2');
  knownAssociatesRef.on('value', function(data){
    var name = "<br><strong>Name</strong>: " + data.val().name;
    var relation = "<strong>Relation</strong>: " + data.val().relation;
    var display = $('<div>');
    display.attr('id', 'display');
    display.append(name + "<br>" + relation);
    $('#result').append(display);
  },function(errorObject) {
  console.log("The read failed: " + errorObject.code);
  });

  var addressRef = database.ref('result/current_addresses/0');
  addressRef.on('value', function(data){
    var address = "<br><strong><span style='color:#2F6FB9'>KNOWN ADDRESSES</span></strong><br><strong>Address 1</strong>: " + data.val().street_line_1 + ", " + data.val().city + " " + data.val().state_code + " " + data.val().postal_code;
    var display = $('<div>');
    display.attr('id', 'display');
    display.append(address);
    $('#result').append(display);
  },function(errorObject) {
  console.log("The read failed: " + errorObject.code);
  });

  var addressRef = database.ref('result/current_addresses/1');
  addressRef.on('value', function(data){
    var address = "<strong>Address 2</strong>: " + data.val().street_line_1 + ", " + data.val().city + " " + data.val().state_code + " " + data.val().postal_code;
    var display = $('<div>');
    display.attr('id', 'display');
    display.append(address);
    $('#result').append(display);
  },function(errorObject) {
  console.log("The read failed: " + errorObject.code);
  });

  $('.btn-default').show()
  search_again.classList.remove('hide');
});

function initMap() {
  var lat_longRef = database.ref('result/current_addresses/0/lat_long');
  lat_longRef.on('value', function(data){
    var lati = data.val().latitude;
    var long = data.val().longitude;
    var uluru = {lat: lati, lng: long};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: uluru
    });
    var marker = new google.maps.Marker({
      position: uluru,
      map: map
    })
  })
}

initMap();



 




 




	
	


        

     

          




	






	








