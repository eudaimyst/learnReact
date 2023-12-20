import { useState } from 'react';

let previousPiece; //stores string of previously clicked piece
let takenPiecesStr;
let status = false;
let selectedSquare = null;
let selectedPiece = null;
let clickedPiece = null;

const gameStates = { awaitingSelection: {text: 'awaiting selection'}, awaitingPlacement: {text: 'awaiting placement'} }
const sides = { white: {text: 'White', notation: 'w', color: 'white'}, black: {text: 'Black', notation: 'b', color: 'black'} }

const Game = {
	board: {},
	turn: sides.white,
	turnCount: 1,
	state: gameStates.awaitingSelection,
	NextTurn: function() {
		if (Game.turn == sides.white) Game.turn = sides.black;
		else Game.turn = sides.white;
		Game.turnCount++;
	},
	SelectPiece: function(pos) {
		if (Game.board[pos].currentPiece) {
			if (Game.board[pos].currentPiece.side == Game.turn) {
				console.log('correct side, selected '+Game.board[pos].currentPiece.name);
				selectedPiece = Game.board[pos].currentPiece;
				Game.state = gameStates.awaitingPlacement;
			}
		}
	},
	PlacePiece: function(pos) {
		console.log('moving '+selectedPiece.name+' from '+selectedPiece.position+' to '+pos);
		Game.board[selectedPiece.position].currentPiece = null;
		Game.board[pos].currentPiece = selectedPiece;
		selectedPiece.position = pos;
		selectedPiece = null;
		selectedSquare = null; //clear selected square
		Game.state = gameStates.awaitingSelection;
		Game.NextTurn(); //next turn
		console.log(Game);
	}
} 

const pieceDefs = {
	king: {
		notation: 'K',
		name: 'King',
		movementRules: {
			directions: [ {x: 1, y: 0},{x: 1, y: 1},{x: 0, y: 1},{x: -1, y: 1},{x: -1, y: 0},{x: -1, y: -1},{x: 0, y: -1},{x: 1, y: -1} ],
			count: 1,
			jumps: false
		}
	},
	queen: {
		notation: 'Q',
		name: 'Queen',
		movementRules: {
			directions: [ {x: 1, y: 0},{x: 1, y: 1},{x: 0, y: 1},{x: -1, y: 1},{x: -1, y: 0},{x: -1, y: -1},{x: 0, y: -1},{x: 1, y: -1} ],
			count: 7,
			jumps: false
		}
	},
	bishop: {
		notation: 'B',
		name: 'Bishop',
		movementRules: {
			directions: [ {x: 1, y: 1},{x: -1, y: 1},{x: -1, y: -1},{x: 1, y: -1} ],
			count: 7,
			jumps: false
		}
	},
	rook: {
		notation: 'R',
		name: 'Rook',
		movementRules: {
			directions: [ {x: 1, y: 0},{x: -1, y: 0},{x: 0, y: 1},{x: 0, y: -1} ],
			count: 7,
			jumps: false
		}
	},
	whitePawn: {
		notation: 'P',
		name: 'Pawn',
		movementRules: {
			directions: [ {x: 0, y: 1} ],
			count: 1,
			jumps: false
		}
	},
	blackPawn: {
		notation: 'P',
		name: 'Pawn',
		movementRules: {
			directions: [ {x: 0, y: -1} ],
			count: 1,
			jumps: false
		}
	},
	knight: {
		notation: 'N',
		name: 'Knight',
		movementRules: {
			directions: [ {x: 1, y: 2}, {x: 2, y: 1}, {x: 2, y: -1}, {x: 1, y: -2}, {x: -1, y: -2}, {x: -2, y: -1}, {x: -2, y: 1}, {x: -1, y: 2} ],
			count: 1,
			jumps: true
		}
	}
}

const startingSquares = {
	white: {
		A1: pieceDefs.rook, B1: pieceDefs.knight, C1: pieceDefs.bishop, D1: pieceDefs.queen,
		E1: pieceDefs.king, F1: pieceDefs.bishop, G1: pieceDefs.knight, H1: pieceDefs.rook,
		A2: pieceDefs.whitePawn, B2: pieceDefs.whitePawn, C2: pieceDefs.whitePawn, D2: pieceDefs.whitePawn,
		E2: pieceDefs.whitePawn, F2: pieceDefs.whitePawn, G2: pieceDefs.whitePawn, H2: pieceDefs.whitePawn,
	},
	black: {
		A8: pieceDefs.rook, B8: pieceDefs.knight, C8: pieceDefs.bishop, D8: pieceDefs.queen,
		E8: pieceDefs.king, F8: pieceDefs.bishop, G8: pieceDefs.knight, H8: pieceDefs.rook,
		A7: pieceDefs.blackPawn, B7: pieceDefs.blackPawn, C7: pieceDefs.blackPawn, D7: pieceDefs.blackPawn,
		E7: pieceDefs.blackPawn, F7: pieceDefs.blackPawn, G7: pieceDefs.blackPawn, H7: pieceDefs.blackPawn,
	}
}

