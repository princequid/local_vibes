/**
 * Local Vibes Restaurant - Reservation form validation & success
 */

(function () {
  'use strict';

  var form = document.getElementById('reservation-form');
  var formWrap = document.getElementById('reservation-form-wrap');
  var successEl = document.getElementById('reservation-success');
  var anotherBtn = document.getElementById('reservation-another');
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

  form.addEventListener('submit', function (e) {
    e.preventDefault();
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
      formWrap.classList.add('opacity-0');
      setTimeout(function () {
        formWrap.classList.add('hidden');
        successEl.classList.remove('hidden');
        successEl.style.animation = 'none';
        successEl.offsetHeight;
        successEl.style.animation = null;
      }, 300);
    }
  });

  if (anotherBtn) {
    anotherBtn.addEventListener('click', function () {
      successEl.classList.add('hidden');
      formWrap.classList.remove('hidden', 'opacity-0');
      form.reset();
      fields.forEach(function (f) {
        showError(f.errorId, false);
        var input = document.getElementById(f.id);
        if (input) setInvalid(input, false);
      });
    });
  }
})();
