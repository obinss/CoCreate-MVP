/* ============================================
   CoCreate Platform - Contextual Help System
   ============================================ */

const ContextualHelp = {
    /**
     * Render a help icon with tooltip
     * @param {string} text - Tooltip content
     * @param {string} position - 'top' | 'bottom' | 'left' | 'right'
     */
    tooltip(text, position = 'top') {
        const positionStyles = {
            top: 'bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);',
            bottom: 'top: calc(100% + 8px); left: 50%; transform: translateX(-50%);',
            left: 'right: calc(100% + 8px); top: 50%; transform: translateY(-50%);',
            right: 'left: calc(100% + 8px); top: 50%; transform: translateY(-50%);'
        };

        return `
            <span class="help-tooltip" style="position: relative; display: inline-flex; cursor: help; margin-left: 6px;">
                <span style="width: 16px; height: 16px; border-radius: 50%; background: #f0f0f0; color: #999; font-size: 0.7rem; display: inline-flex; align-items: center; justify-content: center; font-weight: 600;"
                      onmouseenter="this.nextElementSibling.style.opacity='1'; this.nextElementSibling.style.visibility='visible';"
                      onmouseleave="this.nextElementSibling.style.opacity='0'; this.nextElementSibling.style.visibility='hidden';">?</span>
                <span style="position: absolute; ${positionStyles[position]} background: #1a1a1a; color: white; padding: 8px 12px; border-radius: 6px; font-size: 0.8rem; white-space: nowrap; opacity: 0; visibility: hidden; transition: opacity 0.2s, visibility 0.2s; z-index: 1000; max-width: 250px; white-space: normal; line-height: 1.5;">
                    ${text}
                </span>
            </span>
        `;
    },

    /**
     * Show help sidebar
     */
    showHelpSidebar() {
        const sidebar = document.createElement('div');
        sidebar.id = 'help-sidebar';
        sidebar.style.cssText = `
            position: fixed; top: 0; right: 0; bottom: 0; width: 400px; max-width: 90vw;
            background: white; box-shadow: -4px 0 24px rgba(0,0,0,0.15); z-index: 10000;
            animation: slideInRight 0.3s ease; overflow-y: auto;
        `;

        sidebar.innerHTML = `
            <div style="padding: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h2 style="margin: 0; font-size: 1.5rem;">Help Center</h2>
                    <button onclick="ContextualHelp.closeHelpSidebar()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #999;">×</button>
                </div>

                <!-- Search -->
                <input type="text" placeholder="Search help articles..." 
                       style="width: 100%; padding: 12px 16px; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 24px; font-size: 0.95rem;"
                       oninput="ContextualHelp.filterFAQs(this.value)">

                <!-- Quick Links -->
                <div style="margin-bottom: 32px;">
                    <h3 style="font-size: 0.85rem; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">Quick Links</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <button onclick="navigate('browse')" style="padding: 16px; background: #fafafa; border: 1px solid #e8e8e8; border-radius: 10px; cursor: pointer; text-align: left;">
                            <div style="font-size: 1.5rem; margin-bottom: 8px;">🔍</div>
                            <div style="font-weight: 500;">Browse</div>
                        </button>
                        <button onclick="navigate('seller-application')" style="padding: 16px; background: #fafafa; border: 1px solid #e8e8e8; border-radius: 10px; cursor: pointer; text-align: left;">
                            <div style="font-size: 1.5rem; margin-bottom: 8px;">📦</div>
                            <div style="font-weight: 500;">Sell</div>
                        </button>
                    </div>
                </div>

                <!-- FAQs -->
                <div id="help-faqs">
                    <h3 style="font-size: 0.85rem; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">Frequently Asked</h3>
                    ${this.renderFAQs()}
                </div>

                <!-- Contact -->
                <div style="margin-top: 32px; padding: 20px; background: #fafafa; border-radius: 12px;">
                    <h4 style="margin: 0 0 8px 0;">Need more help?</h4>
                    <p style="color: #666; font-size: 0.9rem; margin-bottom: 16px;">Our support team is here to assist you.</p>
                    <button onclick="navigate('help')" style="width: 100%; padding: 12px; background: #1a1a1a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
                        Contact Support
                    </button>
                </div>
            </div>
        `;

        // Add animation
        if (!document.getElementById('help-styles')) {
            const styles = document.createElement('style');
            styles.id = 'help-styles';
            styles.textContent = `
                @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
            `;
            document.head.appendChild(styles);
        }

        // Add backdrop
        const backdrop = document.createElement('div');
        backdrop.id = 'help-backdrop';
        backdrop.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.3); z-index: 9999;';
        backdrop.onclick = () => this.closeHelpSidebar();

        document.body.appendChild(backdrop);
        document.body.appendChild(sidebar);
    },

    closeHelpSidebar() {
        const sidebar = document.getElementById('help-sidebar');
        const backdrop = document.getElementById('help-backdrop');
        if (sidebar) {
            sidebar.style.animation = 'slideInRight 0.2s ease reverse';
            setTimeout(() => { sidebar.remove(); backdrop?.remove(); }, 200);
        }
    },

    faqs: [
        { q: 'How does escrow work?', a: 'Your payment is held securely until you confirm the materials have been delivered as described.' },
        { q: 'How do I become a seller?', a: 'Go to your Dashboard and click "Become a Seller" to submit a verification application.' },
        { q: 'What are the fees?', a: 'Buyers pay no platform fees. Sellers pay a small commission only on completed sales.' },
        { q: 'How is shipping handled?', a: 'Sellers set pickup or delivery options. Freight costs are calculated based on weight and distance.' },
        { q: 'What if I receive damaged goods?', a: 'Report issues within 48 hours. Our dispute resolution team will review and process refunds if needed.' }
    ],

    renderFAQs(filter = '') {
        const filtered = this.faqs.filter(f =>
            f.q.toLowerCase().includes(filter.toLowerCase()) ||
            f.a.toLowerCase().includes(filter.toLowerCase())
        );

        if (filtered.length === 0) {
            return '<p style="color: #999; font-style: italic;">No matching articles found.</p>';
        }

        return filtered.map(faq => `
            <details style="margin-bottom: 12px; border: 1px solid #e8e8e8; border-radius: 8px; overflow: hidden;">
                <summary style="padding: 14px 16px; cursor: pointer; font-weight: 500; background: #fafafa;">${faq.q}</summary>
                <div style="padding: 14px 16px; color: #666; line-height: 1.6; font-size: 0.95rem;">${faq.a}</div>
            </details>
        `).join('');
    },

    filterFAQs(term) {
        const container = document.getElementById('help-faqs');
        if (container) {
            container.innerHTML = `
                <h3 style="font-size: 0.85rem; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">Frequently Asked</h3>
                ${this.renderFAQs(term)}
            `;
        }
    }
};

window.ContextualHelp = ContextualHelp;
