
//https://codepen.io/bealivefr/pen/VwKrbYg

// document.documentElement.style.setProperty("--span-transform", `${value}%`);


const shadowAnimation={


start:50,
end:30,
startTime:undefined,
currenTime:undefined,
duration:2000,
easing:function (x) {
return -(Math.cos(Math.PI * x) - 1) / 2;
},
animate(time){

    if(!this.startTime){
        this.startTime=time;
    }

    const halfTime=this.duration/2;
    this.currenTime=time;
    const timePass=(this.currenTime - this.startTime) % this.duration;

    if( timePass>halfTime ){

        const timeRatio= (timePass-halfTime) / halfTime;
        const realRatio=this.easing(timeRatio);
        const value= (this.start-this.end)*realRatio + this.end;
        document.documentElement.style.setProperty("--logo-gradient", `${value}%`);

    }else{

        const timeRatio= timePass / halfTime;
        const realRatio=this.easing(timeRatio);
        const value= (this.end-this.start)*realRatio + this.start;
        document.documentElement.style.setProperty("--logo-gradient", `${value}%`);
        
    }


    requestAnimationFrame(this.animate.bind(this));


},
Start(){

    requestAnimationFrame(this.animate.bind(this));
}

}


shadowAnimation.Start();