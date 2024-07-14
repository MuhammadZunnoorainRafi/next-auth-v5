'use client';
import CardWrapper from './CardWrapper';
import { BeatLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import FormSuccess from '../FormSuccess';
import FormError from '../FormError';
import * as actions from '@/actions/index';

function NewVerificationForm() {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = useCallback(() => {
    setError('');
    setSuccess('');
    if (!token) {
      setError('Token not found');
      return;
    }

    actions
      .newEmailVerification(token)
      .then((data) => {
        setError(data?.error);
        setSuccess(data.success);
      })
      .catch(() => setError('Something went wrong'));
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLable="Confirm your email"
      backButtonLable="Back to Login?"
      backButtonHref="/auth/login"
    >
      <div className="w-full flex items-center justify-center">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
}

export default NewVerificationForm;
