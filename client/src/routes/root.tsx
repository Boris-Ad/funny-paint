import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useRootPageSockets } from '../hooks/useRootPageSockets';

const RootPage: React.FC = () => {
  useRootPageSockets()
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="h-full flex-1">
        <Outlet />
      </main>
    </>
  );
};

export default RootPage;
