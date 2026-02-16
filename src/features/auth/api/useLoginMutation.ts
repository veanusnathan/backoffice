import { notifications } from '@mantine/notifications';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AuthResponse } from '../types';
import { getDisplayErrorMessage } from '~/lib/api-error';
import { useStore } from '~/stores';
import { useApiClient } from '~/providers/ApiClientProvider';
import type { LoginFormValues } from '../forms/login-schema';

export function useLoginMutation(options?: UseMutationOptions<void, Error, LoginFormValues>) {
  const { onAuthSuccess } = useStore();
  const { axios, api } = useApiClient();

  return useMutation(
    async (values: LoginFormValues) => {
      // Dev bypass: username 098 / password 098 for local development
      const isDevBypass =
        import.meta.env.DEV && values.username === '098' && values.password === '098';

      if (isDevBypass) {
        const mockUser: AuthResponse['user'] = {
          id: 'dev-098',
          username: '098',
          email: 'dev@local',
          roles: ['superuser'],
        };
        onAuthSuccess({
          accessToken: 'dev-access-token',
          refreshToken: 'dev-refresh-token',
          user: mockUser,
        });
        notifications.show({
          message: 'Logged in (dev bypass)',
          color: 'brand',
        });
        return;
      }

      const { access_token, refresh_token, user } = await api<AuthResponse>(
        axios.post('auth/login', {
          username: values.username,
          password: values.password,
        }),
      );

      onAuthSuccess({
        accessToken: access_token,
        refreshToken: refresh_token,
        user,
      });

      notifications.show({
        message: 'Successfully logged in',
        color: 'brand',
      });
    },
    {
      ...options,
      onError: (error: AxiosError<{ errors?: string[] }>, variables, context) => {
        notifications.show({
          title: 'Login failed',
          message: getDisplayErrorMessage(error),
          color: 'red',
        });
        options?.onError?.(error, variables, context);
      },
    }
  );
}
