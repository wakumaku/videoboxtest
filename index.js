// Mother of the lamb
document.addEventListener('DOMContentLoaded', initPage, false);

var vidio;
var vidioConsole;
var frameRate = 0;
var calculateInterval;


var videoboxResult;
var videoboxStatus;
var tagboxIndex;
var faceboxIndex;

function initPage() {
    vidio = document.getElementById("vidio")
    vidioConsole = document.getElementById("vidioConsole")

    setTrailer("BR")

    document.getElementById("trailer").addEventListener("change", (c) => {
        setTrailer(c.srcElement.value);
        initVideo();
   });

   initVideo();
}

function initVideo() {

    vidio.playbackRate = 0.5;
    
    tagboxIndex = createIndex(videoboxResult.tagbox.tags)
    faceboxIndex = createIndex(videoboxResult.facebox.faces)

    frameRate = calculateFrameRate(videoboxStatus.framesComplete, videoboxStatus.millisecondsComplete);

    clearInterval(calculateInterval)
    
    vidio.addEventListener("playing", () => {
        playVideo()
    });
    vidio.addEventListener("pause", () => {
        clearInterval(calculateInterval)
    });
    vidio.addEventListener("stop", () => {
        clearInterval(calculateInterval)
    });
}

function setTrailer(name) {

    vidio.pause()

    if (name == "BR") {
        videoboxResult = videoboxResultBR
        videoboxStatus = videoboxStatusBR
        vidio.src = "data/br.mp4"
    } else if (name == "JP") {
        videoboxResult = videoboxResultJP
        videoboxStatus = videoboxStatusJP
        vidio.src = "data/jp.mp4"
    } else if (name == "IT") {
        videoboxResult = videoboxResultIT
        videoboxStatus = videoboxStatusIT
        vidio.src = "data/it.mp4"
    } else {
        videoboxResult = videoboxResultBR
        videoboxStatus = videoboxStatusBR
        vidio.src = "data/br.mp4"
    }

}

function playVideo() {
    vidio.play()
    .then(() => {
        calculateInterval = setInterval(putSomeFaces, (1000 / frameRate))
    });
}

function putSomeFaces() {
    currentFrame = calculateCurrentFrame()

    var tags = (tagboxIndex[currentFrame] === undefined) ? [] : tagboxIndex[currentFrame];
    var faces = (faceboxIndex[currentFrame] === undefined) ? [] : faceboxIndex[currentFrame];

    consoleLog(
        "Tags:\n"+
        tags.join("\n") +
        "\n\nFaces:\n"+
        faces.join("\n")
    )
}

function calculateCurrentFrame() {
    currentTime = vidio.currentTime;
    return Math.floor(currentTime * frameRate);
}

function consoleLog(message) {
    vidioConsole.textContent = message;
    console.log(message);
}

function calculateFrameRate(totalFrames, milliseconds) {
    var seconds = milliseconds / 1000;
    return Math.floor(totalFrames/seconds);
}

function createIndex(rootNode) {
    var newIndex = [];
    for (let index = 0; index < rootNode.length; index++) {
        const element = rootNode[index];
        var keyName = element.key; // FaceName , TagName
        for(let i in element.instances) {
            const instance = element.instances[i];
            for (let x = instance.start; x <= instance.end; x++) {
                if (newIndex[x] == undefined) {
                    newIndex[x] = []
                }
                newIndex[x].push(keyName)  
            }
        }
    }

    return newIndex;
}