/* ============================================
   CoCreate Platform - Login Page Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AppState if not already defined
    if (typeof window.AppState === 'undefined') {
        window.AppState = { currentUser: null };
    }

    const form = document.getElementById('login-form');
    if (form) {
        form.onsubmit = function (event) {
            event.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const result = window.login(email, password);

            if (result.success) {
                showNotification('Login successful! Welcome back.', 'success');

                // Redirect based on role
                setTimeout(() => {
                    const user = result.user;
                    saveToLocalStorage('cocreate_user', user);

                    if (user.role === 'admin') {
                        window.location.href = 'placeholder.html';
                    } else if (user.role === 'seller' || (user.isSeller && user.verificationStatus === 'approved')) {
                        window.location.href = 'seller-dashboard.html';
                    } else {
                        window.location.href = 'browse.html';
                    }
                }, 500);
            } else {
                showNotification('Invalid email or password', 'error');
            }
        };
    }
});
