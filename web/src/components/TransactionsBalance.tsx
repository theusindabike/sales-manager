import React from 'react';
import Loader from './Loader';
import useTransactionsBalanceService from '../services/useTransactionsBalanceService';


const TransactionsBalance: React.FC<{}> = () => {
  const { service, transactionsBalance } = useTransactionsBalanceService();
  //const [id, setId] = React.useState('');
  console.info(service);

  const handleUploadClick = () => {
    transactionsBalance('JOSE CARLOS').then(() => {
      console.info('bom dia');
    });
  };
  return (
    <>
      <div className='container'>
        <h2>Balance Page</h2>
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
