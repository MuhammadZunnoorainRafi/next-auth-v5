'use client';

import * as action from '@/actions/index';

function LogoutButton({ children }: { children: React.ReactNode }) {
  return (
    <span onClick={() => action.logout()} className="cursor-pointer">
      {children}
    </span>
  );
}

export default LogoutButton;
