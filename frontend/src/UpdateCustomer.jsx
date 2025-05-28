import React from 'react'
import { useParams } from 'react-router';
import Form from './components/Form';

function ViewCustomer() {

    const { id } = useParams();

    return (
        <div className='bg-cyan-500 mh-screen flex-col content-center place-items-center p-5'>
            <h2 className='text-3xl font-bold'>View/Update Customer</h2>
            <Form customer={id} />
        </div>
    )
}

export default ViewCustomer