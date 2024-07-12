'use client';
import { Button } from '../ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { signIn } from 'next-auth/react';

function Socials() {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 border" />
        <p className="flex-0">OR</p>
        <div className="flex-1 border" />
      </div>
      <div className="flex items-center justify-center gap-2 w-full">
        <Button
          onClick={async () =>
            await signIn('google', {
              callbackUrl: '/settings',
            })
          }
          className="w-full"
          size="lg"
          variant="outline"
        >
          <FcGoogle />
        </Button>
      </div>
    </div>
  );
}

export default Socials;
