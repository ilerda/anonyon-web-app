'use strict';

function Anonyon() {


  this.survey1 = document.getElementById("survey1");
  this.survey2 = document.getElementById("survey2");
  this.survey3 = document.getElementById("survey3");

  this.qList = document.getElementById("qList");
  this.corrList1 = document.getElementById("corr1");
  this.corrList2 = document.getElementById("corr2");
  this.SubmitCorr = document.getElementById("submitCorr");
  this.source1 = document.getElementById("Source");

  this.survey1.addEventListener('click', this.toggleFirst.bind(this));
  this.survey2.addEventListener('click', this.toggleSecond.bind(this));
  this.SubmitCorr.addEventListener('click', this.displayCorell.bind(this));

  //this.Q1.addEventListener('click', this.toggleQuestion('q1').bind(this))

  //this.qItems.addEventListener('click', this.toggleQuestion.bind(this));

  this.initFirebase();

};

Anonyon.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.database = firebase.database();
	this.storage = firebase.storage();
};


/*Anonyon.prototype.dothing = function() {
  console.log(this.countList);
};*/


Anonyon.prototype.toggleFirst = function() {
  this.surveyNum = 2;
  this.initiateS(this.surveyNum);

};

Anonyon.prototype.toggleSecond = function() {
  this.surveyNum = 3;
  this.initiateS(this.surveyNum);
};

Anonyon.prototype.toggleThird = function() {
  this.surveyNum = 3;
  this.initiateS(this.surveyNum);
};


Anonyon.prototype.initiateS = function(Snum) {
  //this.countList = [];
  /*var setQ1 = function(dataSnapshot) {
		this.Q1.innerHTML = dataSnapshot.val();
	}.bind(this);
  this.database.ref('anonyonPolls/survey'+Snum+'/questions/q1/wording').once('value').then(setQ1);*/
  this.qList.innerHTML = "";
  var setQ = function(dataSnapshot) {
    dataSnapshot.forEach(function(childSnapshot) {
      var newQ = childSnapshot.child('wording').val();
      var node = document.createElement("LI");
      var textnode = document.createTextNode(newQ);
      var id1 = childSnapshot.key;
      node.id = id1;
      //node.classList.remove('q-li-clicked');
      node.classList.add('q-li');
      node.classList.add('q-li-def');
      /*node.classList.add('bg-info');*/
      node.addEventListener('click', this.toggleQuestion.bind(this,id1));
      //console.log(childSnapshot.key);
      node.appendChild(textnode);
      this.qList.appendChild(node);
    }.bind(this));
		// this.Q1.innerHTML = dataSnapshot.val();
	}.bind(this);
  this.database.ref('anonyonPolls/survey'+Snum+'/questions').once('value').then(setQ);
  this.database.ref('anonyonPolls/survey'+Snum+'/source').once('value').then(function(snap) {
    this.source1.innerHTML = snap.child('name').val();
    this.source1.href = snap.child('link').val();
    $("#block2").get(0).scrollIntoView(true);
    //window.scrollBy(0, -50);
  }.bind(this));
};

