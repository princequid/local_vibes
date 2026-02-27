/**
 * Local Vibes Restaurant - Contact form validation
 */

(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

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

  form.addEventListener('submit', function (e) {
    e.preventDefault();
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
      form.reset();
      fields.forEach(function (f) {
        showError(f.errorId, false);
        var input = document.getElementById(f.id);
        setInvalid(input, false);
      });
      alert('Thank you! Your message has been sent. We will get back to you soon.');
    }
    
  });
})();
