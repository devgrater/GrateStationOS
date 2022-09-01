let wm = new WindowManager();
let system = new SystemManager();
let theme = new ThemeManager();

function setup() {
  textFont("consolas");
  system.setWindowDimensions(windowWidth, windowHeight);
  system.initialize();
  let template = new NeofetchWindow("GrateStation OS v1.0", 512, 512, 240, 120);
  let tw = new FileDecryptWindow("Test Window", 256, 256, 280, 240);
  let gol = new GameOfLifeWindow("Conway's Game of Life", 384, 384, 720, 240);
  wm.startWindowInstance(template);
  wm.startWindowInstance(gol);
  wm.startWindowInstance(tw);
  
  
}


function draw() {
  system.refreshScreen();
  wm.renderAllWindows(deltaTime * 0.001);
  wm.onMouseMoved(mouseX, mouseY, pmouseX, pmouseY);
}

function mousePressed(){
  wm.onMousePressed(mouseX, mouseY, mouseButton);
}

function mouseReleased(){
  wm.onMouseReleased(mouseX, mouseY, mouseButton);
}
