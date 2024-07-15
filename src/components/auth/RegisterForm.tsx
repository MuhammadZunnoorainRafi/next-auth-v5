'use client';
import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import CardWrapper from './CardWrapper';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import FormSuccess from '../FormSuccess';
import FormError from '../FormError';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegSchema } from '@/lib/schema';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import * as action from '@/actions/index';

export type RegType = z.infer<typeof RegSchema>;

function RegisterForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error')
    ? 'Another account already exists with the same email address'
    : '';
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const form = useForm<RegType>({
    resolver: zodResolver(RegSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const formSubmit = async (formData: RegType) => {
    setSuccessMessage('');
    setErrorMessage('');
    startTransition(() => {
      action.register(formData).then((data) => {
        if (data.success) setSuccessMessage(data.success);
        if (data.error) setErrorMessage(data.error);
      });
    });
    if (successMessage) {
      form.reset();
    }
  };
  return (
    <CardWrapper
      headerLable="Welcome Back"
      backButtonLable="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="johndoe" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="johndoe@gmail.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isPending}
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="******" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isPending} className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
      <FormSuccess message={successMessage} />
      <FormError message={errorMessage || urlError} />
    </CardWrapper>
  );
}

export default RegisterForm;
