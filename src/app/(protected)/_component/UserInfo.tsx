import { Card, CardContent, CardHeader } from '@/components/ui/card';
import React from 'react';
import { ExtendUser } from '../../../../next-auth';

type Props = {
  label: string;
  user?: ExtendUser;
};

function UserInfo({ label, user }: Props) {
  return (
    <Card>
      <CardHeader className="bg-secondary text-center font-bold text-lg">
        {label}
      </CardHeader>
      <CardContent className="w-[600px] divide-y space-y-2 shadow-md rounded-lg bg-secondary">
        <div className="flex items-center justify-between">
          <h1>ID</h1>
          <h2>{user?.id}</h2>
        </div>
        <div className="flex items-center justify-between">
          <h1>Name</h1>
          <h2>{user?.name}</h2>
        </div>
        <div className="flex items-center justify-between">
          <h1>Email</h1>
          <h2>{user?.email}</h2>
        </div>
        <div className="flex items-center justify-between">
          <h1>Role</h1>
          <h2>{user?.role}</h2>
        </div>
        <div className="flex items-center justify-between">
          <h1>Two Factor</h1>
          <h2>{user?.isTwoFactorEnabled ? 'Yes' : 'No'}</h2>
        </div>
      </CardContent>
    </Card>
  );
}

export default UserInfo;
