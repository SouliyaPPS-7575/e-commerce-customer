import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { logoutServer } from '~/server/auth';

export const useLogout = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: logoutServer,
    onSuccess: () => {
      localStorage.removeItem('customer_id');
      navigate({ to: '/login' });
    },
  });

  const handleClose = () => {
    navigate({ to: '/' });
  };

  const handleConfirm = () => {
    mutation.mutate({});
  };

  return {
    // ✅ Event Handlers
    handleClose,
    handleConfirm,
  };
};
