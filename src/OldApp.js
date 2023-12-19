import { useState } from 'react';

export default function Board() {
  let buts = <>
    <BoardRow pieces = "2" />
    <BoardRow pieces = "2" alt = "true" />
    <BoardRow />
    <BoardRow alt = "true" />
    <BoardRow />
    <BoardRow alt = "true" />
    <BoardRow pieces = "1" />
    <BoardRow pieces = "1" alt = "true" />
    <BoardRow coord = "number" />
  </>;
  
  return buts;
}

function BoardRow({alt, pieces, coord}) {
  if (coord != null)
  {
    return <><div className="board-row">
      <CoordAlpha />
      <CoordAlpha />
      <CoordAlpha />
      <CoordAlpha />
      <CoordAlpha />
      <CoordAlpha />
      <CoordAlpha />
      <CoordAlpha />
    </div>
    </>;
  }
  if (pieces == null)
  {
    pieces = "0";
  }
  if (alt == "true") {
    return <><div className="board-row">
      <Square side = "dark" piece = {pieces}/>
      <Square side = "light" piece = {pieces}/>
      <Square side = "dark" piece = {pieces}/>
      <Square side = "light" piece = {pieces}/>
      <Square side = "dark" piece = {pieces}/>
      <Square side = "light" piece = {pieces}/>
      <Square side = "dark" piece = {pieces}/>
      <Square side = "light" piece = {pieces}/>
      <CoordNumber />
    </div>
    </>;
  }
  return <><div className="board-row">
    <Square side = "light" piece = {pieces}/>
    <Square side = "dark" piece = {pieces}/>
    <Square side = "light" piece = {pieces}/>
    <Square side = "dark" piece = {pieces}/>
    <Square side = "light" piece = {pieces}/>
    <Square side = "dark" piece = {pieces}/>
    <Square side = "light" piece = {pieces}/>
    <Square side = "dark" piece = {pieces}/>
    <CoordNumber />
  </div>
  </>;  
}

let pickedPiece = null;

function Square({side, piece}) {
  const [value, setValue] = useState(piece);

  function handleClick() {
    console.log('clicked!');
    if (value == "1" || value == "2")
    {
      pickedPiece = value;
      setValue(prevValue => "X"); //the variable name prevValue can be anything
    }
    else
    {
      if (pickedPiece != null)
      {
        setValue(prevValue => pickedPiece);
        pickedPiece = null;
      }
    }
  }

  if (side == "light") {
    return <button className="squareLight" onClick = {handleClick}> {value} </button>;
  };
  //else
  return <button className="squareDark" onClick = {handleClick}> {value} </button>;
}



function CoordNumber() {
  const [count, setCount] = useState(8);
  setCount(count - 1);
  return <button className="squareDark">count</button>;
}

//create array to store letters of alphabet
let letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
function CoordAlpha()
{
  const [count, setCount] = useState(0);
  setCount(count++);
  return <button className="squareDark">letters[count]</button>;
}
