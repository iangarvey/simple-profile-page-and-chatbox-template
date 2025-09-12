import { useState, useEffect } from "react";

export const ChatBox = ({ selectedContact }) => {
  const [user2, setUser2] = useState(null);
  const [user1, setUser1] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const apiUrl = `${import.meta.env.VITE_BACKEND_URL}`;

  // Load messages when selectedContact changes
  useEffect(() => {
    if (!selectedContact) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Use query parameter for conversation_id (matching your backend)
      const response = await fetch(
        `${apiUrl}api/get-messages?conversation_id=${selectedContact.conversation_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to fetch messages");
        setLoading(false);
        return;
      }

      setMessages(data.messages);
      setUser1(data.user_one);
      setUser2(data.user_two);
      setError("");
      setLoading(false);
    };

    fetchMessages();
  }, [selectedContact, apiUrl]);

  const sendMessage = async () => {
    if (!inputValue.trim() || !selectedContact) return;

    const token = localStorage.getItem("token");

    const response = await fetch(`${apiUrl}api/send-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        conversation_id: selectedContact.conversation_id,
        content: inputValue.trim(),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Failed to send message");
      return;
    }

    // Add the new message to the messages array
    setMessages((prev) => [...prev, data.message_data]);
    setInputValue("");
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  if (!selectedContact) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100">
        <div className="text-muted">
          Select a conversation to start messaging
        </div>
      </div>
    );
  }

  return (
    <div className="chatbox-container p-3 h-100 d-flex flex-column">
      {error && <div className="alert alert-danger">{error}</div>}

      <div
        className="chat-messages flex-grow-1 border rounded p-3 mb-3"
        style={{
          height: "350px",
          overflowY: "auto",
          minHeight: "350px",
        }}
      >
        {loading ? (
          <div className="text-center">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isUser1 = msg.user_id === user1?.id;
            const username = isUser1 ? user1.username : user2.username;
            
            return (
              <div 
                key={msg.id} 
                className={`mb-3 d-flex flex-column ${isUser1 ? 'align-items-end' : 'align-items-start'}`}
              >
                <small className="text-muted mb-1">
                  {username}
                </small>
                <div
                  className={`p-2 rounded ${
                    isUser1
                      ? "bg-primary text-white"
                      : "bg-light text-dark"
                  }`}
                  style={{ maxWidth: "70%" }}
                >
                  {msg.content}
                </div>
                <small className="text-muted mt-1">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </small>
              </div>
            );
          })
        )}
      </div>

      <div className="chat-input d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="btn btn-primary"
          onClick={sendMessage}
          disabled={!inputValue.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};