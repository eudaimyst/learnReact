import { useState } from 'react';

let boardPieces = {}
let previousPiece; //stores string of previously clicked piece
let takenPiecesStr;
let status = false;
let selectedSquare = null;
let selectedPiece = null;

const gameStates = { awaitingSelection: {text: 'awaiting selection'}, awaitingPlacement: {text: 'awaiting placement'} }
const sides = { white: {text: 'White', color: 'white'}, black: {text: 'Black', color: 'black'} }

const Game = {
	turn: sides.white,
	turnCount: 1,
	state: gameStates.awaitingSelection,
	NextTurn: function() {
		if (Game.turn == sides.white) Game.turn = sides.black;
		else Game.turn = sides.white;
		Game.turnCount++;
	},
	SelectPiece: function(square) {
		if (boardPieces[square].currentPiece) {
			if (boardPieces[square].currentPiece.side == Game.turn) {
				console.log('correct side')
				selectedPiece = boardPieces[square].currentPiece;
				Game.state = gameStates.awaitingPlacement;
			}
		}
	},
	PlacePiece: function(square) {

	}
} 

const pieces = {
	king: {
		notation: 'K',
		name: 'King',
		side: null,
		position: null,
		movementRules: {
			directions: [ {x: 1, y: 0},{x: 1, y: 1},{x: 0, y: 1},{x: -1, y: 1},{x: -1, y: 0},{x: -1, y: -1},{x: 0, y: -1},{x: 1, y: -1} ],
			count: 1,
			jumps: false
		}
	},
	queen: {
		notation: 'Q',
		name: 'Queen',
		side: null,
		position: null,
		movementRules: {
			directions: [ {x: 1, y: 0},{x: 1, y: 1},{x: 0, y: 1},{x: -1, y: 1},{x: -1, y: 0},{x: -1, y: -1},{x: 0, y: -1},{x: 1, y: -1} ],
			count: 7,
			jumps: false
		}
	},
	bishop: {
		notation: 'B',
		name: 'Bishop',
		side: null,
		position: null,
		movementRules: {
			directions: [ {x: 1, y: 1},{x: -1, y: 1},{x: -1, y: -1},{x: 1, y: -1} ],
			count: 7,
			jumps: false
		}
	},
	rook: {
		notation: 'R',
		name: 'Rook',
		side: null,
		position: null,
		movementRules: {
			directions: [ {x: 1, y: 0},{x: -1, y: 0},{x: 0, y: 1},{x: 0, y: -1} ],
			count: 7,
			jumps: false
		}
	},
	whitePawn: {
		notation: 'P',
		name: 'Pawn',
		side: sides.white,
		position: null,
		movementRules: {
			directions: [ {x: 0, y: 1} ],
			count: 1,
			jumps: false
		}
	},
	blackPawn: {
		notation: 'P',
		name: 'Pawn',
		side: sides.black,
		position: null,
		movementRules: {
			directions: [ {x: 0, y: -1} ],
			count: 1,
			jumps: false
		}
	},
	knight: {
		notation: 'N',
		name: 'Knight',
		side: null,
		position: null,
		movementRules: {
			directions: [ {x: 1, y: 2}, {x: 2, y: 1}, {x: 2, y: -1}, {x: 1, y: -2}, {x: -1, y: -2}, {x: -2, y: -1}, {x: -2, y: 1}, {x: -1, y: 2} ],
			count: 1,
			jumps: true
		}
	}
}

const startingSquares = {
	white: {
		A1: pieces.rook, B1: pieces.knight, C1: pieces.bishop, D1: pieces.queen,
		E1: pieces.king, F1: pieces.bishop, G1: pieces.knight, H1: pieces.rook,
		A2: pieces.whitePawn, B2: pieces.whitePawn, C2: pieces.whitePawn, D2: pieces.whitePawn,
		E2: pieces.whitePawn, F2: pieces.whitePawn, G2: pieces.whitePawn, H2: pieces.whitePawn,
	},
	black: {
		A8: pieces.rook, B8: pieces.knight, C8: pieces.bishop, D8: pieces.queen,
		E8: pieces.king, F8: pieces.bishop, G8: pieces.knight, H8: pieces.rook,
		A7: pieces.blackPawn, B7: pieces.blackPawn, C7: pieces.blackPawn, D7: pieces.blackPawn,
		E7: pieces.blackPawn, F7: pieces.blackPawn, G7: pieces.blackPawn, H7: pieces.blackPawn,
	}
}

