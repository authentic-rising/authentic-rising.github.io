(() => {
  'use strict';
  const token = new URLSearchParams(location.hash.slice(1)).get('token') || '';
  // Keep the capability in memory only, never in requests for static assets.
  history.replaceState(null, '', location.pathname);
  const form = document.querySelector('form');
  const button = form.querySelector('button');
  const status = document.querySelector('[role="status"]');
  const action = document.body.dataset.action;
  if (!/^[a-f0-9]{64}$/i.test(token)) {
    status.textContent = 'This link is missing or invalid. Please open the complete link from your email.';
    button.disabled = true;
    return;
  }
  button.disabled = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    button.disabled = true;
    status.textContent = 'Please wait…';
    try {
      const response = await fetch(`https://api.authentickids.co.uk/newsletter/${action}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }), credentials: 'omit', cache: 'no-store',
        referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(15000)
      });
      if (response.status === 400 && action === 'confirm') {
        status.textContent = 'This confirmation link is invalid or expired. Please sign up again.';
        return;
      }
      if (!response.ok) throw new Error('Request failed');
      status.textContent = action === 'confirm'
        ? 'Your subscription is confirmed. Thank you for joining us.'
        : 'Your unsubscribe request has been processed.';
      form.hidden = true;
    } catch {
      status.textContent = 'We could not complete your request. Please try again.';
      button.disabled = false;
    }
  });
})();
