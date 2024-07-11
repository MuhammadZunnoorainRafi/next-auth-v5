import { auth } from '@/auth';

async function SettingsPage() {
  const test = await auth();
  return <div>{JSON.stringify(test)}</div>;
}

export default SettingsPage;
