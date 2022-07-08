const gameBoard = (() => {
    const emptyBoard = ['', '', '', '', '', '', '', '', ''];
    let board = [...emptyBoard];
    const boardElem = document.querySelector('#board');

    const renderBoard = () =>  {
        boardElem.innerHTML = '';
        board.forEach(cell => {
            boardElem.innerHTML += `<div>${cell}</div>`;
        });
    };
    const makeMove = (playerToken, index) => {
        if (board[index] !== '') {return false};
        board[index] = playerToken;
        renderBoard();
        return true;
    };
    const resetBoard = () => {
        board = [...emptyBoard];
        renderBoard();
    };
    const getBoard = () => {
        return board;
    };

    return {renderBoard, makeMove, resetBoard, getBoard};
})();

const player = (name) => {return {name}};

const gameController = (() => {
    let players = [];
    let currentTurn;

    const startGame = () => {
        players = [player('Player1'), player('Player2')]
        gameBoard.resetBoard();
        currentTurn = Math.round(Math.random());
    }
    const makeMove = (index) => {
        if (gameBoard.makeMove(players[currentTurn].name, index)) {
            if(validateBoard(gameBoard.getBoard())) {
                console.log(`win for ${players[currentTurn].name}`);
            }
            nextTurn();
        }
    }
    const nextTurn = () => {
        currentTurn = (currentTurn + 1) % 2;
    }
    const validateBoard = (board) => {
        // Horizontals
        for (let i = 0; i < 3; i++) {
            if ((board[i*3] === board[(i*3)+1] && board[i] === board[(i*3)+2])
                && board[i] !== '') {
                return true;
            }
        }
        // Verticals
        for (let i = 0; i < 3; i++) {
            if ((board[i] === board[i+3] && board[i] === board[i+6])
                && board[i] !== '') {
                return true;
            }
        }
        // Diagonals
        if (((board[0] === board[4] && board[0] === board[8])
            || (board[2] === board[4] && board[0] === board[6]))
            && board[4] !== '') {
            return true;
        }
        return false;
    }

    return {startGame, makeMove, validateBoard};
})();
