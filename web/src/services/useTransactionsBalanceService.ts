import { useState } from 'react';
import { Service } from '../types/Service';
import { TransactionBalance } from '../types/TransactionBalance';

const useTransactionsBalanceService = () => {
  const [service, setService] = useState<Service<TransactionBalance>>({
    status: 'init'
  });

  const getTransactionsBalance = (sellerName: string) => {
    setService({ status: 'loading' });
    return new Promise((resolve, reject) => {
        fetch('http://127.0.0.1:8000/transactions/balance?' + new URLSearchParams({
            sellerName: sellerName
         }))
        .then((response) => response.json())
        .then(response => {
          setService({ status: 'loaded', payload: response });
          resolve(response);
        })    
        .catch(error => {
            setService({ status: 'error', error });
            reject(error);
        });
    });
  };

  return {
    service,
    getTransactionsBalance,
  };
};

export default useTransactionsBalanceService;
