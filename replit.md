# Overview

**Bloom** is a comprehensive menstrual cycle tracking application built as a full-stack web application. The project enables users to log daily health data, track menstrual cycles, monitor symptoms and moods, and gain insights into their reproductive health patterns. The application features an intuitive calendar interface, data visualization, and predictive cycle calculations to help users understand their menstrual health.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React 18 with TypeScript, utilizing a modern single-page application (SPA) architecture with client-side routing via Wouter.

**UI System**: Built on shadcn/ui component library with Radix UI primitives, providing accessible and customizable components. The design system uses Tailwind CSS for styling with a custom color scheme and design tokens for consistent theming.

**State Management**: Uses React's built-in state management with custom hooks for data persistence and TanStack Query for server state management and caching.

**Navigation**: Implements responsive navigation with a desktop header and mobile bottom navigation bar, optimized for both desktop and mobile experiences.

## Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js, configured for both development and production environments.

**Database Layer**: PostgreSQL database with Drizzle ORM for type-safe database operations and schema management. The application uses Neon Database for serverless PostgreSQL hosting.

**Storage Interface**: Implements an abstraction layer with both in-memory storage (for development) and database storage options, following the Repository pattern for data access.

**API Design**: RESTful API structure with `/api` prefix for all backend endpoints, implementing proper error handling and request logging middleware.

## Data Storage Solutions

**Primary Database**: PostgreSQL with Drizzle ORM providing type-safe database queries and migrations. The database schema is centralized in the shared directory for consistency between frontend and backend.

**Local Storage**: Client-side localStorage implementation for offline data persistence and quick access to user data, with full import/export capabilities for data portability.

**Session Management**: Uses express-session with PostgreSQL session store for user session persistence across requests.

## Authentication and Authorization

The application currently implements a basic storage interface with user management capabilities, designed to support authentication systems. The architecture includes user creation and retrieval methods, preparing for future authentication implementation.

## External Dependencies

**Database**: Neon Database (serverless PostgreSQL) for production data storage with connection pooling and automatic scaling.

**UI Components**: 
- Radix UI for accessible component primitives
- Lucide React for consistent iconography
- Embla Carousel for interactive carousel components

**Development Tools**:
- Vite for fast development builds and hot module replacement
- ESBuild for production bundling
- Replit integration for development environment support

**Data Validation**: Zod for runtime type validation and schema parsing, ensuring data integrity across the application stack.

**Date Management**: date-fns library for comprehensive date manipulation and formatting, crucial for cycle calculations and calendar functionality.

**Form Handling**: React Hook Form with Hookform Resolvers for efficient form state management and validation.

The architecture emphasizes type safety throughout the stack, offline-first capabilities, and responsive design patterns suitable for health tracking applications requiring reliable data persistence and user privacy.