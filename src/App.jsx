import { useState } from "react";

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button className={`square ${isWinning ? 'winning' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);
  let status;
  let winningSquares = [];
  if (winnerInfo) {
    status = 'Winner: ' + winnerInfo.winner;
    winningSquares = winnerInfo.line;
  } else if (squares.every(square => square !== null)) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : '0');
  }

  const renderSquare = (i) => {
    const isWinning = winningSquares.includes(i);
    return <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} isWinning={isWinning} />;
  };

  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const boardRow = [];
    for (let col = 0; col < 3; col++) {
      boardRow.push(renderSquare(row * 3 + col));
    }
    boardRows.push(<div key={row} className="board-row">{boardRow}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove]= useState(0);
  const [sortAscending, setSortAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {move === currentMove ? (
          <span>You are at move #{move}</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  const sortedMoves = sortAscending ? moves : moves.slice().reverse();

  const handleSquareClick = (i) => {
    const location = i;
    if (currentSquares[i] || calculateWinner(currentSquares)) {
      return;
    }
    const nextSquares = currentSquares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    handlePlay(nextSquares, location);
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => setSortAscending(!sortAscending)}>
          Sort {sortAscending ? 'Descending' : 'Ascending'}
        </button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}
