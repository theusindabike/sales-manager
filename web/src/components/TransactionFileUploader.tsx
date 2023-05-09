import { ChangeEvent, useState } from 'react';
import useUploadTransactionsService from '../services/useUploadTransactionsService';
import Loader from './Loader';


function TransactionFileUploader() {
    const [file, setFile] = useState<File>();
    const { service, uploadTransactionsFile } = useUploadTransactionsService();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        if (!file) {
            return;
        }

        const formData = new FormData(); 
        formData.append('file', file);

        uploadTransactionsFile(formData).then(() => {
            console.info('bom dia');
        });
    };
    return (
        <div className='container'>
            <h2>Upload Page</h2>
            <p>
                <strong>Select a file:</strong>
            </p>
            <input name='file' type="file" onChange={handleFileChange}/>            
            <button onClick={handleUploadClick}>Upload</button>

            {service.status === 'loading' && (
                <div className="loader-container">
                    <Loader />
                </div>
            )}
            {service.status === 'loaded' && (
                <p>
                    <strong>Your file was uploaded. Please refresh the page.</strong>
                </p>
            )}
            {service.status === 'error' && (
                <div>
                    Somenthing went wrong. Try again later.
                </div>
            )}
        </div>
    );
};

export default TransactionFileUploader;