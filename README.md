# Silver Arcade Premier Admin Panel

A modern, responsive admin panel built with React and Tailwind CSS featuring dark/light mode toggle functionality.

## Features

### Authentication
- Login page with email/username and password
- Signup page with full registration form
- Forgot password functionality
- Clean, centered authentication forms with dark mode support

### Theme Management
- Dark/light mode toggle using react-icons
- Theme persistence using localStorage
- System preference detection for initial theme
- Smooth transitions between themes
- shadcn switch component for theme toggle

### UI Components
- Responsive sidebar navigation with react-icons
- Topbar with search functionality and theme toggle
- Dashboard with statistical cards and favorite items
- Consistent styling across all components with dark mode support

### Routing
- Separate layouts for authentication and main application pages
- Sidebar and topbar hidden on authentication routes
- Proper navigation between pages

### Menu Management
- Manage menu items with functionality to add, delete, and filter by category.
- Users can filter items by categories such as Veg, Non-Veg, Drinks, and Veg & Non-Veg.
- Visual feedback for active filters and empty state handling.

### Page Management
- Manage content and images for the main website.
- Upload images with drag-and-drop functionality.
- Input fields for headline text, sub-headline text, and description.

## Technologies Used

- React 18
- Tailwind CSS
- React Router v6
- react-icons
- shadcn/ui
- Chart.js (for data visualization)
- GSAP (for animations)

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
