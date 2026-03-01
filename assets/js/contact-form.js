/**
 * Local Vibes Restaurant - Contact form validation
 */

(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;
  var submitButton = form.querySelector('button[type="submit"]');
  var notice = document.getElementById('contact-form-notice');

  var fields = [
    { id: 'contact-name', errorId: 'contact-name-error', validate: function (v) { return v.trim().length >= 2; } },
    { id: 'contact-email', errorId: 'contact-email-error', validate: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } },
    { id: 'contact-message', errorId: 'contact-message-error', validate: function (v) { return v.trim().length >= 10; } }
  ];

  function showError(id, show) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', !show);
  }

  function setInvalid(input, invalid) {
    if (!input) return;
    input.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    input.classList.toggle('border-red-500/50', invalid);
    input.classList.toggle('border-white/10', !invalid);
  }

  function setSubmitting(isSubmitting) {
    if (!submitButton) return;
    submitButton.disabled = isSubmitting;
    submitButton.classList.toggle('opacity-70', isSubmitting);
    submitButton.textContent = isSubmitting ? 'Sending...' : 'Send message';
  }

  function clearNotice() {
    if (!notice) return;
    notice.classList.add('hidden');
    notice.classList.remove('border-emerald-500/40', 'bg-emerald-500/10', 'text-emerald-200');
    notice.classList.remove('border-red-500/40', 'bg-red-500/10', 'text-red-200');
    notice.textContent = '';
  }

  function showNotice(message, type) {
    if (!notice) return;
    clearNotice();
    notice.textContent = message;
    if (type === 'success') {
      notice.classList.add('border-emerald-500/40', 'bg-emerald-500/10', 'text-emerald-200');
    } else {
      notice.classList.add('border-red-500/40', 'bg-red-500/10', 'text-red-200');
    }
    notice.classList.remove('hidden');
  }

  function buildPayload() {
    var payload = new FormData(form);
    var emailInput = document.getElementById('contact-email');
    var nameInput = document.getElementById('contact-name');
    var messageInput = document.getElementById('contact-message');

    if (emailInput) {
      var userEmail = emailInput.value.trim();
      payload.set('_replyto', userEmail);
      payload.set('_cc', userEmail);
    }

    payload.set('_subject', 'New Contact Message - Local Vibes Restaurant');
    payload.set('_captcha', 'false');
    payload.set('_template', 'table');
    payload.set('name', nameInput ? nameInput.value.trim() : '');
    payload.set('email', emailInput ? emailInput.value.trim() : '');
    payload.set('message', messageInput ? messageInput.value.trim() : '');

    return payload;
  }

  function submitContact() {
    var receiverEmail = (form.getAttribute('data-receiver-email') || '').trim();
    if (!receiverEmail || receiverEmail === 'your-email@example.com') {
      showNotice('Contact form receiver email is not configured.', 'error');
      return;
    }

    clearNotice();
    setSubmitting(true);

    var endpoint = 'https://formsubmit.co/ajax/' + encodeURIComponent(receiverEmail);
    var payload = buildPayload();

    fetch(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: payload
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Submission failed');
        }
        return response.json();
      })
      .then(function (data) {
        var ok = data && (data.success === 'true' || data.success === true);
        if (!ok) {
          throw new Error('Unexpected response');
        }

        form.reset();
        fields.forEach(function (f) {
          showError(f.errorId, false);
          var input = document.getElementById(f.id);
          setInvalid(input, false);
        });
        showNotice('Thank you! Your message has been sent. We will get back to you soon.', 'success');
      })
      .catch(function () {
        showNotice('Unable to send your message right now. Please try again shortly.', 'error');
      })
      .finally(function () {
        setSubmitting(false);
      });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearNotice();
    var valid = true;
    fields.forEach(function (f) {
      var input = document.getElementById(f.id);
      var value = input ? input.value : '';
      var ok = f.validate(value);
      showError(f.errorId, !ok);
      setInvalid(input, !ok);
      if (!ok) valid = false;
    });
    if (valid) {
      submitContact();
    }
  });
})();
