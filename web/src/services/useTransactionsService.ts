import { useEffect, useState } from 'react';
import { Service } from '../types/Service';
import { Transaction } from '../types/Transaction';

export type ListTransactions = Transaction[];

const useTransactionService = () => {
  const [result, setResult] = useState<Service<ListTransactions>>({
    status: 'loading'
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/transactions')
      .then(response => response.json())
      .then(response => {
        setResult({ status: 'loaded', payload: response });
      })
      .catch(error => setResult({ status: 'error', error }));
  }, []);

  return result;
};

export default useTransactionService;
