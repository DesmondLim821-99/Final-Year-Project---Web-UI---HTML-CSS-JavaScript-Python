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
  let db = firebase.firestore();
  // Get a reference to the "Food" collection in Firestore
  var staffRef = db.collection("User");

  
  var uNo;

  function GetAllDataOnce(){
    db.collection("User").get().then((querySnapshot)=>{
        var user = []
        querySnapshot.forEach(doc =>{

            user.push(doc.data());
        });
        AddAllItemsToTheTable(user);
        document.getElementById("recordCount").textContent = querySnapshot.size;
    });
  }

  function GetAllDataRealtime(){
    document.getElementById('tbody1').innerHTML="";
    uNo=0;
    db.collection("User").onSnapshot((querySnapshot)=>{
        var user = [];
        var userid = [];
        querySnapshot.forEach(doc => {
            userid.push(doc.id);
            user.push(doc.data());
        });
        AddAllItemsToTheTable(userid,user);
        document.getElementById("recordCount").textContent = querySnapshot.size;
    });
  }

  var ulist =[];
  var tbody=document.getElementById('tbody1');

  function AddItemToTable(userid,email, password, username){
    var trow= document.createElement('tr');
    var td1= document.createElement('td');
    var td2= document.createElement('td');
    var td3= document.createElement('td');
    var td4= document.createElement('td');
    ulist.push([userid,email, password, username]);
    td1.innerHTML = ++uNo;
    td2.innerHTML = email;
    td3.innerHTML = password;
    td4.innerHTML = username;

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);

    var ControlDiv = document.createElement("div");
    ControlDiv.innerHTML='<button type="button" class="btn btn-primary my-2" data-toggle="modal" data-target="#exampleModalCenter" onclick="FillTboxes(null)">Add New Record</button>'
    ControlDiv.innerHTML+='<button type="button" class="btn btn-primary my-2 ml-2" data-toggle="modal" data-target="#exampleModalCenter" onclick="FillTboxes('+uNo+')">Edit Record</button>'

    trow.appendChild(ControlDiv);
    tbody.appendChild(trow);
  }

  function AddAllItemsToTheTable(useridlist, UserDocsList){
    var uNo=0;
    tbody.innerHTML="";
    UserDocsList.forEach(element => {
        AddItemToTable(useridlist[uNo],element.email,element.password,element.username);
        uNo++
      });
  }

  var ModEmail = document.getElementById('EmailMod');
  var ModPassword = document.getElementById('PasswordMod');
  var ModUsername = document.getElementById('UsernameMod');

  var BTNmodAdd = document.getElementById('AddModBtn');
  var BTNmodUpd = document.getElementById('UpdModBtn');
  var BTNmodDel = document.getElementById('DelModBtn');
  var selectedUserIndex = 0;

  function FillTboxes(index){
    if(index==null){
      ModEmail.value = "";
      ModPassword.value = "";
      ModUsername.value = "";
      ModEmail.disabled=false;
      BTNmodAdd.style.display='inline-block';
      BTNmodUpd.style.display='none';
      BTNmodDel.style.display='none';
    } else {
      --index;
      selectedUserIndex = index; 
      ModEmail.value = ulist[index][1];
      ModPassword.value = ulist[index][2];
      ModUsername.value = ulist[index][3];
      ModEmail.disabled=true;
      BTNmodAdd.style.display='none';
      BTNmodUpd.style.display='inline-block';
      BTNmodDel.style.display='inline-block';
    }
  }

  function AddStd() {
    var email = document.getElementById('EmailMod').value
    var password = document.getElementById('PasswordMod').value
    var username = document.getElementById('UsernameMod').value
    var SuppCount;

    staffRef.get().then((querySnapshot) => {
      SuppCount = querySnapshot.size;
   });

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
            window.location.assign("/Html/UserDetail.html");
          }); 
        })
        .catch((error) => {
          const errorMessage = error.message;
          console.error(errorMessage);
        });
    }
   


    function UpdStd(){
      console.log(selectedUserIndex)
      console.log(ulist[selectedUserIndex][0])
      db.collection("User").doc(ulist[selectedUserIndex][0]).update(
        {
        password: ModPassword.value,
        username: ModUsername.value
      }).then(()=>{
        alert("Update successful!");
        window.location.assign("/Html/UserDetail.html");
      }).catch((error) => {
        console.error("Error updating document: ", error);
      })
    }

    function DelStd() {
  if (confirm("Are you sure you want to delete this users?")) {
    db.collection("User").doc(ulist[selectedUserIndex][0]).delete()
      .then(function() {
        alert("Delete successful!");
        window.location.assign("/Html/UserDetail.html");
      })
      .catch(function(error) {
        console.error("Error deleting document: ", error);
      });
    }
  }


  window.onload = GetAllDataRealtime;