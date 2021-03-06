// import React from 'react';
import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import './style.css';

// class Square extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       state: null,
//     };
//   }

//   render() {
//     return (
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

// let square = { height: '50px' };

function Square(props) {
  return (
    <Button
      className="{square}"
      onClick={props.onClick}
      variant="dark"
      style={{ width: '50px', height: '50px' }}
    >
      {props.value}
    </Button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const rows = 3;
    const cells = 3;

    return (
      <div>
        {[...Array(rows).keys()].map((row) => (
          <div className="board-row" key={row}>
            {[...Array(cells).keys()].map((cell) =>
              this.renderSquare(row * cells + cell)
            )}
          </div>
        ))}
      </div>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let row, col;
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    if (i < 3) row = 1;
    else if (i > 2 && i < 6) row = 2;
    else if (i > 5) row = 3;

    if (i == 0 || i == 3 || i == 6) col = 1;
    else if (i == 1 || i == 4 || i == 7) col = 2;
    else if (i == 2 || i == 5 || i == 8) col = 3;

    this.setState({
      history: history.concat([
        {
          squares: squares,
          row: row,
          col: col,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to step #' + move : 'Start new game';
      let col = this.state.history[move].col;
      let row = this.state.history[move].row;
      return (
        <li key={move}>
          <Button onClick={() => this.jumpTo(move)}>{desc}</Button>
          <p>{move != 0 ? 'col = ' + col + ' row = ' + row : ' '}</p>
        </li>
      );
    });

   
    let status;
    if (winner) {
      let winNum = winner[1];
      console.log(winNum);
      status = 'Winner is ' + winner[0];
    } else {
      status = 'Next is: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <Container bg="Light">
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      </Container>
    );
  }
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
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}
