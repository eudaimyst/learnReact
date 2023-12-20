import { useState } from "react";

let boardPieces = {}
let previousPiece; //stores string of previously clicked piece
let takenPiecesStr;
let status = false;
let selectedSquare = null;
let selectedPiece = null;

const gameStates = { awaitingSelection: {text: "awaiting selection"}, awaitingPlacement: {text: "awaiting placement"} }

const Game = {
	turn: "white",
	turnCount: 1,
	state: gameStates.awaitingSelection,
	NextTurn: function() {
		if (Game.turn == "white") Game.turn = "black";
		else Game.turn = "white";
		Game.turnCount++;
	},
	SelectPiece: function(square) {
		if (boardPieces[square]) {
			if (boardPieces[square].side == Game.turn) {
				selectedPiece = boardPieces[square];
				selectedSquare = square;
				Game.state = gameStates.awaitingPlacement;
			}
		}
	},
	PlacePiece: function(square) {

	}
} 

const pieces = {
	king: {
		notation: "K",
		side: null,
		position: null,
	},
	queen: {
		notation: "Q",
		side: null,
		position: null,
	},
	bishop: {
		notation: "B",
		side: null,
		position: null,
	},
	rook: {
		notation: "R",
		side: null,
		position: null,
	},
	whitePawn: {
		notation: "P",
		side: "white",
		position: null,
	},
	blackPawn: {
		notation: "P",
		side: "black",
		position: null,
	},
	knight: {
		notation: "N",
		side: null,
		position: null,
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

const files = ["A", "B", "C", "D", "E", "F", "G", "H"];

export default function App() {
	const selectedSquareDisp = <h1 key = 'selectedSquare'>selectedSquare:{selectedSquare}</h1>;
	const turnDisp = <p key = 'turn'>Turn: {Game.turn}</p>;
	const stateDisp = <p key = 'status'>State: {Game.state.text}</p>;
	//const currentPiece = <h1 key = 'cph'>current piece:{previousPiece}</h1>;

	let renderArray = [] //elements are added to this which get returned to the document root
	GameBoard().forEach((element, i) => {
		renderArray.push(element);
	});
	renderArray.push(turnDisp, stateDisp )
	return renderArray
}

function GameBoard() {
	let boardArray = [] //elements are added to this which get returned to the default function
	for (let i = 0; i < 8; i++) {
		if (i % 2 === 0) boardArray.push(BoardRow(1, i));
		else boardArray.push(BoardRow(0, i));
	}
	//console.log(boardArray); //debug
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
	let className; 
	const rank = 8-row;
	const file = files[column];
	const square = file + rank;
	let pieceString;
	if (!boardPieces[square]) { //if the board pieces have not been intialised
		/*
		if (startingSquares.white[square]) pieceString = 'w'+startingSquares.white[square].notation;
		else if (startingSquares.black[square]) pieceString = 'b'+startingSquares.black[square].notation;
		else pieceString = '';
		boardPieces[square] = pieceString;
		*/
		boardPieces[square] = {
			currentPiece: null,
		}
		if (startingSquares.white[square]) {
			boardPieces[square].currentPiece = startingSquares.white[square];
			boardPieces[square].currentPiece.side = 'white';
		}
		else if (startingSquares.black[square]) {
			boardPieces[square].currentPiece = startingSquares.black[square];
			boardPieces[square].currentPiece.side = 'black';
		}
	}
	const [renderTrigger, triggerUpdate] = useState('');
	//const [piece, setPiece] = useState(pieceString)

	if (dark) className = 'squareDark';
	else className = 'squareLight';

	function handleClick(square) {
		console.log('-----------------------');
		console.log('square: ' + square + ' clicked');
		let clickedPiece = null;
		if (boardPieces[square].currentPiece) {
			//clickedPiece = boardPieces[square].currentPiece;
			Game.SelectPiece(square);
			//console.log('piece: ' + clickedPiece.notation + ' clicked');
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
		//triggerUpdate(trigger => trigger + ' ');
	}

	let content = ''
	if (boardPieces[square].currentPiece) content = boardPieces[square].currentPiece.notation;

	return <button className={className} key={square} onClick={ () => {handleClick(square)} }>
		{content} 
	</button>;
	
}