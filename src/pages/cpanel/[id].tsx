import { useParams } from 'react-router-dom';
import { CpanelDetail } from '~/features/cpanel/components/CpanelDetail';

export function CpanelDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return <CpanelDetail cpanelId={id} />;
}
