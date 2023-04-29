

class IncomingCallWindow extends GsWindow{

    onWindowPreload(){

        //this.img =
        this.grad = loadShader('assets/commcall.vert', 'assets/commcall.frag');
        //create a default speaker:
        this.speakerList = [speaker_rodeo, speaker_grangran, speaker_ganymede];
        //this.pickNewSpeaker()
        this.scheduleNextCall();

    }

    scheduleNextCall(){
        this.timeUntilCall = Math.random() * 5;
        this.speaker = null;
        this.speakerText = "";
    }
    pickNewSpeaker(){
        this.speaker = this.speakerList[Math.floor(Math.random() * this.speakerList.length)];
        this.speaker.LoadImageIfNotLoaded();
        this.speaker.startOver();
        this.speakerText = this.speaker.getCurrentText();
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
        this.fractLifespan = 0;
        this.buffer = createGraphics(this.sizeX, this.sizeY, WEBGL);
        //this.buffer.textFont("consolas");
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
        push();
        textAlign(CENTER, CENTER);
        textSize(12);
        textStyle(BOLD);
        fill(themeStyle.primaryColor);
        text(this.speakerText, this.sizeX * 0.5, this.sizeY * 0.9);
        pop();
        //image(this.buffer, 0, 0, this.sizeX, this.sizeY);
    }

    drawCaller(){

        if(this.speaker != null){
            this.buffer.shader(this.grad)
            this.grad.setUniform('uSampler', this.speaker.img)
            this.grad.setUniform('tint', normalizeColors(themeStyle.primaryColor))
            this.grad.setUniform('time', this.fractLifespan)
            this.grad.setUniform('windowHeight', this.sizeY * 2)
            this.buffer.quad(-1, -1, 1, -1, 1, 1, -1, 1);
            //no text in webgl!
            //we have to overlay the text on top of the buffer.
        }


    }

    update(dt){
        super.update(dt);
        this.fractLifespan += dt;
        let isSpeakerSpeaking = this.speaker != null;
        let shouldTickFrameTime = this.fractLifespan > 3.1415926;
        let shouldUpdateSpeakerText = isSpeakerSpeaking && shouldTickFrameTime;

        if(shouldTickFrameTime){
            this.fractLifespan %= 3.1415926;
        }
        if(shouldUpdateSpeakerText){
            this.speakerText = this.speaker.nextLine()
            if(this.speakerText === ""){
                //this.pickNewSpeaker();
                this.scheduleNextCall();
                //this.speaker.startOver();
                //this.speakerText = this.speaker.getCurrentText()
            }
        }
        this.timeUntilCall -= dt;
        if(this.timeUntilCall < 0 && !isSpeakerSpeaking){
            //get new speaker
            this.pickNewSpeaker();
        }

    }
}
