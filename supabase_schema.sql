-- FitFortune Database Schema
-- This file contains the SQL schema for creating all necessary tables in Supabase

-- Enable Row Level Security (RLS) for all tables
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Profiles Table (extended user information)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    date_of_birth DATE,
    gender TEXT,
    activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
    goal TEXT CHECK (goal IN ('lose_weight', 'maintain', 'gain_weight', 'build_muscle')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
    ON profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Profiles are created by user registration trigger" 
    ON profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Meals Table (food items logged by users)
CREATE TABLE IF NOT EXISTS meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    calories INTEGER NOT NULL,
    protein NUMERIC(6,2) NOT NULL,
    carbs NUMERIC(6,2) NOT NULL,
    fats NUMERIC(6,2) NOT NULL,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    consumed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on meals
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

-- Create policies for meals
CREATE POLICY "Users can view their own meals" 
    ON meals FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meals" 
    ON meals FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals" 
    ON meals FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals" 
    ON meals FOR DELETE 
    USING (auth.uid() = user_id);

-- Water Logs Table (water intake tracking)
CREATE TABLE IF NOT EXISTS water_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount_ml INTEGER NOT NULL CHECK (amount_ml > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    consumed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on water_logs
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for water_logs
CREATE POLICY "Users can view their own water logs" 
    ON water_logs FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own water logs" 
    ON water_logs FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own water logs" 
    ON water_logs FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own water logs" 
    ON water_logs FOR DELETE 
    USING (auth.uid() = user_id);

-- Nutrition Goals Table (user's nutritional targets)
CREATE TABLE IF NOT EXISTS nutrition_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    calories INTEGER NOT NULL,
    protein NUMERIC(6,2) NOT NULL,
    carbs NUMERIC(6,2) NOT NULL,
    fats NUMERIC(6,2) NOT NULL,
    water_ml INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on nutrition_goals
ALTER TABLE nutrition_goals ENABLE ROW LEVEL SECURITY;

-- Create policies for nutrition_goals
CREATE POLICY "Users can view their own nutrition goals" 
    ON nutrition_goals FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own nutrition goals" 
    ON nutrition_goals FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nutrition goals" 
    ON nutrition_goals FOR UPDATE 
    USING (auth.uid() = user_id);

-- Workouts Table (workout sessions)
CREATE TABLE IF NOT EXISTS workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    calories_burned INTEGER,
    workout_type TEXT CHECK (workout_type IN ('strength', 'cardio', 'flexibility', 'sport', 'other')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on workouts
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

-- Create policies for workouts
CREATE POLICY "Users can view their own workouts" 
    ON workouts FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workouts" 
    ON workouts FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts" 
    ON workouts FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts" 
    ON workouts FOR DELETE 
    USING (auth.uid() = user_id);

-- Achievements Table (predefined achievements)
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category TEXT CHECK (category IN ('nutrition', 'workout', 'water', 'general')),
    icon_url TEXT,
    points INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User Achievements Table (achievements earned by users)
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (user_id, achievement_id)
);

-- Enable RLS on user_achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for user_achievements
CREATE POLICY "Users can view their own achievements" 
    ON user_achievements FOR SELECT 
    USING (auth.uid() = user_id);

-- User Preferences Table (app preferences)
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    theme TEXT DEFAULT 'light',
    notifications_enabled BOOLEAN DEFAULT true,
    water_reminder_interval INTEGER DEFAULT 60, -- minutes
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user_preferences
CREATE POLICY "Users can view their own preferences" 
    ON user_preferences FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
    ON user_preferences FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
    ON user_preferences FOR UPDATE 
    USING (auth.uid() = user_id);

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create empty profile
    INSERT INTO public.profiles (id, username, full_name, avatar_url)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
    
    -- Create default nutrition goals based on standard recommendations
    INSERT INTO public.nutrition_goals (user_id, calories, protein, carbs, fats, water_ml)
    VALUES (new.id, 2000, 150, 250, 65, 2500);
    
    -- Create default user preferences
    INSERT INTO public.user_preferences (user_id)
    VALUES (new.id);
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_nutrition_goals_updated_at
    BEFORE UPDATE ON nutrition_goals
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Sample data for achievements (if needed)
INSERT INTO achievements (name, description, category, points)
VALUES 
    ('Water Warrior', 'Drink your daily water goal for 7 consecutive days', 'water', 20),
    ('Protein Powerhouse', 'Meet your protein goal for 5 consecutive days', 'nutrition', 15),
    ('Workout Wonder', 'Complete 10 workouts', 'workout', 25),
    ('Meal Master', 'Log all meals for 14 consecutive days', 'nutrition', 30),
    ('Early Bird', 'Log a breakfast before 8am for 5 consecutive days', 'nutrition', 15)
ON CONFLICT (name) DO NOTHING; 