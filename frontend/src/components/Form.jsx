import React, { use, useEffect, useRef, useState } from 'react'
import Button from './Button'
import { XMarkIcon } from '@heroicons/react/24/solid'
import axios, { HttpStatusCode } from 'axios';
import { useNavigate } from 'react-router';

const DEFAULT_DATA = {
    name: "",
    nicNumber: "",
    dateOfBirth: "",
    mobileNumbers: [],
    addresses: [],
    familyMemberNics: []
}

const ADDRESS_DEFAULT = {
    addressLine1: "",
    addressLine2: "",
    country: 0,
    city: 0
}

function Form(props) {

    const API_URL = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();

    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [data, setData] = useState(DEFAULT_DATA);

    const [newAddress, setNewAddress] = useState(ADDRESS_DEFAULT);

    const [mobilePopUp, setMobilePopUp] = useState(false);
    const [addressPopUp, setAddressPopUp] = useState(false);
    const [familyPopUp, setFamilyPopUp] = useState(false);


    const [popUpType, setPopUpType] = useState();

    const newNumberRef = useRef();
    const mobileNumberRef = useRef();
    const countryRef = useRef();
    const familyMemberRef = useRef();
    const familyRef = useRef();

    const getCountries = async () => {
        const res = await axios.get(`${API_URL}/country`)
        setCountries(res.data);
    }

    const getCities = async () => {
        const res = await axios.get(`${API_URL}/city`)
        setCities(res.data);
    }

    const getCustomers = async () => {
        const res = await axios.get(`${API_URL}/customer`)
        setCustomers(res.data);
    }

    const getCustomer = async (id) => {
        const res = await axios.get(`${API_URL}/customer/${id}`)
        const existingCustomer = res.data;
        setData({ ...existingCustomer, familyMemberNics: existingCustomer.familyMemberNics.map(f => f.nicNumber) });
    }

    useEffect(() => {
        getCountries();
        getCities();
        getCustomers();

        if (props.customer) {
            getCustomer(props.customer)
        }
    }, [])

    const closePopUp = () => {
        setMobilePopUp(false);
    }

    const closeAddressPopUp = () => {
        setAddressPopUp(false);
    }

    const closeFamilyPopUp = () => {
        setFamilyPopUp(false);
    }

    const openMobilePopUp = () => {
        setMobilePopUp(true);
    }

    const openAddressPopUp = () => {
        setAddressPopUp(true);
    }

    const openFamilyPopUp = () => {
        setFamilyPopUp(true);
    }

    const addPhoneNumber = () => {
        const number = newNumberRef.current.value;
        if (number == "") {
            alert("Please enter a valid number")
            return;
        }
        setData((prevState) => ({ ...prevState, mobileNumbers: [...prevState.mobileNumbers, number] }))
        setMobilePopUp(false);
    }

    const addAddress = () => {

        if (newAddress.addressLine1 == "" || newAddress.addressLine2 == "" || newAddress.city == 0 || newAddress.country == 0) {
            alert("Please fill all fields for address");
            return;
        }

        const country = countries.find(c => c.id == newAddress.country);
        const addressData = { ...newAddress, country: country.name }
        setData((prevState) => ({ ...prevState, addresses: [...prevState.addresses, addressData] }))
        setNewAddress(ADDRESS_DEFAULT);
        setAddressPopUp(false);
    }

    const addFamilyMember = () => {
        const member = familyMemberRef.current.value;
        setData((prevState) => ({ ...prevState, familyMemberNics: [...prevState.familyMemberNics, member] }))
        setFamilyPopUp(false);
    }

    const removeSelectedNumber = () => {

        const numberToRemove = mobileNumberRef.current.value;

        setData((prevState) => ({ ...prevState, mobileNumbers: prevState.mobileNumbers.filter((n) => n !== numberToRemove) }))

    }

    const removeSelectedMember = () => {

        const memberToRemove = familyRef.current.value;

        setData((prevState) => ({ ...prevState, familyMemberNics: prevState.familyMemberNics.filter((n) => n !== memberToRemove) }))

    }

    const clearAddress = () => {
        setData((prevState) => ({ ...prevState, addresses: [] }))
    }

    const dataOnChange = (event) => {
        const { name, value } = event.target;

        setData(prevState => ({
            ...prevState,
            [name]: value,
        }));

        console.log(data);
    }

    const addressOnChange = (event) => {
        const { name, value } = event.target;

        setNewAddress(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    const createCustomer = async () => {

        try {
            const res = await axios.post(`${API_URL}/customer`, data);

            if (res.status == HttpStatusCode.Created) {
                alert("Customer created!")
                setData(DEFAULT_DATA);
                navigate("/");
            }
            else {
                alert("Something Went Wrong")
            }
        } catch (error) {
            console.error(error);
            alert(error.response.data.error || "Unexpected Error");
        }
    }

    const updateCustomer = async () => {

        try {
            const res = await axios.put(`${API_URL}/customer/${props.customer}`, data);

            if (res.status == HttpStatusCode.Ok) {
                alert("Customer updated!")
                setData(DEFAULT_DATA);
                navigate("/");
            }
            else {
                alert("Something Went Wrong")
            }
        } catch (error) {
            console.error(error);
            alert(error.response.data.error || "Unexpected Error");
        }
    }

    return (
        <div className='bg-cyan-500 mh-screen flex-col content-center place-items-center p-5'>
            <form className='p-10 h-full w-100 flex-col space-y-5'>
                <div>
                    <label htmlFor="name" className="block text-gray-200 text-sm font-bold mb-2">
                        Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        onChange={dataOnChange}
                        value={data.name}
                        name="name"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div>
                    <label htmlFor="nic" className="block text-gray-200 text-sm font-bold mb-2">
                        NIC:
                    </label>
                    <input
                        type="text"
                        id="nic"
                        onChange={dataOnChange}
                        value={data.nicNumber}
                        name="nicNumber"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div>
                    <label htmlFor="dob" className="block text-gray-200 text-sm font-bold mb-2">
                        Date Of Birth:
                    </label>
                    <input
                        type="date"
                        id="dob"
                        onChange={dataOnChange}
                        value={data.dateOfBirth}
                        name="dateOfBirth"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div>
                    <label htmlFor="mobile" className="block text-gray-200 text-sm font-bold mb-2">
                        Mobile:
                    </label>
                    <select
                        ref={mobileNumberRef}
                        type="text"
                        id="mobile"
                        name="mobile"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        {data.mobileNumbers.map((num, index) => (
                            <option key={index}>{num}</option>
                        ))}
                    </select>
                    <div className='flex justify-between mt-2'>
                        <Button alt type="button" onClick={removeSelectedNumber}>Remove</Button>
                        <Button alt type="button" onClick={openMobilePopUp}>Add</Button>
                    </div>
                </div>

                <div>
                    <label htmlFor="address" className="block text-gray-200 text-sm font-bold mb-2">
                        Address:
                    </label>
                    <select
                        type="text"
                        id="mobile"
                        name="mobile"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        {data.addresses.map((address, index) => (
                            <option key={index}>{address.addressLine1 + ", " + address.addressLine2 + ", " + address.city + ", " + address.country}</option>
                        ))}
                    </select>
                    <div className='flex justify-between mt-2'>
                        <Button alt type="button" onClick={clearAddress}>Clear</Button>
                        <Button alt type="button" onClick={openAddressPopUp}>Add</Button>
                    </div>
                </div>

                <div>
                    <label htmlFor="family" className="block text-gray-200 text-sm font-bold mb-2">
                        Family Members:
                    </label>
                    <select
                        ref={familyRef}
                        type="text"
                        id="mobile"
                        name="mobile"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        {data.familyMemberNics.map((nic, index) => (
                            <option key={index}>{nic}</option>
                        ))}
                    </select>
                    <div className='flex justify-between mt-2'>
                        <Button alt type="button" onClick={removeSelectedMember}>Remove</Button>
                        <Button alt type="button" onClick={openFamilyPopUp}>Add</Button>
                    </div>
                </div>
                {!props.customer ? <Button onClick={createCustomer} alt css={"w-full"} type={"button"}>Create</Button> : ""}
                {props.customer ? <Button onClick={updateCustomer} alt css={"w-full"} type={"button"}>Update</Button> : ""}
            </form>

            {mobilePopUp && (
                <div className="fixed z-10 inset-0 overflow-y-auto bg-black/75 flex items-center justify-center">
                    <div className="bg-gray-200 rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="mb-4">
                            <label htmlFor="popup-input" className="block text-gray-700 text-sm font-bold mb-2">
                                Enter Number:
                            </label>
                            <input
                                type="number"
                                ref={newNumberRef}
                                id="popup-input"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="flex justify-between">
                            <Button onClick={closePopUp}>Cancel</Button>
                            <Button onClick={addPhoneNumber}>Add</Button>
                        </div>
                    </div>
                </div>
            )}

            {familyPopUp && (
                <div className="fixed z-10 inset-0 overflow-y-auto bg-black/75 flex items-center justify-center">
                    <div className="bg-gray-200 rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="mb-4">
                            <select
                                type="text"
                                id="family"
                                ref={familyMemberRef}
                                name="mobile"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                {customers.filter(c => !data.familyMemberNics.includes(c.nicNumber)).map((customer, index) => (
                                    <option key={index} value={customer.nicNumber}>{customer.nicNumber + " - " + customer.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-between">
                            <Button onClick={closeFamilyPopUp}>Cancel</Button>
                            <Button onClick={addFamilyMember}>Add</Button>
                        </div>
                    </div>
                </div>
            )}

            {addressPopUp && (
                <div className="fixed z-10 inset-0 overflow-y-auto bg-black/75 flex items-center justify-center">
                    <div className="bg-gray-200 rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="mb-4">
                            <label htmlFor="popup-input" className="block text-gray-700 text-sm font-bold mb-2">
                                Address Line 1:
                            </label>
                            <input
                                type="text"
                                value={newAddress.addressLine1}
                                id="addressLine1"
                                onChange={addressOnChange}
                                name="addressLine1"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="popup-input" className="block text-gray-700 text-sm font-bold mb-2">
                                Address Line 2:
                            </label>
                            <input
                                type="text"
                                value={newAddress.addressLine2}
                                id="addressLine2"
                                name="addressLine2"
                                onChange={addressOnChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="popup-input" className="block text-gray-700 text-sm font-bold mb-2">
                                Country:
                            </label>
                            <select
                                id="country"
                                name="country"
                                ref={countryRef}
                                onChange={addressOnChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option key={0} value={0}>Select Country</option>
                                {countries.map((country) => (
                                    <option key={country.id} value={country.id}>{country.name}</option>
                                ))}
                            </select>
                        </div>

                        {newAddress.country ? <div className="mb-4">
                            <label htmlFor="popup-input" className="block text-gray-700 text-sm font-bold mb-2">
                                City:
                            </label>
                            <select
                                type="text"
                                id="city"
                                name="city"
                                onChange={addressOnChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option key={0} value={0}>Select City</option>
                                {cities.filter(c => c.countryId == newAddress.country).map((city) => (
                                    <option key={city.id} value={city.name}>{city.name}</option>
                                ))}
                            </select>
                        </div> : ""}

                        <div className="flex justify-between">
                            <Button onClick={closeAddressPopUp}>Cancel</Button>
                            <Button onClick={addAddress}>Add</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Form