import { useCurrentUserServer } from '@/lib/auth';
import UserInfo from '../_component/UserInfo';

async function ServerUser() {
  const user = await useCurrentUserServer();
  return (
    <div>
      <UserInfo label="Server Component" user={user} />
    </div>
  );
}

export default ServerUser;
