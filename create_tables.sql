-- Create meals table
CREATE TABLE IF NOT EXISTS public.meals (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  name TEXT,
  calories NUMERIC,
  protein NUMERIC,
  carbs NUMERIC,
  fats NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add some sample data
INSERT INTO public.meals (user_id, name, calories, protein, carbs, fats, created_at)
VALUES 
  ('test-user', 'Oatmeal with Berries', 350, 12, 60, 6, now()),
  ('test-user', 'Grilled Chicken Salad', 450, 40, 10, 25, now()),
  ('test-user', 'Protein Smoothie', 300, 30, 30, 5, now());

-- Create water_intake table (optional)
CREATE TABLE IF NOT EXISTS public.water_intake (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  amount_ml NUMERIC,
  consumed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create nutrition_goals table (optional)
CREATE TABLE IF NOT EXISTS public.nutrition_goals (
  id SERIAL PRIMARY KEY,
  user_id TEXT UNIQUE,
  calories NUMERIC DEFAULT 2000,
  protein NUMERIC DEFAULT 150,
  carbs NUMERIC DEFAULT 250,
  fats NUMERIC DEFAULT 65,
  water_ml NUMERIC DEFAULT 2500,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
); 