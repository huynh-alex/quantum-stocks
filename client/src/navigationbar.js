import React, {useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';

export default function NavigationBar(props) {

	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		if(newValue != value){
			setValue(newValue)
			if(newValue == 0)
				props.setPage('StocksTable')
			else if(newValue == 1)
				props.setPage('Portfolio')
			else if(newValue == 2)
				props.setPage('Analysis')
			setValue(newValue);
		}
	};	

	return (
		<Paper>
			<Tabs value={value} onChange={handleChange} centered >
				<Tab label="Search" />       
				<Tab label="Portfolio" />
				<Tab label="Analysis" />
				<Button size="small" color="primary" variant="outlined" style={{marginLeft:'auto'}}>Login</Button>
				<Button size="small" color="primary" variant="outlined">Register</Button>
			</Tabs>

		</Paper>
	);
}