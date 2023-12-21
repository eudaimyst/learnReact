import * as G from './Globals.js'
import * as Board from './GameBoard.js' 

const MakePiece = (def, side, position) => { //given a definition table for a piece, returns a new piece with those properties 
	const piece = {
		notation: def.notation,
		name: def.name,
		side: side,
		position: position,
		jumps: def.jumps,
		rules: def.movementRules,
		hasMoved: false,
		moves: 0, //track how many moves a piece has made this game (for fun)
	}
	//console.log(piece)
	return piece
}

function CalculateMoves(piece) {
	let possibleMoves = []; //returned list of possible moves
	let takingMoves = []; //returned list of taking moves
	let p = Board.GetXYByPos(piece.position);
	let pos = { x: parseInt(p.x), y: parseInt(p.y) }; //xy coords of piece
	let dir = piece.rules.directions; //the directions the piece can move in (e.g. [ {x: 1, y: 0}, {x: 0, y: 1} ] )
	for (let i = 0; i < dir.length; i++) //for each direction
	{
		let x = parseInt(dir[i].x), y = parseInt(dir[i].y); //proposed x/y directions per movement rules
		let pathBlocked = false; //if piecefound on checked square, then path is blocked no further moves in that direction
		for (let j = 1; j <= piece.rules.maxMoves; j++) { //for how many squares in that direction )
			let cx = (x*j)+pos.x, cy =(y*j)+pos.y;
			console.log('checking validity of pos', cx, cy)
			if (!pathBlocked) {
				let cPos = Board.GetPosByXY(cx, cy); //check coords are on board
				if (cPos) {
					let cPiece = Board.GetPieceAtPos(cPos); //check for a piece at the square
					if (cPiece) { 
						if (cPiece.side != piece.side) { //if the piece is on the opposite side
							possibleMoves.push(cPos)
							takingMoves.push(cPos) //this is a taking move
							console.log('success: adding to possible + taking moves')
						}
						//this is actually unecessary unless making custom rules for pieces, horses don't "jump" pieces they just check directly target positions
						if (!piece.jumps) pathBlocked = true; //if this piece can't jump other pieces set pathBlocked to true to stop looking in this direction
					}
					else { //square is empty
						possibleMoves.push(cPos)
						console.log('success: adding to possible moves')
					}
				}
				else console.log('ignoring: outside board')
			}
			else console.log('ignoring: blocked path');
		}
	}
	console.log(possibleMoves)
	return {possibleMoves: possibleMoves, takingMoves: takingMoves}
}


export {MakePiece, CalculateMoves}