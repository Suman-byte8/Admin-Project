# Silver Arcade Premiere Admin Panel

A modern, responsive admin panel built with React and Tailwind CSS for managing the Silver Arcade Premiere hotel system, featuring comprehensive content management, user administration, and analytics.

## Overview

The Admin Panel provides a centralized interface for hotel administrators to manage all aspects of the hotel system including user memberships, content management, room inventory, reservations, and analytics.

## Technologies Used

### Core Framework & Libraries
- **React 18**: Modern JavaScript library for building user interfaces
- **React DOM**: React rendering library for web applications
- **React Router DOM**: Declarative routing for React applications
- **Axios**: HTTP client for making API requests with interceptors

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Material-UI (MUI)**: React components implementing Google's Material Design
- **Emotion**: CSS-in-JS library for styling React components
- **Lucide React**: Beautiful & consistent icon toolkit
- **React Icons**: Popular icon library with multiple icon packs

### Data Visualization & Charts
- **Chart.js**: Simple yet flexible JavaScript charting library
- **React Chart.js 2**: React wrapper for Chart.js
- **Chart.js Auto**: Plugin for automatic chart scaling

### Interactive Components & Animations
- **GSAP**: High-performance JavaScript animation library
- **React Hot Toast**: Beautiful toast notifications
- **React Toastify**: Toast notifications library

### File Upload & Processing
- **React Dropzone**: Simple HTML5 drag-drop zone with React
- **Browser Image Compression**: Client-side image compression library

### Development & Build Tools
- **Vite**: Fast build tool and development server
- **ESLint**: JavaScript linting utility
- **Autoprefixer**: PostCSS plugin for CSS vendor prefixing

## Client-side Caching

### IndexedDB Implementation
The Admin Panel uses IndexedDB for persistent client-side caching of API responses:

**Features:**
- **Persistent Storage**: Data survives browser sessions and refreshes
- **TTL Support**: Automatic expiration of cached data
- **Fallback Storage**: In-memory Map when IndexedDB is unavailable
- **Performance**: Faster subsequent loads and reduced API calls

**Cached Data:**
- Membership lists and user data
- Content management data (hero banners, offers, etc.)
- Gallery images and room information
- Reservation data and analytics

### Cache Management
- **Automatic Cleanup**: Expired data is automatically removed
- **Manual Invalidation**: Cache can be cleared programmatically
- **Size Monitoring**: Cache size tracking and limits
- **Error Handling**: Graceful fallback when caching fails

## Features

### Authentication System
- **JWT-based Authentication**: Secure token-based admin authentication
- **Role-based Access**: Admin role verification and permissions
- **Session Management**: Automatic token refresh and logout
- **Protected Routes**: Route-level authentication guards

### Theme Management
- **Dark/Light Mode Toggle**: Complete theme system with react-icons
- **Theme Persistence**: localStorage-based theme preferences
- **System Preference Detection**: Automatic theme detection
- **Smooth Transitions**: CSS transitions between themes
- **shadcn Switch Component**: Modern toggle interface

### Content Management System (CMS)
- **Hero Banner Management**: Upload and manage homepage banners
- **Curated Offers**: Create and manage special offers
- **Membership Blocks**: Content blocks for membership benefits
- **Navigation Links**: Dynamic navigation menu management
- **Footer Links**: Manage footer navigation and social links
- **Gallery Management**: Image gallery for hotel photos
- **About Page Content**: Manage company information and history

### User & Membership Management
- **Membership Administration**: View, approve, and manage memberships
- **User Activity Tracking**: Monitor user actions and login history
- **Bulk Operations**: Batch user management and status updates
- **Search & Filtering**: Advanced search and filter capabilities

### Room & Facility Management
- **Room Inventory**: Add, edit, and manage gaming rooms
- **Facility Management**: Manage hotel facilities and amenities
- **Image Upload**: Cloudinary integration for image management
- **Pricing Management**: Dynamic pricing and availability

### Analytics & Reporting
- **Dashboard Analytics**: Real-time statistics and KPIs
- **Chart Visualizations**: Interactive charts using Chart.js
- **User Activity Reports**: Detailed user behavior analytics
- **Performance Metrics**: System performance monitoring

