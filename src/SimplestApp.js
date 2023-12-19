import { useState } from 'react';

export default function TestPage() {
	
	function inputUpdate(newValue) { //this function called when input form object updated
		console.log(newValue);
		setText(newValue); //uses state setter, triggers re-render of elements using it
	}

	const [text, setText] = useState('hello'); //var named text, setText gets called to trigger re-render
	
	const h1 = <h1>{text}</h1>;
		const input = <input type='text' id='input' //input form object
		onChange={event => inputUpdate(event.target.value)} />; //event handler generates event, value passed to inputUpdate

	const renderThese = [h1, input]; //elements to be added to render array
	let renderArray = []; //elements in here get returned to document root in index.js

	//for each object in renderThese, add them to renderArray as div element with key of index
	renderThese.forEach((element, i) => {
		renderArray.push(<div key={i}>{element} </div>);
	});

	return renderArray;
}