import React, { Component, Suspense } from 'react';
import './App.css';
import TransactionFileUploader from './components/TransactionFileUploader';
import NavBar from './components/NavBar';
import { Route, Routes } from 'react-router-dom';
import NoMatch from './components/Errors';
import TranscationsList from './components/TransactionsList';
import TransactionsBalance from './components/TransactionsBalance';

class App extends Component {
  // render() {
  //   return (
  //     <div className="App">
  //       <header className="header">          
  //         <h1>Sales Manager </h1>
  //         <p>
  //           Upload and fetch your Sales data.
  //         </p>
  //       </header>
  //       <div className="container">
  //         <TransactionFileUploader />
  //         <Transactions />
  //       </div>
  //     </div>
  //   );
  // }
  render() {
    return (
      <>
        <div>
        <NavBar />
        <Suspense fallback={<div className="container">Loading...</div>}>
          <Routes>
            <Route path="/" element={<TransactionFileUploader />} />
            <Route path="/transactions" element={<TranscationsList />} />
            <Route path="/balance" element={<TransactionsBalance />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>
			  </Suspense>
        </div>
      </>
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