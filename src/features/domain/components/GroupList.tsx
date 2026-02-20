import { useState } from 'react';
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Loader,
  Modal,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
  Group as MantineGroup,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconPencil, IconTrash } from '@tabler/icons-react';
import { useGetGroupsQuery } from '../api/useGetGroupsQuery';
import { useCreateGroupMutation } from '../api/useCreateGroupMutation';
import { useUpdateGroupMutation } from '../api/useUpdateGroupMutation';
import { useDeleteGroupMutation } from '../api/useDeleteGroupMutation';
import type { DomainGroup } from '../api/useGetGroupsQuery';

export function GroupList() {
  const { data: groups, isLoading } = useGetGroupsQuery();
  const createMutation = useCreateGroupMutation();
  const updateMutation = useUpdateGroupMutation();
  const deleteMutation = useDeleteGroupMutation();
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [selected, setSelected] = useState<DomainGroup | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setSelected(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    openCreate();
  };

  const handleOpenEdit = (group: DomainGroup) => {
    setSelected(group);
    setFormName(group.name);
    setFormDescription(group.description ?? '');
    openEdit();
  };

  const handleSaveCreate = () => {
    createMutation.mutate(
      { name: formName.trim(), description: formDescription.trim() || undefined },
      { onSuccess: closeCreate, onSettled: () => resetForm() },
    );
  };

  const handleSaveEdit = () => {
    if (!selected) return;
    const desc = formDescription.trim();
    updateMutation.mutate(
      { id: selected.id, name: formName.trim(), description: desc ? desc : null },
      { onSuccess: closeEdit, onSettled: () => resetForm() },
    );
  };

  const handleOpenDelete = (group: DomainGroup) => {
    setSelected(group);
    openDelete();
  };

  const handleConfirmDelete = () => {
    if (!selected) return;
    deleteMutation.mutate(selected.id, { onSuccess: closeDelete, onSettled: () => setSelected(null) });
  };

  return (
    <Box py="md">
      <Flex justify="space-between" align="center" mb="md">
        <Text size="lg" weight={500}>
          Domain Groups
        </Text>
        <Button leftIcon={<IconPlus size={16} />} onClick={handleOpenCreate}>
          Add Group
        </Button>
      </Flex>

      {isLoading ? (
        <Flex justify="center" py="xl">
          <Loader size="lg" />
        </Flex>
      ) : (
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th style={{ width: 120 }}></th>
            </tr>
          </thead>
          <tbody>
            {groups?.map((group) => (
              <tr key={group.id}>
                <td>{group.name}</td>
                <td>
                  <Text size="sm" color="dimmed" lineClamp={2}>
                    {group.description ?? '–'}
                  </Text>
                </td>
                <td>
                  <Flex gap="xs" wrap="nowrap" align="center">
                    <Tooltip label="Edit">
                      <ActionIcon
                        size="sm"
                        variant="subtle"
                        color="gray"
                        onClick={() => handleOpenEdit(group)}
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete">
                      <ActionIcon
                        size="sm"
                        variant="subtle"
                        color="red"
                        onClick={() => handleOpenDelete(group)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Flex>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {!isLoading && groups?.length === 0 && (
        <Text color="dimmed" ta="center" py="xl">
          No groups yet. Create one with &quot;Add Group&quot;.
        </Text>
      )}

      <Modal opened={createOpened} onClose={closeCreate} title="Add Group" centered>
        <Stack>
          <TextInput
            label="Name"
            placeholder="Group name"
            value={formName}
            onChange={(e) => setFormName(e.currentTarget.value)}
            required
          />
          <Textarea
            label="Description"
            placeholder="Optional description"
            value={formDescription}
            onChange={(e) => setFormDescription(e.currentTarget.value)}
            minRows={2}
          />
          <MantineGroup position="right" mt="md">
            <Button variant="default" onClick={closeCreate}>
              Cancel
            </Button>
            <Button onClick={handleSaveCreate} loading={createMutation.isPending} disabled={!formName.trim()}>
              Create
            </Button>
          </MantineGroup>
        </Stack>
      </Modal>

      <Modal opened={editOpened} onClose={closeEdit} title="Edit Group" centered>
        <Stack>
          <TextInput
            label="Name"
            placeholder="Group name"
            value={formName}
            onChange={(e) => setFormName(e.currentTarget.value)}
            required
          />
          <Textarea
            label="Description"
            placeholder="Optional description"
            value={formDescription}
            onChange={(e) => setFormDescription(e.currentTarget.value)}
            minRows={2}
          />
          <MantineGroup position="right" mt="md">
            <Button variant="default" onClick={closeEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} loading={updateMutation.isPending} disabled={!formName.trim()}>
              Save
            </Button>
          </MantineGroup>
        </Stack>
      </Modal>

      <Modal opened={deleteOpened} onClose={closeDelete} title="Delete Group" centered>
        <Text mb="md">
          Delete group &quot;{selected?.name}&quot;? Domains in this group will have their group unset.
        </Text>
        <MantineGroup position="right">
          <Button variant="default" onClick={closeDelete}>
            Cancel
          </Button>
          <Button color="red" onClick={handleConfirmDelete} loading={deleteMutation.isPending}>
            Delete
          </Button>
        </MantineGroup>
      </Modal>
    </Box>
  );
}
