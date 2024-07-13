'use client';
import CardWrapper from './CardWrapper';
import { BeatLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';

function NewVerificationForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = useCallback(() => {
    console.log(token);
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
        <BeatLoader />
      </div>
    </CardWrapper>
  );
}

export default NewVerificationForm;
