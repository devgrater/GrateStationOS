class ThemeManager {
  constructor() {
    if (ThemeManager._instance) {
      return ThemeManager._instance
    }
    ThemeManager._instance = this;
    this.loadThemeData();
  }
  
  loadThemeData(){
    this.headerbarSize = 20; //10px
    
  }
  
  
  applyThemeStyle(w){
    w.applyWindowStyle(this.headerbarSize);
  }
  
}
