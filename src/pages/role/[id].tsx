import { useParams } from 'react-router-dom';
import { RoleDetail } from '~/features/role/components/RoleDetail';

export function RoleDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return <RoleDetail roleId={id} />;
}
