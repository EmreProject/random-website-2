//https://pellmell.fr/artists/

//https://time.now/developer

/*
fetch('https://time.now/developer/api/timezone/Europe')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });


fetch('https://time.now/developer/api/timezone/Europe/Vatican')
  .then(response => response.json())
  .then(data => {
    console.log(data.datetime);
  });

  */

import * as ImageAnimation from "./imageAnimation.js"
import * as TextAnimation from "./textAnimation.js"
import * as VideoAnimation from "./videoAnimation.js"



function LoadMainPage(){

    const listItem= document.querySelector("div.list")
    listItem.classList.add("visible");
    TextAnimation.StartTextAnimation();
    ImageAnimation.StartImageAnimation();

}


async function Start(){
  
    const imageLoaderPromise=ImageAnimation.preLoadImages(9);
   const dene=new Promise((res,rej)=>{

    setTimeout(()=>{

      res(true);

    },1000)

   })
    const loadingPromise = ImageAnimation.Loader(1000,imageLoaderPromise,dene);
    const isLoaded = await loadingPromise;
    const isVideoLoaded = await VideoAnimation.videosPromise


    const loadingPage= document.querySelector("#loading-page");
    loadingPage.style.opacity="0";

    setTimeout(()=>{

      loadingPage.remove();
       LoadMainPage();
    },900)

    
   


}

Start();



