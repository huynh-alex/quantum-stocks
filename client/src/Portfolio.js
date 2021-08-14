import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useState, useEffect } from 'react'

import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import TableHead from '@material-ui/core/TableHead';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: '25px'
    },
    paper: {
        marginTop: '25px',
        marginBottom: theme.spacing(2),
    },
    table: {
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

export default function Portfolio(props) {
    const classes = useStyles();

    const [pendingStocks, setPendingStocks] = useState({})
    const [purchasedStocksTotal, setPurchasedStocksTotal] = useState([])

    function fetchPendingStocks() {
        fetch('http://localhost:5000/fetch_pending_stocks', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            setPendingStocks(data['pending'])
        })    
    }

    function fetchPortfolio() {
        fetch('http://localhost:5000/fetch_portfolio', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            let non_unique_rows = data['non_unique_rows']
            let unique_rows = data['unique_rows']

            for(var key in unique_rows){
                for (let i = 0; i < non_unique_rows.length; i++){           
                    if(key == non_unique_rows[i][0]){ //if the tickers match
                        unique_rows[key][3].push(non_unique_rows[i])
                    }
                }
            }
            // unique_rows[key][3] => holds the non-unique values
            setPurchasedStocksTotal(data['unique_rows'])
        })   
    }

    const addIcon = (name, ticker, price) => (
        <IconButton onClick={()=>{
            fetch('http://localhost:5000/add_pending_stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "name": name,
                    "ticker": ticker,
                    "price": price
                })
            })
            .then(response => fetchPendingStocks())
            .then(response2 => getBalance())
        }}>
            <AddCircleIcon color="primary"/>
        </IconButton>
    );

    const subtractIcon = (name, ticker, price) => (
        // data === ticker
        <IconButton onClick={()=>{
            fetch('http://localhost:5000/subtract_pending_stock', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "name": name,
                    "ticker": ticker,
                    "price": price
                })
            })
            .then(response => fetchPendingStocks())
        }}>
            <RemoveCircleOutlineIcon color="primary" />
        </IconButton>
    );

    const buyIcon = () => (
        <IconButton onClick={()=>{
            fetch('http://localhost:5000/purchase_pending_stocks', { method: 'GET', headers: { 'Content-Type': 'application/json' }})
            .then(response => fetchPendingStocks())
            .then(response2 => fetchPortfolio())
            .then(response3 => props.setBalanceFunc())
        }}>
            <ShoppingCartIcon color="primary"></ShoppingCartIcon>
            <div>Buy</div>
        </IconButton>
    );

    const sellIcon = (ticker, date, total) => (
        <IconButton onClick={()=>{
            fetch('http://localhost:5000/sell_stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "ticker": ticker,
                    "date": date,
                    "total": total
                })
            })
            .then(response => fetchPortfolio())
            .then(response2 => props.setBalanceFunc())
        }}>
            <AttachMoneyIcon color="primary"/>
        </IconButton>
    );

    const clearAllIcon = () => (
        <IconButton style={{textAlign:"right"}} onClick={()=>{
            fetch('http://localhost:5000/clear_pending_stocks', { method: 'GET', headers: { 'Content-Type': 'application/json' }})
            .then(response => fetchPendingStocks())
        }}>
            <HighlightOffIcon color="primary"></HighlightOffIcon>
            <div>Clear</div>
        </IconButton>
    );

    const [tickerOpen, setTickerOpen] = useState({});

    useEffect(() => {      
        if(props.display == true){
            fetchPendingStocks()
            fetchPortfolio()
        }
    }, [props.display]);   


    return (
        <div className={classes.root} style={{display: props.display ? '' : 'none'}}>
            <Grid container >
            <Grid item xs={6} >
            {/* Pending stocks */}
            <Paper className={classes.paper} style={{marginRight:"25px"}}>
                <Typography className={classes.title} align="center" variant="h6" id="tableTitle" component="div">
                    Pending
                </Typography>   

                <TableContainer>
                <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size="small"
                >

                    <TableBody>
                    {
                        Object.keys(pendingStocks).map(function(key, index){
                            let ticker = key
                            let company = pendingStocks[key][0]
                            let quantity = pendingStocks[key][1]
                            let price = pendingStocks[key][2]
                            return (
                                <TableRow hover tabIndex={index} key={key}>
                                    <TableCell align="left">{ticker}</TableCell>
                                    <TableCell align="left">{company}</TableCell>
                                    <TableCell align="right">${price}</TableCell>
                                    <TableCell align="right">{quantity}</TableCell>
                                    <TableCell align="right">${(price * quantity).toFixed(2)}</TableCell>
                                    <TableCell align="center"> {addIcon(company, ticker, price)} {subtractIcon(company, ticker, price)} </TableCell>
                                </TableRow>
                            );
                        })
                    }
                    </TableBody>
                </Table>
                </TableContainer>
                <Grid justifyContent="space-between" container spacing={0}>
                    <Grid item>
                        {buyIcon()}
                    </Grid>
                    <Grid item>
                        {clearAllIcon()}
                    </Grid>
                </Grid>
            </Paper>
            </Grid>
            
            <Grid item xs={6} >
            {/* Purchased stocks */}
            <Paper className={classes.paper} style={{marginLeft:"25px"}}>
                <Typography className={classes.title} align="center" variant="h6" id="tableTitle" component="div">
                    Purchased
                </Typography>   

                <TableContainer>
                <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size="small"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell align="left"></TableCell>
                            <TableCell align="left">Ticker</TableCell>
                            <TableCell align="left">Company</TableCell>
                            <TableCell align="right">Shares</TableCell>
                            <TableCell align="right">Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {
                        Object.keys(purchasedStocksTotal).map(function(key, index){
                            let ticker = key
                            let company = purchasedStocksTotal[key][0]
                            let quantity = purchasedStocksTotal[key][1]
                            let total_price = purchasedStocksTotal[key][2].toFixed(2)

                            return (
                                <React.Fragment key={key}>
                                    {/* Unique rows */}

                                    <TableRow hover tabIndex={index} key={key}>

                                        <TableCell>
                                            <IconButton aria-label="expand row" size="small" onClick={() => {
                                                if (ticker in tickerOpen){
                                                    setTickerOpen({ticker: !tickerOpen[ticker]})
                                                }
                                                else{
                                                    let newObject = {}
                                                    newObject[ticker] = true
                                                    setTickerOpen(prevState => { return {...prevState, ...newObject}})
                                                }
                                            }}>
                                                {tickerOpen[ticker] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                            </IconButton>
                                        </TableCell>

                                        
                                        <TableCell align="left">{ticker}</TableCell>
                                        <TableCell align="left">{company}</TableCell>
                                        <TableCell align="right">{quantity}</TableCell>
                                        <TableCell align="right">${total_price}</TableCell>
                                    </TableRow>

                                    {/* Non-unique rows. */}
                                    <TableRow>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={tickerOpen[ticker]} timeout="auto" unmountOnExit>
                                                <Box margin={1}>
                                                <Typography variant="h6" gutterBottom component="div">
                                                    History
                                                </Typography>
                                                <Table size="small" aria-label="purchases">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Date</TableCell>
                                                            <TableCell>Quantity</TableCell>
                                                            <TableCell align="right">Purchased Price</TableCell>
                                                            <TableCell align="right">Current Price</TableCell>
                                                            <TableCell align="right">Purchased Total</TableCell>
                                                            <TableCell align="right">Current Total</TableCell>
                                                            <TableCell align="right">% Change</TableCell>
                                                            <TableCell align="center">Sell</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            purchasedStocksTotal[key][3].map( (non_unique, index2) => {
                                                                let date = non_unique[4]
                                                                let shares = non_unique[2]
                                                                let bought_for = non_unique[3]
                                                                let current_price = non_unique[5]
                                                                let purchased_total = (shares * bought_for).toFixed(2)
                                                                let current_total = (shares * current_price).toFixed(2)
                                                                let percent_change = (1 / (purchased_total / current_total)).toFixed(2)
                                                                return(
                                                                <TableRow key={index2}>
                                                                    <TableCell component="th" scope="row"> {date} </TableCell>
                                                                    <TableCell>{shares}</TableCell>
                                                                    <TableCell align="right">{bought_for}</TableCell>
                                                                    <TableCell align="right">{current_price}</TableCell>
                                                                    <TableCell align="right">{purchased_total}</TableCell>
                                                                    <TableCell align="right">{current_total}</TableCell>
                                                                    <TableCell align="right" style={{color: percent_change >= 0 ? "green" : "red"}}>{percent_change}%</TableCell>
                                                                    <TableCell align="center">{sellIcon(ticker, date, current_total)}</TableCell>
                                                                </TableRow>
                                                                )}
                                                            )
                                                        }
                                                    </TableBody>
                                                </Table>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            );
                        })
                    }
                    </TableBody>
                </Table>
                </TableContainer>
            </Paper>
            </Grid>
            </Grid>
       </div>
    )

}
