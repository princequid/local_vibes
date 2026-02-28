/**
 * Local Vibes Restaurant - Reservation form validation & success
 */

(function () {
  'use strict';

  var form = document.getElementById('reservation-form');
  var formWrap = document.getElementById('reservation-form-wrap');
  var successEl = document.getElementById('reservation-success');
  var anotherBtn = document.getElementById('reservation-another');
  var submitErrorEl = document.getElementById('reservation-submit-error');
  var submitButton = form ? form.querySelector('button[type="submit"]') : null;
  if (!form || !formWrap || !successEl) return;

  var fields = [
    { id: 'res-name', errorId: 'res-name-error', validate: function (v) { return v.trim().length >= 2; } },
    { id: 'res-email', errorId: 'res-email-error', validate: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } },
    { id: 'res-phone', errorId: 'res-phone-error', validate: function (v) { return /^[\d\s\-\+\(\)]{10,}$/.test(v); } },
    { id: 'res-date', errorId: 'res-date-error', validate: function (v) { return v.length > 0; } },
    { id: 'res-time', errorId: 'res-time-error', validate: function (v) { return v.length > 0; } },
    { id: 'res-guests', errorId: 'res-guests-error', validate: function (v) { return v.length > 0; } }
  ];

  function showError(id, show) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', !show);
  }

  function setInvalid(input, invalid) {
    input.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    input.classList.toggle('border-red-500/50', invalid);
    input.classList.toggle('border-white/10', !invalid);
  }

  function setSubmitError(message) {
    if (!submitErrorEl) return;
    submitErrorEl.textContent = message;
    submitErrorEl.classList.remove('hidden');
  }

  function clearSubmitError() {
    if (!submitErrorEl) return;
    submitErrorEl.classList.add('hidden');
  }

  function setSubmitting(isSubmitting) {
    if (!submitButton) return;
    submitButton.disabled = isSubmitting;
    submitButton.classList.toggle('opacity-70', isSubmitting);
    submitButton.textContent = isSubmitting ? 'Submitting...' : 'Confirm reservation';
  }

  function showSuccessState() {
    formWrap.classList.add('opacity-0');
    setTimeout(function () {
      formWrap.classList.add('hidden');
      successEl.classList.remove('hidden');
      successEl.style.animation = 'none';
      successEl.offsetHeight;
      successEl.style.animation = null;
    }, 300);
  }

  function buildPayload() {
    var payload = new FormData(form);
    var emailInput = document.getElementById('res-email');
    var phoneInput = document.getElementById('res-phone');
    var dateInput = document.getElementById('res-date');
    var timeInput = document.getElementById('res-time');
    var guestsInput = document.getElementById('res-guests');
    var nameInput = document.getElementById('res-name');

    if (emailInput) {
      var customerEmail = emailInput.value.trim();
      payload.set('_replyto', customerEmail);
      payload.set('_cc', customerEmail);
    }
    payload.set('_subject', 'New Reservation Request - Local Vibes Restaurant');
    payload.set('_captcha', 'false');
    payload.set('_template', 'table');

    var reservationSummary = [
      'Name: ' + (nameInput ? nameInput.value.trim() : ''),
      'Email: ' + (emailInput ? emailInput.value.trim() : ''),
      'Phone: ' + (phoneInput ? phoneInput.value.trim() : ''),
      'Date: ' + (dateInput ? dateInput.value : ''),
      'Time: ' + (timeInput ? timeInput.value : ''),
      'Guests: ' + (guestsInput ? guestsInput.value : '')
    ].join('\n');

    payload.set('message', reservationSummary + '\n\nNotes: ' + (payload.get('notes') || 'None'));
    return payload;
  }

  function openMailFallback(receiverEmail, payload) {
    var subject = payload.get('_subject') || 'New Reservation Request';
    var body = [
      payload.get('message') || '',
      '',
      '---',
      'This draft was opened because the direct reservation submission failed.'
    ].join('\n');

    var mailtoUrl = 'mailto:' + encodeURIComponent(receiverEmail)
      + '?subject=' + encodeURIComponent(String(subject))
      + '&body=' + encodeURIComponent(String(body));

    window.location.href = mailtoUrl;
  }

  function submitReservation() {
    var receiverEmail = (form.getAttribute('data-receiver-email') || '').trim();
    if (!receiverEmail || receiverEmail === 'your-email@example.com') {
      setSubmitError('Set your receiving email in reservations.html: data-receiver-email="you@domain.com".');
      return;
    }

    clearSubmitError();
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
          var apiMessage = data && data.message ? String(data.message) : 'Unexpected response';
          throw new Error(apiMessage);
        }
        showSuccessState();
      })
      .catch(function (error) {
        openMailFallback(receiverEmail, payload);
        var message = 'Direct submit failed. Your email app was opened with a prefilled reservation draft as backup.';
        if (error && /web server/i.test(String(error.message))) {
          message = 'Direct submit failed because this page is running as a local HTML file. Use a local web server (or your deployed site). Your email app was opened with a backup draft.';
        }
        setSubmitError(message);
      })
      .finally(function () {
        setSubmitting(false);
      });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearSubmitError();
    var valid = true;
    fields.forEach(function (f) {
      var input = document.getElementById(f.id);
      var errorEl = document.getElementById(f.errorId);
      var value = input ? input.value : '';
      var ok = f.validate(value);
      showError(f.errorId, !ok);
      if (input) setInvalid(input, !ok);
      if (!ok) valid = false;
    });
    if (valid) {
      submitReservation();
    }
  });

  if (anotherBtn) {
    anotherBtn.addEventListener('click', function () {
      successEl.classList.add('hidden');
      formWrap.classList.remove('hidden', 'opacity-0');
      form.reset();
      clearSubmitError();
      setSubmitting(false);
      fields.forEach(function (f) {
        showError(f.errorId, false);
        var input = document.getElementById(f.id);
        if (input) setInvalid(input, false);
      });
    });
  }
})();
