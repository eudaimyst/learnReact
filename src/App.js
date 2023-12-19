import { useState } from "react";

let boardPieces = {}
let previousPiece; //stores string of previously clicked piece

const pieces = {
	king: {
		notation: "K",
	},
	queen: {
		notation: "Q",
	},
	bishop: {
		notation: "B",
	},
	rook: {
		notation: "R",
	},
	pawn: {
		notation: "P",
	},
	knight: {
		notation: "N",
	}
}

const startingSquares = {
	white: {
		A1: pieces.rook, B1: pieces.knight, C1: pieces.bishop, D1: pieces.queen,
		E1: pieces.king, F1: pieces.bishop, G1: pieces.knight, H1: pieces.rook,
		A2: pieces.pawn, B2: pieces.pawn, C2: pieces.pawn, D2: pieces.pawn,
		E2: pieces.pawn, F2: pieces.pawn, G2: pieces.pawn, H2: pieces.pawn,
	},
	black: {
		A8: pieces.rook, B8: pieces.knight, C8: pieces.bishop, D8: pieces.queen,
		E8: pieces.king, F8: pieces.bishop, G8: pieces.knight, H8: pieces.rook,
		A7: pieces.pawn, B7: pieces.pawn, C7: pieces.pawn, D7: pieces.pawn,
		E7: pieces.pawn, F7: pieces.pawn, G7: pieces.pawn, H7: pieces.pawn,
	}
}

const files = ["A", "B", "C", "D", "E", "F", "G", "H"];

export default function App() {
	let renderArray = [] //elements are added to this which get returned to the document root
	GameBoard().forEach((element, i) => {
		renderArray.push(element);
	});
	return renderArray
}

function GameBoard() {
	let boardArray = [] //elements are added to this which get returned to the default function
	for (let i = 0; i < 8; i++) {
		if (i % 2 === 0) boardArray.push(BoardRow(1, i));
		else boardArray.push(BoardRow(0, i));
	}
	console.log(boardArray);
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
		if (startingSquares.white[square]) pieceString = 'w'+startingSquares.white[square].notation;
		else if (startingSquares.black[square]) pieceString = 'b'+startingSquares.black[square].notation;
		else pieceString = '';
		boardPieces[square] = pieceString;
	}
	const [renderTrigger, triggerUpdate] = useState('');
	//const [piece, setPiece] = useState(pieceString)

	if (dark) className = 'squareDark';
	else className = 'squareLight';

	function handleClick(square, clickedPiece) { 
		console.log('square: ' + square + ' clicked');
		
		if (clickedPiece) {
			console.log('piece: ' + clickedPiece + ' clicked');
			if (previousPiece == null)
			{
				console.log('no previous piece')
				previousPiece = clickedPiece;
				//setPiece('');
				boardPieces[square] = '';
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
		console.log('new selectedPiece: ' + previousPiece);
		triggerUpdate(trigger => trigger + ' ');
	}

	return <button
		className={className}
		key={square}
		onClick={() => {handleClick(square, boardPieces[square])}}
		>
			{renderTrigger + boardPieces[square]}
	</button>;
}