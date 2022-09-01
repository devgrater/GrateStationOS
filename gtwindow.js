let wm = new WindowManager();
let system = new SystemManager();
let theme = new ThemeManager();
const themeStyle = {
  windowColor: [0, 255, 0],
  headbarTextColor: [0, 0, 0],
  accentColor: [0, 255, 0],
  primaryColor: [0, 208, 0],
  secondaryColor: [0, 192, 0],
  tertiaryColor: [0, 128, 0],
  quaternaryColor: [0, 96, 0],
  fifthColor: [0, 64, 0],
  backgroundColor: [0, 0, 0],
  minUnit: [0, 16, 0],
  colorRatio: [0, 1, 0]//minimal unit
}

function setup() {
  textFont("consolas");
  system.setWindowDimensions(windowWidth, windowHeight);
  system.initialize();
  let template = new NeofetchWindow("GrateStation OS v1.0", 512, 512, 240, 120);
  let tw = new FileDecryptWindow("Test Window", 256, 256, 280, 240);
  let gol = new GameOfLifeWindow("ChemTr4il Analyzer", 384, 384, 480, 240);
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