Anonyon.prototype.toggleQuestion = function(QNum) {
  console.log(QNum);
  this.corrList1.innerHTML = "";
  this.corrList2.innerHTML = "";
  this.QNumber = QNum;
  this.countList = [];
  this.ansList = [];
  var refstring = 'anonyonPolls/survey'+this.surveyNum+'/questions/'+QNum+'/answers';
  var QRef = this.database.ref(refstring);
  var initData = function(snapS) {
    snapS.forEach(function(child1) {
      var count1 = child1.child('count').val();
      var ans1 = child1.child('answer').val();
      var key1 = child1.key;
      this.countList.push(count1);
      this.ansList.push(ans1);
      var corrNode = document.createElement("option");
      corrNode.value = key1;
      var text1 = document.createTextNode(ans1);
      corrNode.appendChild(text1);
      this.corrList2.appendChild(corrNode)
      //console.log(count1);
    }.bind(this));
  }.bind(this);
  var dispData = function() {
    console.log(this.countList);

    if (this.myChart) {
  		this.myChart.destroy(); }
    var ctx = document.getElementById("myChart");
  	this.myChart = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: this.ansList,
          datasets: [{
              data: this.countList,
              backgroundColor: [
                  "#36A2EB",
                  "#FF6384",
                  "#FFCE56",
  								"#3D8B37",
                  "#4D4D4D",
                  "#FAA43A",
                  "#60BD68",
                  "#5DA5DA",
                  "#F17CB0",
                  "#B2912F",
                  "#B276B2",
                  "#DECF3F",
                  "#36A2EB",
                  "#FF6384",
                  "#FFCE56",
  								"#3D8B37",
                  "#4D4D4D"
              ]
          }]
      },
      options: {
          maintainAspectRatio: false,
      }
  	});
    $("#chartA").get(0).scrollIntoView(true);
  }.bind(this);

  var setCorell = function(snapshot) {
    snapshot.forEach(function(child1) {
      var key1 = child1.key;
      var val1 = child1.val();
      var corrNode1 = document.createElement("option");
      var text1 = document.createTextNode(val1);
      corrNode1.value = key1;
      corrNode1.appendChild(text1);
      this.corrList1.appendChild(corrNode1)
      //console.log(count1);
    }.bind(this));
  }.bind(this);

  QRef.once('value').then(initData).then(dispData);

  this.database.ref('anonyonPolls/survey'+this.surveyNum+'/corellKey').once('value').then(setCorell);
  var thisItem = document.getElementById(QNum)
	$('.q-li-clicked').removeClass('q-li-clicked');
	$('.q-li').addClass('q-li-def');
  $('#'+QNum).removeClass('q-li-def');
  $('#'+QNum).addClass('q-li-clicked');
};

Anonyon.prototype.displayCorell = function() {
  var Corr1 = $('#corr1').val();
	var Corr2 = $('#corr2').val();
  this.refLoc = 'anonyonPolls/survey'+this.surveyNum+'/questions/'+this.QNumber+'/answers/'+Corr2+'/further/'+Corr1;


  var labelLoc = 'anonyonPolls/survey'+this.surveyNum+'/corellDict/'+Corr1;
  var labelRef = this.database.ref(labelLoc);

  var saveLabel = function(snapshot) {
    this.corrLabel = snapshot.val();
  }.bind(this);

  var saveData = function() {
    var corrRef = this.database.ref(this.refLoc);
    corrRef.once('value').then(dispData2);
  }.bind(this);

  var dispData2 = function(snapshot) {

    if (this.myChart2) {
  		this.myChart2.destroy(); }
    var ctx = document.getElementById("myChart2");
  	this.myChart2 = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: this.corrLabel,
          datasets: [{
              data: snapshot.val(),//this.corrData,
              backgroundColor: [
                "#36A2EB",
                "#FF6384",
                "#FFCE56",
                "#3D8B37",
                "#4D4D4D",
                "#FAA43A",
                "#60BD68",
                "#5DA5DA",
                "#F17CB0",
                "#B2912F",
                "#B276B2",
                "#DECF3F"
              ]
          }]
      },
      options: {
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: "sub-percentage"
              },
              ticks: {
                suggestedMin: 0
              }
            }]
          }
      }
  	});
    $("#secondInfo").get(0).scrollIntoView(true);
  }.bind(this);

  labelRef.once('value').then(saveLabel).then(saveData);
  //return false;

};

/*
if (this.myChart) {
  this.myChart.destroy(); }
var ctx = document.getElementById("myChart");
this.myChart = new Chart(ctx, {
  type: 'pie',
  data: {
      labels: this.anss,
      datasets: [{
          data: this.valss,
          backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#3D8B37"
          ]
      }]
  },
  options: {
      maintainAspectRatio: false,
  }
});
*/

window.onload = function() {
  window.anonyon = new Anonyon();
};
