import React, { useState } from 'react';
import NavigationBar from './navigationbar';
import StocksTable from './Stockstable';
import Portfolio from './portfolio';
import Analysis from './analysis'

export default function Landing() {
    
	const [page, setPage] = useState("StocksTable")

	return (
		<div>
		<NavigationBar setPage={setPage}/>
		<StocksTable display={page == "StocksTable"} />
		<Portfolio display={page == "Portfolio"}/>
		<Analysis display={page == "Analysis"} />
		</div>
	);
}