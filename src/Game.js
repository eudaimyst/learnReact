import * as G from "./Globals.js";
import * as Piece from "./GamePiece.js";
import * as Board from "./GameBoard.js";

let turn = null;
let turnCount = 0;
let state = G.gameStates.awaitingSelection;
let selectedPiece = null;

const pieceDefinitions = {
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

let p = pieceDefinitions; //just readability
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

function Init() {
	console.log('Initializing game setup');
	if (!Board.Init()) return false;
	turn = G.sides.white;
	turnCount = 1
	return true;
}

function NextTurn() {
	if (turn === G.sides.white) turn = G.sides.black;
	else if (turn === G.sides.black) turn = G.sides.white;
	else return false; //misassigned turn variable
	state = G.gameStates.awaitingSelection; //initial state of any turn is to wait selecting a peice
	return true;
}

function SelectPiece (pos) {
	if (board[pos].currentPiece) {
		if (board[pos].currentPiece.side === turn) {
			console.log('correct side, selected '+board[pos].currentPiece.name);
			selectedPiece = board[pos].currentPiece;
			state = G.gameStates.awaitingPlacement;
			return true;
		}
		return true;
	}
	return false; //no piece at provided pos on the board
}

function PlacePiece (pos) {
	console.log('moving '+selectedPiece.name+' from '+selectedPiece.position+' to '+pos);
	board[selectedPiece.position].currentPiece = null;
	board[pos].currentPiece = selectedPiece;
	selectedPiece.position = pos;
	selectedPiece = null;
	selectedSquare = null; //clear selected square
	state = G.gameStates.awaitingSelection;
	if (NextTurn()) { //next turn
		return true;
	}
}

const GetBoard = () => board;
const GetTurn = () => turn;
const GetTurnCount = () => turnCount;
const GetState = () => state;


export { Init, GetBoard, GetTurn, GetTurnCount, GetState, NextTurn, SelectPiece, PlacePiece }; 