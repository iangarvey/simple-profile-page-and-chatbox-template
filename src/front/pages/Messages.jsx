import { useState, useEffect } from "react";
import { ContactTab } from "../components/ContactTab";

export const Messages = () => {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const apiUrl = `${import.meta.env.VITE_BACKEND_URL}`;

    useEffect(() => {
        const fetchContacts = async () => {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${apiUrl}api/contacts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Failed to fetch contacts');
                setLoading(false);
                return;
            }
            
            setContacts(data.contacts);
            
            // If there are contacts, select the first one by default
            if (data.contacts.length > 0) {
                setSelectedContact(data.contacts[0]);
            }
            
            setError(""); // Clear any previous errors
            setLoading(false);
        };

        fetchContacts();
    }, [apiUrl]);

    if (loading) {
        return <div className="container">Loading conversations...</div>;
    }

    if (error) {
        return <div className="container alert alert-danger">{error}</div>;
    }

    return (
        <div className="container row justify-content-center border border-3 m-5 p-3">
            <div className="col-4 border border-5" style={{ width: "350px", height: "500px" }}>
                <h5 className="p-2">Conversations</h5>
                <div style={{ maxHeight: "450px", overflowY: "auto" }}>
                    {contacts.length === 0 ? (
                        <div className="text-center text-muted p-3">
                            No conversations yet. Visit someone's profile to start messaging!
                        </div>
                    ) : (
                        contacts.map(contact => (
                            <ContactTab 
                                key={contact.id}
                                contact={contact}
                                isSelected={selectedContact?.id === contact.id}
                                onClick={() => setSelectedContact(contact)}
                            />
                        ))
                    )}
                </div>
            </div>
            <div className="col-4 border border-5" style={{ width: "850px", height: "500px" }}>
                {selectedContact ? (
                    <div className="p-3">
                        <h5>Chat with {selectedContact.username}</h5>
                        {/* This is where you'll add your message components later */}
                        <div className="text-muted">Message box coming soon...</div>
                    </div>
                ) : (
                    <div className="d-flex align-items-center justify-content-center h-100">
                        <div className="text-muted">Select a conversation to start messaging</div>
                    </div>
                )}
            </div>
        </div>
    );
};