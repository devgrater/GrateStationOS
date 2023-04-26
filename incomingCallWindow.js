class IncomingCallWindow extends GsWindow{
    onWindowReady(){
        //load in some random images?
        this.title = "Incoming Call...";
        this.img = loadImage('assets/caller.png');
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
        this.buffer.tint(themeStyle.primaryColor);
        this.buffer.image(this.img, 0, 0)
    }

    update(dt){
        super.update(dt);
    }
}