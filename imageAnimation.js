const listContainer=document.querySelector("div.list")
const listItems=[...document.querySelectorAll("div.list a")];


function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () =>{

    try {
        // decode() varsa: gerçek “ilk frame hazır” noktası bu
        if (img.decode) await img.decode();
      } catch (e) {
        // bazı tarayıcılarda decode reject edebilir; cache yine de dolmuş olur
      }
      resolve(img);
    } 
    img.onerror = reject;
    img.src = url;
  });
}

function preLoadImages(count){

    const imagePromises=[];

    for(let i=0;i<count;i++){

        imagePromises.push(preloadImage(`./images/${i}_low.jpg`))
    }

    return Promise.all(imagePromises);

}


function Loader(minTime, ...promises){

const promisesLength=promises.length;
let resolvedPromises=0;
for(let i=0;i<promisesLength;i++){

promises[i].then((result)=>{

resolvedPromises++;

});

}


const eachPromiseRatio=0.1;
const mainRatio= 1 - promisesLength * eachPromiseRatio;

return new Promise((res,rej)=>{


    const loaderAnimation={

        element: document.querySelector("#loading-page h3"),
        startTime:undefined,
        duration:minTime,
        start:0,
        end:100,
        animate(time){
        
            if(!this.startTime){
                 this.startTime=time;
             }

             let timeRatio = (time - this.startTime) / this.duration;

             if(timeRatio > mainRatio + resolvedPromises*eachPromiseRatio){
                timeRatio = mainRatio + resolvedPromises*eachPromiseRatio;
                this.startTime =  time - timeRatio * this.duration
             }


             const currentValue= this.start + (this.end - this.start)*timeRatio;

             this.element.textContent=`${Math.floor(currentValue)}%`;

             if(timeRatio<1){
                requestAnimationFrame(this.animate.bind(this));
             }else{
                res(true);
             }

        }


    }

    requestAnimationFrame(loaderAnimation.animate.bind(loaderAnimation));



});



}


class ImageData{

url;
index;

constructor(index){

    this.index=index;
    this.url=`./images/${index}_low.jpg`;

    const high = new Image();
    high.src = `./images/${index}.jpg`;

    high.onload = () => {
        this.url = high.src;
    };
}


}


const imagesData=[];
for(let i=0;i<9;i++){

    imagesData.push(new ImageData(i));
}

class ListImage{


static listImageArray=[]


element;
index;

//Reveal animation
startTime=undefined;
currentTime=undefined;
startOpacity=0;
endOpacity=1;
durationOpacity=300;
startSize=[]; //top clip, right clip, scale
endSize=[];
durationSize=1000;
delay=0;


//Disappear animation
startTime2=undefined;
startOpacity2=1;
endOpacity2=0;
durationOpacity2=600;
startSize2=[];
endSize2=[];
durationSize2=2000;
delay2=0;




easing=function (x) {
return 1 - Math.pow(1 - x, 4);
}

constructor(index_,startSize_,endSize_){ //example: startSize=[70,30]  endSize=[30,12]

    
const mainPage=document.querySelector("#main-page");   
const div=document.createElement("div");
div.classList.add("image")
mainPage.append(div);
const imageUrl=imagesData[index_].url;
div.style.backgroundImage=`url("${imageUrl}")`

this.element=div;
this.index=index_;
this.startSize=startSize_;
this.endSize=endSize_;
this.startSize2=endSize_;
this.endSize2=startSize_;


}

animateReveal(time){

if(!this.startTime){
    this.startTime=time + this.delay;
}

this.currentTime=time;
const timeRatioOpacity= Math.min(Math.max((this.currentTime-this.startTime)/this.durationOpacity,0),1);
const timeRatioSize= Math.min(Math.max((this.currentTime-this.startTime)/this.durationSize,0),1);

const realRatioOpacity= this.easing(timeRatioOpacity);
const realRatioSize=this.easing(timeRatioSize);

const opacity=this.startOpacity + (this.endOpacity - this.startOpacity)*realRatioOpacity;
const topClip= this.startSize[0] + (this.endSize[0] - this.startSize[0])*realRatioSize
const leftClip=this.startSize[1] + (this.endSize[1] - this.startSize[1])*realRatioSize;
const scale=this.startSize[2] + (this.endSize[2] - this.startSize[2])*realRatioSize;


this.element.style.opacity=`${opacity}`;
this.element.style.clipPath=`rect(${topClip}% ${100-leftClip}% ${100-topClip}% ${leftClip}% round 30px)`

this.element.style.transform=`translateX(-50%) translateY(-50%) scale(${scale})`;


if(timeRatioOpacity<1 || timeRatioSize<1){

requestAnimationFrame(this.animateReveal.bind(this));

}



}


animateDisappear(time){


if(!this.startTime2){
    this.startTime2=time + this.delay2;
}

this.currentTime=time;
const timeRatioOpacity= Math.min(Math.max((this.currentTime-this.startTime2)/this.durationOpacity2,0),1);
const timeRatioSize= Math.min(Math.max((this.currentTime-this.startTime2)/this.durationSize2,0),1);

const realRatioOpacity= this.easing(timeRatioOpacity);
const realRatioSize=this.easing(timeRatioSize);

const opacity=this.startOpacity2 + (this.endOpacity2 - this.startOpacity2)*realRatioOpacity;
const topClip= this.startSize2[0] + (this.endSize2[0] - this.startSize2[0])*realRatioSize
const leftClip=this.startSize2[1] + (this.endSize2[1] - this.startSize2[1])*realRatioSize;
const scale=this.startSize2[2] + (this.endSize2[2] - this.startSize2[2])*realRatioSize;

if(this.currentTime - this.startTime2 > 0){

   this.element.style.opacity=`${opacity}`;
this.element.style.clipPath=`rect(${topClip}% ${100-leftClip}% ${100-topClip}% ${leftClip}% round 30px)`

this.element.style.transform=`translateX(-50%) translateY(-50%) scale(${scale})`;
    
}

if(timeRatioOpacity<1 || timeRatioSize<1){

requestAnimationFrame(this.animateDisappear.bind(this));

}else{

ListImage.listImageArray= ListImage.listImageArray.filter(a=>{

return a!=this;

});

this.element.remove();

}



}


}



