import { NavLink } from '@mantine/core';
import { Link } from 'react-router-dom';

interface SidebarLinkProps {
  label: string;
  to: string;
  icon?: React.ReactNode;
  active?: boolean;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({ label, to, icon, active }) => {
  return (
    <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
      <NavLink
        py="md"
        active={active}
        styles={{ label: { fontSize: 16 } }}
        label={label}
        icon={icon}
      />
    </Link>
  );
};
