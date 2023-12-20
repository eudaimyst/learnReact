import { useState } from 'react';
import * as Game from "./Game.js";
import * as g from "./Globals.js";

let selectedSquare = null;
let selectedPiece = null;

const Game = {
	board: {},
	turn: sides.white,
	turnCount: 1,
	state: gameStates.awaitingSelection,
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