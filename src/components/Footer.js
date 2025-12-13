/* ============================================
   CoCreate Platform - Footer Component
   ============================================ */

function renderFooter() {
    return `
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <!-- About Section -->
                    <div class="footer-section">
                        <h3>About CoCreate</h3>
                        <p style="color: rgba(255, 255, 255, 0.8);">
                            Connecting construction companies with excess materials to contractors, 
                            tradespeople, and DIYers. Sustainable building starts here.
                        </p>
                    </div>

                    <!-- Quick Links -->
                    <div class="footer-section">
                        <h3>Quick Links</h3>
                        <ul class="footer-links">
                            <li><a href="#" class="footer-link" onclick="navigate('browse'); return false;">Browse Materials</a></li>
                            <li><a href="#" class="footer-link" onclick="navigate('help'); return false;">Help Center</a></li>
                            <li><a href="#" class="footer-link" onclick="navigate('signup'); return false;">Become a Seller</a></li>
                        </ul>
                    </div>

                    <!-- Legal -->
                    <div class="footer-section">
                        <h3>Legal</h3>
                        <ul class="footer-links">
                            <li><a href="#" class="footer-link" onclick="navigate('terms'); return false;">Terms of Service</a></li>
                            <li><a href="#" class="footer-link" onclick="navigate('privacy'); return false;">Privacy Policy</a></li>
                            <li><a href="#" class="footer-link">Liability Disclaimer</a></li>
                        </ul>
                    </div>

                    <!-- Contact -->
                    <div class="footer-section">
                        <h3>Contact</h3>
                        <ul class="footer-links">
                            <li style="color: rgba(255, 255, 255, 0.8);">Email: info@cocreate.com</li>
                            <li style="color: rgba(255, 255, 255, 0.8);">Phone: +49 30 1234 5678</li>
                            <li style="color: rgba(255, 255, 255, 0.8);">Berlin, Germany</li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>&copy; ${new Date().getFullYear()} CoCreate. All rights reserved. Built with sustainability in mind.</p>
                </div>
            </div>
        </footer>
    `;
}
