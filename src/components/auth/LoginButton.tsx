'use client';

import { useRouter } from 'next/navigation';

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: 'modal' | 'redirect';
  asChild?: boolean;
}

function LoginButton({ children, mode = 'redirect' }: LoginButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push('/auth/login');
  };

  if (mode === 'modal') {
    return <p>TODO: Implement Modal</p>;
  }
  return (
    <span onClick={handleClick} className="cursor-pointer">
      {children}
    </span>
  );
}

export default LoginButton;
