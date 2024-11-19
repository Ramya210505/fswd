// Contact form submission logic
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Get form values
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  // Check if all fields are filled
  if (name && email && message) {
    document.getElementById('message-success').style.display = 'block';
    setTimeout(() => {
      document.getElementById('message-success').style.display = 'none';
    }, 3000);

    // Reset form
    document.getElementById('contact-form').reset();
  }
});
