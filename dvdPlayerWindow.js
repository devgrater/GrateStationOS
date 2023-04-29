class DvdPlayerWindow extends GsWindow{
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

    onWindowPreload() {
        super.onWindowPreload();
        this.dvdImg = loadImage("assets/dvdplayer.png");
        this.dvdPosX = this.sizeX * 0.5;
        this.dvdPosY = this.sizeY * 0.5;
        let rad = Math.random() * 6.28;
        //extract vector:
        this.speed = 40;// 10px per sec
        this.vecX = Math.cos(rad);
        this.vecY = -Math.sin(rad);
    }

    update(dt){
        let speedVec = this.speed * dt;
        this.dvdPosX += this.vecX * speedVec;
        this.dvdPosY += this.vecY * speedVec;

        if(this.dvdPosX > this.sizeX - this.dvdImg.width){
            this.dvdPosX = this.sizeX - this.dvdImg.width;
            this.vecX = -this.vecX;
        }

        if(this.dvdPosX < 0){
            this.dvdPosX = 0;
            this.vecX = -this.vecX;
        }

        if(this.dvdPosY > this.sizeY - this.dvdImg.height){
            this.dvdPosY = this.sizeY - this.dvdImg.height;
            this.vecY = -this.vecY;
        }

        if(this.dvdPosY < 0){
            this.dvdPosY = 0;
            this.vecY = -this.vecY;
        }

    }

    drawBouncingDvdLogo(){
        this.buffer.tint(themeStyle.primaryColor)
        this.buffer.image(this.dvdImg,
            this.dvdPosX - this.sizeX * 0.5, this.dvdPosY - this.sizeY * 0.5
        );
    }
    drawWindowContent(dt) {
        this.buffer.background(0);
        //draw task bits:
        //calculate block:
        this.buffer.push();
        this.drawBouncingDvdLogo();
        this.buffer.pop();
        this.renderBuffer();
    }
}