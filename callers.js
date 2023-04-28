
class Speaker{
    constructor(imgPath, name, texts, matrix, validStarts) {
        this.imgPath = imgPath;
        this.imgLoaded = false;
        this.img = null;//initialize as empty
        this.name = name;
        this.texts = texts;
        this.markovMatrix = this._computeMarkovChain(matrix)
        this.validStarts = validStarts;
        //pick a random start in the array of validStarts
        this.startOver();
    }

    LoadImageIfNotLoaded(){
        if(!this.imgLoaded){
            this.img = loadImage(this.imgPath);
            this.imgLoaded = true;
        }
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

let speaker_rodeo = new Speaker('assets/picasso.png', 'Rode0',
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

let speaker_grangran = new Speaker('assets/grangran.png', 'Gran-Gran',
    ["Hello there, dearie!", "Well, hello there, my dear!", "Hey there, my little worker bee!",
    "I hope you're doing well.", "I need you to work\nhard on that *project*.", "I hope you're doing your best\ndoing the job at hand.",
    "I'm counting on you to deliver the goods.", "No slacking off, you hear me?", "Remember, there's money\nand cookies waiting for you.",
    "Get back to work\nand make Gran-Gran proud.", "Gran-Gran's gotta run."],
    //holy shit this will be a 11x11 matrix.
    [  //0  1  2  3  4  5  6  7  8  9  A
        [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0], // 0 Hello there, dearie.
        [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0], // 1 Well, hello there, my dear.
        [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0], // 2 Hey there, my little worker bee!
        [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0], // 3 I hope you're doing well.
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0], // 4 I need you to keep working hard on that project of yours.
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0], // 5 I hope you're doing your best to complete the job at hand.
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0], // 6 I'm counting on you to deliver the goods.
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // 7 No slacking off, you hear me?
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1], // 8 Remember, there's money waiting for you once the job is finished.
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 9 Get back to work and make grandma proud.
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // A Gran-Gran's gotta run.
    ],
    [0, 1, 2]
);


let speaker_ganymede = new Speaker('assets/broker.png', 'Ganymede',
    ["Grater.", "Hey.", "Agent.",
        "I'm checking in to see the progress.", "Hope I didn't call at a bad time.", "What is the status quo?",
        "Remember to leave no traces.", "I have high expectations in you.", "Go out there and make me proud.",
        "Ganymede out.", "*Click*"],
    //holy shit this will be a 11x11 matrix.
    [  //0  1  2  3  4  5  6  7  8  9  A
        [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0], // 0 Grater.
        [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0], // 1 Hey.
        [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0], // 2 Agent.
        [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0], // 3 I'm checking in to see the progress.
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0], // 4 Hope I didn't call at a bad time.
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0], // 5 What is the status quo?
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0], // 6 Remember to leave no traces.
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // 7 I have high expectations in you.
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1], // 8 Go out there and make me proud.
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 9 Ganymede out.
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // A *Click*
    ],
    [0, 1, 2]
);