import React from 'react';
import Header from '../components/Header';
import BookSearch from '../components/BookSearch';

const DashboardPage: React.FC = () => {
    return (
        <div
            className="vista-card"
            style={{
                maxWidth: 800,
                margin: '40px auto',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 24
            }}
        >
            <Header/>
            <section>
                <h2 style={{color: '#fff', marginBottom: 12}}>Wyszukaj książki</h2>
                <BookSearch/>
            </section>
        </div>
    );
};

export default DashboardPage;
