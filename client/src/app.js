import React from 'react';
import Landing from "./Landing";

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