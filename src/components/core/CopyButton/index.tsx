import { useState } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface CopyButtonProps {
  value: string;
  size?: number;
}

export function CopyButton({ value, size = 16 }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value?.trim()) return;
    navigator.clipboard.writeText(value).then(
      () => {
        setCopied(true);
        notifications.show({ message: 'Copied to clipboard', color: 'green' });
        setTimeout(() => setCopied(false), 2000);
      },
      () => notifications.show({ message: 'Failed to copy', color: 'red' }),
    );
  };

  return (
    <Tooltip label={copied ? 'Copied!' : 'Copy to clipboard'}>
      <ActionIcon
        variant="subtle"
        color={copied ? 'green' : 'gray'}
        size="sm"
        onClick={handleCopy}
      >
        {copied ? <IconCheck size={size} /> : <IconCopy size={size} />}
      </ActionIcon>
    </Tooltip>
  );
}
