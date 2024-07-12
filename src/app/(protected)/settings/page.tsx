import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import TestBtn from './testBtn';

async function SettingsPage() {
  const session = await auth();
  if (!session) redirect('/auth/login');
  return (
    <div>
      <div>{JSON.stringify(session)}</div>
      <TestBtn />
    </div>
  );
}

export default SettingsPage;
