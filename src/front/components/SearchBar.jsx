import { useState, useEffect } from "react";

//   Steps to Create a Search Bar in React

//     Create the search bar UI.
//     Store user input.
//     Filter the data using the filter function.

export const SearchBar = () => {
    const [searchUser, setSearchUser] = useState("");

    const handleSearchUser = (e) => {
        var lowerCase = e.target.value.toLowerCase();
        setSearchUser(lowerCase);
    }

    return (
        <>
            <input value={searchUser} onChange={e => setSearchUser(e.target.value)} />
            <button onClick={handleSearchUser}>Search</button>
        </>
    )
}