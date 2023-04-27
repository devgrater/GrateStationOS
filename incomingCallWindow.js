class IncomingCallWindow extends GsWindow{

    onWindowPreload(){
        this.img = loadImage('assets/caller.png');
        this.grad = loadShader('assets/commcall.vert', 'assets/commcall.frag');

    }
    onWindowReady(){
        //load in some random images?
        this.title = "Incoming Call...";
        console.log(this.grad)
    }

    windowSetup(title, posX, posY, sizeX, sizeY){
        this.isMouseDragging = false;
        this.title = title;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.posX = posX;
        this.posY = posY;
        this.lifespan = 0;
        this.buffer = createGraphics(this.sizeX, this.sizeY, WEBGL);
        this.windowState = "NORMAL";
    }

    drawWindowContent(dt){
        this.buffer.background(0);
        //draw task bits:
        //calculate block:
        this.buffer.push();
        this.drawCaller();
        this.buffer.pop();
        this.renderBuffer();
        //image(this.buffer, 0, 0, this.sizeX, this.sizeY);
    }

    drawCaller(){
        this.buffer.shader(this.grad)
        this.grad.setUniform('colorCenter', [1, 0, 0]);
        this.grad.setUniform('colorBackground', [0, 1, 0]);
        this.grad.setUniform('offset', [sin(millis() / 2000), 1]);
        this.buffer.quad(-1, -1, 1, -1, 1, 1, -1, 1);
        //this.buffer.tint(themeStyle.primaryColor);
        //this.buffer.image(this.img, -this.sizeX * 0.5, -this.sizeY * 0.5)
    }

    update(dt){
        super.update(dt);
    }
}