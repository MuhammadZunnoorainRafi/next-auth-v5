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
import { login } from '@/actions/auth-actions';
import { useState } from 'react';
import { LogSchema } from '@/lib/schema';
import FormError from '../FormError';

export type LogType = z.infer<typeof LogSchema>;

function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const [successMessage, setSuccessMessage] = useState<string | undefined>('');
  const form = useForm<LogType>({
    resolver: zodResolver(LogSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const formSubmit = async (formData: LogType) => {
    login(formData).then((data) => {
      setSuccessMessage(data.success);
      setErrorMessage(data.error);
    });
    // const res = await login(formData);
    // if (res?.error) {
    //   setErrorMessage(res.error);
    // } else {
    //   setSuccessMessage(res.success);
    // }
  };

  return (
    <CardWrapper
      headerLable="Welcome Back"
      backButtonLable="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-2">
          <FormField
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
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
      <FormSuccess message={successMessage} />
      <FormError message={errorMessage} />
    </CardWrapper>
  );
}

export default LoginForm;
