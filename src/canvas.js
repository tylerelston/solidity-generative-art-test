import React, {useEffect, useRef} from "react";

let canvas;
let ctx;

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

    new Point(drawingSeed);
  }, [])

  
  return <canvas ref={canvasRef} {...props}/>;
}

export default Canvas

class Point {
  constructor(drawingSeed) {
    this.seed = drawingSeed % 0.9;
    this.x = this.seed;
    this.y = this.seed;
    this.speedX = this.seed * drawingSeed % 54;
    this.speedY = this.seed * drawingSeed % 54;
    this.maxSize = 55;
    this.size = 5;
    this.update();
  }

  bounce = () => {
    if (this.x > canvas.width) {
      this.x = canvas.width;
      this.speedX = this.speedX * -1;
    }
    if (this.x < 0) {
      this.x = 0;
      this.speedX = this.speedX * -1;
    }
    if (this.y > canvas.height) {
      this.y = canvas.height;
      this.speedY = this.speedY * -1;
    }
    if (this.y < 0) {
      this.y = 0;
      this.speedY = this.speedY * -1;
    }
  }

  resize = () => {
    if ((this.seed * this.x % 100) < 10 && this.size > 1) {
      this.size -= 1;
    }
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.size += 0.1;
    if (this.size < this.maxSize){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, this.seed * Math.PI * 2);
      ctx.fillStyle = "hsl(43, 100%, 50%)";
      ctx.fill();
      ctx.stroke();
      this.bounce();
      this.resize();
      requestAnimationFrame(this.update.bind(this));
      setTimeout(this.update, 50);
    }
  }
}