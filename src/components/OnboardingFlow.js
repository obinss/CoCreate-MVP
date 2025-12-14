/* ============================================
   CoCreate Platform - Onboarding Flow
   ============================================ */

const OnboardingFlow = {
    STORAGE_KEY: 'cocreate_onboarding_complete',

    steps: [
        {
            title: 'Welcome to CoCreate',
            content: 'The marketplace for surplus construction materials. Buy professional-grade inventory at great prices, or sell your excess stock.',
            icon: '<i class="fas fa-handshake" style="color: #A6375F;"></i>'
        },
        {
            title: 'Browse & Buy',
            content: 'Search verified listings from contractors and suppliers. Filter by category, location, and price to find exactly what you need.',
            icon: '<i class="fas fa-magnifying-glass" style="color: #A6375F;"></i>'
        },
        {
            title: 'Secure Payments',
            content: 'Your money is held safely in escrow until you confirm delivery. 100% buyer protection on every transaction.',
            icon: '<i class="fas fa-shield-halved" style="color: #A6375F;"></i>'
        },
        {
            title: 'Sell Your Surplus',
            content: 'Have leftover materials? Become a verified seller and turn waste into revenue. List for free, pay only when you sell.',
            icon: '<i class="fas fa-sack-dollar" style="color: #A6375F;"></i>'
        }
    ],

    currentStep: 0,

    /**
     * Check if onboarding should be shown
     */
    shouldShow() {
        return !localStorage.getItem(this.STORAGE_KEY);
    },

    /**
     * Mark onboarding as complete
     */
    markComplete() {
        localStorage.setItem(this.STORAGE_KEY, 'true');
    },

    /**
     * Reset onboarding (for testing)
     */
    reset() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    /**
     * Show onboarding modal
     */
    show() {
        if (!this.shouldShow()) return;

        this.currentStep = 0;
        this.renderModal();
    },

    renderModal() {
        const step = this.steps[this.currentStep];
        const isLast = this.currentStep === this.steps.length - 1;
        const isFirst = this.currentStep === 0;

        const backdrop = document.createElement('div');
        backdrop.id = 'onboarding-backdrop';
        backdrop.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.7); z-index: 10000;
            display: flex; align-items: center; justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        backdrop.innerHTML = `
            <div style="background: white; border-radius: 16px; max-width: 480px; width: 90%; padding: 48px 40px; text-align: center; position: relative; animation: slideUp 0.3s ease;">
                <!-- Progress Dots -->
                <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 32px;">
                    ${this.steps.map((_, i) => `
                        <div style="width: 8px; height: 8px; border-radius: 50%; background: ${i === this.currentStep ? '#A6375F' : '#e0e0e0'}; transition: background 0.3s;"></div>
                    `).join('')}
                </div>

                <!-- Icon -->
                <div style="font-size: 4rem; margin-bottom: 24px;">${step.icon}</div>

                <!-- Content -->
                <h2 style="font-size: 1.75rem; font-weight: 600; color: #1a1a1a; margin-bottom: 16px;">${step.title}</h2>
                <p style="color: #666; line-height: 1.7; margin-bottom: 40px; font-size: 1.05rem;">${step.content}</p>

                <!-- Navigation -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    ${isFirst ? `
                        <button onclick="OnboardingFlow.skip()" style="background: none; border: none; color: #999; cursor: pointer; font-size: 0.95rem;">Skip</button>
                    ` : `
                        <button onclick="OnboardingFlow.prev()" style="background: none; border: none; color: #666; cursor: pointer; font-size: 0.95rem; display: flex; align-items: center; gap: 4px;">← Back</button>
                    `}

                    <button onclick="${isLast ? 'OnboardingFlow.complete()' : 'OnboardingFlow.next()'}" 
                            style="background: #1a1a1a; color: white; border: none; padding: 12px 32px; border-radius: 10px; font-weight: 500; cursor: pointer; font-size: 1rem;">
                        ${isLast ? 'Get Started' : 'Next →'}
                    </button>
                </div>
            </div>
        `;

        // Add animation styles if not exists
        if (!document.getElementById('onboarding-styles')) {
            const styles = document.createElement('style');
            styles.id = 'onboarding-styles';
            styles.textContent = `
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `;
            document.head.appendChild(styles);
        }

        // Remove existing if any
        const existing = document.getElementById('onboarding-backdrop');
        if (existing) existing.remove();

        document.body.appendChild(backdrop);
    },

    next() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.renderModal();
        }
    },

    prev() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.renderModal();
        }
    },

    skip() {
        this.markComplete();
        this.close();
    },

    complete() {
        this.markComplete();
        this.close();
        showNotification('Welcome to CoCreate! Start exploring materials.', 'success');
    },

    close() {
        const backdrop = document.getElementById('onboarding-backdrop');
        if (backdrop) {
            backdrop.style.animation = 'fadeIn 0.2s ease reverse';
            setTimeout(() => backdrop.remove(), 200);
        }
    }
};

window.OnboardingFlow = OnboardingFlow;
