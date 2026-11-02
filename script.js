// Navigation remains available if JavaScript is disabled.
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

if (header && toggle && navigation) {
  header.classList.add('menu-enabled');
  toggle.hidden = false;
  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const enquiryForm = document.querySelector('#enquiry-form');
if (enquiryForm) {
  const submit = enquiryForm.querySelector('button[type="submit"]');
  const status = document.querySelector('#enquiry-status');
  let requestId = null;
  let previousPayload = null;
  submit.disabled = false;
  enquiryForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submit.disabled || !enquiryForm.reportValidity()) return;
    const payload = JSON.stringify(Object.fromEntries(new FormData(enquiryForm)));
    if (payload !== previousPayload) {
      requestId = crypto.randomUUID();
      previousPayload = payload;
    }
    submit.disabled = true;
    status.textContent = 'Sending your enquiry…';
    try {
      const response = await fetch('https://api.authentickids.co.uk/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': requestId },
        body: payload,
        signal: AbortSignal.timeout(20000)
      });
      if (!response.ok) throw new Error('Submission failed');
      enquiryForm.reset();
      requestId = null;
      previousPayload = null;
      status.textContent = 'Thank you. Your enquiry has been received for delivery to Steph.';
    } catch {
      status.textContent = 'We could not confirm your enquiry was received. Your message is still here. Please try again, or email steph@authentickids.co.uk.';
    } finally {
      submit.disabled = false;
    }
  });
}
