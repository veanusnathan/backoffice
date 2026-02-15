import { notifications } from '@mantine/notifications';

/**
 * Normalize domain to have https:// prefix.
 */
function normalizeDomain(domain: string): string {
  const trimmed = domain.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed.replace(/\/$/, '');
  }
  return `https://${trimmed}`.replace(/\/$/, '');
}

/**
 * One-click WordPress login: open wp-login.php in a new tab and POST credentials.
 * Redirects to /wp-admin/ after login.
 * WordPress form expects: action="{domain}/wp-login.php" method="post",
 * inputs name="log" (username), name="pwd" (password), name="redirect_to" (wp-admin).
 */
export function openWordPressLogin(domain: string, username: string, password: string): void {
  const baseUrl = normalizeDomain(domain);
  if (!baseUrl) {
    notifications.show({
      message: 'Domain is required for WordPress login.',
      color: 'red',
    });
    return;
  }
  if (!username?.trim()) {
    notifications.show({
      message: 'Username is required for WordPress login.',
      color: 'red',
    });
    return;
  }

  const loginUrl = `${baseUrl}/wp-login.php`;
  const redirectTo = `${baseUrl}/wp-admin/`;

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = loginUrl;
  form.target = '_blank';
  form.style.display = 'none';

  const logInput = document.createElement('input');
  logInput.type = 'hidden';
  logInput.name = 'log';
  logInput.value = username;
  form.appendChild(logInput);

  const pwdInput = document.createElement('input');
  pwdInput.type = 'hidden';
  pwdInput.name = 'pwd';
  pwdInput.value = password;
  form.appendChild(pwdInput);

  const redirectInput = document.createElement('input');
  redirectInput.type = 'hidden';
  redirectInput.name = 'redirect_to';
  redirectInput.value = redirectTo;
  form.appendChild(redirectInput);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}
