import { useNavigate } from 'react-router-dom';
import { DomainList } from '~/features/domain/components/DomainList';

export const DomainListPage: React.FC = () => {
  const navigate = useNavigate();

  const onNavigateToDetail = (domainId: string) => {
    navigate(domainId);
  };

  return <DomainList onNavigateToDetail={onNavigateToDetail} />;
};
