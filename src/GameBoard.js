
const board = {}

function MakeSquare(pos) //makes a "square" on the board at the given notation position
{
	let square = {};
	square.currentPiece = null;
	square.selected = false;
	if (startingSquares.white[pos]) {
		square.currentPiece = makePiece(startingSquares.white[pos], sides.white, pos);
	}
	else if (startingSquares.black[pos]) {
		square.currentPiece = makePiece(startingSquares.black[pos], sides.black, pos);
	}
	return square;
}

function Init() {
		
	for (let i = 0; i < 8; i++) {
		let rank = 8-i;
		for (let j = 0; j < 8; j++) {
			let file = files[j];
			let pos = file+rank;
			board[pos] = makeSquare(pos);
		}
	}
	return board
}

export { Init }