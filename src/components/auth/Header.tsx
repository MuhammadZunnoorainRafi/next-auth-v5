import React from 'react';

function Header({ label }: { label: string }) {
  return (
    <div className="text-center">
      <h1 className="text-3xl ">🔐 Auth</h1>
      <p className="text-slate-700">{label}</p>
    </div>
  );
}

export default Header;
