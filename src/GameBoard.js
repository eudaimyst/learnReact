import * as G from "./Globals.js";
import { MakePiece } from "./GamePiece.js";

const board = {};
const squares = []; //a flat representation of the squares not accesible by position key
let GetTurn; //gets assigned to Game.js GetTurn function on init()

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

function MakeSquare(pos, dark) //makes a "square" on the board at the given notation position
{
	let square = {
		position: pos, //position in notation format
		defaultClass: dark ? 'squareDark' : 'squareLight', //default class for square
		className: dark ? 'squareDark' : 'squareLight', //default class for square
		highlighted: false,
		currentlyPossible: false, //move to this square by selected piece is possible
		currentlyImpossible: false, //move to this square by selected piece puts its king in check
		currentlyTaking: false, //move to this square by selected piece takes a piece
		GetClass() {
			this.highlighted ? this.defaultClass == 'squareDark' ? this.className = 'squareHighlightDark': this.className = 'squareHighlightLight' : this.className = this.defaultClass;
			this.currentlyPossible ? this.className = 'squareHighlightPossible': {} ;
			this.currentlyTaking ? this.className = 'squareHighlightTaking': {} ;
			this.currentlyImpossible ? this.className = 'squareHighlightImpossible': {} ;
			return this.className;
		},
		SetHover: function(self, value) {self.highlighted = value},
		SetPossible: function(self, value) {self.currentlyPossible = value},
		SetImpossible: function(self, value) {self.currentlyImpossible = value},
		SetTaking: function(self, value) {self.currentlyTaking = value}
	};
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

function Init(GetTurnFunc) {
	GetTurn = GetTurnFunc;
	for (let i = 0; i < 8; i++) {
		let rank = 8-i;
		for (let j = 0; j < 8; j++) {
			let file = G.files[j];
			let pos = file+rank;
			let dark = (i + j + 1) % 2 == 0 ? true : false; //if odd square is dark
			board[pos] = MakeSquare(pos, dark);
			squares.push(board[pos]);
		}
	}
	return true
}

function MoveMakesCheck(piece, from, to) { //checks if a specific move will place a king in check
	if (piece.side == G.OppSide(GetTurn())) return false; //ignore moves of pieces whose turn it is not 
	//do move
	console.log('---------------------\nchecking if moving '+piece.side.name+piece.name+' from '+from+" to "+to+' makes check\n---------------------')
	let makesCheck = false
	let pieceAtSquare = board[to].currentPiece;
	MovePiece(from, to, true);
	if (CheckForChecks(piece.side)) {
		makesCheck = true
		console.log('RESULT: move DOES make check');
	}
	else console.log('RESULT: move DOES NOT make check');
	//undo move
	MovePiece(to, from, true);
	if (pieceAtSquare) {
		board[to].currentPiece = pieceAtSquare;
		pieceAtSquare.position = to;
	}
	return makesCheck
}

function CheckForChecks(kingSide) { //checks to see if a king is in check, passed the side of the king to check
	let pieces = GetPieces(); 
	//for each piece, calculate possible moves
	let allSquaresUnderAttack = [];
	for (let piece of pieces) {
		if (piece.side == G.OppSide(kingSide)) {
			console.log('checking '+piece.side.name+piece.name+' taking moves for check')
			console.log('has this many taking moves'+piece.takingMoves.length)
			for (let move of piece.takingMoves) {
				console.log('checking move: '+move+' for check on '+kingSide.name+' king. By '+piece.name )
				allSquaresUnderAttack.push(GetBoard()[move]);
			}
		}
	}
	for (let square of allSquaresUnderAttack) {
		console.log('checking for '+kingSide.name+' king in check at '+square.position)
		if (!square.currentPiece) console.log("square under attack that doesn't have a piece");
		else if (square.currentPiece.side == kingSide && square.currentPiece.name == 'King') return true;
	}
	return false;
}

function MovePiece(from, to, testing) { //testing = testing for check
	//if (testing == null) testing = false;
	let movingPiece = board[from].currentPiece; //the piece that is moving
	if (movingPiece) {
		board[to].currentPiece = movingPiece; //store reference to the piece at the new position
		movingPiece.MovePiece(to, testing); //call function on piece to increase movecount and update current position
		board[from].currentPiece = null; //clear reference at the position the piece was at
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
	//console.log(pieces);
	return pieces;
}

function GetPieceAtPos(pos) {
	if (board[pos].currentPiece) {
		return board[pos].currentPiece;
	}
	return false;
}

function GetSquareByPos(pos) {
	if (board[pos]) return board[pos];
	return false
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

function ClearPossibleMoves() {
	let i = 0;
	for (let square of squares) {
		i++;
		//console.log(i)
		square.SetTaking(square, false)
		square.SetPossible(square, false)
	}
}

function ShowPossibleMoves(piece) {
	for (let pos of piece.possibleMoves) {
		let square = GetSquareByPos(pos);
		if (square) square.SetPossible(square, true);
	}
	for (let pos of piece.takingMoves) {
		let square = GetSquareByPos(pos);
		if (square) square.SetTaking(square, true);
	}
	for (let pos of piece.impossibleMoves) {
		let square = GetSquareByPos(pos);
		if (square) square.SetImpossible(square, true);
	}
}

function GetBoard() {return board}
function GetSize() {return 8 } //future expansion for different size boards, used for piece movement rules

export { Init, GetBoard, GetPieceAtPos, GetSquareByPos, GetSquareByXY, GetPosByXY, GetXYByPos, MovePiece, GetPieces, GetSize, ClearPossibleMoves, MoveMakesCheck, ShowPossibleMoves, CheckForChecks }