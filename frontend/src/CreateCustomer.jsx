import React from 'react'
import Form from './components/Form'

function Create() {
    return (
        <div className='bg-cyan-500 mh-screen flex-col content-center place-items-center p-5'>
            <h2 className='text-3xl font-bold'>Create Customer</h2>
            <Form />
        </div>
    )
}

export default Create