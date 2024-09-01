class WindowManager {
  constructor() {
    if (WindowManager._instance) {
      return WindowManager._instance
    }
    WindowManager._instance = this;
    this.activeWindows = [];
    this._themeManager = new ThemeManager();
    // ... Your rest of the constructor code goes after this
  }
  
  initialize(){
    
  }
  
  renderAllWindows(dt){
    //when rendering, we do it back to front:
    for(let i = this.activeWindows.length - 1; i >= 0; i--){
      this.activeWindows[i].render(dt);
    }
  }
  
  reportAllWindowLocs(){
    for(let i = 0; i < this.activeWindows.length; i++){
      let w = this.activeWindows[i];
      console.log(w.title + " x: " + w.posX + " y: " + w.posY);
    }
  }

  startWindowInstance(w){
    this._themeManager.applyThemeStyle(w);
    this.activeWindows.push(w);
    w.onWindowReady();
  }

  closeWindowInstance(w){
    let index = this.activeWindows.indexOf(w);
    if(index > -1){
      this.activeWindows.splice(index, 1);
    }
  }
  
  onMouseMoved(mx, my, px, py){
    for(let i = 0; i < this.activeWindows.length; i++){
      this.activeWindows[i].onMouseMoved(mx, my, px, py);
    }
  }

  onMousePressed(mx, my, pressedButton){
    //for each window, check if its clicked.
    for(let i = 0; i < this.activeWindows.length; i++){
      let w = this.activeWindows[i];
      let isValidClick = w.isValidClickRange(mx, my);
      let isHeadbarClick = w.isHeadbarClickRange(my);
      if(isValidClick){
        if(isHeadbarClick){
          w.onMouseDownHeadbar(mx, my, pressedButton);
        }
        else{
          w.onMouseDownWindow(mx, my, pressedButton);
        }
        
      }
      if(isValidClick){
        //move window to front:
        this.activeWindows.splice(i, 1);
        this.activeWindows.splice(0, 0, w);
        break;
      }
    }
  }
  
  onMouseReleased(mx, my, releasedButton){
    for(let i = 0; i < this.activeWindows.length; i++){
      let w = this.activeWindows[i];
      w.onMouseUpHeadbar(mx, my);
      w.onMouseUpWindow();
    }
  }
  
}
