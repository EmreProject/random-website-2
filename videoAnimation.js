const canvas = document.querySelector("canvas.background-video");
const ctx = canvas.getContext("2d");



canvas.width=window.innerWidth;
canvas.height=window.innerHeight

window.addEventListener("resize",()=>{

canvas.width=window.innerWidth;
canvas.height=window.innerHeight

})



class Video{

    static activeVideo;
    index;
    videoElement;
    startTime; //as second
    filterColor; //as hex
    isVideoLoaded;

    constructor(index, startTime,filterColor){

        this.index=index;
        this.startTime=startTime;
        this.filterColor=filterColor
        this.videoElement=document.createElement("video");
        this.videoElement.src=`./videos/${index}.mp4`;
        this.videoElement.muted = true;;

        const video=this.videoElement;

        video.addEventListener("ended", () => {
             video.currentTime = startTime;
             video.play();
        });


        this.isVideoLoaded=new Promise((res,rej)=>{

            const onReady=()=>{
                res(true);
            }
            video.addEventListener("canplaythrough", onReady, { once: true });

        })
    }

}


const videos=[];
const videoLoadedPromises=[];

videos.push(new Video(0,10,"#64dfdf"))
videos.push(new Video(1,10,"#0077b6"))
videos.push(new Video(2,10,"#0077b6"))
videos.push(new Video(3,10,"#48cae4"))
videos.push(new Video(4,10,"#8338ec"))
videos.push(new Video(5,10,"#0077b6"))
videos.push(new Video(6,10,"#0077b6"))
videos.push(new Video(7,10,"#fac005"))
videos.push(new Video(8,10,"#ff006e"))

Video.activeVideo=videos[0]

for(let i=0;i<9;i++){

videoLoadedPromises.push(videos[i].isVideoLoaded);
}

const videosPromise=Promise.all(videoLoadedPromises);
let isAllVideosLoaded=false;
videosPromise.then(()=>{
    isAllVideosLoaded=true;
   
 Video.activeVideo.videoElement.currentTime= Video.activeVideo.startTime;
 Video.activeVideo.videoElement.play();
 Video.activeVideo.videoElement.muted = true;
})


const listContainer=document.querySelector("div.list")
let activeItem=listContainer.querySelector(".list-item");
listContainer.addEventListener("mouseover",(event)=>{

const index= Number(event.target.getAttribute("index"))

if(event.target!=activeItem && event.target.classList.contains("list-item")){
    
Video.activeVideo=videos[index];
videos[index].videoElement.currentTime=videos[index].startTime;
videos[index].videoElement.play();
videos[index].videoElement.muted = true;

}
if(event.target.classList.contains("list-item")){

    activeItem=event.target
}
})




  function render(){

    if(isAllVideosLoaded){
        
        ctx.filter = "grayscale(100%)";
        ctx.drawImage(Video.activeVideo.videoElement,0,0,canvas.width,canvas.height);
        ctx.filter = "none";
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = Video.activeVideo.filterColor;
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.globalCompositeOperation = "source-over";
    }

    requestAnimationFrame(render);
    
   
  }

  render();



export {videosPromise}