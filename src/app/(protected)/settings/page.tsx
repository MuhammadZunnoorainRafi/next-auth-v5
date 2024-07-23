'use client';
import { enableTwoFA } from '@/actions/enableTwoFA';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useCurrentUser } from '@/lib/hooks';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormT = {
  button: boolean;
};

function SettingsPage() {
  const [switchValue, setSwitchValue] = useState(false);
  console.log(switchValue);
  const user = useCurrentUser();
  const { register, handleSubmit, setValue } = useForm<FormT>();
  const handleForm = async () => {
    const res = await enableTwoFA(switchValue, user!.id as string);
    if (res.error) {
      console.log(res.error);
    }
    if (res.success) {
      console.log(res.success);
    }
  };

  if (!user) redirect('/auth/login');
  return (
    <form
      onSubmit={handleSubmit(handleForm)}
      className="p-10 rounded-lg text-center bg-secondary shadow-md"
    >
      <h1>
        Hello{' '}
        <span className="font-bold font-mono text-xl p-1 rounded-lg bg-gradient-to-tr text-transparent bg-clip-text from-cyan-600 to-orange-600 ">
          {user.name}
        </span>
      </h1>
      <div className="flex items-center space-x-2">
        <button
          className={`${
            switchValue ? 'text-green-500' : 'text-red-500'
          } font-bold`}
          {...register('button')}
          id="airplane-mode"
          onClick={() => {
            setSwitchValue((prev) => !prev);
          }}
        >
          {switchValue ? 'True' : 'False'}
        </button>
        <Label htmlFor="airplane-mode">Enable 2FA Mode</Label>
      </div>
    </form>
  );
}

export default SettingsPage;
