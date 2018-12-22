var trainName = ""
var destination = ""
var frequency = ""
var nextArrival = ""
var firstTrain = ""
// var minAway = ""

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

  database.ref().on("child_added", function (snapshot) {
    var sv = snapshot.val();

    var firstTrainTime = moment(sv.first,"HH:mm");
    var maxTime = moment.max(moment(),firstTrainTime);
    // Variable: 1) Time in minutes until next train == tMinutesTillTrain
    //2)Actual Time the next train will arrive == nextArrival
    
    if (maxTime === firstTrainTime)
    {
      //first train has not yet arrived
      nextArrival = firstTrainTime.format("hh:mm A");
      tMinutesTillTrain = firstTrainTime.diff(moment(),"minutes");

    }
    else
    {
      // first train has already arrived

// First Time (pushed back 1 year to make sure it comes before current time)
var firstTimeConverted = moment(sv.first,"HH:mm").subtract(1, "years");
console.log(firstTimeConverted); 
console.log(sv.first);

      // Current Time
 var currentTime = moment();
 console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

 // Difference between the times
 var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

 // Time apart (remainder)
 var tRemainder = diffTime % sv.freq;
 console.log("remaining minutes: " + tRemainder);

 // minutes away
 var tMinutesTillTrain = sv.freq - tRemainder;
 console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
  
//  next Train
 nextArrival = moment().add(tMinutesTillTrain, "minutes");
 nextArrival = moment(nextArrival).format('h:mm A');

    }
 


      console.log(sv.name);
      console.log(sv.dest);
      console.log(sv.first);
      console.log(sv.freq);
  
      var tableRow = $("<tr>");
      var tableData1 = $("<td>");
      tableData1.text(sv.name);
      var tableData2 = $("<td>");
      tableData2.text(sv.dest);
      var tableData3 = $("<td>");
      tableData3.text(sv.freq);
      var tableData4 = $("<td>");
      tableData4.text(nextArrival);
      var tableData5 = $("<td>");
      tableData5.text(tMinutesTillTrain);
  
    
      tableRow.append(tableData1, tableData2, tableData3, tableData4, tableData5);
      $(".table").append(tableRow); 




}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);

});