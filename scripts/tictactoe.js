const gameBoard = (() => {
    const emptyBoard = ['', '', '', '', '', '', '', '', ''];
    let board = [...emptyBoard];
    const boardElem = document.querySelector('#board');

    const renderBoard = () =>  {
        boardElem.innerHTML = '';
        board.forEach((contents, index) => {
            let newCell = document.createElement('div');
            newCell.textContent = contents;
            newCell.dataset.index = index;
            newCell.addEventListener('click', (e) => {
                gameController.makeMove(e.target.dataset.index);
            })
            boardElem.appendChild(newCell);
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

    return {makeMove, resetBoard, getBoard};
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
            let result = evaluateBoard(gameBoard.getBoard());
            if (result === false) {
                nextTurn();
            } else {
                endGame(result);
            }
        }
    }
    const nextTurn = () => {
        currentTurn = (currentTurn + 1) % 2;
    }
    const evaluateBoard = (board) => {
        // Horizontals
        for (let i = 0; i < 3; i++) {
            if ((board[i*3] === board[(i*3)+1] && board[i] === board[(i*3)+2])
                && board[i] !== '') {
                return players[currentTurn];
            }
        }
        // Verticals
        for (let i = 0; i < 3; i++) {
            if ((board[i] === board[i+3] && board[i] === board[i+6])
                && board[i] !== '') {
                    return players[currentTurn];
            }
        }
        // Diagonals
        if (((board[0] === board[4] && board[0] === board[8])
            || (board[2] === board[4] && board[0] === board[6]))
            && board[4] !== '') {
                return players[currentTurn];
        }
        // Draw
        if (!(board.includes(''))){
            return 'draw';
        }
        return false;
    }
    const endGame = (result) => {
        document.body.insertAdjacentHTML('beforeend', `
        <div id="result-modal-root" class="modal">
            <div id="result-modal-content" class="modal-content">
                <div class="modal-header">
                    <h2>${result.name} Wins!</h2>
                    <span id="result-modal-close" class="modal-close">✖</span>
                </div>
            </div>
        </div>`);

        const resultRoot = document.querySelector('#result-modal-root');
        resultRoot.addEventListener('click', () => {
            startGame();
            resultRoot.remove();
        });
        document.querySelector('#result-modal-close').addEventListener('click', () => {
            startGame();
            resultRoot.remove();
        });
        document.querySelector('#result-modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    return {startGame, makeMove};
})();

gameController.startGame();