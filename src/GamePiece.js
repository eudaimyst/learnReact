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
		moveCount: 0, //track how many moves a piece has made this game (for pawns and fun)
		possibleMoves: [],
		takingMoves: [],
		className: side == G.sides.white ? 'whitePiece' : 'blackPiece',
		MovePiece: function (self, from, to)
		{
			self.position = to;
			self.moveCount++;
			console.log(piece, 'moved!')
		}
	}
	piece.MovePiece
	//console.log("BASDFASFAS");
	//for each rule in the pieces piece.rules
	//console.log(piece.rules)
	if (piece.rules.maxMoves == -1) piece.rules.maxMoves = Board.GetSize() - 1;
	//console.log('setting maxMoves for '+piece.side.text+piece.name+' to '+piece.rules.maxMoves)
	//console.log(piece)
	return piece
}

function CalculateMoves(piece) {
	piece.possibleMoves = []; //clear arrays for pushing
	piece.takingMoves = []; 
	let p = Board.GetXYByPos(piece.position);
	let pos = { x: parseInt(p.x), y: parseInt(p.y) }; //xy coords of piece
	let dir = piece.rules.directions; //the directions the piece can move in (e.g. [ {x: 1, y: 0}, {x: 0, y: 1} ] )
	if (piece.rules.firstMove && piece.moveCount == 0) dir = piece.rules.firstMove; //if piece has rules for first move (pawns), use them instead
	for (let i = 0; i < dir.length; i++) {//for each direction
		let x = parseInt(dir[i].x), y = parseInt(dir[i].y); //proposed x/y directions per movement rules
		let pathBlocked = false; //if piecefound on checked square, then path is blocked no further moves in that direction
		for (let j = 1; j <= piece.rules.maxMoves; j++) { //for how many squares in that direction )
			let cx = (x*j)+pos.x, cy =(y*j)+pos.y;
			//console.log('piece: '+piece.name+' at position: '+piece.position+' checking validity of move: ', cx, cy)
			if (!pathBlocked) {
				let cPos = Board.GetPosByXY(cx, cy); //check coords are on board
				if (cPos) {
					let cPiece = Board.GetPieceAtPos(cPos); //check for a piece at the square
					if (cPiece) { 
						if (cPiece.side != piece.side) { //if the piece is on the opposite side
							if (!piece.rules.takingDirections) {//if this piece doesn't have rules about what can moves can take pieces (pawns)
								piece.possibleMoves.push(cPos)
								piece.takingMoves.push(cPos) //this is a taking move
							}
							//console.log('success: adding to possible + taking moves')
						}
						//this is actually unecessary unless making custom rules for pieces, knights don't "jump" pieces they just check directly target positions
						if (!piece.jumps) pathBlocked = true; //if this piece can't jump other pieces set pathBlocked to true to stop looking in this direction
					}
					else { //square is empty
						piece.possibleMoves.push(cPos)
						//console.log('success: adding to possible moves')
					}
				}
				//else console.log('ignoring: outside board');
			}
			//else console.log('ignoring: blocked path');
		}
	}
	if (piece.rules.takingDirections)
	{
		let dir = piece.rules.takingDirections;
		for (let i = 0; i < dir.length; i++) //check taking moves (pawns)
		{
			let x = parseInt(dir[i].x), y = parseInt(dir[i].y); //proposed x/y directions per movement rules
			let pathBlocked = false; //if piecefound on checked square, then path is blocked no further moves in that direction
			let cx = x+pos.x, cy =y+pos.y; //xy position to check
			//console.log('piece: '+piece.name+' at position: '+piece.position+' checking validity of taking move: ', cx, cy)
			let cPos = Board.GetPosByXY(cx, cy); //check coords are on board
			if (cPos) {
				let cPiece = Board.GetPieceAtPos(cPos); //check for a piece at the square
				if (cPiece) { 
					if (cPiece.side != piece.side) { //if the piece is on the opposite side
						piece.possibleMoves.push(cPos)
						piece.takingMoves.push(cPos) //this is a taking move
						//console.log('success: adding to possible + taking moves')
					}
					//else console.log('ignoring: piece on same side');
				}
				//else console.log('ignoring: no piece at position');
			}
			//else console.log('ignoring: outside board');
		}
	}
	//console.log(piece.side.text+piece.name+': '+piece.possibleMoves);
	return true
}


export {MakePiece, CalculateMoves}