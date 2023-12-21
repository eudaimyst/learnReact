import { useState } from 'react';
import * as Game from "./Game.js";
import * as G from "./Globals.js";

Game.Init() ? console.log("Game initialized") : console.log("Game failed to initialize");

export default function App() {

	const turnDisp = <p key = 'turnDisp'>Turn: {Game.GetTurnCount()+", "+Game.GetTurn().text}</p>;
	const stateDisp = <p key = 'stateDisp'>State: {Game.GetState().text}</p>;
	const selectedSquareDisp = <p key = 'selectedSquareDisp'>selectedSquare:{Game.GetSelectedSquare()}</p>;
	const selectedPieceDisp = <p key = 'selectedPieceDisp'> selectedPiece:{Game.GetSelectedPiece() ? Game.GetSelectedPiece().side.text+' '+Game.GetSelectedPiece().name:''}</p>; // (if) x ?(then) y :(else) z 
	let renderArray = [];
	BoardLayout().forEach((element, i) => { //calls BoardElements to build rows and squares and adds them to array
		renderArray.push(element);
	});
	renderArray.push(turnDisp, stateDisp, selectedSquareDisp, selectedPieceDisp )


	//useState workaround to trigger re-renders as fn Update
	const [renderTrigger, triggerUpdate] = useState(0); //register state variable
	const Update = () => triggerUpdate(t => t + 1); //iterate using state callback
	Game.RegRenderTrigger(Update); //pass fn to game to trigger re-render from anywhere
	
	return <>{renderTrigger}{renderArray}</> //renderTrigger as sibling to ensure renderArray is re-rendered on an update
}

function BoardLayout() {
	let boardArray = [] //row elements are added to this
	for (let i = 0; i < 8; i++) {
		if (i % 2 === 0) boardArray.push(row(1, i));
		else boardArray.push(row(0, i));
	}
	function row(alt, count) {
		let rowArray = []; // square elements are added to this
		for (let i = 0; i < 8; i++) {
			rowArray.push(square( (i + alt) % 2 == 0 ? true : false, count, i));//if odd square is dark
		}
		function square(dark, row, col) {
			const pos = G.files[col]+(8-row); //position in notation format of row and col
			function handleClick(pos) {
				console.log('-----------------------\npos: ' + pos + ' clicked');
				Game.SelectSquare(pos);
				Game.Update();
			}
			return <button className={dark ? 'squareDark' : 'squareLight'} key={pos} onClick={ () => {handleClick(pos)} }>
				{Game.GetBoard().GetPieceAtPos(pos) ? Game.GetBoard().GetPieceAtPos(pos).notation : '' }   
			</button>;
		}
		return <div className='board-row' key = {'row'+ count} >{rowArray}</div>;
	}
	return boardArray;
}
