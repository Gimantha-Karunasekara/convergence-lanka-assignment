import axios, { HttpStatusCode } from 'axios';
import React, { useState } from 'react'
import Button from './components/Button';
import Spinner from './components/Spinner';

function DataUpload() {

    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Choose a file first");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setIsLoading(true);

        try {
            const res = await axios.post("http://localhost:8080/api/customer/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status == HttpStatusCode.Ok) {
                alert("Customers Created/Updated")
            }
        } catch (err) {
            console.error(err);
            alert(err.message);
        }

        setIsLoading(false);
    };

    return (
        <div className='bg-cyan-500 min-h-screen flex-col content-start place-items-center p-5'>
            <h2 className='text-3xl font-bold'>Upload Customer File</h2>
            <div className='m-20'>
                <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
                <Button alt onClick={handleUpload}>Upload</Button>
            </div>
            {isLoading ? <Spinner /> : ""}
        </div>
    )
}

export default DataUpload