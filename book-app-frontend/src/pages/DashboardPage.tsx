import React from 'react';
import Header from '../components/Header';
import BookSearch from '../components/BookSearch';

const DashboardPage: React.FC = () => {
    return (
        <>
            <Header/>
            <div className="vista-card">
                <section>
                    <h2 style={{color: '#fff', marginBottom: 12}}>Wyszukaj książki</h2>
                    <BookSearch/>
                </section>
            </div>
        </>
    );
};

export default DashboardPage;
