export const ContactTab = ({ contact, isSelected, onClick }) => {
    const handleClick = () => {
        if (onClick) {
            onClick(contact);
        }
    };

    return (
        <div 
            className={`tab d-flex cursor-pointer ${isSelected ? 'bg-primary' : 'bg-secondary'}`}
            style={{ 
                height: "80px", 
                cursor: "pointer",
                borderBottom: "1px solid #dee2e6"
            }}
            onClick={handleClick}
        >
            <div
                className="profile-pic align-self-center"
                style={{
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    backgroundColor: "white",
                    margin: "10px",
                    backgroundImage: `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF5-3YjBcXTqKUlOAeUUtuOLKgQSma2wGG1g&s)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            />
            <div 
                className="username align-self-center" 
                style={{ 
                    color: "white", 
                    fontSize: "18px",
                    fontWeight: isSelected ? "bold" : "normal"
                }}
            >
                {contact.username}
            </div>
        </div>
    );
};