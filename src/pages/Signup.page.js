/* ============================================
   CoCreate Platform - Signup Page Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');
    if (form) {
        form.onsubmit = function (event) {
            event.preventDefault();

            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const role = document.querySelector('input[name="role"]:checked').value;
            const terms = document.getElementById('terms').checked;

            if (!terms) {
                showNotification('Please accept the terms', 'error');
                return;
            }

            // Mock signup
            showNotification('Account created successfully!', 'success');

            setTimeout(() => {
                // In real app, we'd hit API and get user back. Here we mock.
                const newUser = {
                    id: 'user_' + Date.now(),
                    name,
                    email,
                    role,
                    isSeller: role === 'seller',
                    verificationStatus: 'pending'
                };

                // Save session
                saveToLocalStorage('cocreate_user', newUser);

                if (role === 'seller') {
                    window.location.href = 'seller-dashboard.html';
                } else {
                    window.location.href = 'browse.html';
                }
            }, 1000);
        };
    }
});
