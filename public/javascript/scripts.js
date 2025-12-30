
setTimeout(function () {
    const msg = document.getElementById("success-message");
    if (msg) {
      msg.style.opacity = "0";
      setTimeout(() => {
        msg.remove();
        if (window.history.replaceState) {
          const cleanURL = window.location.origin + window.location.pathname;
          window.history.replaceState(null, null, cleanURL);
        }
      }, 500);
    }
  }, 2000);


  window.addEventListener('DOMContentLoaded', () => {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const errorMessage = document.getElementById('error-message');

    confirmPassword.addEventListener('input', () => {
      if (password.value.length < 8 ) {
        errorMessage.textContent = 'Password must be at least 8 characters long.';
        errorMessage.style.display = 'block';
      } else if (confirmPassword.value !== password.value) {
        errorMessage.style.display = 'block';
      } else {
        errorMessage.style.display = 'none';
      }
    });

    password.addEventListener('input', () => {
      // re-check when password is being changed
      if (confirmPassword.value !== '') {
        if (password.value.length < 8 ) {
          errorMessage.textContent = 'Password must be at least 8 characters long.';
          errorMessage.style.display = 'block';
        } else if (confirmPassword.value !== password.value) {
          errorMessage.textContent = 'Passwords do not match!';
          errorMessage.style.display = 'block';
        } else {
          errorMessage.style.display = 'none';
        }
      }
    });
  });


  document.getElementById('profile-icon').addEventListener('click', function(event) {
    const dropdownMenu = document.getElementById('dropdown-menu');
    
    // Toggle visibility of the dropdown menu
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    
    // Prevent the click event from propagating to the window event listener
    event.stopPropagation();
  });
  
  // Close the dropdown if user clicks anywhere outside
  window.addEventListener('click', function(event) {
    const dropdownMenu = document.getElementById('dropdown-menu');
    const profileIcon = document.getElementById('profile-icon');
    
    if (!profileIcon.contains(event.target)) {
      dropdownMenu.style.display = 'none';
    }
  });

  document.querySelectorAll('.dropdown-menu a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('dropdown-menu').style.display = 'none';
    });
  });

  window.addEventListener('DOMContentLoaded', () => {
    const new_password = document.getElementById('new_password');
    const confirmPassword = document.getElementById('confirm_password');
    const errorMessage = document.getElementById('error-message');

    confirmPassword.addEventListener('input', () => {
      if (new_password.value.length < 8 ) {
        errorMessage.textContent = 'Password must be at least 8 characters long.';
        errorMessage.style.display = 'block';
      } else if (confirmPassword.value !== new_password.value) {
        errorMessage.style.display = 'block';
      } else {
        errorMessage.style.display = 'none';
      }
    });

    password.addEventListener('input', () => {
      // re-check when password is being changed
      if (confirmPassword.value !== '') {
        if (new_password.value.length < 8 ) {
          errorMessage.textContent = 'Password must be at least 8 characters long.';
          errorMessage.style.display = 'block';
        } else if (confirmPassword.value !== new_password.value) {
          errorMessage.textContent = 'Passwords do not match!';
          errorMessage.style.display = 'block';
        } else {
          errorMessage.style.display = 'none';
        }
      }
    });
  });
