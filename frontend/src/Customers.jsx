import React, { use, useEffect, useState } from 'react'
import axios, { HttpStatusCode } from 'axios';
import Button from './components/Button'
import { useNavigate } from 'react-router';

function Customers() {
    const API_URL = import.meta.env.VITE_API_URL;

    const [customers, setCustomers] = useState([]);
    const navigate = useNavigate();


    const getCustomers = async () => {
        const res = await axios.get(`${API_URL}/customer`);
        console.log(res.data);
        if (res.status == HttpStatusCode.Ok) {
            setCustomers(res.data);
        }
        else {
            alert("Something Went Wrong!")
        }

    }

    useEffect(() => {
        getCustomers();
    }, [])

    const handleViewCustomer = (id) => {
        navigate(`/${id}`)
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg">
                <thead className="bg-gray-100">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
                            NIC
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                            Date Of Birth
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider max-w-min hidden sm:table-cell">
                            Mobile Numbers
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                            Address
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((item) => (
                        <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">{item.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nicNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">{item.dateOfBirth}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-1 truncate hidden sm:table-cell">{
                                item.mobileNumbers.map((number) => (
                                    number + ", "
                                ))
                            }</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-1 truncate hidden sm:table-cell">{
                                item.addresses.map((addr) => (
                                    addr.addressLine1 + ", " + addr.addressLine2 + ", " + addr.city + ", " + addr.country + " | "
                                ))
                            }</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button onClick={() => handleViewCustomer(item.nicNumber)}>View</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Customers