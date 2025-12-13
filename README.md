# CoCreate - Construction Materials Marketplace MVP

A B2B2C marketplace platform connecting construction companies with excess materials to contractors, tradespeople, and DIYers.

## Overview

This is a **frontend prototype** demonstrating the complete user experience and flow of the CoCreate platform. It uses mock data to simulate all features without requiring backend infrastructure.

## Features

### Core Functionality
- ✅ User authentication (Buyer/Seller/Admin roles)
- ✅ Product browsing with advanced filtering
- ✅ Product detail pages with price comparison
- ✅ Shopping cart and checkout flow
- ✅ Seller dashboard with inventory management
- ✅ Buyer dashboard with order tracking
- ✅ Admin panel for user verification
- ✅ Saved searches and watchlists
- ✅ Fully responsive mobile design

### Design Features
- Premium UI with Lisbon-Oriente color scheme
- Glassmorphism effects
- Smooth animations and transitions
- Mobile-first responsive design
- Touch-friendly interface

## Quick Start

### Option 1: Using Python's Built-in Server (Recommended)

```bash
python3 -m http.server 8000
```

Then open your browser to: `http://localhost:8000`

### Option 2: Using PHP's Built-in Server

```bash
php -S localhost:8000
```

### Option 3: Using VS Code Live Server

Install the "Live Server" extension and click "Go Live" in VS Code.

### Option 4: GitHub Pages (For Team Review)

**Perfect for sharing with your team!**

1. Go to your GitHub repository → **Settings** → **Pages**
2. Under "Source", select **Deploy from a branch**
3. Choose **main** branch and **/ (root)** folder
4. Click **Save**
5. Your site will be live at: `https://[username].github.io/[repo-name]/`

GitHub Pages automatically rebuilds when you push changes to the main branch!

## Demo Accounts

Use these credentials to test different user roles:

**Buyer Account:**
- Email: `john.buyer@example.com`
- Password: (any password works)

**Seller Account:**
- Email: `maria.contractor@example.com`
- Password: (any password works)

**Admin Account:**
- Email: `admin@cocreate.com`
- Password: (any password works)

## User Flows to Test

### As a Buyer:
1. Browse materials on the home page
2. Use filters to search by category, price, condition
3. View product details with price calculations
4. Add items to cart
5. Proceed through checkout
6. View orders in dashboard
7. Save searches for notifications

### As a Seller:
1. View seller dashboard with inventory stats
2. Browse active listings
3. View product performance (views, saves)
4. See sales analytics

### As an Admin:
1. View platform statistics
2. Approve/reject seller verifications
3. Access user management tools

## Project Structure

```
CoCreate/
├── index.html                  # Main entry point
├── src/
│   ├── styles/
│   │   ├── index.css          # Design system & variables
│   │   ├── components.css     # Component styles
│   │   └── mobile.css         # Responsive styles
│   ├── data/
│   │   └── mockData.js        # Mock database
│   ├── utils/
│   │   └── utils.js           # Helper functions
│   ├── components/
│   │   ├── Navbar.js          # Navigation bar
│   │   └── Footer.js          # Footer
│   ├── pages/
│   │   ├── Home.js            # Landing page
│   │   ├── Browse.js          # Product marketplace
│   │   ├── ProductDetail.js   # Product details
│   │   ├── Login.js           # Login page
│   │   ├── Signup.js          # Registration
│   │   ├── BuyerDashboard.js  # Buyer dashboard
│   │   ├── SellerDashboard.js # Seller dashboard
│   │   └── AdminDashboard.js  # Admin panel
│   └── app.js                 # Main app & router
└── README.md
```

## Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables
- **Vanilla JavaScript** - No framework dependencies
- **LocalStorage** - State persistence

### Design System
- **Color Scheme**: Lisbon-Oriente inspired palette
  - Primary: #A6375F
  - Secondary: #121940
  - Accent: #A3BFD9
- **Typography**: Inter font family
- **Components**: Modular, reusable UI components
- **Animations**: Smooth micro-interactions

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Integration Points for Production

This prototype clearly marks integration points for backend implementation:

1. **Authentication**: Replace mock login with real authentication service
2. **Payment Processing**: Integrate Stripe Connect for escrow payments
3. **Delivery APIs**: Connect to freight carrier APIs (DHL, Uber Freight)
4. **Image Upload**: Integrate with AWS S3 or similar storage
5. **Database**: Replace mock data with PostgreSQL/MySQL
6. **Real-time Messaging**: Implement WebSocket for chat
7. **Price Scraping**: Add backend service for market price comparison

## Next Steps for Development

1. Backend API development (Node.js/Express or similar)
2. Database schema implementation
3. Real authentication & authorization
4. Payment gateway integration
5. File upload & image processing
6. Email notification system
7. Advanced analytics & reporting

## License

This is a prototype/MVP demonstration. All rights reserved.

## Contact

For questions about this project, please contact the CoCreate team.
