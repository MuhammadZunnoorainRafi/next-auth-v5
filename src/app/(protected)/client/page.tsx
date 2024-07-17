'use client';
import UserInfo from '../_component/UserInfo';
import { useCurrentUser } from '@/lib/hooks';

function ServerUser() {
  const user = useCurrentUser();
  return (
    <div>
      <UserInfo label="Client Component" user={user} />
    </div>
  );
}

export default ServerUser;
