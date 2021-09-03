import React, {useEffect, useRef} from "react";

let canvas;
let ctx;

const interval = setInterval(function() {
   // method to be executed;
 }, 5000);

const Canvas = props => {
  
  const canvasRef = useRef(null);

  useEffect(() => {
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth/4;
    canvas.height = window.innerHeight/2;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const drawingSeed = 3245345;

    const start = new Origin(50,50, drawingSeed);
  }, [])

  
  return <canvas ref={canvasRef} {...props}/>;
}

export default Canvas

class Origin {
  constructor(x, y, drawingSeed) {
    this.seed = drawingSeed % 0.9;
    this.x = x;
    this.y = y;
    this.speedX = this.seed * 4 - 2;
    this.speedY = this.seed * 4 - 2;
    this.maxSize = this.seed * 50 + 2;
    this.size = this.seed * 1 + 2;
    this.update();
  }

  bounce(){
    if (this.x > canvas.width) {
      this.speedX = this.speedX * -1;
    }
    if (this.y > canvas.height) {
      this.speedY = this.speedY * -1;
    }
  }

  update() {
    //this.bounce();
    this.x += this.speedX;
    this.y += this.speedY;
    this.size += 0.1;
    if (this.size < this.maxSize){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, this.seed * Math.PI * 2);
      ctx.fillStyle = "hsl(23, 100%, 50%)";
      ctx.fill();
      ctx.stroke();
      requestAnimationFrame(this.update.bind(this));
    }
    setTimeout(this.update, 500);
  }
}