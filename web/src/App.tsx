import React, { Component } from 'react';
import './App.css';
// import CreateStarship from './components/CreateStarship';
import Transactions from './components/Transactions';
import FileUploader from './components/TransactionFileUploader';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="header">          
          <h1>Sales Manager </h1>
          <p>
            Upload and fetch your Sales data.
          </p>
        </header>
        <div className="container">
          <FileUploader />
          <Transactions />
        </div>
      </div>
    );
  }
}

export default App;


// import React, { useEffect, useState } from "react"

// function BalanceTransactionsTable({ transactions }) {
//   // const [filterText, setFilterText] = useState('');
//   // const [inStockOnly, setInStockOnly] = useState(false);

//   return (
//     <div>
//       {/* <SearchBar 
//         filterText={filterText} 
//         inStockOnly={inStockOnly} 
//         onFilterTextChange={setFilterText} 
//         onInStockOnlyChange={setInStockOnly} /> */}
//       <TransactionTable 
//         transactions={transactions} />
//     </div>
//   );
// }

// function TransactionRow({ transaction }) {
//   // const sellerName = transction.type ? transaction.type :
//   //   <span style={{ color: 'red' }}>
//   //     {transaction.type}
//   //   </span>;

//   return (
//     <tr>
//       <td>{transaction.sellerName}</td>
//       <td>{transaction.value}</td>
//     </tr>
//   );
// }

// function TransactionTable({ transactions, filterText, inStockOnly }) {
//   const rows = [];
  

//   transactions.forEach((transaction) => {
//     // if (
//     //   transaction.sellerName.toLowerCase().indexOf(
//     //     filterText.toLowerCase()
//     //   ) === -1
//     // ) {
//     //   return;
//     // }
//     // if (inStockOnly && !transaction.stocked) {
//     //   return;
//     // }
//     rows.push(
//       <TransactionRow
//         transaction={transaction}
//         key={transaction.sellerName} />
//     );
//   });

//   return (
//     <table>
//       <thead>
//         <tr>
//         <th>Transactions</th>
//         </tr>
//         <tr>
//           <th>Seller Name</th>
//           <th>Value</th>
//         </tr>
//       </thead>
//       <tbody>{rows}</tbody>
//     </table>
//   );
// }

// const App = () => {
//   const [transactions, setTransactions] = useState([])

//   const fetchTransactionData = () => {
//     fetch("http://127.0.0.1:8000/transactions")
//       .then(response => {
//         return response.json()
//       })
//       .then(data => {
//         setTransactions(data)
//       })
//   }

//   useEffect(() => {
//     fetchTransactionData()
//   }, [])

//   // return (
//   //   <div>
//   //     {transactions.length > 0 && (
//   //       <ul>
//   //         {transactions.map(transactions => (
//   //           <li key={transactions.id}>{transactions.sellersellerName}</li>
//   //         ))}
//   //       </ul>
//   //     )}
//   //   </div>
//   // );
//   return <BalanceTransactionsTable transactions={transactions} />;
// }

// export default App;