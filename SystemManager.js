class SystemManager {
  constructor() {
    if (SystemManager._instance) {
      return SystemManager._instance
    }
    SystemManager._instance = this;
    
    // ... Your rest of the constructor code goes after this
  }
  
  setWindowDimensions(wwidth, wheight){
    this.wwidth = wwidth;
    this.wheight = wheight;
  }
  
  getWindowDimensions(){
    return {
      x: this.wwidth,
      y: this.wheight
    };
  }
  
  initialize(){
    createCanvas(this.wwidth, this.wheight);

  }
  
  refreshScreen(){
    background(0);
  }
}
