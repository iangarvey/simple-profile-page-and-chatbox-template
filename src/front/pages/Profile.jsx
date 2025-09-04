import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

    // Fetch the user data from your backend using the username from the URL.
    // Store it in state and use it for rendering.


// ...existing imports...

export const Profile = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");
    const apiUrl = `${import.meta.env.VITE_BACKEND_URL}`;

    useEffect(() => {
        const fetchUserProfile = async () => {
            const response = await fetch(
                `${apiUrl}api/profile/${username}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Failed to fetch user data");
                return;
            }
            setUserData(data.user);
        }
        fetchUserProfile();
    }, [username, apiUrl]);

    if (error) {
        return <div className="container alert alert-danger">{error}</div>;
    }

    if (!userData) {
        return <div className="container">Loading...</div>;
    }

    return (
        <div>
            <div className="page-container d-flex align-items-center justify-content-center">
                <div className="profile-container d-flex flex-column align-items-center justify-content-center border border-3 w-50">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF5-3YjBcXTqKUlOAeUUtuOLKgQSma2wGG1g&s" alt="Profile" className="rounded-full" />
                    <h1 style={{ textAlign: "center" }}>Welcome to {userData.username}'s profile!</h1>
                </div>
            </div>
        </div>
    );
}