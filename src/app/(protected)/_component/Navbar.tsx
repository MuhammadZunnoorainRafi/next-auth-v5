'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import UserButton from './UserButton';

function Navbar() {
  const pathname = usePathname();
  return (
    <div className="bg-secondary flex items-center justify-between p-4 rounded-lg w-[600px] shadow-md">
      <div className="flex gap-x-2">
        <Button
          asChild
          variant={pathname === '/server' ? 'default' : 'outline'}
        >
          <Link href="/server">Server</Link>
        </Button>
        <Button
          asChild
          variant={pathname === '/client' ? 'default' : 'outline'}
        >
          <Link href="/client">Client</Link>
        </Button>
        <Button asChild variant={pathname === '/admin' ? 'default' : 'outline'}>
          <Link href="/admin">Admin</Link>
        </Button>
        <Button
          asChild
          variant={pathname === '/settings' ? 'default' : 'outline'}
        >
          <Link href="/settings">Setting</Link>
        </Button>
      </div>
      <div>
        <UserButton />
      </div>
    </div>
  );
}

export default Navbar;
