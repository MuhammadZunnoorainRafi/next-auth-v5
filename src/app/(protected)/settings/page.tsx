import { auth } from '@/auth';
import { redirect } from 'next/navigation';

async function SettingsPage() {
  const session = await auth();
  if (!session) redirect('/auth/login');
  return <div>{JSON.stringify(session)}</div>;
}

export default SettingsPage;
