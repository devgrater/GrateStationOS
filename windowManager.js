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
  
  startWindowInstance(w){
    this._themeManager.applyThemeStyle(w);
    this.activeWindows.push(w);
  }
  
  onMouseMoved(mx, my, px, py){
    for(let i = 0; i < this.activeWindows.length; i++){
      this.activeWindows[i].onMouseMoved(mx, my, px, py);
    }
  }

  onMousePressed(mx, my){
    //for each window, check if its clicked.
    for(let i = 0; i < this.activeWindows.length; i++){
      let w = this.activeWindows[i];
      let isValidClick = w.isValidClickRange(mx, my);
      let isHeadbarClick = w.isHeadbarClickRange(my);
      if(isValidClick && isHeadbarClick){
        w.onMouseDownHeadbar();
      }
      if(isValidClick){
        //move window to front:
        this.activeWindows.splice(i, 1);
        this.activeWindows.splice(0, 0, w);

      }
    }
  }
  
  onMouseReleased(mx, my){
    for(let i = 0; i < this.activeWindows.length; i++){
      let w = this.activeWindows[i];
      w.onMouseUpHeadbar();
    }
  }
  
}
