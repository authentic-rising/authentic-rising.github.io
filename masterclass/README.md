# Masterclass preview

Static review pages: `/masterclass/` and `/masterclass/thanks/`. Shared branding comes from the main site; page-specific styling is in `masterclass.css`. Neither page takes payments or sends email. Both are excluded from search indexing while in review. The main site's navigation has not been changed.

Before launch, replace the suggested title, introduction and themes with Steph's approved class copy. Confirmed event details: 6 February 2027 at 18:30 GMT, duration 1 hour, price £35. Confirm recording delivery timing/access period, recording participation arrangements, cancellation/refund wording and applicable privacy/terms links.

Replace the disabled booking button with the verified Stripe hosted checkout link. Remove the review banners, theme review labels and the review-only thank-you link. Remove the landing page's noindex directive only when ready for discovery; keep the thank-you page excluded from search.

The thank-you page deliberately makes no verified payment or email-sent claim. Connect server-verified booking status before adding personalised confirmation. Never display private Zoom links, attendee information or recording files in these static files. Do not trust query parameters as proof of payment.

Backend work: map the Stripe product to the live event, persist confirmed registrations and their included recording entitlement, deduplicate payment notifications, queue confirmation email and support resend. Purchases must not enrol attendees in marketing automatically. The future recording-only product should grant recording access without registering someone for the live event.
