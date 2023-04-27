

class IncomingCallWindow extends GsWindow{

    onWindowPreload(){
        this.img = loadImage('assets/caller.png');
        this.grad = loadShader('assets/commcall.vert', 'assets/commcall.frag');
        //create a default speaker:
        let speaker = new Speaker('assets/caller.png', 'speaker',
            ["Hey.", "Grater.", "*Cough*",
             "You there?", "How's that *business* going?", 'I hope you are not slacking off.',
             'Making progress, are we?', 'I need you to get it done ASAP.',
             'You will be paid.', 'I will be waiting.', 'Goodbye.'],
            //holy shit this will be a 11x11 matrix.
            [
                [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0], //Hey.
                [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0], //Grater.
                [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0], //*Cough*
                [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0], //You there?
                [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0], //How's that *business* going?
                [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0], //I hope you are not slacking off.
                [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0], //Making progress, are we?
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1], //I need you to get it done ASAP.
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //You will be paid.
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //I will be waiting.
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //Goodbye.
            ],
            [0, 1, 2]
        );
        this.speaker = speaker;
        this.speakerText = speaker.getCurrentText();
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
        text(this.speakerText, this.sizeX * 0.5, this.sizeY * 0.8);
        pop();
        //image(this.buffer, 0, 0, this.sizeX, this.sizeY);
    }

    drawCaller(){
        this.buffer.shader(this.grad)
        this.grad.setUniform('uSampler', this.img)
        this.grad.setUniform('tint', normalizeColors(themeStyle.primaryColor))
        this.grad.setUniform('time', this.fractLifespan)
        this.grad.setUniform('windowHeight', this.sizeY * 2)
        this.buffer.quad(-1, -1, 1, -1, 1, 1, -1, 1);
        //no text in webgl!
        //we have to overlay the text on top of the buffer.

    }

    update(dt){
        super.update(dt);
        this.fractLifespan += dt;
        if(this.fractLifespan > 3.1415926){
            this.fractLifespan -= 3.1415926;
            this.speakerText = this.speaker.nextLine()
            if(this.speakerText === "")
                this.speaker.startOver();
        }
    }
}

class Speaker{
    constructor(imgPath, name, texts, matrix, validStarts) {
        this.img = loadImage(imgPath);
        this.name = name;
        this.texts = texts;
        this.markovMatrix = this._computeMarkovChain(matrix)
        this.validStarts = validStarts;
        //pick a random start in the array of validStarts
        this.startOver();
    }

    _computeMarkovChain(matrix){
        //create a new array:
        let newMatrix = [];
        for(let i = 0; i < matrix.length; i++){
            //calculate the cumulative distribution function:
            let cdf = [];
            let sum = 0;
            for(let j = 0; j < matrix[i].length; j++){
                sum += matrix[i][j];
                cdf.push(sum);
            }
            //second pass to normalize:
            for(let j = 0; j < matrix[i].length; j++){
                cdf[j] /= sum;
            }
            newMatrix.push(cdf);
        }
        return newMatrix;
    }

    getCurrentText(){
        return this.texts[this.validStarts[this.currentIndex]];
    }

    nextLine(){
        //read from the markov matrix:
        let r = Math.random();
        let cdf = this.markovMatrix[this.currentIndex];
        let previousCdf = 0;
        for(let i = 0; i < cdf.length; i++){
            //if greater than the previous cdf but less than this one, we have a winner!
            if(r >= previousCdf && r < cdf[i]){
                this.currentIndex = i;
                return this.texts[this.currentIndex];
            }
            previousCdf = cdf[i];
        }
        return "";//nothing found!
    }

    startOver(){
        this.currentIndex = Math.floor(Math.random() * this.validStarts.length);
    }


}