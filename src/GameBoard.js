import * as G from "./Globals.js";
import { MakePiece } from "./GamePiece.js";

const board = {}

let p = G.pieceDefinitions; //just readability

const startingSquares = {
	white: {
		A1: p.rook, B1: p.knight, C1: p.bishop, D1: p.queen,
		E1: p.king, F1: p.bishop, G1: p.knight, H1: p.rook,
		A2: p.whitePawn, B2: p.whitePawn, C2: p.whitePawn, D2: p.whitePawn,
		E2: p.whitePawn, F2: p.whitePawn, G2: p.whitePawn, H2: p.whitePawn,
	},
	black: {
		A8: p.rook, B8: p.knight, C8: p.bishop, D8: p.queen,
		E8: p.king, F8: p.bishop, G8: p.knight, H8: p.rook,
		A7: p.blackPawn, B7: p.blackPawn, C7: p.blackPawn, D7: p.blackPawn,
		E7: p.blackPawn, F7: p.blackPawn, G7: p.blackPawn, H7: p.blackPawn,
	}
}

function makeSquare(pos) //makes a "square" on the board at the given notation position
{
	let square = {};
	square.currentPiece = null;
	square.selected = false;
	if (startingSquares.white[pos]) {
		square.currentPiece = MakePiece(startingSquares.white[pos], G.sides.white, pos);
	}
	else if (startingSquares.black[pos]) {
		square.currentPiece = MakePiece(startingSquares.black[pos], G.sides.black, pos);
	}
	return square;
}

function MovePiece(from, to) {
	let movingPiece = board[from].currentPiece;
	if (movingPiece) {
		board[to].currentPiece = movingPiece;
		movingPiece.MovePiece(movingPiece, from, to); //call function on piece to increase movecount and update current position
		board[from].currentPiece = null;
		return true;
	}
	console.log('Error: no piece to move');
	return false;
}

function GetPieces()
{
	//for each square on the board check if it has pieces and return a new array with the pieces
	let pieces = [];
	for (let pos in board) {
		if (board[pos].currentPiece) pieces.push(board[pos].currentPiece);
	}
	console.log(pieces);
	return pieces;
}

function GetPieceAtPos(pos) {
	if (board[pos].currentPiece) {
		return board[pos].currentPiece;
	}
	return false;
}

function GetSquareByXY(x, y) {
	let pos = GetPosByXY(x, y);
	if (board[pos]) return board[pos];
	return false
}

function GetPosByXY(x, y) {
	let file = G.files[x-1];
	let rank = y
	let pos = file+rank;
	//console.log(x, y, pos);
	if (board[pos]) return pos;
	else {
		//console.log(x, y, 'out of range')
		return false;
	}
}
function GetXYByPos(pos) {
	//console.log(pos)
	let file = pos.slice(0,1);
	let rank = pos.slice(1,2);
	return {x: G.invFiles[file],y: rank}
}

function Init() {
	for (let i = 0; i < 8; i++) {
		let rank = 8-i;
		for (let j = 0; j < 8; j++) {
			let file = G.files[j];
			let pos = file+rank;
			board[pos] = makeSquare(pos);
		}
	}
	return true
}

function GetSize() {return 8 } //future expansion for different size boards, used for piece movement rules

export { Init, GetPieceAtPos, GetSquareByXY,GetPosByXY, GetXYByPos, MovePiece, GetPieces, GetSize }