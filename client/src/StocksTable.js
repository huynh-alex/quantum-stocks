import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import { useState, useEffect } from 'react'
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        marginTop: '25px'
    },
    paper: {
        width: '100%',
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

export default function StocksTable(props) {
    const classes = useStyles();
    const [orderDirection, setOrderDirection] = React.useState('asc');
    const [orderVariable, setOrderVariable] = React.useState('no.');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [data, setData] = useState([]);   

    function handleRequestSort(variable){
        const isAsc = (orderVariable === variable) && (orderDirection === 'asc');
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderVariable(variable);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const headCells = [
        { id: 'No.', numeric: true, disablePadding: false, label: 'No.' },
        { id: 'Ticker', numeric: false, disablePadding: false, label: 'Ticker' },
        { id: 'Company', numeric: false, disablePadding: false, label: 'Company' },
        { id: 'Sector', numeric: false, disablePadding: false, label: 'Sector' },
        { id: 'Industry', numeric: false, disablePadding: false, label: 'Industry' },
        { id: 'Country', numeric: false, disablePadding: false, label: 'Country' },
        { id: 'Market Cap', numeric: false, disablePadding: false, label: 'Market Cap' },
        { id: 'P/E', numeric: true, disablePadding: false, label: 'P/E' },
        { id: 'Price', numeric: true, disablePadding: false, label: 'Price' },
        { id: 'Change', numeric: false, disablePadding: false, label: 'Change' },
        { id: 'Volume', numeric: true, disablePadding: false, label: 'Volume' },
    ];
    
    
    function EnhancedTableHead(props) {
        const {classes, orderDirection, orderVariable, onRequestSort} = props
        function createSortHandler(variable) {
            onRequestSort(variable);
        }
    
        return (
            <TableHead>
                <TableRow>
                    {headCells.map((headCell) => (
                        
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderVariable === headCell.id ? orderDirection : false}
                        >
                            <TableSortLabel
                                active={orderVariable === headCell.id}
                                direction={orderVariable === headCell.id ? orderDirection : 'asc'}
                                onClick={() => {
                                    createSortHandler(headCell.id);
                                }}
                            >
                            
                                {headCell.label}
                                {orderVariable === headCell.id ? (
                                    <span className={classes.visuallyHidden}>
                                    {orderDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </span>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }

    const addIcon = (name, ticker, price) => (
        // data === ticker
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
        }}>
            <AddCircleIcon color="primary" />
        </IconButton>
    );

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    Array.prototype.columnSort = function(column, direction) {
        function compare(a, b) {
            function isNumeric(num){
                return !isNaN(num)
            }
            var left = (isNumeric(a[column])) ? +a[column] : a[column];
            var right = (isNumeric(b[column])) ? +b[column] : b[column];

            if (left < right)
                return -1 * direction;
            if (left > right) 
                return 1 * direction;
            return 0;
        }
        this.sort(compare);
    }

    function sortTable(array, orderVariable, orderDirection) {
        let direction = (orderDirection === 'asc') ? 1 : -1
        switch(orderVariable){
            case 'No.':
                array.columnSort(0, direction)
                break;
            case 'Ticker':
                array.columnSort(1, direction)
                break;
            case 'Company':
                array.columnSort(2, direction)
                break;
            case 'Sector':
                array.columnSort(3, direction)
                break;
            case 'Industry':
                array.columnSort(4, direction)
                break;
            case 'Country':
                array.columnSort(5, direction)
                break;
            case 'Market Cap':
                array.columnSort(6, direction)
                break;
            case 'P/E':
                array.columnSort(7, direction)
                break;
            case 'Price':
                array.columnSort(8, direction)
                break;
            case 'Change':
                array.columnSort(9, direction)
                break;
            case 'Volume':
                array.columnSort(10, direction)
                break;
            default:
                break;
        }
        return array
    }
    
    
    function fetch_stocks() {
        fetch('http://localhost:5000/fetch_stocks', { method: 'GET'})
        .then(response => response.json())
        .then(data => {
            setData(data['rows'])
        })
    }
    
    useEffect(() => { 
        if(props.display){     
            fetch_stocks()
        }
    }, [props.updateStocks]);   
    
    return (
        <div className={classes.root} style={{display: props.display ? '' : 'none'}}>
            <Paper className={classes.paper}>
                <TableContainer>
                <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size="small"
                    aria-label="enhanced table"
                >
                    <EnhancedTableHead
                        classes={classes}
                        orderDirection={orderDirection}
                        orderVariable={orderVariable}
                        onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                    {
                        sortTable(data, orderVariable, orderDirection).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                            return (
                                <TableRow hover tabIndex={-1} key={row[0]}>
                                    <TableCell component="th" scope="row">{row[0]}</TableCell>
                                    <TableCell align="right">{row[1]}</TableCell>
                                    <TableCell align="right">{row[2]}</TableCell>
                                    <TableCell align="right">{row[3]}</TableCell>
                                    <TableCell align="right">{row[4]}</TableCell>
                                    <TableCell align="right">{row[5]}</TableCell>
                                    <TableCell align="right">{row[6]}</TableCell>
                                    <TableCell align="right">{row[7]}</TableCell>
                                    <TableCell align="right">{row[8]}</TableCell>
                                    <TableCell align="right" style={{backgroundColor: parseInt(row[9].substring(0, row[9].length - 1)) >= 0 ? 'lightgreen' : 'lightcoral'}}>{row[9]}</TableCell>
                                    <TableCell align="right">{row[10]}</TableCell>
                                    <TableCell> {addIcon(row[2], row[1], row[8])} </TableCell>
                                </TableRow>
                            );
                        })
                    }
                    {
                        emptyRows > 0 && (
                        <TableRow style={{ height: 33 * emptyRows }}>
                        <TableCell colSpan={6} />
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}
