var trainName = ""
var destination = ""
var frequency = ""
var nextArrival = ""
var firstTrain = ""
var minAway = ""

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
        next: minAway,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

  });

  database.ref().on("child_added", function (snapshot) {
    var sv = snapshot.val();

    console.log(sv.name);
    console.log(sv.dest);
    console.log(sv.first);
    console.log(sv.freq);
    console.log(sv.next);

    var tableRow = $("<tr>");
    var tableData1 = $("<td>");
    tableData1.text(sv.name);
    var tableData2 = $("<td>");
    tableData2.text(sv.dest);
    var tableData3 = $("<td>");
    tableData3.text(sv.freq);
    var tableData4 = $("<td>");
    tableData4.text(sv.first);
    var tableData5 = $("<td>");
    tableData5.text(sv.next);

  
    tableRow.append(tableData1, tableData2, tableData3, tableData4, tableData5);
    $(".table").append(tableRow);  
    // // Assumptions
    // var tFrequency = 3;

    //  // Time is 3:30 AM
    //  var firstTime = "03:30";
 
// First Time (pushed back 1 year to make sure it comes before current time)
var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
console.log(firstTimeConverted);   
  
 // Current Time
 var currentTime = moment();
 console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

 // Difference between the times
 var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
 console.log("DIFFERENCE IN TIME: " + diffTime);

 // Time apart (remainder)
 var tRemainder = diffTime % frequency;
 console.log(tRemainder);

 // next train
 var tMinutesTillTrain = frequency - tRemainder;
 console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

 sv.next = moment().add(tMinutesTillTrain, 'minutes');
 sv.next = moment(sv.next).format('h:mm A');

 // minutes away
 minAway = frequency - tRemainder;
  minAway = moment().startOf('day').add(minAway, 'minutes').format('HH:mm');
	    return moment(minAway).format('HH:mm');

 

}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);

});