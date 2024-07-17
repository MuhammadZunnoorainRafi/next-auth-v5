import { auth } from '@/auth';
import { redirect } from 'next/navigation';

async function SettingsPage() {
  const session = await auth();

  if (!session) redirect('/auth/login');
  return (
    <div className="p-10 rounded-lg text-center bg-secondary shadow-md">
      Hello World
    </div>
  );
}

export default SettingsPage;
