class GsWindow{

  onWindowPreload(){

  }
  constructor(title, posX, posY, sizeX, sizeY){
    this.windowSetup(title, posX, posY, sizeX, sizeY);
    //this.onWindowReady(); //your function goes here...
    this.onWindowPreload();
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
    this.buffer = createGraphics(this.sizeX, this.sizeY);
    this.windowState = "NORMAL";
  }
  
  onWindowReady(){
    
  }
  
  applyWindowStyle(headerbarSize){
    this.headerbarSize = headerbarSize;
  }
  

  onResize(){
    
  }
  
  onMouseDownHeadbar(mx, my, pressedButton){
    this.isMouseDragging = true;
  }
  
  onMouseUpHeadbar(mx, my, pressedButton){
    this.isMouseDragging = false;
  }

  onMouseDownWindow(mx, my, pressedButton){

  }

  onMouseUpWindow(mx, my, pressedButton){

  }

  onMouseMoveWindow(mx, my){

  }
  
  onMouseMoved(mx, my, px, py){
    if(this.isMouseDragging){
      this.handleWindowDrag(mx - px, my - py);
    }
    else{
      this.onMouseMoveWindow(mx, my);
    }
  }

  getPositionRelativeToWindow(mx, my){
    let currentWindow = this;
    return {
      x: mx - (currentWindow.posX - this.sizeX * 0.5),
      y: my - (currentWindow.posY - this.sizeY * 0.5)
    }
  }
  
  handleWindowDrag(dx, dy){
    this.posX += dx;
    this.posY += dy;
  }
  
  drawWindowBackPanel(cornerX, cornerY){
    
    push();
      stroke(themeStyle.windowColor);
      strokeWeight(1);
      fill(themeStyle.windowColor);
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
      fill(themeStyle.headbarTextColor);
      rect(cornerX + this.sizeX - 16, cornerY - this.headerbarSize + 4, 12, 12);
    pop();
  }
  
  drawWindowTitle(cornerX, cornerY){
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(12);
    fill(themeStyle.headbarTextColor);
    text(this.title, cornerX + 10.0, cornerY - this.headerbarSize * 0.5);
  }
  
  
  
  drawWindowContent(dt){
    this.buffer.background(0);
    this.renderBuffer();
  }

  renderBuffer(){
    image(this.buffer, 0, 0, this.sizeX, this.sizeY);
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
