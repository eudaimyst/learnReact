import * as G from "./Globals.js";
import * as Piece from "./GamePiece.js";
import * as Board from "./GameBoard.js";

let turn = null;
let turnCount = 0;
let state = null;
let selectedSquare = null;
let selectedPiece = null;

let renderTrigger = null
function RegRenderTrigger(o) {
	renderTrigger = o;
}
function Update() {
	renderTrigger(); //call trigger for react to re-render
}

function Init() {
	console.log('Initializing game setup');
	Board.Init() ? console.log('board initialized') : console.log('board failed to initialize');
	turn = G.sides.white;
	state = G.gameStates.awaitingSelection;
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
	let piece = Board.GetPieceAtPos(pos)
	if (piece == false) return false; //no piece at provided pos on the board
	else if (piece.side === turn) {
		console.log('correct side, selected '+piece.name);
		selectedPiece = piece;
		state = G.gameStates.awaitingPlacement; console.log('state: '+state.text);
		return true;
	}
	return false;
}

function PlacePiece (pos) {
	if (!Board.GetPieceAtPos(pos)) {
		Board.MovePiece(selectedPiece.position, pos);
		selectedPiece.position = pos;
		state = G.gameStates.awaitingSelection; console.log('state: '+state.text);
		return true;
	}
	console.log('cant move piece, square is occupied') //temporary
	return false;
}

function SelectSquare (pos) {
	if (state == G.gameStates.awaitingSelection) SelectPiece(pos);
	else if (state == G.gameStates.awaitingPlacement) PlacePiece(pos);
}

const GetBoard = () => Board;
const GetTurn = () => turn;
const GetTurnCount = () => turnCount;
const GetState = () => state;
const GetSelectedPiece = () => selectedPiece;
const GetSelectedSquare = () => selectedSquare;

export { Init, GetBoard, GetTurn, GetTurnCount, GetState, NextTurn, SelectSquare, SelectPiece, GetSelectedPiece, GetSelectedSquare, RegRenderTrigger, Update }; 