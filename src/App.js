import { useState } from 'react';
import * as Game from "./Game.js";
import * as G from "./Globals.js";
import { GetSquareByPos } from './GameBoard.js';

Game.Init() ? console.log("Game initialized") : console.log("Game failed to initialize");

export default function App() {
	//draw stats
	function adjustPieceDisplay(value) {
		setPieceDisplay(value)
	}
	const [pieceDisplay, setPieceDisplay] = useState('imga');
	const StateDisplay = <>
	<p key = 'piece line'>Pieces: <select key = 'pieceDisplay' 
          onChange={e => adjustPieceDisplay(e.target.value)}>
		<option value='imga'>Image</option>
		<option value='ascii'>Ascii</option>
		<option value='ascii2'>AsciiB</option>
		<option value='not'>Notation</option>
		<option value='imgb'>ImageB</option>
	</select></p>
	<p key = 'turnDisp'>Turn: {Game.GetTurnCount()+", "+Game.GetTurn().name}</p>
	<p key = 'stateDisp'>State: {Game.GetState().text}</p>
	<p key = 'selectedSquareDisp'>selectedSquare:{Game.GetSelectedSquare()}</p>
	<p key = 'selectedPieceDisp'> selectedPiece:{Game.GetSelectedPiece() ? Game.GetSelectedPiece().side.text+' '+Game.GetSelectedPiece().name:''}</p>
	<p key = 'validMovesDisp'> validMoves:{Game.GetSelectedPiece() ? Game.GetSelectedPiece().possibleMoves : ''}</p>
	<p key = 'checksDisp'> checks:{Game.GetChecks()}</p>
	</>
	let renderArray = []; //holds container and any other elements to render	
	let boardArray = [] //row elements are added to this

	//draw the board
	for (let i = 0; i < 8; i++) boardArray.push(row(i));
	function row(count) {
		let rowArray = []; // square elements are added to this
		for (let i = 0; i < 8; i++) {
			rowArray.push(square(count, i));//if odd square is dark
		}
		function square(row, col) {
			const pos = G.files[col]+(8-row); //position in notation format of row and col
			const square = GetSquareByPos(pos); //gets reference to square object on game board at this position

			//interaction handlers for squares
			function handleClick(pos) {
				console.log('-----------------------\npos: ' + pos + ' clicked');
				Game.SelectSquare(pos);
				Game.Update();
			}
			function handleHover(pos, enter) {
				//console.log(enter ? 'hover: '+pos : 'unhover: '+pos);
				Game.HighlightSquare(pos, enter);
				Game.Update();
			}
			//data used in element
			let piece = '';
			let displayData = G.pieceDisplayTypes[pieceDisplay]
			let displayType = displayData['type'];
			if (square.currentPiece)
			{
				if (displayType == 'char') piece = displayData['values'][square.currentPiece.dispID]
				else if (displayType == 'img') {
					let imageString = '/images/'+displayData['folder']+'/'+G.imageFiles[square.currentPiece.dispID]
					piece = <img key = {pos+'pieceImage'} className='pieceImg' src={imageString} />
				}
			}
			//return the element
			return (
			<button className={square.GetClass(square)} key={pos}
				onClick={ () => {handleClick(pos)} }
				onMouseEnter={() => {handleHover(pos, true)} }
				onMouseLeave={() => {handleHover(pos, false)} }>
				<p key = {pos+'piece'} className={square.currentPiece?square.currentPiece.className:''}> 
					{ piece }
				</p>   
			</button>)
		}
		let rankNotation = <button className='square' key = {'rank'+8-count} >{8-count}</button>
		return <div className='board-row' key = {'row'+ count} >{rowArray}{rankNotation}</div>;
	}
	for (let i = 1; i <= 8; i++) {
		let fileNotation = <button className='square' key = {'file'+G.files[i-1]}>{G.files[i-1]}</button>
		boardArray.push(fileNotation);
	}

	let boardContainer = <div key="boardContainer">{boardArray}</div>;
	renderArray.push(StateDisplay, boardContainer )


	//useState workaround to trigger re-renders as fn Update
	const [renderTrigger, triggerUpdate] = useState(0); //register state variable
	const Update = () => triggerUpdate(t => t + 1); //iterate using state callback
	Game.RegRenderTrigger(Update); //pass fn to game to trigger re-render from anywhere

	return <>{renderTrigger}{renderArray}</> //renderTrigger as sibling to ensure renderArray is re-rendered on an update
}