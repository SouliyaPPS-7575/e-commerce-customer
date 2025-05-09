import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { LoginForm } from '~/models/auth';
import { loginServer } from '~/server/auth';

export const useLogin = () => {
  const navigate = useNavigate();

  // TanStack Query mutation for login
  const login = useMutation({
    mutationFn: loginServer,
    onSuccess: () => {
      navigate({ to: '/' });
    },
  });

  const form = useForm({
    defaultValues: {
      phone: '',
      password: '',
    } as LoginForm,
    onSubmit: async ({ value }) => {
      login.mutate({
        data: {
          ...value,
          phone: `+856${value.phone}`,
        },
      });
    },
  });
  return { form };
};
