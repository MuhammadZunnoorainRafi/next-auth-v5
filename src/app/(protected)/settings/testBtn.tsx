'use client';

import { signOut } from 'next-auth/react';

function TestBtn() {
  return <button onClick={() => signOut()}>logout</button>;
}

export default TestBtn;
