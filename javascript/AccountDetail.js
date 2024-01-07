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

var currentUserIndex = 0;
  var userList = [];
  var ulist = [];

//   function GetAllUser(){
//     db.collection("User").onSnapshot((querySnapshot)=>{
//         var user = [];
//         var userid = [];
//         querySnapshot.forEach(doc => {        
//             userid.push(doc.id);
//             user.push(doc.data());
//         });
//         DisplayUserDetail(userid,user);
//     });
//   }
    

function displayUser(){
  console.log("hi",useremail);
  const query = staffRef.where("email", "==", useremail).limit(1);

  query.get().then((querySnapshot) => {
  if (!querySnapshot.empty) {
      const documentSnapshot = querySnapshot.docs[0];
      const data = documentSnapshot.data();
      const { email: e, username: u, password: p } = data;
      console.log(e, u, p);
      var currente = document.getElementById('currentEmail')
      var currentu = document.getElementById('currentUsername')
      var currentp = document.getElementById('currentPassword')
      currente.value = e;
      currentu.value = u;
      currentp.value = p;
  }
  });
}

//   function DisplayUserDetail(useridlist, UserDocsList){
//     var uNo = 0;
//     UserDocsList.forEach(element => {
//         userList.push(useridlist[uNo],element.email,element.password,element.username);
//         uNo++
//     });
//     for(let i =0; i<userList.length; i++){
//         if(userList[i][1] == document.getElementById('email')){
//             currentUserIndex = i;
//             break;
//         }
//     }
//     console.log(currentUserIndex);
//     console.log(userList[currentUserIndex][3]);
//     var curUsername = document.getElementById('currentUsername');
//     var curEmail = document.getElementById('currentEmail');
//     var curPassword = document.getElementById('currentPassword');
    
//     curUsername.value = userList[currentUserIndex][3]
//     curEmail.value = userList[currentUserIndex][1]
//     curPassword.value = userList[currentUserIndex][2]

//     document.getElementById('currentUsername').disabled = true;
//     document.getElementById('currentEmail').disabled = true;
//     document.getElementById('currentPassword').disabled = true;

//   }

  function editAccount() {

    document.getElementById('currentUsername').disabled = false;
    document.getElementById('currentEmail').disabled = false;
    document.getElementById('currentPassword').disabled = false;

  }

  function updateCurrentUser() {

    var curUsername = document.getElementById('currentUsername');
    var curEmail = document.getElementById('currentEmail');
    var curPassword = document.getElementById('currentPassword');

    staffRef.doc(userid[currentUserIndex]).update({
      password: curPassword.value,
      username: curUsername.value,
      email: curEmail.value

    }).then(()=>{
      console.log("Document successfully updated!");
    }).catch((error) => {
      console.error("Error updating document: ", error);
    })

    //Dunno how to update authentication. hahahahaha

  }

  function cancelUpdate() {
    document.getElementById('currentUsername').disabled = true;
    document.getElementById('currentEmail').disabled = true;
    document.getElementById('currentPassword').disabled = true;
  }