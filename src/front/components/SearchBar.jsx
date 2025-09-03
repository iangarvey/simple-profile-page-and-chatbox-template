// 5 Steps to Create a Search Bar in React

//     Create the search bar UI.
//     Add the dummy content.
//     Map data to form the list.
//     Store user input.
//     Filter the data using the filter function.

export const SearchBar = () => {
    return (
        <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <button type="submit">Search</button>
        </div>
    );
}