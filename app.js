var trainName = ""
var destination = ""
var frequency = ""
var nextArrival = ""
var firstTrain = ""

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDV2R04iHKk7reBWt6j1Us51kr_mht6344",
  authDomain: "train-scheduler-1aeaa.firebaseapp.com",
  databaseURL: "https://train-scheduler-1aeaa.firebaseio.com",
  projectId: "train-scheduler-1aeaa",
  storageBucket: "",
  messagingSenderId: "239226890992"
};
firebase.initializeApp(config);

var database = firebase.database();


// function 1 deals with submit card and pushes to database
$(document).on("click", "#btnSubmit", function (event) {
  event.preventDefault();
  // values from text-boxes
  trainName = $("#nameInput").val().trim();
  destination = $("#destInput").val().trim();
  firstTrain = $("#firstTrainInput").val().trim();
  frequency = $("#frequencyInput").val().trim();

  var tableRow = $("<tr>");
  var tableData1 = $("<td>");
  tableData1.text(trainName);
  var tableData2 = $("<td>");
  tableData2.text(destination);
  var tableData3 = $("<td>");
  tableData3.text(firstTrain);
  var tableData4 = $("<td>");
  tableData4.text(frequency);


  database.ref().push({
    name: trainName,
    dest: destination,
    first: firstTrain,
    freq: frequency,
    // next: minAway,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

});

database.ref().on("value", function (snapshot) {
  $("#trainRow").empty();
  //sv = snapshot of db object of objects
  var sv = snapshot.val();
  
  //loop through ids (properties of sv) to access specific trains
  for(var id in sv){
    //sv[id] = current train in loop
    populateUI(sv[id], id);
  }


}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

function populateUI (snapshot, id) {
  var firstTrainTime = moment(snapshot.first, "HH:mm");
  var maxTime = moment.max(moment(), firstTrainTime);
  // Variable: 1) Time in minutes until next train == tMinutesTillTrain
  //2)Actual Time the next train will arrive == nextArrival

  if (maxTime === firstTrainTime) {
    //first train has not yet arrived
    nextArrival = firstTrainTime.format("hh:mm A");
    tMinutesTillTrain = firstTrainTime.diff(moment(), "minutes");

  }
  else {
    // first train has already arrived

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(snapshot.first, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);
    console.log(snapshot.first);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % snapshot.freq;
    console.log("remaining minutes: " + tRemainder);

    // minutes away
    var tMinutesTillTrain = snapshot.freq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    //  next Train
    nextArrival = moment().add(tMinutesTillTrain, "minutes");
    nextArrival = moment(nextArrival).format('h:mm A');

  }

  console.log(snapshot.name);
  console.log(snapshot.dest);
  console.log(snapshot.first);
  console.log(snapshot.freq);



  var tableRow = $("<tr>");
  tableRow.addClass(`${id}`); //puts id as a class in HTML dynamically so we can target which train with the remove button
  var tableData1 = $("<td>");
  tableData1.text(snapshot.name);
  var tableData2 = $("<td>");
  tableData2.text(snapshot.dest);
  var tableData3 = $("<td>");
  tableData3.text(snapshot.freq);
  var tableData4 = $("<td>");
  tableData4.text(nextArrival);
  var tableData5 = $("<td>");
  tableData5.text(tMinutesTillTrain);
  var tableData6 = $("<td>");
  tableData6.append("<button>");
  tableData6.addClass("remove");


  tableRow.append(tableData1, tableData2, tableData3, tableData4, tableData5, tableData6);
  $("#trainRow").append(tableRow);


  $(document).on("click", ".remove", function () {
    var path = this.parentElement.className; //remove button is a child of the ID class added to the table row above
    firebase.database().ref(path).remove();
  })
}

