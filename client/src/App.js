import React from 'react';
import Landing from "./landing";

function App() {

	window.onunload = function() {
		sessionStorage.clear();
	}

	return (
		<div>
			<Landing/>
		</div>
	);
  }
  
export default App