# CSK Muniz Photography - Angular Application

This is the Angular version of the CSK Muniz Photography website, converted from a static HTML/CSS/JavaScript site to a modern Angular application.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/          # Navigation component
│   │   ├── hero/            # Hero slider component
│   │   ├── portfolio/       # Portfolio gallery component
│   │   ├── about/           # About section component
│   │   ├── services/        # Services showcase component
│   │   ├── testimonials/    # Testimonials carousel component
│   │   ├── contact/         # Contact form component
│   │   └── footer/          # Footer component
│   ├── pages/
│   │   ├── home/            # Home page component
│   │   └── portfolio-category/  # Portfolio category page
│   ├── services/
│   │   ├── portfolio.service.ts
│   │   ├── navigation.service.ts
│   │   └── contact.service.ts
│   ├── models/
│   │   ├── portfolio-item.interface.ts
│   │   ├── testimonial.interface.ts
│   │   └── service.interface.ts
│   └── app.module.ts
├── assets/
│   └── images/              # All image assets
└── styles.css               # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Features

- **Component-based Architecture**: Modular Angular components for each section
- **TypeScript**: Full type safety and modern JavaScript features
- **Reactive Forms**: Angular reactive forms for contact form with validation
- **Routing**: Angular Router for navigation between pages
- **Services**: Centralized data management and business logic
- **Responsive Design**: Fully responsive design preserved from original
- **Animations**: Scroll-triggered animations and transitions
- **Image Viewer**: Modal image viewer for portfolio galleries

## Key Components

### Home Page
- Combines all section components (Hero, Portfolio, About, Services, Testimonials, Contact, Footer)
- Smooth scrolling navigation
- Scroll-based active link highlighting

### Portfolio Category Page
- Dynamic routing for portfolio categories
- Image gallery with modal viewer
- Navigation between images

## Services

- **PortfolioService**: Manages portfolio data and categories
- **NavigationService**: Handles scroll-based navigation and active section tracking
- **ContactService**: Handles form submission and validation

## Development

The application uses:
- Angular 17
- TypeScript 5.2
- RxJS for reactive programming
- Angular Animations for transitions

## Notes

- All original CSS styling has been preserved in `src/styles.css`
- Images are located in `src/assets/images/`
- The application maintains all original functionality while adding Angular features

