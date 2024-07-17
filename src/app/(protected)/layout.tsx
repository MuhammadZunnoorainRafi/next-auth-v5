import React from 'react';
import Navbar from './_component/Navbar';

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col gap-y-6 items-center justify-center">
      <Navbar />
      {children}
    </div>
  );
}

export default ProtectedLayout;
