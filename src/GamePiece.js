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
		dispID: def.dispID, //used to pick display from array (img, ascii, etc)
		moveCount: 0, //track how many moves a piece has made this game (for pawns and fun)
		impossibleMoves: [], //moves the piece could make but puts the king in check
		possibleMoves: [], //what moves the piece can make
		takingMoves: [], //what moves the piece can make that take other pieces
		className: side == G.sides.white ? 'whitePiece' : 'blackPiece',
		MovePiece: function (to, testing) {
			this.position = to;
			if (!testing) {
				this.moveCount++; //don't increment if move is testing for check
				console.log(this, 'moved!')
			}
			else console.log(this.side.name+this.name+' moved for testing to '+to)
		},
		AddToMoves: function (pos, taking) { //adds move to possible moves array, and taking array, calls extra checks for checking if puts king in check
			console.log('adding'+this.side.name+this.name+' to '+pos+' to possible moves');
			this.possibleMoves.push(pos)
			if (taking) {
				this.takingMoves.push(pos)
			}
		},
		CheckChecking: function() {
			if (this.possibleMoves)
				{
					for (let move of this.possibleMoves)
					{
						if (Board.MoveMakesCheck(this, this.position, move)) {
							this.impossibleMoves.push(move);
							const i = this.possibleMoves.indexOf(move);
							if (i > -1) { // only splice array when item is found
								this.possibleMoves.splice(i, 1); // 2nd parameter means remove one item only
							}
						}
					}
				}
			},
		ClearMoves: function () {
			this.impossibleMoves = []; //clear arrays for pushing
			this.possibleMoves = [];
			this.takingMoves = []; 
		}
	}
	//adds # of pieces to dispID for black side to account for all pieces
	side == G.sides.white ? piece.dispID = Object.keys(G.pieceDefinitions).length-1 + piece.dispID : piece.dispID
	//console.log("BASDFASFAS");
	//for each rule in the pieces piece.rules
	//console.log(piece.rules)
	if (piece.rules.maxMoves == -1) piece.rules.maxMoves = Board.GetSize() - 1;
	//console.log('setting maxMoves for '+piece.side.text+piece.name+' to '+piece.rules.maxMoves)
	//console.log(piece)
	return piece
}

function CalculateMoves(piece, turnSide) { //accepts a piece to calculate and the side whos turn it is
	piece.ClearMoves(); //clear arrays for pushing
	//console.log(piece.side, turnSide)
	//if (piece.side.name != turnSide.name) { console.log("calculating"+piece.side+turnSide); return true; } //if the piece is not on the side whos turn it is, return)
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
								piece.AddToMoves(cPos, true) //true as this is a taking move
							}
							//console.log('success: adding to possible + taking moves')
						}
						//this is actually unecessary unless making custom rules for pieces, knights don't "jump" pieces they just check directly target positions
						if (!piece.jumps) pathBlocked = true; //if this piece can't jump other pieces set pathBlocked to true to stop looking in this direction
					}
					else { //square is empty
						piece.AddToMoves(cPos, false) //true as this is a taking move
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
						piece.AddToMoves(cPos, true) //true as this is a taking move
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