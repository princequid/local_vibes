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

  function setHiddenField(name, value) {
    var hidden = form.querySelector('input[type="hidden"][name="' + name + '"]');
    if (!hidden) {
      hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = name;
      form.appendChild(hidden);
    }
    hidden.value = String(value);
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
    }
    payload.set('_subject', '🗓️ New Reservation – ' + (nameInput ? nameInput.value.trim() : '') + ' – ' + (dateInput ? dateInput.value : '') + ' at ' + (timeInput ? timeInput.value : ''));
    payload.set('_captcha', 'true');
    payload.set('_template', 'table');
    var configuredNextUrl = (form.getAttribute('data-next-url') || '').trim();
    var nextUrl = configuredNextUrl;
    if (!nextUrl) {
      var successUrl = new URL(window.location.href);
      successUrl.searchParams.set('reservation', 'success');
      nextUrl = successUrl.toString();
    }
    payload.set('_next', nextUrl);

    var submittedOn = new Date().toLocaleString();
    var specialRequests = String(payload.get('notes') || '').trim() || 'None';
    var fullName = nameInput ? nameInput.value.trim() : '';
    var firstName = fullName ? fullName.split(/\s+/)[0] : 'Guest';
    var restaurantName = (form.getAttribute('data-restaurant-name') || 'Local Vibes').trim();
    var restaurantPhone = (form.getAttribute('data-restaurant-phone') || '').trim();
    var restaurantEmail = (form.getAttribute('data-restaurant-email') || form.getAttribute('data-receiver-email') || '').trim();
    var restaurantAddress = (form.getAttribute('data-restaurant-address') || '').trim();
    var websiteUrl = (form.getAttribute('data-restaurant-website') || '').trim();
    var hasPublicWebsite = /^https?:\/\//i.test(websiteUrl) && !/localhost|127\.0\.0\.1/i.test(websiteUrl);

    var reservationSummary = [
      'New Reservation Received',
      '',
      'You have received a new table reservation request.',
      '',
      '📌 Reservation Details',
      '',
      'Full Name: ' + (nameInput ? nameInput.value.trim() : ''),
      'Email Address: ' + (emailInput ? emailInput.value.trim() : ''),
      'Phone Number: ' + (phoneInput ? phoneInput.value.trim() : ''),
      'Date: ' + (dateInput ? dateInput.value : ''),
      'Time: ' + (timeInput ? timeInput.value : ''),
      'Number of Guests: ' + (guestsInput ? guestsInput.value : ''),
      '',
      'Special Requests:',
      specialRequests,
      '',
      '⏱ Submitted On:',
      '',
      submittedOn,
      '',
      '⚠️ Please confirm or contact the guest as soon as possible.'
    ].join('\n');

    var customerConfirmationLines = [
      'Dear ' + firstName + ',',
      '',
      'Thank you for choosing ' + restaurantName + '.',
      '',
      'We have received your reservation request and will be happy to host you.',
      '',
      'Reservation Details:',
      '',
      '- Date: ' + (dateInput ? dateInput.value : ''),
      '',
      '- Time: ' + (timeInput ? timeInput.value : ''),
      '',
      '- Number of Guests: ' + (guestsInput ? guestsInput.value : ''),
      '',
      '- Special Requests: ' + specialRequests + '.',
      '',
      'If any of these details are incorrect, please contact us immediately.',
      '',
      restaurantPhone ? 'Phone: ' + restaurantPhone : null,
      '',
      restaurantEmail ? 'Email: ' + restaurantEmail : null,
      '',
      'We look forward to welcoming you and providing you with an exceptional dining experience.',
      '',
      'Warm regards,',
      '',
      restaurantName + ' Team',
      '',
      restaurantAddress || null,
      '',
      hasPublicWebsite ? websiteUrl : null
    ];

    var customerConfirmation = customerConfirmationLines.filter(function (line) {
      return line !== null;
    }).join('\n');

    //payload.set('message', reservationSummary);
    payload.set('_autoresponse', customerConfirmation);
    return payload;
  }

  function submitReservation() {
    var receiverEmail = (form.getAttribute('data-receiver-email') || '').trim();
    if (!receiverEmail || receiverEmail === 'your-email@example.com') {
      setSubmitError('Set your receiving email in reservations.html: data-receiver-email="you@domain.com".');
      return;
    }

    clearSubmitError();
    setSubmitting(true);
    var payload = buildPayload();

    ['_replyto', '_subject', '_captcha', '_template', '_next', 'message', '_autoresponse'].forEach(function (key) {
      var value = payload.get(key);
      if (value !== null && value !== undefined) {
        setHiddenField(key, value);
      }
    });

    form.method = 'POST';
    form.action = 'https://formsubmit.co/' + encodeURIComponent(receiverEmail);
    form.submit();
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

  if (window.location.search) {
    var params = new URLSearchParams(window.location.search);
    if (params.get('reservation') === 'success') {
      showSuccessState();
      params.delete('reservation');
      var cleanUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '') + window.location.hash;
      window.history.replaceState({}, '', cleanUrl);
    }
  }

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
