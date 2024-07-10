import LoginButton from '@/components/auth/LoginButton';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-5">
      <h1 className="font-bold text-5xl text-center">🔐 AUTH</h1>
      <p>A simple authentication service.</p>
      <LoginButton>
        <Button>Sign In</Button>
      </LoginButton>
    </div>
  );
}
