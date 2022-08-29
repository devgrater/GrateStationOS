class NeofetchWindow extends GsWindow{
  
  onWindowReady(){
    this.linespeed = 0.0001;
    this.headPercentage = 0.0;
    this.lineCount = 8.0;
    this.lineDst = 1.0 / this.lineCount;
    this.zDist = 2.0;
    this.xDist = 1.0;
    this.camHeight = 1.5;
    this.hlineCount = 32.0;
    
  }
  
  drawWindowContent(dt){
    this.buffer.background(0);
    this.buffer.push();
    
      this.buffer.strokeWeight(1);
      this.buffer.noFill();
      
      this.headPercentage = (this.lifespan * this.linespeed) % this.lineDst;
      this.buffer.stroke(96, 0, 0);
      let basePos;
      for(let i = 0; i < this.lineCount; i++){
        let fraction = 1 - i / this.lineCount;
        fraction -= this.headPercentage;
        
        //now, how far are you from the camera?
        let zPos = this.zDist * fraction;
        let zDist = sqrt(zPos * zPos + this.camHeight * this.camHeight);
        let pos = this.sizeY * fraction;
        pos /= zDist; //perspective projection
        pos = this.sizeY - pos;
        this.buffer.line(0, pos, this.sizeX, pos);
      }
      
      let linesWidth = this.sizeX;
      let halfWidth = linesWidth * 0.5;
      //horizontal lines
      for(let i = 0; i < this.hlineCount; i++){
        //split into 4:
        let xCoord = linesWidth / this.hlineCount * i;
        xCoord -= halfWidth;
        xCoord += halfWidth / this.hlineCount;
        xCoord *= 3;
        //near is 0, far is zDist
        let sqrSum = xCoord * xCoord + this.camHeight * this.camHeight;
        let zDistFar = sqrt(this.camHeight * this.camHeight + this.zDist * this.zDist);
        let zDistNear = sqrt(sqrSum);
        
        this.buffer.line(xCoord + halfWidth, this.sizeY, xCoord / zDistFar + halfWidth, this.sizeY - this.sizeY / zDistFar);
      }
    this.drawNeofetch();

    image(this.buffer, 0, 0, this.sizeX, this.sizeY);
  }
  
  drawNeofetch(){
      this.buffer.push();
      //line(
        this.buffer.textFont("consolas");
        this.buffer.textAlign(CENTER, CENTER);
        this.buffer.fill(255, 0, 0);
        //this.buffer.textStyle(BOLD);
        this.buffer.push();
          this.buffer.textSize(16);
          
          this.buffer.text("GrateStation OS", this.sizeX * 0.5, this.sizeY * 0.5 - 8);
        this.buffer.pop();
        this.buffer.textSize(12);
        this.buffer.text("By DeveloGrater", this.sizeX * 0.5, this.sizeY * 0.5 + 8);
      this.buffer.pop();
    this.buffer.pop();
  }
  
 
}
