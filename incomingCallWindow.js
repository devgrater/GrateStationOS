

class IncomingCallWindow extends GsWindow{

    //nice contractor.
    //Paragraph 1:
    //
    // Hello there, dearie. I hope this message finds you well. Listen up, I've got some important things to tell you. You better keep your nose to the grindstone and keep working on that project of yours. No slacking off, you hear me? I want that job done ASAP, and I mean yesterday. You'll get paid once it's done, so don't even think about taking a break until it's finished. Alright, now get back to work and make grandma proud. Bye now!
    //
    //
    // Paragraph 2:
    //
    // Well, well, well. It's good to hear from you. I hope you're doing your best to complete the job at hand. There's no time to waste, so you better buckle down and get it done quickly. I'm counting on you to deliver the goods, and I won't accept any excuses. Remember, there's money waiting for you once the job is finished. So, focus on the task and don't let anything distract you. Alright, take care and talk to you soon.
    //
    //
    // Paragraph 3:
    //
    // Well, hello there, my dear. I hope you're doing well. Listen up, I need you to keep working hard on that project of yours. Time is money, and we don't have any to waste. So, put your nose to the grindstone and get the job done as soon as possible. Once you're finished, you'll get paid, and we can both go about our business. Alright, now go get 'em, tiger. Talk to you later. Bye now!

    //your average gran-gran contractor
    //Paragraph 1:
    //
    // Well hello there, sweetie! It's your Gran-Gran here. I just wanted to remind you to keep your nose to the grindstone and finish up that project you're working on pronto. The clock is ticking, and you know how important it is to get this job done on time. So, keep at it, work your magic, and remember - the sooner you get it done, the sooner you get paid! Alrighty, then. Gran-Gran's gotta run. Keep up the good work, and I'll talk to you soon!
    //
    //
    // Paragraph 2:
    //
    // Howdy, partner! It's your favorite secret corpo agent, Gran-Gran! I hope you're doing well and making progress on that project of yours. Remember, time is of the essence, and we need you to get this job done as soon as humanly possible. We're counting on you, and we know you won't let us down. So, keep pushing, keep working, and keep your eye on the prize! And, of course, don't forget - the sooner you get this done, the sooner you get paid. Alrighty, then. Gran-Gran's gotta go. Keep up the great work, and I'll talk to you soon!
    //
    //
    // Paragraph 3:
    //
    // Well, hello there, my little worker bee! It's Gran-Gran, your favorite secret corpo agent and grandma. I just wanted to check in and see how things are going with that project of yours. I hope you're making progress and getting closer to the finish line. We're excited to see what you come up with, and we know you're going to knock it out of the park! So, keep your head down, stay focused, and get that job done ASAP! And, of course, we can't forget the best part - getting paid! The sooner you finish, the sooner you get your reward. Alrighty, then. Gran-Gran's gotta run. Keep up the fantastic work, and I'll talk to you soon!

    onWindowPreload(){
        this.img = loadImage('assets/broker.png');
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
            if(this.speakerText === ""){
                this.speaker.startOver();
                this.speakerText = this.speaker.getCurrentText()
            }


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