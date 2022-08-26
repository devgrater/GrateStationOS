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
    for(let i = 0; i < this.activeWindows.length; i++){
      this.activeWindows[i].render(dt);
    }
  }
  
  startWindowInstance(w){
    this._themeManager.applyThemeStyle(w);
    this.activeWindows.push(w);
  }

  onMousePressed(mx, my){
    //for each window, check if its clicked.
    for(let i = 0; i < this.activeWindows.length; i++){
      let w = this.activeWindows[i];
      let isValidClick = w.isValidClickRange(mx, my);
      let isHeadbarClick = w.isHeadbarClickRange(my);
      if(isValidClick){
        console.log(w.title);
      }
    }
  }
  
  onMouseReleased(mx, my){
    
  }
  
}
