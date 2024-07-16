'use client';
import { useForm } from 'react-hook-form';
import FormSuccess from '../FormSuccess';
import CardWrapper from './CardWrapper';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Suspense, useState, useTransition } from 'react';
import { LogSchema } from '@/lib/schema';
import FormError from '../FormError';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import * as action from '@/actions/index';

export type LogType = z.infer<typeof LogSchema>;

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlParams = new URLSearchParams(searchParams);
  const urlError = searchParams.get('error')
    ? 'Another account already exists with the same email address'
    : '';
  const [isPending, startTransition] = useTransition();
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const [successMessage, setSuccessMessage] = useState<string | undefined>('');
  const form = useForm<LogType>({
    resolver: zodResolver(LogSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    // mode: 'onSubmit',
  });
  const formSubmit = async (formData: LogType) => {
    setSuccessMessage('');
    setErrorMessage('');
    if (urlParams.has('error')) {
      urlParams.delete('error');
      router.push('/auth/login');
    }

    startTransition(() => {
      action
        .login(formData)
        .then((data) => {
          if (data?.error) {
            setErrorMessage(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccessMessage(data.success);
          }

          if (data?.twoFactor) {
            setTimeout(() => setShowTwoFactor(true), 100);
          }
        })
        .catch(() => setErrorMessage('Something went wrong'));
    });
  };

  return (
    <Suspense key={1} fallback="loading">
      <CardWrapper
        headerLable="Welcome Back"
        backButtonLable="Don't have an account?"
        backButtonHref="/auth/register"
        showSocial
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-2">
            <div>
              {showTwoFactor && (
                <FormField
                  disabled={isPending}
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!showTwoFactor && (
                <>
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
                  <FormField
                    disabled={isPending}
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="******"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <Button
              size="sm"
              variant="link"
              className="px-0 font-normal"
              asChild
            >
              <Link href="/auth/reset">Forgot password?</Link>
            </Button>
            <Button disabled={isPending} className="w-full" type="submit">
              {showTwoFactor ? 'Confirm' : 'Submit'}
            </Button>
          </form>
        </Form>
        <FormSuccess message={successMessage} />
        <FormError message={errorMessage || urlError} />
      </CardWrapper>
    </Suspense>
  );
}

export default LoginForm;