const files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export default function App() {
	const turnDisp = <p key = 'turnDisp'>Turn: {Game.turnCount+", "+Game.turn.text}</p>;
	const stateDisp = <p key = 'stateDisp'>State: {Game.state.text}</p>;
	const selectedSquareDisp = <p key = 'selectedSquareDisp'>selectedSquare:{selectedSquare}</p>;
	const selectedPieceDisp = <p key = 'selectedPieceDisp'> selectedPiece:{selectedPiece ? selectedPiece.side.text+' '+selectedPiece.name:''}</p>; // (if) x ?(then) y :(else) z 
	//const currentPiece = <h1 key = 'cph'>current piece:{previousPiece}</h1>;

	let renderArray = [] //elements are added to this which get returned to the document root
	GameBoard().forEach((element, i) => {
		renderArray.push(element);
	});
	renderArray.push(turnDisp, stateDisp, selectedSquareDisp, selectedPieceDisp )
	return renderArray
}

function GameBoard() {
	let boardArray = [] //elements are added to this which get returned to the default function
	for (let i = 0; i < 8; i++) {
		if (i % 2 === 0) boardArray.push(BoardRow(1, i));
		else boardArray.push(BoardRow(0, i));
	}
	console.log(boardArray); //debug
	return boardArray;
}

function BoardRow(alt, count) {
	let rowArray = []; //elements are added to this which get returned to the GameBoard function
	for (let i = 0; i < 8; i++) {
		if ((i + alt) % 2 === 0) rowArray.push(Square(true, count, i));//if odd square is dark
		else rowArray.push(Square(false, count, i));
	}
	return <div className='board-row' key = {'row'+ count} >{rowArray}</div>;
}

function Square(dark, row, column) {
	//console.log(boardPieces)
	let className; 
	const rank = 8-row;
	const file = files[column];
	const square = file + rank;
	let pieceString;
	if (!boardPieces[square]) { //if the board pieces have not been intialised
		boardPieces[square] = {
			currentPiece: null, //ensures boardPieces table entry is initialised at index square with currentPiece property (even if nil)
		}
		//places the piece data from the startingSquares table into the boardPieces table
		if (startingSquares.white[square]) {
			boardPieces[square].currentPiece = startingSquares.white[square];
			boardPieces[square].currentPiece.side = sides.white; //set the correct side for the piece
			console.log('adding white piece '+square+', '+boardPieces[square].currentPiece.notation);
			console.log(boardPieces[square].currentPiece.side);
		}
		else if (startingSquares.black[square]) {
			boardPieces[square].currentPiece = startingSquares.black[square];
			boardPieces[square].currentPiece.side = sides.black;
			console.log('adding black piece '+square+', '+boardPieces[square].currentPiece.notation);
			console.log(boardPieces[square].currentPiece.side);
		}
	}
	const [renderTrigger, triggerUpdate] = useState('');

	if (dark) className = 'squareDark';
	else className = 'squareLight';

	function handleClick(square) {
		console.log('-----------------------');
		console.log('square: ' + square + ' clicked');
		selectedSquare = square;
		let clickedPiece = null;
		if (boardPieces[square].currentPiece) {
			clickedPiece = boardPieces[square].currentPiece;
			console.log(clickedPiece.side);
			Game.SelectPiece(square);
		}
		/*
		if (clickedPiece) {
			console.log('piece: ' + clickedPiece + ' clicked');
			if (previousPiece == null)
			{
				console.log('no previous piece');
				previousPiece = clickedPiece;
				boardPieces[square] = ' ';
			}
		 }
		else {
			console.log('square has no piece')
			if (previousPiece) {
				//setPiece(previousPiece);
				boardPieces[square] = previousPiece;
				previousPiece = null
			};
		}
		*/
		triggerUpdate(trigger => square);
	}

	let content = ''
	if (boardPieces[square].currentPiece) content = boardPieces[square].currentPiece.notation;

	return <button className={className} key={square} onClick={ () => {handleClick(square)} }>
		{content} 
	</button>;
	
}