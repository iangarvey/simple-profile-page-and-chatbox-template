import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";


    // On search, send a GET request to backend endpoint with the username.
    // If the user exists, redirect to /profile/:username.



export const SearchBar = () => {
    const [searchUser, setSearchUser] = useState("");
    const apiURL = `${import.meta.env.VITE_BACKEND_URL}`;
    const navigate = useNavigate();

    const handleSearchUser = async (searchUser) => {
        // e.preventDefault();
        if (!searchUser) return;
        const response = await fetch(
            `${apiURL}api/profile/${searchUser}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const data = await response.json();
        if (response.ok && data.user) {
            navigate(`/profile/${searchUser}`);
        } else {
            alert("User not found");
        }
    };

    return (
        <>
            <input value={searchUser} onChange={e => setSearchUser(e.target.value)} placeholder="Search username"></input>
            <button onClick={() => handleSearchUser(searchUser)}>Search</button>
        </>
    )
}