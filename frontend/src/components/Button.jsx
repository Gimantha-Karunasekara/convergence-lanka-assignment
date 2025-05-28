import React from 'react'

function Button(props) {
    return (
        <button onClick={props.onClick} type={props.type} className={`p-2 w-25 ${props.alt ? "bg-gray-200 text-black" : "bg-cyan-500"} rounded cursor-pointer ${props.css}`}>
            {props.children}
        </button>
    )
}

export default Button