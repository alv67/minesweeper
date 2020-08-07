document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left')
    let width = 10
    let height = 10
    let squareWidth = 40
    let bombAmount = 20
    let flags = 0
    let squares = []
    let isGameOver = false

    //create Board
    function createBoard() {
        //get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill("bomb");
        const emptyArray = Array(width * height - bombAmount).fill("valid");
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray
            .sort(() => Math.random() - 0.5)
            .sort(() => Math.random() - 0.5)
            .sort(() => Math.random() - 0.5)
            .sort(() => Math.random() - 0.5); // multi random to spread results
        grid.style.height = height*squareWidth + "px"
        grid.style.width = width*squareWidth + "px"
        for (let i = 0; i < width * height; i++) {
            const square = document.createElement("div");
            square.setAttribute("id", i);
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);

            // normal click
            square.addEventListener('click', function(e) {
                click(square)
            })

            //cntl and left click
            square.oncontextmenu = function(e) {
                e.preventDefault()
                addFlag(square)
            }
        }

        //add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i % width === width-1)
            const isTopEdge = (i<width)
            const isBottomEdge = (i>=squares.length - width)

            if (squares[i].classList.contains("valid")) {
                if (!isLeftEdge && squares[i-1].classList.contains("bomb")) total++
                if (!isTopEdge && !isRightEdge && squares[i+1-width].classList.contains("bomb")) total++
                if (!isTopEdge && squares[i-width].classList.contains("bomb")) total++
                if (!isTopEdge && !isLeftEdge && squares[i-1-width].classList.contains("bomb")) total++
                if (!isRightEdge && squares[i+1].classList.contains("bomb")) total++
                if (!isBottomEdge && !isRightEdge && squares[i+1+width].classList.contains("bomb")) total++
                if (!isBottomEdge && squares[i+width].classList.contains("bomb")) total++
                if (!isBottomEdge && !isLeftEdge && squares[i-1+width].classList.contains("bomb")) total++            
                squares[i].setAttribute("data", total)
            }
        }
    }

    createBoard();

    function addFlag(square){
        if (isGameOver) return
        if (!square.classList.contains('checked') ) {
            if (!square.classList.contains('flag')) {
                if (flags < bombAmount) {
                    square.classList.add('flag')
                    square.innerHTML = '🚩'
                    flags ++
                    flagsLeft.innerHTML = bombAmount-flags
                    checkForWin()
                }
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags --
                flagsLeft.innerHTML = bombAmount-flags
            }
        }
    }

    // click on square actions
    function click(square){
        let currentId = square.id
        if (isGameOver) return
        if (square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('bomb')) {
            gameOver(square)
        } else {
            let total = square.getAttribute('data')
            if (total != 0) {
                square.classList.add('checked')
                square.innerHTML = total
                return
            }
            checkSquare(square,currentId)
        }
        square.classList.add('checked')
    }

    // check neighboring squares once is clicked
    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width-1)
        const isTopEdge = (currentId<width)
        const isBottomEdge = (currentId>=squares.length - width)

        setTimeout(() => {
            if (!isLeftEdge) {
                const newId = squares[parseInt(currentId)-1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (!isRightEdge) {
                const newId = squares[parseInt(currentId)+1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (!isTopEdge && !isRightEdge) {
                const newId = squares[parseInt(currentId)+1-width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (!isTopEdge) {
                const newId = squares[parseInt(currentId)-width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (!isTopEdge && !isLeftEdge) {
                const newId = squares[parseInt(currentId)-1-width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (!isBottomEdge && !isRightEdge) {
                const newId = squares[parseInt(currentId)+1+width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (!isBottomEdge) {
                const newId = squares[parseInt(currentId)+width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (!isBottomEdge && !isLeftEdge) {
                const newId = squares[parseInt(currentId)-1+width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
    
        }, 10)
    
    }

    //game over
    function gameOver(square) {
        console.log('BOOM! Game Over!')
        isGameOver = true

        //show ALL the bombs
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣'
            }
        })

    }

    //check for win
    function checkForWin() {
        let matches = 0
        for (let i=0; i<squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches ++
            }
            if (matches === bombAmount) {
                console.log('YOU WIN!')
                isGameOver = true
            }
        }
    }
});


