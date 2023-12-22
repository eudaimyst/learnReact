import { useState } from 'react';
import * as Game from "./Game.js";
import * as G from "./Globals.js";

Game.Init() ? console.log("Game initialized") : console.log("Game failed to initialize");

export default function App() {
	const [selectedFruit, setSelectedFruit] = useState('not');
	const StateDisplay = <>
	<p><select key = 'pieceDisplay' 
          onChange={e => setSelectedFruit(e.target.value)}>
		<option value='not'>Notation</option>
		<option value='ascii'>Ascii</option>
		<option value='imga'>ImageA</option>
		<option value='imgb'>ImageB</option>
	</select>{selectedFruit}</p>
	<p key = 'turnDisp'>Turn: {Game.GetTurnCount()+", "+Game.GetTurn().text}</p>
	<p key = 'stateDisp'>State: {Game.GetState().text}</p>
	<p key = 'selectedSquareDisp'>selectedSquare:{Game.GetSelectedSquare()}</p>
	<p key = 'selectedPieceDisp'> selectedPiece:{Game.GetSelectedPiece() ? Game.GetSelectedPiece().side.text+' '+Game.GetSelectedPiece().name:''}</p>
	<p key = 'validMovesDisp'> validMoves:{Game.GetSelectedPiece() ? Game.GetSelectedPiece().possibleMoves : ''}</p>
	</>
	let renderArray = []; //holds container and any other elements to render
	let board = []; //board elements to place in a container div
	BoardLayout().forEach((element, i) => { //calls BoardElements to build rows and squares and adds them to array
		board.push(element);
	});
	let boardContainer = <div key="boardContainer">{board}</div>;
	renderArray.push(StateDisplay, boardContainer )


	//useState workaround to trigger re-renders as fn Update
	const [renderTrigger, triggerUpdate] = useState(0); //register state variable
	const Update = () => triggerUpdate(t => t + 1); //iterate using state callback
	Game.RegRenderTrigger(Update); //pass fn to game to trigger re-render from anywhere

	return <>{renderTrigger}{renderArray}</> //renderTrigger as sibling to ensure renderArray is re-rendered on an update
}

function BoardLayout() {
	let boardArray = [] //row elements are added to this
	for (let i = 0; i < 8; i++) boardArray.push(row(i));
	function row(count) {
		let rowArray = []; // square elements are added to this
		for (let i = 0; i < 8; i++) {
			rowArray.push(square(count, i));//if odd square is dark
		}
		function square(row, col) {
			const pos = G.files[col]+(8-row); //position in notation format of row and col
			const square = Game.GetBoard().GetSquareByPos(pos);

			function handleClick(pos) {
				console.log('-----------------------\npos: ' + pos + ' clicked');
				Game.SelectSquare(pos);
				Game.Update();
			}
			function handleHover(pos, enter) {
				console.log(enter ? 'hover: '+pos : 'unhover: '+pos);
				Game.HighlightSquare(pos, enter);
				Game.Update();
			}
			return (
			<button className={square.GetClass(square)} key={pos}
				onClick={ () => {handleClick(pos)} }
				onMouseEnter={() => {handleHover(pos, true)} }
				onMouseLeave={() => {handleHover(pos, false)} }>
				<p key = {pos+'piece'} className={square.currentPiece?square.currentPiece.className:''}> 
					{square.currentPiece?square.currentPiece.notation:''}
				</p>   
			</button>)
		}
		let fileNotation = <button className='square' key = {'file'+G.files[count]}>{G.files[count]}</button>
		return <div className='board-row' key = {'row'+ count} >{rowArray}{fileNotation}</div>;
	}
	for (let i = 1; i <= 8; i++) {
		let rankNotation = <button className='square' key = {'rank'+i} >{i}</button>
		boardArray.push(rankNotation);
	}
	return boardArray;
}
