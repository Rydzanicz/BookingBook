import React from 'react';
import BookSearch from '../components/auth/BookSearch';
import CollectionList from '../components/collection/CollectionList';

const DashboardPage: React.FC = () => (
    <div>
      <h1>Search Books</h1>
      <BookSearch />
      <h2>My Collection</h2>
      <CollectionList />
    </div>
);

export default DashboardPage;
