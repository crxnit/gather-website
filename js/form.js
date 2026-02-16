/**
 * Inquiry form validation and submission to Google Apps Script.
 *
 * NOTE ON no-cors MODE:
 * Google Apps Script web apps redirect (302) to a different origin during execution,
 * which makes standard CORS responses unreliable. Using `mode: 'no-cors'` works around
 * this, but means we cannot read the response — so we optimistically show a success
 * message after the request completes without a network error. If Apps Script returns
 * a server error (500, quota exceeded, etc.), the user will still see the success message.
 * This is a known trade-off of the GAS web app pattern.
 */

(function () {
  'use strict';

  // TODO: Replace with your deployed Google Apps Script web app URL
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwUH7jthn3EY6KDeBh8dcATLIEG0f2hxWClqBW8SwxoAge7t4xf-p1s5AzYOE0ns04/exec';

  /** Guard: prevent submission if the Apps Script URL hasn't been configured. */
  function isConfigured() {
    return APPS_SCRIPT_URL.startsWith('https://');
  }

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('inquiry-form');
    if (!form) return;

    const submitBtn = document.getElementById('submit-btn');
    const messageEl = document.getElementById('form-message');
    let isSubmitting = false;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (isSubmitting) return;

      clearErrors();

      if (!validate()) return;

      if (!isConfigured()) {
        showMessage('error', 'The inquiry form is not yet configured. Please email us directly at info@gathercateringandevents.com');
        return;
      }

      isSubmitting = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const data = collectFormData();

      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(data)
      })
        .then(function () {
          showMessage('success', 'Thank you! Your inquiry has been sent and a confirmation email is on its way. Our team will follow up within 24\u201348 business hours.');
          form.reset();
        })
        .catch(function () {
          showMessage('error', 'Something went wrong. Please try again or email us directly at info@gathercateringandevents.com');
        })
        .finally(function () {
          isSubmitting = false;
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Inquiry';
        });
    });

    function validate() {
      let valid = true;
      const requiredFields = [
        { name: 'firstName', check: function (v) { return v.trim() !== ''; } },
        { name: 'lastName',  check: function (v) { return v.trim() !== ''; } },
        { name: 'email',     check: function (v) { return v.trim() !== '' && isValidEmail(v); } }
      ];

      requiredFields.forEach(function (field) {
        const input = form.querySelector('[name="' + field.name + '"]');
        if (input && !field.check(input.value)) {
          setError(input);
          valid = false;
        }
      });

      if (!valid) {
        const firstError = form.querySelector('.has-error .form-input');
        if (firstError) firstError.focus();
      }

      return valid;
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function collectFormData() {
      const formData = new FormData(form);
      const services = [];
      form.querySelectorAll('[name="services"]:checked').forEach(function (cb) {
        services.push(cb.value);
      });

      return {
        firstName: formData.get('firstName') || '',
        lastName: formData.get('lastName') || '',
        email: formData.get('email') || '',
        phone: formData.get('phone') || '',
        services: services,
        budget: formData.get('budget') || '',
        details: formData.get('details') || '',
        timestamp: new Date().toISOString()
      };
    }

    function setError(input) {
      const group = input.closest('.form-group');
      if (group) group.classList.add('has-error');
    }

    function clearErrors() {
      form.querySelectorAll('.has-error').forEach(function (el) {
        el.classList.remove('has-error');
      });
      if (messageEl) {
        messageEl.textContent = '';
        messageEl.className = '';
      }
    }

    function showMessage(type, text) {
      if (!messageEl) return;
      messageEl.textContent = text;
      messageEl.className = 'form-message form-message--' + type;
      messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();
