'use client';

import { type FC, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useForm } from 'react-hook-form';
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

const schema = z.object({
  name: z
    .string({ required_error: 'Обязательное поле' })
    .min(1, { message: 'Поле должно быть заполнено' }),
  file: z.any({ required_error: 'Обязательное поле' }),
  model: z.string({ invalid_type_error: 'Обязательное поле' }).optional(),
});

type FormData = z.infer<typeof schema>;

interface CreateChatFormProps {
  className?: string;
}

export const CreateChatForm: FC<CreateChatFormProps> = (props) => {
  const { className } = props;
  const [isStandard, setIsStandard] = useState(true);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    const file = data.file[0];
    formData.append('file', file);
    formData.append('name', data.name);
    if (data.model) {
      formData.append('model', data.model);
    }

    // const response = fetch('/api/chat/create', {
    //   method: 'POST',
    //   body: formData,
    // });

    // if (!response.ok) {
    //   return;
    // }

    // const responseData = await response.json();

    // redirect(router.chat(responseData.id));

    console.log(data, formData.get('file'), formData.get('name'));
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Новый чат" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              control={form.control}
              name="name"
            />

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
            )}

            <Button disabled={!form.formState.isLoading} type="submit">
              Создать
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
