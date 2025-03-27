# Supabase Integration Guide

## Setup Instructions

### Local Development

1. Create a `.env` file in the root directory with the following variables:
```
REACT_APP_SUPABASE_URL=your-project-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

2. Replace `your-project-url` and `your-anon-key` with your Supabase project credentials from the Supabase dashboard.

### Vercel Deployment

1. Go to your project settings in Vercel
2. Navigate to the Environment Variables section
3. Add the following environment variables:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

4. Set their values to your Supabase project credentials

## Database Schema

Ensure your Supabase database has the following tables:

- `sales_analytics`
  - `period` (text)
  - `product` (text)
  - `percentage` (numeric)

- `revenue_analytics`
  - `period` (text)
  - `amount` (numeric)
  - `growth_rate` (numeric)

- `shops`
  - `name` (text)
  - `location` (text)
  - `revenue` (numeric)

- `recent_activity`
  - `created_at` (timestamp)
  - `activity` (text)
  - `user` (text)

- `transactions`
  - `created_at` (timestamp)
  - `order_id` (text)
  - `amount` (numeric)
  - `status` (text)

## API Integration

The Supabase client is configured in `src/config/supabase.js`. Database operations are defined in `src/config/database.js`.

Authentication methods are available in `src/config/auth.js`.

## Dependencies

Make sure to install the Supabase client library:

```bash
npm install @supabase/supabase-js
```