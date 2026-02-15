import { Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSetNameServersMutation } from '../api/useSetNameServersMutation';
import type { Domain } from '../types';

interface GantiNameServerFormProps {
  domain: Domain;
  onSuccess?: () => void;
}

export function GantiNameServerForm({ domain, onSuccess }: GantiNameServerFormProps) {
  const mutation = useSetNameServersMutation();

  const form = useForm({
    initialValues: {
      ns1: domain.nameServers?.[0] ?? '',
      ns2: domain.nameServers?.[1] ?? '',
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    const nameServers = [values.ns1, values.ns2].filter(Boolean);
    mutation.mutate(
      { domainId: domain.id, nameServers },
      { onSuccess: () => onSuccess?.() }
    );
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing="sm">
        <TextInput
          label="Name Server 1"
          placeholder="ns1.example.com"
          {...form.getInputProps('ns1')}
        />
        <TextInput
          label="Name Server 2"
          placeholder="ns2.example.com"
          {...form.getInputProps('ns2')}
        />
        <Button type="submit" loading={mutation.isLoading}>
          Simpan Name Server
        </Button>
      </Stack>
    </form>
  );
}
