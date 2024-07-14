'use client';
import { ResetSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FormError from '../FormError';
import FormSuccess from '../FormSuccess';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import CardWrapper from './CardWrapper';
import * as action from '@/actions/index';

export type ResetType = z.infer<typeof ResetSchema>;

function ResetForm() {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const [successMessage, setSuccessMessage] = useState<string | undefined>('');
  const form = useForm<ResetType>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const formSubmit = async (formData: ResetType) => {
    setSuccessMessage('');
    setErrorMessage('');
    startTransition(() => {
      action.resetPassword(formData).then((data) => {
        setErrorMessage(data?.error);
        setSuccessMessage(data?.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLable="Forgot your password"
      backButtonLable="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-2">
          <FormField
            disabled={isPending}
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="johndoe@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isPending} className="w-full" type="submit">
            Send reset email
          </Button>
        </form>
      </Form>
      <FormSuccess message={successMessage} />
      <FormError message={errorMessage} />
    </CardWrapper>
  );
}

export default ResetForm;
