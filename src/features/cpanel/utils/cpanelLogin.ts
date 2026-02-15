import { notifications } from '@mantine/notifications';

/**
 * One-click cPanel login: open cPanel in a new tab and POST user/pass to /login/.
 * Creates a form, submits to the cPanel base URL /login/, opens in _blank.
 * cPanel form expects: action="/login/" method="post", inputs name="user" and name="pass".
 */
export function openCpanelLogin(username: string, password: string): void {
  if (!username) return;

  const baseUrl = import.meta.env.VITE_CPANEL_BASE_URL;
  if (baseUrl == null || String(baseUrl).trim() === '') {
    notifications.show({
      message: 'VITE_CPANEL_BASE_URL is not configured. Please set it in your .env file.',
      color: 'red',
    });
    return;
  }

  const CPANEL_BASE_URL = String(baseUrl).trim();

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = `${CPANEL_BASE_URL}/login/`;
  form.target = '_blank';
  form.style.display = 'none';

  const userInput = document.createElement('input');
  userInput.type = 'hidden';
  userInput.name = 'user';
  userInput.value = username;
  form.appendChild(userInput);

  const passInput = document.createElement('input');
  passInput.type = 'hidden';
  passInput.name = 'pass';
  passInput.value = password;
  form.appendChild(passInput);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}
