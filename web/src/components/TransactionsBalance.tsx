import React, { useState } from 'react';
import Loader from './Loader';
import useTransactionsBalanceService from '../services/useTransactionsBalanceService';
import { TransactionBalance } from '../types/TransactionBalance';


const TransactionsBalance: React.FC<{}> = () => {
  const initialTransactionBalanceState: TransactionBalance = {
    name: '',
    balanceAsSeller: 0,
    balanceAsAffiliate: 0
  };

  const [balance, setBalance] = useState<TransactionBalance>(
    initialTransactionBalanceState
  );

  const { service, transactionsBalance } = useTransactionsBalanceService();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setBalance(prevBalance => ({
      ...prevBalance,
      [event.target.name]: event.target.value
    }));
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    transactionsBalance(balance.name);
  };
  return (
    <>
      <div className='container'>
        <h2>Balance Page</h2>
        <form onSubmit={handleFormSubmit}>        
        <div className="">
          <label>Seller Name:</label>          
          <input
            type="text"
            name="name"
            value={balance.name}
            onChange={handleChange}
          />          
          <button type="submit">Load Balance</button>
          </div>
        </form>
        <div className="grid-3">
          <span>
            <strong>Name</strong>
          </span>
          <span>
            <strong>Balance As Seller</strong>
          </span>
          <span>
            <strong>Balance As Affiliate</strong> 
          </span>
        </div>
        {service.status === 'loading' && (
          <div className="loader-container">
            <Loader />
          </div>
        )}
        {service.status === 'loaded' && (            
          <div className="grid-3">
            <span>{service.payload.name}</span>
            <span>{service.payload.balanceAsSeller}</span>
            <span>{service.payload.balanceAsAffiliate}</span>
          </div>
        )}
        {service.status === 'error' && (
          <div>Error, something went wrong. Try again later</div>
        )}
      </div>
    </>
  );
};

export default TransactionsBalance;
