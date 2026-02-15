import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextInput,
  PasswordInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from '@mantine/form';
import { useLoginMutation } from '~/features/auth/api/useLoginMutation';
import { loginSchema, type LoginFormValues } from '~/features/auth/forms/login-schema';

export const AuthRouter = () => {
  const theme = useMantineTheme();
  const loginMutation = useLoginMutation();

  const form = useForm<LoginFormValues>({
    initialValues: { username: '', password: '' },
    validate: zodResolver(loginSchema),
  });

  return (
    <Box w="100vw" h="100vh" bg={theme.colors.gray[2]}>
      <Container size="xs" py="xl">
        <Paper p="lg">
          <form
            onSubmit={form.onSubmit((values) => {
              loginMutation.mutate(values);
            })}>
            <Stack>
              <Title mb="xl" align="center">
                Sign in to Back Office
              </Title>
              <TextInput
                label="Username"
                placeholder="Enter your username"
                required
                {...form.getInputProps('username')}
              />
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                required
                {...form.getInputProps('password')}
              />
              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={loginMutation.isLoading}>
                Sign in
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};
