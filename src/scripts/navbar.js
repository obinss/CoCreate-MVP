/* ============================================
   CoCreate Platform - Navbar Component Script
   ============================================ */

// Bind search
document.getElementById('navbar-search-input')?.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        window.location.href = `browse.html?search=${encodeURIComponent(e.target.value)}`;
    }
});

// Mobile menu toggle
document.getElementById('navbar-hamburger')?.addEventListener('click', () => {
    document.getElementById('navbar-menu').classList.toggle('active');
});

// User menu toggle
const userMenuBtn = document.getElementById('user-menu-btn');
const userMenu = document.getElementById('user-menu');

if (userMenuBtn && userMenu) {
    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = userMenu.style.display === 'none' || userMenu.style.display === '';
        userMenu.style.display = isHidden ? 'block' : 'none';
    });

    document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target) && e.target !== userMenuBtn) {
            userMenu.style.display = 'none';
        }
    });
}

// Scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Auth State Updates (Basic checks against localStorage)
/* 
   Note: We assume a simplified app state where checking localStorage is enough for UI toggling.
   Real apps would verify tokens. 
*/
(function updateNavbarAuth() {
    const storedUser = localStorage.getItem('cocreate_user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    const authElements = document.querySelectorAll('.auth-only');
    const guestElements = document.querySelectorAll('.guest-only');
    const sellerElements = document.querySelectorAll('.seller-only');
    const adminElements = document.querySelectorAll('.admin-only');

    if (user) {
        authElements.forEach(el => el.classList.remove('hidden'));
        guestElements.forEach(el => el.classList.add('hidden')); // Explicitly hide guest elements
        guestElements.forEach(el => el.style.display = 'none'); // Extra safety

        if (userMenuBtn) userMenuBtn.textContent = user.name;

        // Role based
        if (user.role === 'seller' || (user.isSeller && user.verificationStatus === 'approved') || user.role === 'admin') {
            sellerElements.forEach(el => el.classList.remove('hidden'));
        }
        if (user.role === 'admin') {
            adminElements.forEach(el => el.classList.remove('hidden'));
        }

        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('cocreate_user');
            localStorage.removeItem('cocreate_token');
            window.location.href = 'index.html';
        });
    } else {
        authElements.forEach(el => el.classList.add('hidden'));
        sellerElements.forEach(el => el.classList.add('hidden'));
        adminElements.forEach(el => el.classList.add('hidden'));
        guestElements.forEach(el => el.classList.remove('hidden'));
        guestElements.forEach(el => el.style.display = '');
    }

    // Cart Badge
    const cart = JSON.parse(localStorage.getItem('cocreate_cart') || '[]');
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
})();
