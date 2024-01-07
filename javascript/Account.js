const firebaseConfig = {
    apiKey: "AIzaSyDzfibX8cpwABkzZBxnnrn-4U6OubXKvRg",
    authDomain: "registeruser-c6cbc.firebaseapp.com",
    projectId: "registeruser-c6cbc",
    storageBucket: "registeruser-c6cbc.appspot.com",
    messagingSenderId: "1143647232",
    appId: "1:1143647232:web:bf32107975e761a7577ce5"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Initialize variables
  const auth = firebase.auth()
  //const database = firebase.database()
  //var storageRef = firebase.storage().ref()
  var db = firebase.firestore();
  // Get a reference to the "Food" collection in Firestore
  var staffRef = db.collection("User");

  staffRef.get().then((querySnapshot) => {
    SuppCount = querySnapshot.size;
  });

  function createUser(username, email, password) {
    // Create the user in Firebase Authentication
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
          
  
          // Initialize food count to the number of existing documents in the collection
          SuppCount++;
          var userId = "U" + SuppCount.toString().padStart(6, "0");
  
          // Add the user's information to Cloud Firestore
          staffRef.doc(userId).set({
            username: username,
            email: email,
            password: password,
          }).then(()=>{
            alert('User Created!');
            console.log('User created successfully!');
            window.location.assign("/Html/Account.html");
          }); 
        })
        .catch((error) => {
          const errorMessage = error.message;
          console.error(errorMessage);
        });
    }

  // Set up our register function
  function register() {

    // Get all our input fields
    username = document.getElementById('username').value
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    repassword = document.getElementById('repassword').value
  
    /*
    favourite_song = document.getElementById('favourite_song').value
    milk_before_cereal = document.getElementById('milk_before_cereal').value
    */
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false || validate_repassword(repassword) == false) {
      alert('Email or Password is Outta Line!!')
      return
      // Don't continue running the code
    }
  
    /*|| validate_field(favourite_song) == false || validate_field(milk_before_cereal) == false */
    if (validate_field(username) == false) {
      alert('One or More Extra Fields is Outta Line!!')
      return
    }
  
    //Validate New Password with Confirm Password
    if (password != repassword){
      alert('Password does not Match! Please Try again...')
      return
    }


      if (!document.getElementById("terms").checked) {
          alert("Please agree to the terms and conditions before registering.");
          return false;
        }
        // The rest of your registration code goes here
  
    createUser(username, email, password);
    
  }
  
  
  // Validate Functions
  function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
      // Email is good
      return true
    } else {
      // Email is not good
      return false
    }
  }
  
  function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
      return false
    } else {
      return true
    }
  }
  
  function validate_repassword(repassword) {
    // Firebase only accepts lengths greater than 6
    if (repassword =!password) {
      return false
    } else {
      return true
    }
  }

  function validate_field(field) {
    if (field == null) {
      return false
    }
  
    if (field.length <= 0) {
      return false
    } else {
      return true
    }
  }

  let useremail = "";

  function login() {
    var email = document.getElementById('email').value;
    useremail = email;
    var password = document.getElementById('password').value;

    if (email === 'admin' && password === 'admin888') {
      window.location.assign("/Html/Admin.html");
  } else {
      firebase.auth().signInWithEmailAndPassword(email, password)
          .then(function() {
            staffRef.where("email", "==", email).get().then(function(querySnapshot){
              if (!querySnapshot.empty) {
                const documentSnapshot = querySnapshot.docs[0];
                const data = documentSnapshot.data();
                const userid = documentSnapshot.id;
                console.log("hi", userid);
                db.collection("User").doc(userid).update(
                  {
                  password: password
                })
              alert("Login successful!");
              window.location.assign("/Html/loginal.html");
            }})
          })
          .catch(function(error) {
              var errorCode = error.code;
              var errorMessage = error.message;
              alert("Login failed: " + errorMessage);
          });
  }
}

firebase.auth().onAuthStateChanged(function(user){
  if (user){
    var useremail = user.email;
    var currentu = document.getElementById('currentUsername')
    var currente = document.getElementById('currentEmail')
    var currentp = document.getElementById('currentPassword')
    staffRef.where("email", "==", useremail).get().then(function(querySnapshot){
      if (!querySnapshot.empty) {
        const documentSnapshot = querySnapshot.docs[0];
        const data = documentSnapshot.data();
        const userid = documentSnapshot.id;
        //console.log(u, e, p);    
        currentu.value = data.username;
        currente.value = data.email;
        currentp.value = data.password;
        document.getElementById('currentEmail').readOnly = true;
        document.getElementById('editDone').addEventListener('click', () => {
          db.collection("User").doc(userid).update(
            {
            password: currentp.value,
            email: currente.value,
            username: currentu.value
          })

        })
    } 
    });
  }
});

  function resetpassword(){
    var useremail = document.getElementById('emailfp').value;
    if (validate_email(useremail == false)){
      alert("Invalid Email!");
      return
    }
    auth.sendPasswordResetEmail(useremail).then(()=> {
      alert("Password reset link send to "+ useremail);
      window.location.assign("/Html/Account.html");
    }).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    });
  }



  function updateCurrentUser(){
    
    // db.collection("User").doc(userid).update(
    //   {
    //   password: currentp.value,
    //   username: currentu.value
    // }).then(()=>{
    //   console.log("Document successfully updated!");
    //   //window.location.assign("/Html/UserAccount.html");
    // }).catch((error) => {
    //   console.error("Error updating document: ", error);
    // })
  }

  function cancelUpdate(){
    window.location.assign("/Html/UserAccount.html");
  }