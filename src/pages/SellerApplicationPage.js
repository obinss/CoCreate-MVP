/* ============================================
   CoCreate Platform - Seller Application Page
   ============================================ */

function renderSellerApplicationPage() {
    const user = AppState.currentUser;

    // Check if already a seller
    if (user && user.isSeller) {
        return `
            <div class="container section">
                <div class="card text-center" style="padding: 64px; max-width: 600px; margin: 0 auto;">
                    <h2>You're Already a Seller</h2>
                    <p style="color: #666; margin: 24px 0;">
                        ${user.verificationStatus === 'approved'
                ? 'Your seller account is active. Start listing materials now.'
                : 'Your seller application is pending admin approval. You\'ll be notified once verified.'}
                    </p>
                    <button class="btn" style="background: #1a1a1a; color: white;" 
                            onclick="navigate('${user.verificationStatus === 'approved' ? 'add-product' : 'browse'}')">
                        ${user.verificationStatus === 'approved' ? 'Add Listing' : 'Browse Materials'}
                    </button>
                </div>
            </div>
        `;
    }

    return `
        <div class="container section" style="max-width: 800px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 48px;">
              <h1 style="font-size: 3rem; font-weight: 600; color: #1a1a1a; margin-bottom: 16px; letter-spacing: -0.01em;">
                    Become a Seller
                </h1>
                <p style="font-size: 1.125rem; color: #666; max-width: 600px; margin: 0 auto;">
                    List your surplus materials and turn excess inventory into revenue
                </p>
            </div>

            <!-- Benefits -->
            <div style="background: #fafafa; border-radius: 12px; padding: 40px; margin-bottom: 48px; border: 1px solid #e8e8e8;">
                <h3 style="font-size: 1.375rem; font-weight: 600; color: #1a1a1a; margin-bottom: 24px;">Why Sell on CoCreate?</h3>
                <div style="display: grid; gap: 20px;">
                    <div style="display: flex; gap: 16px;">
                        <span style="flex-shrink: 0; width: 40px; height: 40px; background: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">💰</span>
                        <div>
                            <h4 style="margin: 0 0 6px 0; font-size: 1rem; font-weight: 600; color: #1a1a1a;">Recover Value</h4>
                            <p style="margin: 0; color: #666; font-size: 0.9rem; line-height: 1.6;">Turn leftover materials into cash instead of disposal costs</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 16px;">
                        <span style="flex-shrink: 0; width: 40px; height: 40px; background: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">🔒</span>
                        <div>
                            <h4 style="margin: 0 0 6px 0; font-size: 1rem; font-weight: 600; color: #1a1a1a;">Secure Payments</h4>
                            <p style="margin: 0; color: #666; font-size: 0.9rem; line-height: 1.6;">Escrow system protects both buyers and sellers</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 16px;">
                        <span style="flex-shrink: 0; width: 40px; height: 40px; background: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">🌍</span>
                        <div>
                            <h4 style="margin: 0 0 6px 0; font-size: 1rem; font-weight: 600; color: #1a1a1a;">Sustainability</h4>
                            <p style="margin: 0; color: #666; font-size: 0.9rem; line-height: 1.6;">Reduce construction waste and support circular economy</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Application Form -->
            <div class="card" style="padding: 40px; border: 1px solid #e8e8e8;">
                <h3 style="font-size: 1.375rem; font-weight: 600; color: #1a1a1a; margin-bottom: 24px;">Application Details</h3>
                <form id="seller-application-form" onsubmit="submitSellerApplication(event)">
                    <!-- Company Information -->
                    <div style="margin-bottom: 32px;">
                        <h4 style="font-size: 1.125rem; font-weight: 600; color: #1a1a1a; margin-bottom: 16px;">Company Information</h4>
                        
                        <div class="input-group">
                            <label class="input-label">Company Name *</label>
                            <input type="text" class="input" name="companyName" required 
                                   placeholder="Your company or business name" />
                        </div>

                        <div class="input-group">
                            <label class="input-label">Business Type *</label>
                            <select class="input" name="businessType" required>
                                <option value="">Select type</option>
                                <option value="contractor">General Contractor</option>
                                <option value="subcontractor">Subcontractor</option>
                                <option value="supplier">Materials Supplier</option>
                                <option value="developer">Developer</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div class="input-group">
                            <label class="input-label">Registration Number</label>
                            <input type="text" class="input" name="registrationNumber" 
                                   placeholder="Company registration or tax ID" />
                            <span class="input-helper">Optional but recommended for verification</span>
                        </div>
                    </div>

                    <!-- Contact Details -->
                    <div style="margin-bottom: 32px;">
                        <h4 style="font-size: 1.125rem; font-weight: 600; color: #1a1a1a; margin-bottom: 16px;">Contact Details</h4>
                        
                        <div class="input-group">
                            <label class="input-label">Phone Number *</label>
                            <input type="tel" class="input" name="phone" required 
                                   placeholder="+49 xxx xxx xxxx" />
                        </div>

                        <div class="input-group">
                            <label class="input-label">Business Address *</label>
                            <textarea class="input" name="address" required rows="3"
                                      placeholder="Street, City, Postal Code, Country"></textarea>
                        </div>
                    </div>

                    <!-- Additional Information -->
                    <div style="margin-bottom: 32px;">
                        <h4 style="font-size: 1.125rem; font-weight: 600; color: #1a1a1a; margin-bottom: 16px;">Additional Information</h4>
                        
                        <div class="input-group">
                            <label class="input-label">Types of Materials You'll Sell</label>
                            <textarea class="input" name="materialTypes" rows="3"
                                      placeholder="e.g., Wood, Metal, Electrical components, etc."></textarea>
                        </div>

                        <div class="input-group">
                            <label class="input-label">Estimated Monthly Listings</label>
                            <select class="input" name="estimatedListings">
                                <option value="">Select range</option>
                                <option value="1-5">1-5 listings</option>
                                <option value="5-20">5-20 listings</option>
                                <option value="20-50">20-50 listings</option>
                                <option value="50+">50+ listings</option>
                            </select>
                        </div>
                    </div>

                    <!-- Terms -->
                    <div style="margin-bottom: 32px;">
                        <div class="checkbox-group">
                            <input type="checkbox" id="terms" name="terms" required class="checkbox" />
                            <label for="terms" style="color: #666; font-size: 0.9rem;">
                                I agree to the <a href="#" style="color: #A6375F;">Terms of Service</a> and 
                                <a href="#" style="color: #A6375F;">Seller Guidelines</a>
                            </label>
                        </div>
                    </div>

                    <!-- Submit -->
                    <div style="display: flex; gap: 12px;">
                        <button type="submit" class="btn" style="background: #1a1a1a; color: white; flex: 1;">
                            Submit Application
                        </button>
                        <button type="button" class="btn" style="background: transparent; border: 1.5px solid #e0e0e0; color: #1a1a1a;"
                                onclick="navigate('browse')">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            <!-- FAQ -->
            <div style="margin-top: 48px; text-align: center; color: #666;">
                <p style="margin-bottom: 8px;">Questions about selling?</p>
                <a href="#" style="color: #A6375F; font-weight: 500;">View Seller FAQ →</a>
            </div>
        </div>
    `;
}

function submitSellerApplication(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    // Convert to object
    const application = {};
    formData.forEach((value, key) => {
        application[key] = value;
    });

    // Update user
    AppState.currentUser.isSeller = true;
    AppState.currentUser.verificationStatus = 'pending';
    AppState.currentUser.sellerInfo = {
        ...application,
        applicationDate: new Date().toISOString()
    };

    // Save to local storage
    saveToLocalStorage('currentUser', AppState.currentUser);

    // Show success notification
    showNotification('Application submitted successfully! Our team will review it within 24-48 hours.', 'success');

    // Navigate to dashboard
    setTimeout(() => {
        navigate('buyer-dashboard');
    }, 1500);
}