const files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function makePiece(def, side, position) { //given a definition table for a piece, returns a new piece with those properties 
	let piece = {
		notation: def.notation,
		name: def.name,
		side: side,
		position: position,
		movementRules: {}
	}
	return piece
}

function makeSquare(pos) //makes a "square" on the board at the given notation position
{
	let square = {};
	square.currentPiece = null;
	square.selected = false;
	if (startingSquares.white[pos]) {
		square.currentPiece = makePiece(startingSquares.white[pos], sides.white, pos);
	}
	else if (startingSquares.black[pos]) {
		square.currentPiece = makePiece(startingSquares.black[pos], sides.black, pos);
	}
	return square;
}

function initBoard() {
	
	let board = {}

	board.checkSquare = function(pos) {
		if (board[pos].currentPiece) {
			return true;
		}
		else {
			return false;
		}
	}	
	for (let i = 0; i < 8; i++) {
		let rank = 8-i;
		for (let j = 0; j < 8; j++) {
			let file = files[j];
			let pos = file+rank;
			board[pos] = makeSquare(pos);
		}
	}
	return board
}
Game.board = initBoard();


export default function App() {

	//console.log(Game.board)	

	const turnDisp = <p key = 'turnDisp'>Turn: {Game.turnCount+", "+Game.turn.text}</p>;
	const stateDisp = <p key = 'stateDisp'>State: {Game.state.text}</p>;
	const selectedSquareDisp = <p key = 'selectedSquareDisp'>selectedSquare:{selectedSquare}</p>;
	const selectedPieceDisp = <p key = 'selectedPieceDisp'> selectedPiece:{selectedPiece ? selectedPiece.side.text+' '+selectedPiece.name:''}</p>; // (if) x ?(then) y :(else) z 
	//const currentPiece = <h1 key = 'cph'>current piece:{previousPiece}</h1>;

	let renderArray = [] //elements are added to this which get returned to the document root
	BoardElements().forEach((element, i) => {
		renderArray.push(element);
	});
	renderArray.push(turnDisp, stateDisp, selectedSquareDisp, selectedPieceDisp )
	return renderArray
}

function BoardElements() {
	let boardArray = [] //elements are added to this which get returned to the default function
	for (let i = 0; i < 8; i++) {
		if (i % 2 === 0) boardArray.push(BoardRowElement(1, i));
		else boardArray.push(BoardRowElement(0, i));
	}
	//console.log(boardArray); //debug
	return boardArray;
}

function BoardRowElement(alt, count) {
	let rowArray = []; //elements are added to this which get returned to the GameBoard function
	for (let i = 0; i < 8; i++) {
		if ((i + alt) % 2 === 0) rowArray.push(SquareElement(true, count, i));//if odd square is dark
		else rowArray.push(SquareElement(false, count, i));
	}
	return <div className='board-row' key = {'row'+ count} >{rowArray}</div>;
}

function SquareElement(dark, row, col) {
	//console.log(boardPieces)

	//set classname for css to colour square
	let className; 
	if (dark) className = 'squareDark';
	else className = 'squareLight';
	const pos = files[col]+(8-row); //position in notation format of row and col
	
	const [renderTrigger, triggerUpdate] = useState(''); //call triggerUpdate to update variable for react to re-render

	function handleClick(pos) {
		console.log('-----------------------');
		console.log('pos: ' + pos + ' clicked');
		selectedSquare = pos; //stores which square is clicked for display
		if (Game.state == gameStates.awaitingSelection)
		{
			if (Game.board[pos].currentPiece) {
				clickedPiece = Game.board[pos].currentPiece;
				Game.SelectPiece(pos);
			}
		}
		else if (Game.state == gameStates.awaitingPlacement) {
			//here we will call for checks to see if valid movement
			Game.PlacePiece(pos);
		};
		triggerUpdate(trigger => pos); //call trigger for react to re-render
	}

	let content = ''
	if (Game.board[pos].currentPiece) {
		if (Game.board[pos].currentPiece) {
			content = Game.board[pos].currentPiece.side.notation + Game.board[pos].currentPiece.notation;
		}
	}

	return <button className={className} key={pos} onClick={ () => {handleClick(pos)} }>
		{content}   
	</button>;
}