
const MakePiece = (def, side, position) => { //given a definition table for a piece, returns a new piece with those properties 
	let piece = {
		notation: def.notation,
		name: def.name,
		side: side,
		position: position,
		movementRules: def.movementRules,
	}

	return piece
}

export {MakePiece}