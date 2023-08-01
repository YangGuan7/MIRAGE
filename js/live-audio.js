$(document).ready(function() {
    $("video").trigger('play');
    setTimeout(function() {
          $("#logo").fadeOut();
    }, 5000);

    var div = $('body');
    var moveTimer;

    div.on("mousemove",function(){
      $("#logo").fadeIn();
      clearTimeout(moveTimer);
      moveTimer = setTimeout(function() {
          $("#logo").fadeOut();
      }, 5000);
    });

    
  });


var score = []; //recognition result
var au;
// window.onload = function () {
// init();
// init3();
// };

// more documentation available at
// https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/vcBCSct3G/";

async function createModel() {
  const checkpointURL = URL + "model.json"; // model topology
  const metadataURL = URL + "metadata.json"; // model metadata

  const recognizer = speechCommands.create(
      "BROWSER_FFT", // fourier transform type, not useful to change
      undefined, // speech commands vocabulary feature, not useful for your models
      checkpointURL,
      metadataURL);

  // check that model and metadata are loaded via HTTPS requests.
  await recognizer.ensureModelLoaded();

  return recognizer;
}

judgeAudio();
au = setInterval(judgeAudio, 500);
var i = 0;

function judgeAudio(){
  if(score[1] > 0.5){
      console.log("encore");
      showEncoreFeedback();
  }
  else{
  }
}
async function init() {
  const recognizer = await createModel();
  const classLabels = recognizer.wordLabels(); // get class labels
  const labelContainer = document.getElementById("label-container");
  for (let i = 0; i < classLabels.length; i++) {
      labelContainer.appendChild(document.createElement("div"));
  }

  // listen() takes two arguments:
  // 1. A callback function that is invoked anytime a word is recognized.
  // 2. A configuration object with adjustable fields
  recognizer.listen(result => {
      const scores = result.scores; // probability of prediction for each class
      // render the probability scores per class
      for (let i = 0; i < classLabels.length; i++) {
          score[i] = parseFloat(result.scores[i]);
          const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
          labelContainer.childNodes[i].innerHTML = classPrediction;

      }
  }, {
      includeSpectrogram: true, // in case listen should return result.spectrogram
      probabilityThreshold: 0.6,
      invokeCallbackOnNoiseAndUnknown: true,
      overlapFactor: 0.5 // probably want between 0.5 and 0.75. More info in README
  });
}

function showFullScreenFeedback(ele,bg){ //for full screen feedback
  var imageUrl = "/img/" + bg + ".gif";
  $("#"+ele).css("background-image", "url(" + imageUrl + ")");
  $("#"+ele).show();
  setTimeout(function() { 
          $("#"+ele).hide();
  }, 3000);
}

function showEncoreFeedback(ele){ //for full screen encore feedback
    $("#encoreFeedback").show();
    setTimeout(function() { 
        $("#encoreFeedback").hide();
        var posx = (Math.random() * ($(document).width() - 750)+350).toFixed();
        var posy = (Math.random() * ($(document).height() - 550)+150).toFixed();
        $("#encoreFeedback").css({
            'left':posx+'px',
            'top':posy+'px'
        });
    }, 3000);
  }

function showRandPosFeedback(ele,bg){ //for random position feedback
  showFullScreenFeedback(ele,bg);
  setTimeout(function() { 
      $("#"+ele).hide();
      resetPosition(ele);
      // i=0;
  }, 3000);
}

function resetPosition(ele){
  // $("#audioFeedback").hide();
  var posx = (Math.random() * ($(document).width() - 750)+350).toFixed();
      var posy = (Math.random() * ($(document).height() - 550)+150).toFixed();
      $('#'+ele).css({
          'left':posx+'px',
          'top':posy+'px'
      });
}