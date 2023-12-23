import * as G from "./Globals.js";
import * as Piece from "./GamePiece.js";
import * as Board from "./GameBoard.js";

let turn = null;
let turnCount = 0;
let state = null;
let selectedSquare = null;
let selectedPiece = null;
let whiteChecked = false;
let blackChecked = false;

let pieces = []; //after board is created gets reference to all pieces

let renderTrigger = null
function RegRenderTrigger(o) {
	renderTrigger = o;
}
function Update() {
	renderTrigger(); //call trigger for react to re-render
}

function Init() {
	console.log('Initializing game setup');
	Board.Init(GetTurn) ? console.log('board initialized') : console.log('board failed to initialize'); //pass the GetTurn function to the board for checking checks
	pieces = Board.GetPieces();
	turn = G.sides.white;	
	//for each piece, calculate possible moves
	for (let piece of pieces) { Piece.CalculateMoves(piece, turn) }
	state = G.gameStates.awaitingSelection;
	turnCount = 1
	return true;
}

function UpdateChecks(){
	Board.CheckForChecks(G.sides.white) ? whiteChecked = true : whiteChecked = false
	Board.CheckForChecks(G.sides.black) ? blackChecked = true : blackChecked = false
}

function GetChecks(){
	return (whiteChecked ? G.sides.white.name : '') + (blackChecked ? G.sides.black.name : '');
}

function NextTurn() {
	if (turn === G.sides.white) turn = G.sides.black;
	else if (turn === G.sides.black) turn = G.sides.white;
	else return false; //misassigned turn variable
	for (let piece of pieces) { //calculate all available moves for all available pieces
		Piece.CalculateMoves(piece, turn)
	}
	for (let piece of pieces) { //after this is done we check checks (important to be done after all pieces as uses their possible moves to calc checks)
		piece.CheckChecking();
	}
	state = G.gameStates.awaitingSelection; //initial state of any turn is to wait selecting a peice
	turnCount++;
	Board.ClearPossibleMoves(); //clears the display of possible moves (square color)
	console.log("post possible moves: ", selectedPiece);
	selectedPiece = null;
	UpdateChecks();
	return true;
}

function SelectPiece (pos) {
	let piece = Board.GetPieceAtPos(pos)

	if (piece == false) return false; //no piece at provided pos on the board
	else if (piece.side == turn) { //selected piece of correct side 
		Board.ShowPossibleMoves(piece); //shows the display of possible moves (square color)
		//console.log('correct side, selected '+piece.name);
		selectedPiece = piece;
		state = G.gameStates.awaitingPlacement; //console.log('state: '+state.text);
		return true;
	}
	return false; //piece is at pos but it is not of the correct side
}

function PlacePiece (pos) {
	if (!Board.GetPieceAtPos(pos)) {
		if (selectedPiece.possibleMoves.includes(pos)) {
			console.log('valid move, placing piece')
			Board.MovePiece(selectedPiece.position, pos);
			state = G.gameStates.awaitingSelection; console.log('state: '+state.text);
			NextTurn();
			return true;
		}
		else {
			console.log('invalid move, not placing piece')
			return false;
		}
	}
	else { //already piece at proposed position
		if (selectedPiece.takingMoves.includes(pos)) {
			console.log('valid move, taking piece')
			Board.MovePiece(selectedPiece.position, pos);
			state = G.gameStates.awaitingSelection; console.log('state: '+state.text);
			NextTurn();
			return true;
		}
		else {
			if (selectedPiece == Board.GetPieceAtPos(pos)) { //same piece clicked again - deselect
				//console.log('fdjskal');
				Board.ClearPossibleMoves();
				selectedPiece = null;
				state = G.gameStates.awaitingSelection; console.log('state: '+state.text);
			}
			console.log('cant move piece, square is occupied')
			return false;
		}
	}
}

function SelectSquare (pos) {
	if (state == G.gameStates.awaitingSelection) SelectPiece(pos);
	else if (state == G.gameStates.awaitingPlacement) PlacePiece(pos);
}

function HighlightSquare(pos, hover) {
	let square = Board.GetSquareByPos(pos);
	if (square) //no square at provided pos on the board))
	{	
		//console.log("jsdkflasjdklfasjkldfsa");
		//console.log(square);
		square.SetHover(square, hover);
	}
	else return false; //no square at provided pos on the board
}

const GetTurn = () => turn;
const GetTurnCount = () => turnCount;
const GetState = () => state;
const GetSelectedPiece = () => selectedPiece;
const GetSelectedSquare = () => selectedSquare;

export { Init, GetTurn, GetTurnCount, GetState, GetChecks, NextTurn, SelectSquare, HighlightSquare, SelectPiece, GetSelectedPiece, GetSelectedSquare, RegRenderTrigger, Update }; 