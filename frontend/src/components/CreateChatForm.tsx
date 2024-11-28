'use client';

import { type FC, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { set, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { useRouter } from 'next/navigation';
import { router } from '@/lib/router';

const schema = z.object({
  file: z.any({ required_error: 'Обязательное поле' }),
  model: z.string({ invalid_type_error: 'Обязательное поле' }).optional(),
  apiKey: z.string({ invalid_type_error: 'Обязательное поле' }).optional(),
});

type FormData = z.infer<typeof schema>;

interface CreateChatFormProps {
  className?: string;
}

export const CreateChatForm: FC<CreateChatFormProps> = (props) => {
  const nextRouter = useRouter();
  const { className } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isStandard, setIsStandard] = useState(true);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    const file = data.file[0];
    formData.append('file', file);
    const chats = JSON.parse(localStorage.getItem('chats') ?? '[]');
    const newChat = {
      id: Date.now().toString(),
      name: file.name,
      modelType: isStandard ? 'openrouter' : 'custom',
      apiKey: data.apiKey,
      apiUrl: isStandard ? null : data.model,
    };
    localStorage.setItem('chats', JSON.stringify([...chats, newChat]));

    setIsLoading(true);
    nextRouter.push(router.chat(newChat.id));

    const response = await fetch('http://backend:8000/upload', {
      method: 'POST',
      body: formData,
    });

    console.log(response);
  };

  return (
    <Card className={cn('w-1/3', className)}>
      <CardHeader>
        <CardTitle>Создание чата</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              render={() => (
                <FormItem>
                  <FormLabel>База знаний</FormLabel>
                  <FormControl>
                    <Input
                      accept=".zip"
                      type="file"
                      onChange={(e) => form.setValue('file', e.target.files)}
                    />
                  </FormControl>
                  <FormDescription>
                    Архив с базой знаний должен включать только docx, pdf, txt файлы
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
              control={form.control}
              name="file"
            />

            <div className="flex items-center gap-1">
              <Label className="flex items-center gap-1">
                <Checkbox
                  checked={isStandard}
                  onCheckedChange={(checked) => {
                    setIsStandard(!!checked);
                  }}
                />
                Использовать стандартную языковую модель
              </Label>
            </div>

            {!isStandard && (
              <>
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ссылка на модель</FormLabel>
                      <FormControl>
                        <Input placeholder="https://openai.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  control={form.control}
                  name="model"
                />
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>api key</FormLabel>
                      <FormControl>
                        <Input placeholder="sk-or-v1-6635db51dfd..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  control={form.control}
                  name="apiKey"
                />
              </>
            )}

            <Button disabled={isLoading} type="submit">
              Создать
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
