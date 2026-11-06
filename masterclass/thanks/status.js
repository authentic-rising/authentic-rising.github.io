// Copy lives here so it can be reviewed without changing booking verification.
const copy = {
  missing: ['Your booking reference is missing.', 'If you have paid, please check your confirmation email or contact Steph. Opening this page alone does not confirm a booking.'],
  checking: ['Checking your booking…', 'We’re waiting for payment confirmation. This can take a moment. Please don’t make another payment.'],
  confirmed: ['Your place is confirmed!', 'Your payment has been verified and your place is registered. Access to the recording is included.'],
  waiting: ['We can’t confirm your booking just yet.', 'Payment confirmation may still be on its way. If you have paid, please don’t pay again. Check your email, try again shortly, or contact Steph.'],
  unavailable: ['We couldn’t check your booking.', 'Please try again shortly. If you have paid, please don’t pay again. You can also check your confirmation email or contact Steph.']
};
const emailCopy = {
  accepted: 'Your confirmation email has been accepted for sending. If it hasn’t arrived, check your spam or junk folder.',
  queued: 'Your confirmation email is waiting to be sent. You don’t need to make another booking.',
  attention: 'Your booking is confirmed, but the confirmation email needs attention. Please contact Steph if you haven’t received it.'
};
const title = document.querySelector('#booking-status-title');
const detail = document.querySelector('#booking-status-detail');
const email = document.querySelector('#booking-email-status');
const retry = document.querySelector('#booking-retry');
const params = new URLSearchParams(location.search);
const reference = params.get('session_id');
// Strip the bearer reference from the address bar before links are followed.
if (params.has('session_id')) {
  params.delete('session_id');
  history.replaceState(null, '', location.pathname + (params.size ? '?' + params : '') + location.hash);
}
function render(state, mailState) {
  document.querySelector('#welcome-title').textContent = state === 'confirmed' ? "You're In! Welcome to The Plum Bunch! 💜" : 'Welcome to The Plum Bunch! 💜';
  document.querySelector('#confirmed-thanks').hidden = state !== 'confirmed';
  title.textContent = copy[state][0];
  detail.textContent = copy[state][1];
  email.textContent = emailCopy[mailState] || '';
  retry.hidden = !['waiting', 'unavailable'].includes(state);
}
let running = false;
async function check() {
  if (running) return;
  if (!/^cs_(test|live)_[A-Za-z0-9_]{12,190}$/.test(reference || '')) { render('missing'); return; }
  running = true;
  render('checking');
  try {
    for (let attempt = 0; attempt < 10; attempt++) {
      const response = await fetch('https://api.authentickids.co.uk/masterclass/booking-status', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: reference }), credentials: 'omit',
        cache: 'no-store', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(8000)
      });
      if (!response.ok) throw new Error('Status unavailable');
      const result = await response.json();
      if (result.status === 'confirmed') { render('confirmed', result.emailStatus); return; }
      if (result.status !== 'awaiting-verification') throw new Error('Unexpected status');
      if (attempt < 9) await new Promise(resolve => setTimeout(resolve, 2000));
    }
    render('waiting');
  } catch { render('unavailable'); }
  finally { running = false; }
}
retry.addEventListener('click', check);
check();
