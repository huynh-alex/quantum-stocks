import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react'
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AssessmentIcon from '@material-ui/icons/Assessment';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import { Alert, AlertTitle } from '@material-ui/lab';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) =>({
	root: {
	},
	paper: {
        width: '100%',
		height: '100%',
        marginBottom: theme.spacing(2),
    }
}));

export default function Analysis(props) {

	const [stocks, setStocks] = useState([])
	const [autocompleteForm, setAutoCompleteForm] = useState([])
	const [budget, setBudget] = useState(1)
	const [showError, setShowError] = useState(false)
	const [stocksSelected, setStocksSelected] = useState(0)
	const [classicalOptimization, setClassicalOptimization] = useState([])
	const [quantumOptimization, setQuantumOptimization] = useState([])
	const [updatingBool, setUpdatingBool] = useState('')
	const [updatingStatus, setUpdatingStatus] = useState('')

	//valiantly tried to use a hook to store selected stocks but they kept resetting each other; potential React bug. therefore
	//am using sessionStorage to store the chosen stocks

    function fetch_stocks() {
        fetch('http://localhost:5000/fetch_stocks', { method: 'GET'})
        .then(response => response.json())
		.then(data => {
			setStocks(data['rows'])
		})
    }
	
	useEffect(() => { 
        if(props.display){     
            fetch_stocks()
        }
    }, [props.display]);   

	const removeIcon = () => (
		<IconButton style={{display: autocompleteForm.length > 1 ? '' : 'none'}} onClick={()=>{
			// console.log(autocompleteForm)
			var newForm = [...autocompleteForm]
			newForm.splice(newForm.length - 1, 1)
			// console.log(newForm)
			setAutoCompleteForm(newForm)
		}}>
			<RemoveCircleIcon color="primary" />
		</IconButton>
    );


	const slider = () => (
		<div style={{display: autocompleteForm.length >= 2 ? '' : 'none', width:'35%'}}>
			<Typography gutterBottom>
        		Number of stocks to purchase
			</Typography>
			<Slider defaultValue={1} step={1} marks min={1} max={autocompleteForm.length} valueLabelDisplay="auto" onChange={(event, value) => {console.log(value); setBudget(value)}}/>
		</div>
	)

	useEffect(() => {
		if(stocks.length != 0 && autocompleteForm.length == 0){
			let formNum = 0
			let key = "autocompleteForm".concat(formNum)
			setAutoCompleteForm((prev) => [...prev,
				<div key={key}>
				<Autocomplete
				id={key}
				options={stocks}
				getOptionLabel={(option) => option[2]}
				style={{ width: 500 }}
				onInputChange={(event, input) => {
					console.log(input)
					if(input != '')
						sessionStorage.setItem(formNum, input);
					else
						sessionStorage.removeItem(formNum)
				}}
				renderInput={(params) => <TextField {...params} label="Select stock" variant="outlined" />}
				/>
				</div>
			])
		}
	}, [stocks])

	const classes = useStyles();

	const addIcon = () => (
        // data === ticker
        <IconButton onClick={()=>{
			let formNum = autocompleteForm.length
			let key = "autocompleteForm".concat(formNum)
			setAutoCompleteForm(prev => [...prev,
				<div style={{marginTop: '15px'}} key={key}>
				<Autocomplete
				style={{marginTop: 500}}
				id={key}
				options={stocks}
				getOptionLabel={(option) => option[2]}
				style={{ width: 500 }}
				onInputChange={(event, input) => {
					sessionStorage.setItem(formNum, input);
				}}
				renderInput={(params) => <TextField {...params} label="Select stock" variant="outlined" />}
				/>
				</div>
			])
		}}>
            <AddCircleIcon color="primary" />
        </IconButton>
    );

	const analyzeButton = () => (
		<div>
			<IconButton onClick={()=>{
				setStocksSelected(Object.values(sessionStorage).length)
				if(stocksSelected != autocompleteForm.length || stocksSelected == 1){
					setShowError(true)
				}
				else{
					setShowError(false)
					let stocksSelected = []
					for(let i = 0; i < autocompleteForm.length; i++){
						stocksSelected.push(sessionStorage.getItem(i))
					}
					setUpdatingBool(true)

					var intervalLoop = setInterval( () => { 
						fetch('http://localhost:5000/get_analysis_progress', { method: 'GET'})
						.then(response => response.json())
						.then(data => {
							setUpdatingStatus(data['progress'])
						})
					}, 500);

					fetch('http://localhost:5000/analyze_stocks', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							"stocks": stocksSelected,
							"budget": budget
						})
					})
					.then(response => response.json())
					.then(data => {
						setClassicalOptimization(data['classical'])
						setQuantumOptimization(data['quantum'])
						setUpdatingBool(false)
						clearInterval(intervalLoop)
					})
				}
			}}>
				<AssessmentIcon color="primary"/>
				<div>Analyze</div>
			</IconButton>
		</div>
	)



	const updateSpinner = () => (
		<div style={{display: updatingBool ? '' : 'none'}}>
			<CircularProgress />
			<div>{updatingStatus}</div>
		</div>
	)
	const classicalOptimizationAlert = () => (
		<div style={{textAlign:"center", alignItems: "center", justify: "center"}}>
			<Alert severity="info" style={{display: classicalOptimization.length == 0 ? 'none' : ''}}>
				<AlertTitle>Classical optimization</AlertTitle>
				<div>Best stocks to buy: {classicalOptimization}</div>
			</Alert>
		</div>
	)
	const quantumOptimizationAlert = () => (
		<div style={{textAlign:"center", alignItems: "center", justify: "center"}}>
			<Alert severity="info" style={{display: quantumOptimization.length == 0 ? 'none' : '', marginTop:'15px'}}>
				<AlertTitle>Quantum optimization</AlertTitle>
				<div>Best stocks to buy: {quantumOptimization}</div>
			</Alert>
		</div>
	)
	const errorAlert = () => (
		<div>
			<Alert severity="error" style={{width:"40%", display: showError == true && stocksSelected == 0 ? '' : 'none'}}>
				<AlertTitle>Error</AlertTitle>
				<div>Please select stocks.</div>
			</Alert>
			<Alert severity="error" style={{width:"40%", display: showError == true && stocksSelected == 1 ? '' : 'none'}}>
			<AlertTitle >Error</AlertTitle>
			<div>Cannot analyze one stock.</div>
			</Alert>
		</div>
	)

	return (
			<div className={classes.root} style={{display: props.display ? '' : 'none', marginLeft: '15px'}}>
				 <Grid container spacing = {1}>
					<React.Fragment>
						<Grid item xs={6}>
							{autocompleteForm}
							{addIcon()}
							{removeIcon()}
							{slider()}
							{analyzeButton()}
							{errorAlert()}
						</Grid>
						
						<Grid xs={6} item style={{marginTop: '15px'}}>
							{updateSpinner()}
							{classicalOptimizationAlert()}
							{quantumOptimizationAlert()}
						</Grid>
					</React.Fragment>
				</Grid>
			</div>
	);
}