### Reservation Management
- **Booking Oversight**: View and manage all reservations
- **Status Updates**: Approve, modify, or cancel bookings
- **Calendar Integration**: Visual booking calendar
- **Notification System**: Automated booking confirmations

## Architecture

### Component Structure
- **Pages**: Route-based admin pages (Dashboard, Users, Content, etc.)
- **Components**: Reusable UI components (Sidebar, Topbar, Forms, etc.)
- **Services**: API service layer with Axios interceptors
- **Context**: React Context for theme and authentication management
- **Utils**: Utility functions and IndexedDB cache management

### State Management
- **React Context**: Global state for theme and authentication
- **Local State**: Component-level state with React hooks
- **Persistent State**: localStorage for preferences, IndexedDB for cache

### API Integration
- **Axios Interceptors**: Automatic token attachment and error handling
- **Cached API Calls**: IndexedDB-backed API response caching
- **Error Handling**: Comprehensive error handling with user notifications
- **Request Optimization**: Intelligent caching and request deduplication

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn package manager

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## Environment Configuration

### Environment Variables
- `VITE_BACKEND_URL`: Backend API base URL
- `VITE_CLOUDINARY_URL`: Cloudinary CDN URL for image uploads

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Optimizations

- **Code Splitting**: Route-based code splitting with React.lazy
- **Image Optimization**: Automatic image compression and lazy loading
- **Bundle Analysis**: Optimized bundle sizes with tree shaking
- **Caching**: Intelligent caching strategies for improved load times
- **IndexedDB**: Persistent client-side caching for offline capabilities

## Recent Enhancements

### Theme System
- Implemented complete dark/light mode toggle using React Context
- Added shadcn switch component for modern theme toggle
- Created CSS variables for consistent theming across components
- Added localStorage persistence for user theme preferences

### Client-side Caching
- Integrated IndexedDB for persistent data caching
- Implemented TTL-based cache expiration
- Added fallback storage mechanisms
- Optimized API calls with intelligent caching

### UI/UX Improvements
- Enhanced responsive design across all components
- Improved form styling and validation
- Added loading states and error handling
- Implemented modern card-based layouts

### Content Management
- Comprehensive CMS for all website content
- Drag-and-drop image upload functionality
- Real-time content preview and editing
- Bulk content operations and management

## Contributing

1. Follow established code style and conventions
2. Use ESLint for code quality
3. Test components thoroughly
4. Create feature branches for new developments
5. Follow Git commit conventions

## License

This project is licensed under the MIT License.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx
│   ├── Topbar.jsx
│   └── Home/
│       ├── StatCard.jsx
│       ├── FavouriteItemCard.jsx
│       ├── DonutRing.jsx
│       └── SparkLine.jsx
├── context/
│   └── ThemeContext.jsx
├── pages/
│   ├── Home.jsx
│   ├── MenuManagementPage/
│   │   └── MenuManagement.jsx
│   └── PageManagement.jsx
├── constants/
│   └── sidebarLinks.js
├── App.jsx
├── main.jsx
└── index.css
```

## Recent Enhancements

1. **Theme System**:
   - Implemented a complete dark/light mode toggle using React Context
   - Added shadcn switch component for theme toggle
   - Created CSS variables for consistent theming
   - Added localStorage persistence for user preferences

2. **Authentication Pages**:
   - Redesigned login, signup, and forgot password pages
   - Centered all authentication forms on the page
   - Added consistent styling with dark mode support
   - Fixed navigation between authentication pages

3. **Routing Improvements**:
   - Separated layouts for authentication and main application
   - Sidebar and topbar now hidden on authentication routes
   - Proper route structure for all pages

4. **UI Components**:
   - Fixed sidebar icon imports and navigation links
   - Improved form styling across all components
   - Added consistent dark mode support for all elements

5. **Room Management Page**:
   - Enhanced UI with modern card-based layout
   - Added unique room numbers and varied room types/prices
   - Improved table design with better spacing and visual hierarchy
   - Added "Add New Room" button
   - Enhanced filter buttons with better styling
   - Improved pagination controls
   - Full dark mode support with appropriate color schemes

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the project for production
- `npm run preview` - Previews the production build locally
- `npm run lint` - Runs ESLint on the project

## Browser Support

The application is optimized for modern browsers that support:
- CSS Variables
- ES6+ JavaScript
- Flexbox and Grid layouts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.
