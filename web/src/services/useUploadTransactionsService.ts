import { useState } from 'react';
import { Service } from '../types/Service';

export type UploadTransactionsFile = FormData;

const useUploadTransactionsService = () => {
  const [service, setService] = useState<Service<UploadTransactionsFile>>({
    status: 'init'
  });

  const uploadTransactionsFile = (file: UploadTransactionsFile) => {
    setService({ status: 'loading' });
    return new Promise((resolve, reject) => {
      fetch('http://127.0.0.1:8000/transactions/upload', {
          method: 'POST',
          body: file,
      })
      .then((response) => response.json())
      .then(response => {
        if(response.statusCode && 
          (response.statusCode >= 300 || response.statusCode < 200)) {
          throw new Error(response.message);
        }
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
    uploadTransactionsFile,
  };
};

export default useUploadTransactionsService;
