/* ============================================
   CoCreate Platform - Signup Page
   ============================================ */

function renderSignupPage() {
    // Set up the signup handler globally
    setTimeout(() => {
        const form = document.getElementById('signup-form');
        if (form) {
            form.onsubmit = function (event) {
                event.preventDefault();

                const name = document.getElementById('signup-name').value;
                const email = document.getElementById('signup-email').value;
                const password = document.getElementById('signup-password').value;
                const wantsToSell = document.getElementById('wants-to-sell').checked;

                // Check if email already exists
                const existingUser = USERS.find(u => u.email === email);
                if (existingUser) {
                    showNotification('Email already registered', 'error');
                    return;
                }

                // Mock signup - create new user
                const newUser = {
                    id: 'user_' + Date.now(),
                    email,
                    name,
                    role: 'buyer', // All start as buyers
                    isSeller: wantsToSell,
                    verificationStatus: wantsToSell ? 'pending' : null,
                    isVerified: false,
                    createdAt: new Date().toISOString()
                };

                USERS.push(newUser);
                AppState.currentUser = newUser;
                saveToLocalStorage('currentUser', newUser);

                showNotification('Account created successfully!', 'success');

                if (wantsToSell) {
                    showNotification('Seller verification pending. You can browse while waiting for approval.', 'info');
                }

                setTimeout(() => navigate('browse'), 1000);
            };
        }
    }, 100);

    return `
        <div class="container section">
            <div style="max-width: 600px; margin: 0 auto;">
                <div class="card" style="padding: 48px;">
                    <h1 class="text-center" style="margin-bottom: 8px;">Join CoCreate</h1>
                    <p class="text-center text-secondary" style="margin-bottom: 32px;">
                        Start buying or selling construction materials today
                    </p>

                    <form id="signup-form">
                        <div class="input-group">
                            <label class="input-label">Full Name</label>
                            <input type="text" class="input" id="signup-name" 
                                   placeholder="John Smith" required />
                        </div>

                        <div class="input-group">
                            <label class="input-label">Email Address</label>
                            <input type="email" class="input" id="signup-email" 
                                   placeholder="your.email@example.com" required />
                        </div>

                        <div class="input-group">
                            <label class="input-label">Password</label>
                            <input type="password" class="input" id="signup-password" 
                                   placeholder="Create a strong password" required />
                        </div>

                        <div class="input-group">
                            <div class="checkbox-group">
                                <input type="checkbox" class="checkbox" id="wants-to-sell" />
                                <label for="wants-to-sell" style="cursor: pointer;">
                                    <strong>I also want to sell materials</strong>
                                    <span class="text-sm text-tertiary" style="display: block; margin-left: 26px;">
                                        Your account will be pending admin approval to sell
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div class="checkbox-group" style="margin-bottom: 24px;">
                            <input type="checkbox" class="checkbox" id="terms-agree" required />
                            <label for="terms-agree" style="cursor: pointer;">
                                I agree to the <a href="#" onclick="navigate('terms'); return false;">Terms of Service</a> 
                                and <a href="#" onclick="navigate('privacy'); return false;">Privacy Policy</a>
                            </label>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 16px;">
                            Create Account
                        </button>
                    </form>

                    <div style="text-align: center; margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--color-background);">
                        <p class="text-secondary">
                            Already have an account? 
                            <a href="#" onclick="navigate('login'); return false;" style="font-weight: 600;">
                                Log in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
}
