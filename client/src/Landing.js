import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import StocksTable from './StocksTable';
import Portfolio from './Portfolio';
import { useState } from 'react'
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import Analysis from './Analysis'


const useStyles = makeStyles({
	root: {
		flexGrow: 1,
	},
});

export default function Landing() {

	const classes = useStyles();
	const [value, setValue] = useState(2);
    const [progress, setProgress] = useState(0);   
	const [updateStocksCounter, setUpdateStocksCounter] = useState(0)
	const [updating, setUpdating] = useState(false)
	const [balance, setBalance] = useState(0)

	function updateStocks() {
        fetch('http://localhost:5000/update_stocks', { method: 'GET', headers: {'Content-Type': 'application/json'}})
		setProgress(0.00001)
		setUpdating(true)
	}  

	function getUpdateProgress() {
		fetch('http://localhost:5000/get_update_progress', { method: 'GET', headers: {'Content-Type': 'application/json'}}).
		then(response => response.json())
		.then(json => {
			setProgress(json['progress'])
		})
    }    

	function getBalance(){
		fetch('http://localhost:5000/get_balance', { method: 'GET', headers: {'Content-Type': 'application/json'}})
		.then(response => response.json())
		.then(json => {
			setBalance("Balance: $" + parseFloat(json).toFixed(2))
		})
	}

	const handleChange = (event, newValue) => {
		if(newValue != value){
			setValue(newValue)
		}
		setValue(newValue);
	};	

	const searchIcon = () => (
        // data === ticker
        <IconButton onClick={()=>{
        }}>
            <SearchIcon color="primary" />
        </IconButton>
    );

	function CircularProgressWithLabel(props) {
		return (
			<Box position="relative" display="inline-flex">
			<CircularProgress variant="determinate" {...props} />
			<Box
				top={0}
				left={0}
				bottom={0}
				right={0}
				position="absolute"
				display="flex"
				alignItems="center"
				justifyContent="center"
			>
				<Typography variant="caption" component="div" color="textSecondary">{props.value}%</Typography>
			</Box>
			</Box>
		);
	}
	const UpdateStocksComponent = () => {
		let percent_done = Math.round(progress)
		if(progress == 0){
			return(
				<Tooltip title="Update stocks" placement="left" style={{display: value == 2 ? '' : 'none'}}>
					<IconButton aria-label="auto_renew" onClick={()=>{ updateStocks()}}> 
						<AutorenewIcon/>
					</IconButton>
				</Tooltip>
			)
		}
		else if(percent_done < 100){
			return(
				<CircularProgressWithLabel value={percent_done} style={{display: value == 2 ? '' : 'none'}}/>
			)
		}
		else{ //if progress == 100
			setProgress(0)
			setUpdating(false)
			setUpdateStocksCounter(updateStocksCounter+1)
		}
	}

    useEffect(() => { 
		getBalance()
		let update_progress_id = setInterval(() => {
			if(updating)
				getUpdateProgress()
			else{
				setUpdateStocksCounter(updateStocksCounter+1)
				setProgress(0)
			}
		}, 1000)
		return () => {
			clearInterval(update_progress_id);
		}
	}, [balance, updating]);   
    

	return (
		<Paper className={classes.root}>
			<Tabs value={value} onChange={handleChange} centered >
				{ searchIcon() }
				{ UpdateStocksComponent() }
				<Tab label="Search" />       
				<Tab label="Portfolio" />
				<div style={{display: value == 3 ? '' : 'none'}}><Tab label={balance} disabled/></div>
				<Tab label="Analysis" />
			</Tabs>

			<StocksTable display={value == 2} updateStocks = {updateStocksCounter}/>
			<Portfolio display={value == 3} setBalanceFunc={setBalance}/>
			{/* "balance" is consider value == 4 */}
			<Analysis display={value == 5} />

		</Paper>
	);
}