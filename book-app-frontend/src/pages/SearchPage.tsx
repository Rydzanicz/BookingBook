// src/pages/SearchPage.tsx

import React from 'react';
import BookSearch from "../components/auth/BookSearch";

const SearchPage: React.FC = () => (
    <div>
        <h1>Wyszukiwanie książek</h1>
        <BookSearch />
    </div>
);

export default SearchPage;
