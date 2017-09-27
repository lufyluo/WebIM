
function encodeRawPCM(data) {
	var fdata = new Float32Array(data.length);

	for (var i=-1; ++i<data.length;) {
		fdata[i] = data[i] / 32767;
	}

	// Just plays
	var wavData = PCMData.encode({
		sampleRate: 8000
	  , channelCount: 1
	  , bytesPerSample: 2
	  , data: fdata
	});				

	element = new Audio();
	element.src = "data:audio/wav;base64,"+btoa(wavData);
	//element.play();
	
	var begin = Date.now(), end, times
	  ,	ret
	  , binaryString;

	encodeBytes(data)	
}

function encodeBytes(pcmData) {
	var BlobBuilder = window["WebKitBlobBuilder"] || window["MozBlobBuilder"] || window["BlobBuilder"];
	var bb = new BlobBuilder();
	bb.append(pcmData);
	buffer = null;

	var reader = new FileReader();	
	reader.onload = function (e) {		 		
		var frames, bytes
		  , begin, end, times
		  ,	ret
		  , data = e.target.result
		  , shorts =  pcmData.constructor.prototype == String.prototype ? new Int16Array(data) : pcmData;

		/**
		  * Encode PCM (byte)
		  */
		console.warn("encode pcm int data");
		var codec = new AMR({
		   	benchmark: true
		})

		var frames = codec.encode(shorts, true);
				
		AMR.util.play(codec.decode(frames));

	};

	reader.readAsArrayBuffer(bb.getBlob());
}


var playamr = function (blob) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.open('GET', blob, true);
    xhr.onload = function () {
        if (this.status == 200) {
            blob = new Blob();
            blob = this.response;
            play(blob);
        }
    }
    xhr.send();
    //$.ajax({
    //    url: blob,
    //    async:false,
    //    success: function (data) {
    //        var samples = new AMR({
    //            benchmark: true
    //        }).decode(data);
    //        AMR.util.play(samples);
    //    }
    //});
};
function play(blob) {
    var reader = new FileReader();
    reader.onload = (function (file) {
        return function (e) {  
                var samples = new AMR({
                    benchmark: true
                }).decode(e.target.result);

                AMR.util.play(samples);
        }
    })(blob);
    // Read the file as a Binary String
    reader.readAsBinaryString(blob);
}