import React from 'react';
import useTranscationsService from '../services/useTransactionsService';
import Loader from '../components/Loader';
import { format } from 'date-fns';
import { TransactionType } from '../types/Transaction';


const TranscationsList: React.FC<{}> = () => {
  const service = useTranscationsService();
  return (
    <>
      <div className='container'>
        <h2>Transactions Page</h2>
        <div className="grid-5">
          <span>
            <strong>Type</strong>
          </span>
          <span>
            <strong>Date</strong>
          </span>
          <span>
            <strong>Product Description</strong> 
          </span>
          <span>
            <strong>Value</strong>
          </span>
          <span>
            <strong>Seller Name</strong>
          </span>
        </div>
        {service.status === 'loading' && (
          <div className="loader-container">
            <Loader />
          </div>
        )}
        {service.status === 'loaded' && service.payload.map(transaction => (            
          <div key={transaction.id} className="grid-5">
            <span>{TransactionType[transaction.type]}</span>
            <span>{format(new Date(transaction.date), 'dd-MM-yyyy hh:mm:ss')}</span>
            <span>{transaction.productDescription}</span>
            <span>{transaction.value}</span>
            <span>{transaction.sellerName}</span>
          </div>
        ))}
        {service.status === 'error' && (
          <div>Error, something went wrong.</div>
        )}
        {service.status === 'loaded' && service.payload.length === 0 && (
          <div>No transactions were found.</div>
        )}
      </div>
    </>
  );
};

export default TranscationsList;
