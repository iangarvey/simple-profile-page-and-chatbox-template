import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

export const Profile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");
    const [isCreatingConversation, setIsCreatingConversation] = useState(false);
    const apiUrl = `${import.meta.env.VITE_BACKEND_URL}`;

    useEffect(() => {
        const fetchUserProfile = async () => {
            const response = await fetch(`${apiUrl}api/profile/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Failed to fetch user data');
                return;
            }
            setUserData(data.user);
            setError(""); // Clear any previous errors
        };
        
        fetchUserProfile();
    }, [username, apiUrl]);

    const handleMessageClick = async () => {
        if (!userData) return;
        
        setIsCreatingConversation(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${apiUrl}api/conversations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ contact_user_id: userData.id })
        });

        const data = await response.json();
        if (!response.ok) {
            setError(data.error || 'Failed to create conversation');
            setIsCreatingConversation(false);
            return;
        }
        
        setIsCreatingConversation(false);
        navigate('/messages');
    };

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
                    <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF5-3YjBcXTqKUlOAeUUtuOLKgQSma2wGG1g&s" 
                        alt="Profile" 
                        className="rounded-full" 
                    />
                    <h1 style={{ textAlign: "center" }}>
                        Welcome to {userData.username}'s profile!
                    </h1>
                    <button 
                        className="btn btn-primary"
                        onClick={handleMessageClick}
                        disabled={isCreatingConversation}
                    >
                        {isCreatingConversation ? 'Loading...' : `Message ${userData.username}`}
                    </button>
                </div>
            </div>
        </div>
    );
};