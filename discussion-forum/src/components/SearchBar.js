import React, { useState } from 'react'

const SearchBar = ({ onSearch }) => {
    const [input, setInput] = useState("")

    const handleChange = (value) => {
        setInput(value)
        onSearch(value)
    }

    return (
        <input 
            placeholder='Search for a canteen'
            type="text"
            onChange={(e) => handleChange(e.target.value)}
            value={input}
            className="userInput h-10 w-80 ml-4 mt-4"
        />
  )
}

export default SearchBar
