(() => {
  'use strict';
  const forms = document.querySelectorAll('.newsletter-signup');
  const optional = document.querySelector('.newsletter-optional');
  async function initialize() {
    try {
      const response = await fetch('https://api.authentickids.co.uk/newsletter/options', { cache: 'no-store', credentials: 'omit', signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error('Unavailable');
      const options = await response.json();
      if (!options.available || !options.consentVersion || !options.consentWording) throw new Error('Unavailable');
      document.querySelectorAll('[data-newsletter-consent]').forEach(label => { label.textContent = options.consentWording; });
      if (optional) {
        optional.hidden = false;
        const checkbox = optional.querySelector('input'); checkbox.disabled = false; checkbox.dataset.consentVersion = options.consentVersion;
      }
      forms.forEach(form => {
        const button = form.querySelector('button');
        const status = form.querySelector('[role="status"]');
        form.querySelector('[name="consent"]').disabled = false; button.disabled = false;
        status.textContent = options.testMode ? 'Signup is currently being tested. Please use this form only if you have been invited to test.' : '';
        form.addEventListener('submit', async event => {
          event.preventDefault();
          if (button.disabled || !form.reportValidity()) return;
          button.disabled = true; status.textContent = 'Requesting your confirmation email…';
          try {
            const values = Object.fromEntries(new FormData(form));
            const source = new URLSearchParams(location.search).get('source') === 'booking' ? 'booking' : form.dataset.source || 'website';
            const sent = await fetch('https://api.authentickids.co.uk/newsletter/subscriptions', {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'omit',
              body: JSON.stringify({ email: values.email, name: values.name || null, consent: true, consentVersion: options.consentVersion, source }),
              signal: AbortSignal.timeout(20000)
            });
            if (!sent.ok) throw new Error('Signup failed');
            form.reset(); status.textContent = 'If confirmation is needed, please check your email and click the confirmation link. Check your spam folder too.';
          } catch { status.textContent = 'Signup could not be completed. Your details are still here; please try again shortly.'; }
          finally { button.disabled = false; }
        });
      });
    } catch {
      forms.forEach(form => { form.querySelector('[role="status"]').textContent = 'Newsletter signup is not available yet. Please try again later.'; });
    }
  }
  initialize();
})();
