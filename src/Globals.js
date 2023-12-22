
const gameStates = { awaitingSelection: {text: 'awaiting selection'}, awaitingPlacement: {text: 'awaiting placement'} }
const sides = { white: {text: 'White', notation: 'w', color: 'white'}, black: {text: 'Black', notation: 'b', color: 'black'} }
const OppSide = (side) => side == G.sides.white ? G.sides.black : G.sides.white; //given a side returns the opposing side
const files = [['A'], ['B'], ['C'], ['D'], ['E'], ['F'], ['G'], ['H']];
const invFiles = {A:1, B:2, C:3, D:4, E:5, F:6, G:7, H:8};
const pieceDefinitions = {
	king: {
		notation: 'K',
		name: 'King',
		dispID: 0,
		movementRules: {
			directions: [ {x: 1, y: 0},{x: 1, y: 1},{x: 0, y: 1},{x: -1, y: 1},{x: -1, y: 0},{x: -1, y: -1},{x: 0, y: -1},{x: 1, y: -1} ],
			maxMoves: 1,
			jumps: false
		}
	},
	queen: {
		notation: 'Q',
		name: 'Queen',
		dispID: 1,
		movementRules: {
			directions: [ {x: 1, y: 0},{x: 1, y: 1},{x: 0, y: 1},{x: -1, y: 1},{x: -1, y: 0},{x: -1, y: -1},{x: 0, y: -1},{x: 1, y: -1} ],
			maxMoves: -1,
			jumps: false
		}
	},
	bishop: {
		notation: 'B',
		name: 'Bishop',
		dispID: 3,
		movementRules: {
			directions: [ {x: 1, y: 1},{x: -1, y: 1},{x: -1, y: -1},{x: 1, y: -1} ],
			maxMoves: -1,
			jumps: false
		}
	},
	rook: {
		notation: 'R',
		name: 'Rook',
		dispID: 2,
		movementRules: {
			directions: [ {x: 1, y: 0},{x: -1, y: 0},{x: 0, y: 1},{x: 0, y: -1} ],
			maxMoves: -1,
			jumps: false
		}
	},
	whitePawn: {
		notation: 'P',
		name: 'Pawn',
		dispID: 5,
		movementRules: {
			directions: [ {x: 0, y: 1} ],
			firstMove: [ {x: 0, y: 1}, {x: 0, y: 2} ], //for pawns that can move 2 squares on their first move
			takingDirections: [ {x: 1, y: 1}, {x: -1, y: 1} ],
			maxMoves: 1,
			jumps: false
		}
	},
	blackPawn: {
		notation: 'P',
		name: 'Pawn',
		dispID: 5,
		movementRules: {
			directions: [ {x: 0, y: -1} ],
			firstMove: [ {x: 0, y: -1}, {x: 0, y: -2} ], //for pawns that can move 2 squares on their first move
			takingDirections: [ {x: 1, y: -1}, {x: -1, y: -1} ],
			maxMoves: 1,
			jumps: false
		}
	},
	knight: {
		notation: 'N',
		name: 'Knight',
		dispID: 4,
		movementRules: {
			directions: [ {x: 1, y: 2}, {x: 2, y: 1}, {x: 2, y: -1}, {x: 1, y: -2}, {x: -1, y: -2}, {x: -2, y: -1}, {x: -2, y: 1}, {x: -1, y: 2} ],
			maxMoves: 1,
			jumps: true
		}
	}
}

const imageFiles = ['bK.png', 'bQ.png', 'bR.png', 'bB.png', 'bN.png', 'bP.png', 'wK.png', 'wQ.png', 'wR.png', 'wB.png', 'wN.png', 'wP.png']
const pieceDisplayTypes = {
	not: { type: 'char', values : [ 'bK', 'bQ', 'bR', 'bB', 'bN', 'bP', 'wK', 'wQ', 'wR', 'wB', 'wN', 'wP' ] }, 
	ascii: { type: 'char', values : [ '♔', '♕', '♖', '♗', '♘', '♙', '♚', '♛', '♜', '♝', '♞', '♟︎'] }, 
	imga: { type: 'img', folder: 'pieceA' },
	imgb: { type: 'img', folder: 'pieceB' },
}


export { gameStates, sides, pieceDefinitions, files, invFiles, OppSide, pieceDisplayTypes, imageFiles }