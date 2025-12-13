/* ============================================
   CoCreate Platform - Login Page
   ============================================ */

function renderLoginPage() {
    return `
        <div class="container section">
            <div style="max-width: 480px; margin: 0 auto;">
                <div class="card" style="padding: 48px;">
                    <h1 class="text-center" style="margin-bottom: 8px;">Welcome Back</h1>
                    <p class="text-center text-secondary" style="margin-bottom: 32px;">
                        Log in to continue to CoCreate
                    </p>

                    <form id="login-form" onsubmit="handleLogin(event)">
                        <div class="input-group">
                            <label class="input-label">Email Address</label>
                            <input type="email" class="input" id="login-email" 
                                   placeholder="your.email@example.com" required />
                        </div>

                        <div class="input-group">
                            <label class="input-label">Password</label>
                            <input type="password" class="input" id="login-password" 
                                   placeholder="Enter your password" required />
                        </div>

                        <div class="checkbox-group" style="margin-bottom: 24px;">
                            <input type="checkbox" class="checkbox" id="remember-me" />
                            <label for="remember-me" style="cursor: pointer;">Remember me</label>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 16px;">
                            Log In
                        </button>
                    </form>

                    <div style="text-align: center; margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--color-background);">
                        <p class="text-secondary">
                            Don't have an account? 
                            <a href="#" onclick="navigate('signup'); return false;" style="font-weight: 600;">
                                Sign up
                            </a>
                        </p>
                    </div>

                    <div class="alert alert-info" style="margin-top: 24px;">
                        <strong>Demo Accounts:</strong><br/>
                        <small>
                            Buyer: john.buyer@example.com<br/>
                            Seller: maria.contractor@example.com<br/>
                            Password: (any password works)
                        </small>
                    </div>
                </div>
            </div>
        </div>

        <script>
            function handleLogin(event) {
                event.preventDefault();
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;

                const result = login(email, password);
                
                if (result.success) {
                    showNotification('Login successful! Welcome back.', 'success');
                    setTimeout(() => {
                        navigate(result.user.role === 'seller' ? 'seller-dashboard' : 'browse');
                    }, 1000);
                } else {
                    showNotification('Invalid email or password', 'error');
                }
            }
        </script>
    `;
}
