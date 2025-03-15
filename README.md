# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
# FitFortune

# Nutrition Tracker

A simple nutrition tracking application that helps users track their meals, water intake, and nutritional goals.

## Setup Instructions

### 1. Supabase Setup

1. Create a Supabase account at [https://supabase.com](https://supabase.com) if you don't have one.
2. Create a new project in Supabase.
3. Once your project is created, go to the SQL Editor in the Supabase dashboard.
4. Copy the contents of the `create_tables.sql` file from this repository.
5. Paste the SQL into the SQL Editor and run it to create the necessary tables.

### 2. Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```
   cp .env.example .env
   ```

2. Update the `.env` file with your Supabase credentials:
   - `VITE_SUPABASE_URL`: Your Supabase project URL (found in Project Settings > API)
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon/public key (found in Project Settings > API)
   - `VITE_GEMINI_API_KEY`: Your Gemini API key (if using Gemini AI features)

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm run dev
```

### 5. Test the Database Connection

```bash
npm test
```

## Features

- Track meals and their nutritional content
- Monitor water intake
- Set and track nutritional goals
- Get nutritional advice using Gemini AI

## Troubleshooting

### Database Connection Issues

If you're experiencing database connection issues:

1. Check that your Supabase URL and anon key are correct in the `.env` file.
2. Verify that the required tables exist in your Supabase project.
3. Run the SQL in `create_tables.sql` to create the necessary tables.
4. Run `npm test` to verify the connection.

### Gemini API Issues

If you're experiencing issues with the Gemini API:

1. Check that your Gemini API key is correct in the `.env` file.
2. Verify that you have access to the Gemini API.

## License

MIT
