'use client';

import { type FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Eye, EyeClosed } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface SingUpFormProps {
  className?: string;
}
const schema = z.object({
  username: z
    .string({ required_error: 'Обязательное поле' })
    .min(5, { message: 'Username должен быть длиной больше 5 символов' }),
  password: z
    .string({ required_error: 'Обязательное поле' })
    .min(8, { message: 'пароль должен быть длиной больше 8 символов' }),
});

type FormData = z.infer<typeof schema>;

export const SignInForm: FC<SingUpFormProps> = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Card className="w-1/4">
      <CardHeader>
        <CardTitle>Авторизация</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              control={form.control}
              name="username"
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 relative">
                      <Input
                        placeholder="пароль"
                        type={passwordVisible ? 'text' : 'password'}
                        {...field}
                      />
                      <Button
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                        type="button"
                        variant="link"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        {passwordVisible ? <EyeClosed /> : <Eye />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              control={form.control}
              name="password"
            />
            <Button type="submit">Войти</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
