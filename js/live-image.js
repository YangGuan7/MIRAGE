    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

    // the link to your model provided by Teachable Machine export panel
    const URL3 = "https://teachablemachine.withgoogle.com/models/jomBMtGOn/";

    let model3, webcam3, labelContainer3, maxPredictions3;
    var imageRecog = [];
    var step_handler;
    var predict_handler;
    var caping = 0;

    // judging();
    // step_handler = setInterval(judging, 1000);

    function judging(){
        switch(1){
                case (imageRecog[1]): //big heart
                    console.log("小愛心");
                    showRandPosFeedback("imageSmallHeartFeedback","image/smallHeart");
                    
                    break;
                case (imageRecog[2] || imageRecog[3]):  // small heart
                    console.log("搖滾手左、右");
                    // fade("image/smallHeart");
                    showFullScreenFeedback("fullscreenFeedback","image/rock");
                    break;
                case (imageRecog[4] || imageRecog[5]):
                    console.log("截圖");
                    caping +=1;
                
                    if (caping <=1){
                        function firstFunction(){
                            html2canvas(document.querySelector("#wrapper")).then(canvas => {
                                // document.body.appendChild(screenshotArea)
                                var myImage = canvas.toDataURL("image/png",0.1);
                                $("#captureImg").attr("src", myImage);
                                
                                // uploadCaptureImg(myImage);

                                console.log("html2canvas completed.  png rendered to screenshotArea");
                            });
                            }
                            const secondFunction = async () => {
                                const result = await firstFunction()
                                $("#screenshotArea").show();
                            
                            setTimeout(function() { 
                                $("#screenshotArea").hide();
                                caping=0;
                            }, 5000);
                            }

                            secondFunction();
                    }
                    
                    break;

                    case (imageRecog[6]):  
                    console.log("雙人大愛心");
                    // fade("image/smallHeart");
                    showFullScreenFeedback("fullscreenFeedback","image/bigHeart");
                    break;
                    
                default:
                    // resetfeedback();
                    // resetcaptureArea();
            }
    }


    // Load the image model and setup the webcam
    async function init3() {
        const modelURL3 = URL3 + "model.json";
        const metadataURL3 = URL3 + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model3 = await tmImage.load(modelURL3, metadataURL3);
        maxPredictions3 = model3.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam3 = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam3.setup(); // request access to the webcam
        await webcam3.play();
        window.requestAnimationFrame(loop);
        predict_handler = setInterval(predict_loop, 500);

        // append elements to the DOM
        document.getElementById("webcam-container3").appendChild(webcam3.canvas);
        labelContainer3 = document.getElementById("label-container3");
        for (let i = 0; i < maxPredictions3; i++) { // and class labels
            labelContainer3.appendChild(document.createElement("div"));
        }
    }

    async function loop() {
        webcam3.update(); // update the webcam frame
        // await predict();
        setTimeout(function () {
            window.requestAnimationFrame(loop);
        }, 500)
    }

    async function predict_loop() {
    await predict();
}

    // run the webcam image through the image model
    async function predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await model3.predict(webcam3.canvas);
        for (let i = 0; i < maxPredictions3; i++) {
            imageRecog[i] = parseFloat(prediction[i].probability);
            judging();
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer3.childNodes[i].innerHTML = classPrediction;
        }
    }

    function testcapanimation(){
        $("#screenshotArea").fadeIn({'start':function() {
                $(this)
                .css('transform','scale(0.2)')
                },'duration':200})
                .delay(2000).fadeOut("slow");

                setTimeout(2000);
    }

    function resetcaptureArea(){
                $('#screenshotArea').css({
                    'left':'0px',
                    'transform':'scale(1)',
                    'display' : 'none'
                });
    }

    function uploadCaptureImg(myImage) {
        $.ajax({
            type: "POST",
            url: "photo_upload.php",
            data: { 
               imgBase64: myImage
            }
          }).done(function(o) {
            console.log('saved'); 
            // If you want the file to be visible in the browser 
            // - please modify the callback in javascript. All you
            // need is to return the url to the file, you just saved 
            // and than put the image in your browser.
          });
    }