import * as z from 'zod';

export const jobSchema = z.object({
  title: z.string().min(3, 'Минимум 3 символа').max(100, 'Максимум 100 символов'),
  salary: z.string().regex(/^\d+$/, 'Можно вводить только цифры'),
  cityId: z.number({ required_error: 'Выберите город' }),
  phone: z.string().regex(/^\d+$/, 'Можно вводить только цифры').min(7, 'Минимум 7 цифр'),
  description: z.string().min(10, 'Минимум 10 символов').max(2000, 'Максимум 2000 символов'),
});
