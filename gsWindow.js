class GsWindow{
  constructor(title, posX, posY, sizeX, sizeY){
    this.windowSetup(title, posX, posY, sizeX, sizeY);
    this.onWindowReady(); //your function goes here...
    console.log(title + " Ready");
  }
  
  windowSetup(title, posX, posY, sizeX, sizeY){
    this.isMouseDragging = false;
    this.title = title;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.posX = posX;
    this.posY = posY;
    this.lifespan = 0;
    this.windowState = "NORMAL";
  }
  
  onWindowReady(){
    
  }
  
  applyWindowStyle(headerbarSize){
    this.headerbarSize = headerbarSize;
  }
  

  onResize(){
    
  }
  
  onMouseDownHeadbar(){
    this.isMouseDragging = true;
  }
  
  onMouseUpHeadbar(){
    this.isMouseDragging = false;
  }
  
  onMouseMoved(mx, my, px, py){
    if(this.isMouseDragging){
      this.handleWindowDrag(mx - px, my - py);
    }
  }
  
  handleWindowDrag(dx, dy){
    this.posX += dx;
    this.posY += dy;
  }
  
  drawWindowBackPanel(cornerX, cornerY){
    
    push();
      stroke(255, 0, 0);
      strokeWeight(1);
      fill(255, 0, 0);
      push();
        //main window
        noFill();//fill(0);
        rect(cornerX, cornerY - this.headerbarSize, this.sizeX, this.sizeY + this.headerbarSize);
      pop();
      rect(cornerX, cornerY - this.headerbarSize, this.sizeX, this.headerbarSize);
    pop();
  }
  
  drawExitIcon(cornerX, cornerY){
    push();
      fill(0);
      rect(cornerX + this.sizeX - 16, cornerY - this.headerbarSize + 4, 12, 12);
    pop();
  }
  
  drawWindowTitle(cornerX, cornerY){
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(12);
    fill(0);
    text(this.title, cornerX + 10.0, cornerY - this.headerbarSize * 0.5);
  }
  
  
  
  drawWindowContent(dt){
    
  }
  
  update(dt){
    this.lifespan += dt;
  }
  
  render(dt){
    let cornerX = this.posX - 0.5 * this.sizeX;
    let cornerY = this.posY - 0.5 * this.sizeY;
    
    push();
      translate(cornerX, cornerY);
      this.drawWindowContent(dt);
      this.drawWindowBackPanel(0, 0);
      this.drawWindowTitle(0, 0);
      this.drawExitIcon(0, 0);
    pop();
    

    

    
    this.update(dt);
    //circle(this.posX, this.posY, this.sizeX);
  }
  
  isValidClickRange(mx, my){
    let isInXRange = abs(mx - this.posX) < this.sizeX * 0.5;
    let isInYRange = abs(my - this.posY) < this.sizeY * 0.5;
    return (isInXRange && isInYRange) || (isInXRange && this.isHeadbarClickRange(my));
  }
  
  isHeadbarClickRange(my){
    let yDiff = (my - (this.posY - this.sizeY * 0.5));
    return (yDiff > -this.headerbarSize) && (yDiff < 0);
  }
}
