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
    const makeMove = (player, boardIndex) => {
        board[boardIndex] = player;
        renderBoard();
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
