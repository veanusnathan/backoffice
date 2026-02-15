import { useParams } from 'react-router-dom';
import { DomainDetail } from '~/features/domain/components/DomainDetail';

export const DomainDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return <DomainDetail domainId={id} />;
};
