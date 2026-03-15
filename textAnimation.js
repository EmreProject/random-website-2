

const titleItem=document.querySelector(".title .title-item");
const listContainer = document.querySelector("#main-page .list")
const listChildItems=[...document.querySelectorAll("a.child")];


const activeListItem={

  element: listChildItems[0],
  index:0,
  update(index){

    this.index=index;
    this.element=listChildItems[index];

    const text = this.element.textContent;
    titleItem.textContent="";

    const words=text.split(" ");
    words.forEach(word=>{
      

      const spanContainer= document.createElement("div");
      spanContainer.style.display="inline-block"
      spanContainer.style.overflow="hidden"
    
      const span=document.createElement("span");
      spanContainer.appendChild(span);

      span.textContent=word+" ";
      titleItem.append(spanContainer)
    })

  


  }
}



class Animation{




   static easing=function (x) {
        return 1 - Math.pow(1 - x, 5);
    };
  static  easingOut=function(x){
    return 1- Animation.easing(1-x);
   }

    start=100;
    end=0;
    startTime=undefined;
    currentTime=undefined;
    duration=500;
    easingFunc=Animation.easing;
    currentIndex=0;
   currentDirection="forward"

  constructor(){}

   
    finishCallback=undefined;

    
    #animate(time){
        
        if(this.startTime==null){
            
            this.startTime=time;
        }
        
        this.currentTime=time;
        const timeRatio= Math.min((this.currentTime-this.startTime) / this.duration,1)
        
        if(timeRatio==1){
          this.startTime=this.currentTime-this.duration;
        }

        const realRatio=this.easingFunc(timeRatio);

        const value=(this.end-this.start)*realRatio + this.start;
         document.documentElement.style.setProperty("--span-transform", `${value}%`);

       
          if(this.finishCallback && timeRatio==1){
            this.finishCallback();
          }
         
     
          requestAnimationFrame(this.#animate.bind(this));
      

        
    }
    
    Start(){

     requestAnimationFrame(this.#animate.bind(this));      

    }
    
}


const textAnimation=new Animation();
function StartTextAnimation(){

  activeListItem.update(0);
  document.querySelector("div.list a").classList.add("mouse-over");
  textAnimation.Start();
  
}




//mouse enter list item
listContainer.addEventListener("mouseover",function(event){

const target=event.target;


if(target.classList.contains("child")){


listChildItems.forEach(item=>{

  item.classList.remove("mouse-over");
})

target.classList.add("mouse-over")
const index=Number(target.getAttribute("index"));

if(textAnimation.currentIndex == index){
  
   if(textAnimation.currentDirection == "backward"){

      textAnimation.finishCallback=undefined
     
      textAnimation.start=100;
      textAnimation.end=0;
  const elapsed =(textAnimation.currentTime - textAnimation.startTime)


const currentTimePass = Math.max(0, textAnimation.duration - elapsed);



  textAnimation.startTime = textAnimation.currentTime - currentTimePass;

      textAnimation.easingFunc=Animation.easing;
      textAnimation.currentDirection="forward"
    


   }

}else{



  if(textAnimation.currentDirection == "forward"){

   const elapsed =(textAnimation.currentTime - textAnimation.startTime);

const currentTimePass = Math.max(0, textAnimation.duration - elapsed);


  textAnimation.startTime = textAnimation.currentTime - currentTimePass;

       textAnimation.start=0;
       textAnimation.end=100;
      textAnimation.easingFunc=Animation.easingOut;
      textAnimation.currentDirection="backward"

       
   textAnimation.finishCallback=()=>{


                activeListItem.update(index);
                 textAnimation.start=100;
               textAnimation.end=0;
                textAnimation.easingFunc=Animation.easing;
                textAnimation.currentIndex=index;
                textAnimation.currentDirection="forward";
                textAnimation.startTime=textAnimation.currentTime;
                textAnimation.finishCallback=undefined
             

              }
    

  }else{



         textAnimation.finishCallback=()=>{


                activeListItem.update(index);
                 textAnimation.start=100;
               textAnimation.end=0;
                textAnimation.easingFunc=Animation.easing;
                textAnimation.currentIndex=index;
                textAnimation.currentDirection="forward";
                textAnimation.startTime= textAnimation.currentTime;
                textAnimation.finishCallback=undefined
             

              }
          


  }



  


}


}


});


export {StartTextAnimation}