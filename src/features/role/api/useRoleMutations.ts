import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { getDisplayErrorMessage } from '~/lib/api-error';
import { useApiClient } from '~/providers/ApiClientProvider';

interface CreatePayload {
  name: string;
}

interface UpdatePayload {
  id: number;
  name?: string;
}

export function useCreateRoleMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePayload) => {
      const { data } = await axiosWithToken.post<{ id: number; name: string }>(
        'roles',
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      notifications.show({ message: 'Role created', color: 'green' });
    },
    onError: (err) => {
      notifications.show({
        title: 'Create failed',
        message: getDisplayErrorMessage(err),
        color: 'red',
      });
    },
  });
}

export function useUpdateRoleMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdatePayload) => {
      const { data } = await axiosWithToken.patch<{ id: number; name: string }>(
        `roles/${id}`,
        payload,
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roles', variables.id] });
      notifications.show({ message: 'Role updated', color: 'green' });
    },
    onError: (err) => {
      notifications.show({
        title: 'Update failed',
        message: getDisplayErrorMessage(err),
        color: 'red',
      });
    },
  });
}

export function useDeleteRoleMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await axiosWithToken.delete(`roles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      notifications.show({ message: 'Role deleted', color: 'green' });
    },
    onError: (err) => {
      notifications.show({
        title: 'Delete failed',
        message: getDisplayErrorMessage(err),
        color: 'red',
      });
    },
  });
}
