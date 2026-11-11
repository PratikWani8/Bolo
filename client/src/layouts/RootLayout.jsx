import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ConnectivityBanner from '../components/common/ConnectivityBanner';

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-ivory text-slate-800">
      <ConnectivityBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
