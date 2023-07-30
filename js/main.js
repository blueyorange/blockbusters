BB.main = function() {
    // DOM references
    const hexTemplateElement =  document.getElementById('hexTemplate');
    const questionElement = document.getElementById('question');
    const gridElement = document.getElementById('grid');
    const startButtonElement = document.getElementById('startButton');
    const letterClass = 'yellow';
    const horizTeamClass = 'blue';
    const vertTeamClass = 'white';
    const selectedClass = 'selected';
    const svgns = 'http://www.w3.org/2000/svg';
    // horizontal and vertical offsets for hexagon shape (half-width,half-height)
    const hexX = 10;
    const hexY = 9;

    function Hex(x,y,grid) {
        this.grid = grid;
        this.element = hexTemplateElement.cloneNode(true);
        this.element.setAttribute('transform',`translate(${x},${y})`);
        this.textElement = document.createElementNS(svgns,'text');
        this.element.appendChild(this.textElement);
        gridElement.appendChild(this.element);
        this.select = () => {
            // check to see if currently selected
            if (this.grid.selected === this) {
                this.element.removeEventListener('click',this.select)
                this.element.classList.remove(selectedClass);
                // toggle colour if already selected
                if ( this.element.classList.contains(horizTeamClass) ) {
                    this.change(vertTeamClass);
                } else {
                    this.change(horizTeamClass);
                }
            }
            // store reference to selected hex in grid
            this.grid.deselect();
            this.grid.selected = this;
            this.element.classList.add(selectedClass);
            questionElement.innerHTML = this.question;
            console.log(this.answer);
            return this;
        }
    }

    Hex.prototype.selectable = function() {
        this.element.addEventListener('click', this.select )
    }

    Hex.prototype.changeLetter = function(l) {
        this.textElement.innerHTML = l;
        this.letter = l;
    }

    Hex.prototype.change = function(className) {
        this.element.classList.remove(...this.element.classList);
        this.element.classList.add('hex');
        this.element.classList.add(className);
    }

    function HexGrid(rows,cols) {
        // constructor for grid
        this.deselect = function() {
            // removes selected class from currently selected hex
            if (this.selected !== null) {
                this.selected.element.classList.remove('selected');
            }
        }

        this.selectable = () => {
            // make all remaining letters clickable
            this.grid.forEach( (row) => {row.forEach( (hex) => {hex.selectable()})})
        }

        // no element selected to begin with
        this.selected = null;
        this.grid = [];
        // retrieve enough questions for gameboard
        let questions = BB.getnQuestions(rows*cols);
        for (let row=-1; row <= rows; row++) {
            let gridRow = [];
            for (let col=-1; col <= cols; col++) {
                let x = hexX * (2.5 + col*3/2);
                let y = hexY*2 + row*hexY*2;
                if (col%2) {
                    // odd column: shift downwards
                    y += hexY;
                }
                if ((row==rows)&&((col==-1)||(col==cols))) {
                    // extra border elements not not be created
                    continue
                }
                let hex = new Hex(x,y,this);
                if ((col == -1) || (col == cols)) {
                    hex.change(horizTeamClass);
                } else if ((row == -1) || (row == rows)) {
                    hex.change(vertTeamClass);
                } else {
                    // retrieve question and answer from array
                    let question = questions[row*cols+col];
                    gridRow[col] = hex;
                    hex.changeLetter(question.letter);
                    hex.change(letterClass);
                    hex.question = question.question;
                    hex.answer = question.answer;
                }
            }
            if (gridRow.length) {
                // store letter tiles in array
                this.grid[row] = gridRow;
            }
        }
    }

    Game = function() {
        // initialise game board
        const rows = 4;
        const cols = 5;
        let hexGrid = new HexGrid(rows,cols);

        let firstQuestion = function() {
            // get random initial question
            let i = Math.floor(Math.random() * rows);
            let j =  Math.floor(Math.random() * cols);
            // returns answer to question
            return hexGrid.grid[i][j].select();
        }

        this.start = (e) => {
            hexGrid.selectable();
            firstQuestion();
            // hide start button
            e.target.style.display = 'none';
        }
    }

    let game = new Game();
    startButtonElement.addEventListener('click', (e) => game.start(e))
}

BB.main();