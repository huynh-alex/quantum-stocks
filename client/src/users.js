// const [updating, setUpdating] = useState(false)
// const [balance, setBalance] = useState(0)

// function getBalance(){
//     fetch('http://localhost:5000/get_balance', { method: 'GET', headers: {'Content-Type': 'application/json'}})
//     .then(response => response.json())
//     .then(json => {
//         setBalance("Balance: $" + parseFloat(json).toFixed(2))
//     })
// }

// useEffect(() => { 
//     getBalance()
//     let update_progress_id = setInterval(() => {
//         if(updating)
//             getUpdateProgress()
//         else{
//             setUpdateStocksCounter(updateStocksCounter+1)
//             setProgress(0)
//         }
//     }, 1000)
//     return () => {
//         clearInterval(update_progress_id);
//     }
// }, [balance, updating]);