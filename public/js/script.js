(function () {
  'use strict';

  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {

      let valid = true;

      // -------- LISTING FORM VALIDATION --------
      const title = form.querySelector('#title');
      const price = form.querySelector('#price');
      const description = form.querySelector('#description');

      if (title && price && description) {
        const wordCount = description.value.trim().split(/\s+/).length;
        if (wordCount > 100) {
          description.setCustomValidity('Too long');
          valid = false;
        } else {
          description.setCustomValidity('');
        }

        const priceVal = parseFloat(price.value);
        if (isNaN(priceVal) || priceVal <= 0) {
          price.setCustomValidity('Invalid price');
          valid = false;
        } else {
          price.setCustomValidity('');
        }

        if (title.value.trim().length < 3) {
          title.setCustomValidity('Too short');
          valid = false;
        } else {
          title.setCustomValidity('');
        }
      }

      // -------- REVIEW FORM VALIDATION --------
      const rating = form.querySelector('#rating');
      const comment = form.querySelector('#comment');

      if (rating && comment) {
        if (!comment.value.trim()) {
          comment.setCustomValidity('Review cannot be empty');
          valid = false;
        } else {
          comment.setCustomValidity('');
        }
      }

      if (!form.checkValidity() || !valid) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    }, false);
  });
})();
