import { Modal as MantineModal } from '@mantine/core';
import { PropsWithChildren, ReactNode } from 'react';

export const Modal: React.FC<
  PropsWithChildren<{
    opened: boolean;
    onClose: () => void;
    title: string;
    isSuccess?: boolean;
    successComponent?: ReactNode;
    withCloseButton?: boolean;
  }>
> = ({ opened, onClose, title, isSuccess, successComponent, children, withCloseButton }) => {
  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      withCloseButton={withCloseButton}
      closeOnClickOutside={false}>
      {isSuccess ? successComponent : children}
    </MantineModal>
  );
};
