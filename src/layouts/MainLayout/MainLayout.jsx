// src/layouts/MainLayout/MainLayout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import styles from './MainLayout.module.css';

const MainLayout = () => {
    const location = useLocation();
    const hideNavbarRoutes = [];
    const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

    return (
        <div className={styles.container}>
            {!shouldHideNavbar && <Navbar />}
            <main className={styles.main}>
                <Outlet />
            </main>
            {!shouldHideNavbar && <Footer />}
        </div>
    );
};

export default MainLayout;
