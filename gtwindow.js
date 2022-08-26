let wm = new WindowManager();
let system = new SystemManager();
let theme = new ThemeManager();

function setup() {
  textFont("consolas");
  system.setWindowDimensions(windowWidth, windowHeight);
  system.initialize();
  let template = new NeofetchWindow("GrateStation OS v1.0", 512, 512, 250, 140);
  wm.startWindowInstance(template);
  
}


function draw() {
  system.refreshScreen();
  wm.renderAllWindows(deltaTime);
}

function mousePressed(){
  wm.onMousePressed();
}

function mouseReleased(){
  wm.onMouseReleased();
}