//At start
 let activeItem;
function StartImageAnimation(){

     activeItem=document.querySelector(`div.list [index="${0}"]`)
    let firstImage;
    if(window.innerWidth>=1200){
        
        firstImage=new ListImage(0,[30,30,1],[20,0,1.3]);
    }else if(window.innerWidth>=900){
        
        firstImage=new ListImage(0,[20,30,1],[0,5,1.2]);
    }else if(window.innerWidth>=570){
        
        firstImage=new ListImage(0,[20,30,1],[0,5,1.4]);
    }else{
        firstImage=new ListImage(0,[30,40,1],[0,30,3]);
    }
    ListImage.listImageArray.push(firstImage);
    requestAnimationFrame(firstImage.animateReveal.bind(firstImage));
}




listContainer.addEventListener("mouseover",(event)=>{

const index= Number(event.target.getAttribute("index"))

if(event.target!=activeItem && event.target.classList.contains("list-item")){
 
    let newImage;


if(window.innerWidth>=1200){
        
        newImage=new ListImage(index,[30,30,1],[20,0,1.3]);
    }else if(window.innerWidth>=900){
        
        newImage=new ListImage(index,[20,30,1],[0,5,1.2]);
    }else if(window.innerWidth>=570){
        
        newImage=new ListImage(index,[20,30,1],[0,5,1.4]);
    }else{
        newImage=new ListImage(index,[30,40,1],[0,30,3]);
    }
ListImage.listImageArray.forEach(a=>{


    if(!a.startTime2){

        const revealPassTime= a.currentTime - a.startTime;
        const remainingTime = Math.max(a.durationOpacity,a.durationSize) - revealPassTime ;
        
        a.delay2=remainingTime;
        requestAnimationFrame(a.animateDisappear.bind(a));
    }

})

requestAnimationFrame(newImage.animateReveal.bind(newImage));
ListImage.listImageArray.push(newImage);

}
if(event.target.classList.contains("list-item")){

    activeItem=event.target
}
})



const throttle={

check:undefined,
time:300

}

window.addEventListener("resize",()=>{


if(throttle.check){
    clearTimeout(throttle.check)
}


throttle.check=setTimeout(() => {

let newImage;
const index= Number(activeItem.getAttribute("index"))

    if(window.innerWidth>=1200){
         newImage=new ListImage(index,[30,30,1],[20,0,1.3]);
    }else if(window.innerWidth>=900){    
        newImage=new ListImage(index,[20,30,1],[0,5,1.2]);
    }else if(window.innerWidth>=570){  
        newImage=new ListImage(index,[20,30,1],[0,5,1.4]);
    }else{
        newImage=new ListImage(index,[30,40,1],[0,30,3]);
    }
    
    ListImage.listImageArray.forEach(a=>{


    if(!a.startTime2){

        const revealPassTime= a.currentTime - a.startTime;
        const remainingTime = Math.max(a.durationOpacity,a.durationSize) - revealPassTime ;
        
        a.delay2=remainingTime;
        requestAnimationFrame(a.animateDisappear.bind(a));
    }

})

requestAnimationFrame(newImage.animateReveal.bind(newImage));
ListImage.listImageArray.push(newImage);

    
}, throttle.time);


})

export {preLoadImages,StartImageAnimation,Loader}