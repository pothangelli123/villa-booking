# Villa Booking Website - Project Summary

## Overview

This is a direct booking website for a luxury villa, providing an engaging user interface and seamless booking experience. The website is built with modern web technologies and follows best practices for performance, accessibility, and user experience.

![Villa Booking Website](https://dummyimage.com/1200x630/0284c7/ffffff&text=Luxury+Villa+Booking+Website)

## Live Demo

You can view the live demo at: http://localhost:3000 (after running the development server)

## Features

- **Visually Stunning UI**: Modern, responsive design with animations and transitions
- **Multi-step Booking Flow**: User-friendly booking process with date selection, guest details, and payment
- **Photo Gallery**: Showcase high-quality images of the villa
- **Booking Management**: Store and retrieve booking information using Supabase
- **Payment Processing**: Secure payment processing with Stripe integration
- **Mobile Responsive**: Fully responsive design that works on all device sizes

## Tech Stack

- **Frontend**: 
  - Next.js (React framework)
  - TypeScript (Type-safe JavaScript)
  - TailwindCSS (Utility-first CSS framework)
  - Framer Motion (Animation library)
  - React Icons (Icon library)
  - React Datepicker (Date selection component)
  - React Hot Toast (Notification system)

- **Backend**:
  - Next.js API Routes (Serverless functions)
  - Supabase (Database and authentication)
  - Stripe (Payment processing)

## Project Structure

```
villa-booking/
├── components/       # Reusable UI components
├── pages/            # Next.js pages
│   ├── api/          # API routes (serverless functions)
│   │   ├── bookings.ts    # Booking API
│   │   └── payment.ts     # Payment API
│   ├── _app.tsx      # Custom App component
│   ├── _document.tsx # Custom Document component
│   ├── index.tsx     # Homepage
│   └── booking.tsx   # Booking page
├── public/           # Static assets
│   └── images/       # Villa images
├── styles/           # Global styles
│   └── globals.css   # TailwindCSS imports and custom styles
├── utils/            # Utility functions
│   └── supabase.ts   # Supabase client and helpers
├── scripts/          # Helper scripts
│   ├── build.js      # Production build script
│   └── init-supabase.js # Supabase initialization script
├── setup.js          # Project setup script
├── .env.local        # Environment variables
├── next.config.js    # Next.js configuration
├── package.json      # Project dependencies
├── postcss.config.js # PostCSS configuration
├── tailwind.config.js # TailwindCSS configuration
└── tsconfig.json     # TypeScript configuration
```

## Getting Started

1. Clone the repository
2. Run `node setup.js` to initialize the project
3. Start the development server with `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Home Page Features

- Hero section with stunning background and call-to-action
- Villa details section with amenities and features
- Photo gallery with interactive elements
- Call-to-action section
- Footer with contact information and quick links

## Booking Page Features

- Three-step booking process:
  1. Date selection with interactive calendar
  2. Guest details form with validation
  3. Payment information with Stripe integration
- Real-time booking summary
- Booking confirmation page with details

## Backend API

- **Booking API**: Handles booking creation and retrieval
- **Payment API**: Processes payments with Stripe

## Database Schema

### Bookings Table
```sql
CREATE TABLE bookings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  check_in date NOT NULL,
  check_out date NOT NULL,
  guests integer NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  special_requests text,
  total_amount numeric NOT NULL,
  payment_id text NOT NULL,
  villa_id text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
```

### Villas Table
```sql
CREATE TABLE villas (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  short_description text NOT NULL,
  location text NOT NULL,
  price numeric NOT NULL,
  bedrooms integer NOT NULL,
  bathrooms integer NOT NULL,
  max_guests integer NOT NULL,
  images text[] NOT NULL,
  amenities text[] NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
```

## Deployment

To deploy this website to production:

1. Set up a Supabase project and configure the database
2. Set up a Stripe account and obtain API keys
3. Update the environment variables with your Supabase and Stripe credentials
4. Run `node scripts/build.js` to build the production version
5. Deploy the build to your hosting provider (Vercel, Netlify, etc.)

## Future Enhancements

- User authentication for booking management
- Admin dashboard for villa owners
- Multiple villa listings
- Availability calendar
- Integration with more payment gateways
- Email notifications for bookings
- Guest reviews and ratings 