import React, { Component, Suspense } from 'react';
import './App.css';
import TransactionFileUploader from './components/TransactionFileUploader';
import NavBar from './components/NavBar';
import { Route, Routes } from 'react-router-dom';
import NoMatch from './components/Errors';
import TranscationsList from './components/TransactionsList';
import TransactionsBalance from './components/TransactionsBalance';

class App extends Component {
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