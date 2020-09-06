var CameraOn = false;
vid = q("#vid");
video = vid.Target;

btn = q("button.actionBTN");

function StartCamera() {
	

	if(CameraOn) {
		window.localStream.getTracks().forEach(function(track) {
  			track.stop();
		});
		CameraOn = false;
		btn.Text("Start");
		//video.className = "vid";
	}
	else {

		var constraints = { audio: true, video: { width: 1920, height: 1080 , frameRate : { ideal: 15, max: 30}} }; 

	navigator.mediaDevices.getUserMedia(constraints)
	.then(function(mediaStream) {
  		video.srcObject = mediaStream;
  		video.onloadedmetadata = function(e) {
  			window.localStream = mediaStream;
  			btn.Text("Stop");
    		video.play();
    		CameraOn  = true;
    	};
	})
	.catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors
	}



}


