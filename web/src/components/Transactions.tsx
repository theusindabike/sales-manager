import React from 'react';
import useTranscationsService from '../services/useTransactionsService';
import Loader from './Loader';


const Transcations: React.FC<{}> = () => {
  const service = useTranscationsService();
  //const [id, setId] = React.useState('');
  console.info(service);
  return (
    <>
      <div className="grid">
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
        <div className="grid">
          <span>{transaction.type}</span>
          <span>{transaction.date}</span>
          <span>{transaction.productDescription}</span>
          <span>{transaction.value}</span>
          <span>{transaction.sellerName}</span>
        </div>
      ))}
      {service.status === 'error' && (
        <div>Error, the backend moved to the dark side.</div>
      )}
        
    </>
  );
};

export default Transcations;
