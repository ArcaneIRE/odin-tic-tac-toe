const gameBoard = (() => {
    const emptyBoard = ['', '', '', '', '', '', '', '', ''];
    let board = [...emptyBoard];
    const boardElem = document.querySelector('#board');

    const renderBoard = () =>  {
        boardElem.innerHTML = '';
        board.forEach((content, index) => {
            let newCell = document.createElement('div');
            if (content === '') {
                newCell.textContent = content
            } else {
                newCell.textContent = content.getToken();
            }
            newCell.dataset.index = index;
            newCell.addEventListener('click', (e) => {
                gameController.makeMove(e.target.dataset.index);
            })
            boardElem.appendChild(newCell);
        });
    };
    const makeMove = (player, index) => {
        if (board[index] !== '') {return false};
        board[index] = player;
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

    return {makeMove, resetBoard, getBoard, renderBoard};
})();

const player = (id) => {
    // Name
    const nameInput = document.querySelector(`#${id} .player-name`);
    let name = document.querySelector(`#${id} .player-name`).value;
    const setName = (newName) => {
        if (newName === "") {
            name = 'Anonymous';
        } else {
            name = newName;
        }
    };
    let timeout = null;
    nameInput.addEventListener('keyup', () => {
        clearTimeout(timeout);
        timeout = setTimeout(setName(nameInput.value), 500);
    });
    setName(nameInput.value);
    const getName = () => name;

    // Token
    let token = document.querySelector(`#${id} .player-token.current`).textContent;
    const tokenBar = Array.from(document.querySelectorAll(`#${id} .player-token`));
    const tokenBarClear = () => {
        tokenBar.forEach(option => {
            option.classList.remove('current');
        });
    };
    tokenBar.forEach(tokenOption => {
        tokenOption.addEventListener('click', () => {
            tokenBarClear();
            tokenOption.classList.add('current');
            token = tokenOption.textContent;
            gameBoard.renderBoard();
        });
    });
    const getToken = () => token;

    return {getToken, getName};
};

const gameController = (() => {
    let players = [];
    let currentTurn;

    const startGame = () => {
        players = [player('player1'), player('player2')];
        gameBoard.resetBoard();
        currentTurn = Math.round(Math.random());
    }
    const makeMove = (index) => {
        if (gameBoard.makeMove(players[currentTurn], index)) {
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
            if ((board[i*3] === board[(i*3)+1] && board[i*3] === board[(i*3)+2])
                && board[i*3] !== '') {
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
            || (board[2] === board[4] && board[2] === board[6]))
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
                    <h2>${result.getName()} Wins!</h2>
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