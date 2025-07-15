-- =============================================================================
-- TRADING PLATFORM DATABASE SCHEMA
-- PostgreSQL 14+ with UUID extension
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================================================
-- USERS TABLE
-- =============================================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(320) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    avatar_url VARCHAR(500),
    timezone VARCHAR(50) DEFAULT 'UTC',
    preferences JSONB DEFAULT '{}',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_login ON users(last_login);

-- =============================================================================
-- LESSONS TABLE
-- =============================================================================
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content TEXT,
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    duration_minutes INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    thumbnail_url VARCHAR(500),
    video_url VARCHAR(500),
    transcript TEXT,
    learning_objectives JSONB DEFAULT '[]',
    prerequisites JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lessons table
CREATE INDEX idx_lessons_category ON lessons(category);
CREATE INDEX idx_lessons_difficulty ON lessons(difficulty);
CREATE INDEX idx_lessons_status ON lessons(status);
CREATE INDEX idx_lessons_order ON lessons(category, order_index);
CREATE INDEX idx_lessons_created_at ON lessons(created_at);

-- =============================================================================
-- LESSON SLIDES TABLE
-- =============================================================================
CREATE TABLE lesson_slides (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    slide_type VARCHAR(50) DEFAULT 'content' CHECK (slide_type IN ('intro', 'content', 'quiz', 'summary', 'video')),
    order_index INTEGER DEFAULT 0,
    media_url VARCHAR(500),
    duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lesson_slides table
CREATE INDEX idx_lesson_slides_lesson_id ON lesson_slides(lesson_id);
CREATE INDEX idx_lesson_slides_order ON lesson_slides(lesson_id, order_index);

-- =============================================================================
-- USER PROGRESS TABLE
-- =============================================================================
CREATE TABLE user_progress (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_lessons INTEGER DEFAULT 0,
    completed_lessons INTEGER DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0, -- in minutes
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    average_quiz_score DECIMAL(5,2) DEFAULT 0,
    total_quiz_attempts INTEGER DEFAULT 0,
    last_activity TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- LESSON PROGRESS TABLE
-- =============================================================================
CREATE TABLE lesson_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    time_spent INTEGER DEFAULT 0, -- in minutes
    completed_at TIMESTAMP,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    current_slide INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, lesson_id)
);

-- Indexes for lesson_progress table
CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_completed ON lesson_progress(user_id, completed_at) WHERE completed_at IS NOT NULL;
CREATE INDEX idx_lesson_progress_last_accessed ON lesson_progress(last_accessed_at);

-- =============================================================================
-- QUIZ QUESTIONS TABLE
-- =============================================================================
CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of answer options
    correct_answer INTEGER NOT NULL, -- Index of correct option
    explanation TEXT,
    points INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for quiz_questions table
CREATE INDEX idx_quiz_questions_lesson_id ON quiz_questions(lesson_id);
CREATE INDEX idx_quiz_questions_order ON quiz_questions(lesson_id, order_index);

-- =============================================================================
-- QUIZ ATTEMPTS TABLE
-- =============================================================================
CREATE TABLE quiz_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    passed BOOLEAN DEFAULT FALSE,
    answers JSONB NOT NULL, -- User's answers
    results JSONB NOT NULL, -- Detailed results
    attempt_number INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for quiz_attempts table
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_lesson_id ON quiz_attempts(lesson_id);
CREATE INDEX idx_quiz_attempts_user_lesson ON quiz_attempts(user_id, lesson_id);
CREATE INDEX idx_quiz_attempts_created_at ON quiz_attempts(created_at);

-- =============================================================================
-- ACHIEVEMENTS TABLE
-- =============================================================================
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100),
    criteria VARCHAR(50) NOT NULL, -- e.g., 'lessons_completed', 'streak_days'
    threshold INTEGER NOT NULL, -- Required value to earn achievement
    category VARCHAR(50) DEFAULT 'general',
    points INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for achievements table
CREATE INDEX idx_achievements_criteria ON achievements(criteria);
CREATE INDEX idx_achievements_category ON achievements(category);

-- =============================================================================
-- USER ACHIEVEMENTS TABLE
-- =============================================================================
CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, achievement_id)
);

-- Indexes for user_achievements table
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_earned_at ON user_achievements(earned_at);

-- =============================================================================
-- LEARNING SESSIONS TABLE
-- =============================================================================
CREATE TABLE learning_sessions (
    id SERIAL PRIMARY KEY,
    session_id UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    duration_minutes INTEGER,
    lessons_completed INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    events_count INTEGER DEFAULT 0,
    platform VARCHAR(20) DEFAULT 'web',
    device_info JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for learning_sessions table
CREATE INDEX idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX idx_learning_sessions_session_id ON learning_sessions(session_id);
CREATE INDEX idx_learning_sessions_started_at ON learning_sessions(started_at);

-- =============================================================================
-- ANALYTICS EVENTS TABLE
-- =============================================================================
CREATE TABLE analytics_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES learning_sessions(session_id) ON DELETE SET NULL,
    event_name VARCHAR(100) NOT NULL,
    properties JSONB DEFAULT '{}',
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for analytics_events table
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_lesson_id ON analytics_events(lesson_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- =============================================================================
-- USER FEEDBACK TABLE
-- =============================================================================
CREATE TABLE user_feedback (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('bug', 'feature', 'improvement', 'complaint', 'praise', 'question')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    message TEXT NOT NULL,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE SET NULL,
    category VARCHAR(50) DEFAULT 'general',
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for user_feedback table
CREATE INDEX idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX idx_user_feedback_type ON user_feedback(type);
CREATE INDEX idx_user_feedback_lesson_id ON user_feedback(lesson_id);
CREATE INDEX idx_user_feedback_status ON user_feedback(status);
CREATE INDEX idx_user_feedback_created_at ON user_feedback(created_at);

-- =============================================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_feedback_updated_at BEFORE UPDATE ON user_feedback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- INSERT INITIAL DATA
-- =============================================================================

-- Insert default achievements
INSERT INTO achievements (name, description, icon, criteria, threshold, category, points) VALUES
('Erste Schritte', 'Erste Lektion abgeschlossen', '🎯', 'lessons_completed', 1, 'progress', 10),
('Auf dem Weg', '5 Lektionen abgeschlossen', '🚀', 'lessons_completed', 5, 'progress', 25),
('Halbzeit', '10 Lektionen abgeschlossen', '⭐', 'lessons_completed', 10, 'progress', 50),
('Fortgeschritten', '25 Lektionen abgeschlossen', '💎', 'lessons_completed', 25, 'progress', 100),
('Experte', '50 Lektionen abgeschlossen', '🏆', 'lessons_completed', 50, 'progress', 200),

('Täglicher Lerner', '7 Tage in Folge gelernt', '🔥', 'streak_days', 7, 'engagement', 30),
('Wochenkrieger', '14 Tage in Folge gelernt', '💪', 'streak_days', 14, 'engagement', 60),
('Monatsmeister', '30 Tage in Folge gelernt', '👑', 'streak_days', 30, 'engagement', 150),

('Zeitinvestor', '10 Stunden Lernzeit', '⏰', 'study_time', 600, 'time', 40),
('Wissensdurst', '25 Stunden Lernzeit', '📚', 'study_time', 1500, 'time', 75),
('Lernmaschine', '50 Stunden Lernzeit', '🤖', 'study_time', 3000, 'time', 150),

('Quiz-Neuling', 'Erstes Quiz bestanden', '🎓', 'quiz_passed', 1, 'quiz', 15),
('Quiz-Profi', '80% Durchschnitt in Quizzes', '🧠', 'quiz_average', 80, 'quiz', 50),
('Perfektionist', '95% Durchschnitt in Quizzes', '💯', 'quiz_average', 95, 'quiz', 100);

-- Insert sample lesson categories and initial lessons
INSERT INTO lessons (title, description, category, difficulty, duration_minutes, order_index, status, content) VALUES
('Trading Grundlagen', 'Einführung in die Welt des Tradings', 'grundlagen', 'beginner', 30, 1, 'published', 
'<h1>Trading Grundlagen</h1><p>Willkommen zur ersten Lektion unseres Trading-Kurses...</p>'),

('Marktanalyse verstehen', 'Lernen Sie die verschiedenen Arten der Marktanalyse kennen', 'analyse', 'beginner', 45, 2, 'published',
'<h1>Marktanalyse</h1><p>In dieser Lektion lernen Sie die Grundlagen der Marktanalyse...</p>'),

('Charts lesen', 'Verstehen Sie Charts und ihre Bedeutung', 'technische-analyse', 'beginner', 35, 3, 'published',
'<h1>Charts lesen</h1><p>Charts sind die Sprache der Märkte...</p>'),

('Risikomanagement', 'Wie Sie Ihr Kapital schützen', 'risikomanagement', 'intermediate', 40, 4, 'published',
'<h1>Risikomanagement</h1><p>Das wichtigste Thema für jeden Trader...</p>'),

('Psychologie des Tradings', 'Emotionen kontrollieren und erfolgreich handeln', 'psychologie', 'intermediate', 50, 5, 'published',
'<h1>Trading-Psychologie</h1><p>Der Kampf zwischen Gier und Angst...</p>');

-- Insert sample quiz questions
INSERT INTO quiz_questions (lesson_id, question, options, correct_answer, explanation, points, order_index) VALUES
(1, 'Was ist Trading?', 
 '["Langfristige Investition", "Kurzfristige Spekulation", "Sparen auf dem Bankkonto", "Immobilienkauf"]', 
 1, 'Trading ist kurzfristige Spekulation mit dem Ziel, von Preisbewegungen zu profitieren.', 2, 1),

(1, 'Welche Märkte können getradet werden?', 
 '["Nur Aktien", "Nur Forex", "Aktien, Forex, Rohstoffe, Kryptowährungen", "Nur Kryptowährungen"]', 
 2, 'Trading ist in vielen verschiedenen Märkten möglich.', 2, 2),

(2, 'Was ist technische Analyse?', 
 '["Analyse von Unternehmensdaten", "Analyse von Charts und Preisbewegungen", "Analyse von Nachrichten", "Analyse von Wirtschaftsdaten"]', 
 1, 'Technische Analyse untersucht Charts und Preisbewegungen, um zukünftige Bewegungen vorherzusagen.', 2, 1),

(3, 'Was zeigt ein Candlestick-Chart?', 
 '["Nur den Schlusskurs", "Eröffnung, Hoch, Tief, Schluss", "Nur das Volumen", "Nur die Zeit"]', 
 1, 'Ein Candlestick zeigt alle wichtigen Preisdaten einer Periode: Eröffnung, Hoch, Tief und Schluss.', 2, 1);

-- Create admin user (password: admin123!)
INSERT INTO users (email, password_hash, name, role, status, email_verified) VALUES
('admin@tradingplatform.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewafHVyhO/9l.jNO', 'Administrator', 'admin', 'active', true);

-- Create sample student user (password: student123!)
INSERT INTO users (email, password_hash, name, role, status, email_verified) VALUES
('student@example.com', '$2a$12$X5PB8fKbUe1Q8JNJqGFdKuIj.BZxOzX3Nc/XkQ6XKMrn8PHsF8uIS', 'Max Mustermann', 'student', 'active', true);

-- Initialize progress for sample student
INSERT INTO user_progress (user_id, total_lessons, completed_lessons) VALUES
(2, 5, 0);

-- =============================================================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- =============================================================================

-- Function to update user progress after lesson completion
CREATE OR REPLACE FUNCTION update_user_progress_on_lesson_completion()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update if lesson was just completed (completed_at changed from NULL to a timestamp)
    IF OLD.completed_at IS NULL AND NEW.completed_at IS NOT NULL THEN
        UPDATE user_progress 
        SET 
            completed_lessons = completed_lessons + 1,
            total_time_spent = total_time_spent + NEW.time_spent,
            last_activity = NEW.completed_at
        WHERE user_id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic progress updates
CREATE TRIGGER trigger_update_user_progress 
    AFTER UPDATE ON lesson_progress
    FOR EACH ROW 
    EXECUTE FUNCTION update_user_progress_on_lesson_completion();

-- Function to calculate and update streak
CREATE OR REPLACE FUNCTION update_learning_streak(p_user_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    current_streak INTEGER := 0;
    longest_streak INTEGER := 0;
BEGIN
    -- Calculate current streak
    WITH daily_activity AS (
        SELECT DISTINCT DATE(completed_at) as activity_date
        FROM lesson_progress
        WHERE user_id = p_user_id 
          AND completed_at IS NOT NULL
        ORDER BY activity_date DESC
    ),
    streak_calculation AS (
        SELECT 
            activity_date,
            activity_date - (ROW_NUMBER() OVER (ORDER BY activity_date DESC))::integer as streak_group
        FROM daily_activity
    )
    SELECT COUNT(*)
    INTO current_streak
    FROM streak_calculation
    WHERE streak_group = (
        SELECT streak_group 
        FROM streak_calculation 
        WHERE activity_date = CURRENT_DATE
        LIMIT 1
    );
    
    -- Get longest streak from user_progress
    SELECT COALESCE(user_progress.longest_streak, 0)
    INTO longest_streak
    FROM user_progress
    WHERE user_id = p_user_id;
    
    -- Update user progress with new streak data
    UPDATE user_progress
    SET 
        current_streak = COALESCE(current_streak, 0),
        longest_streak = GREATEST(longest_streak, COALESCE(current_streak, 0))
    WHERE user_id = p_user_id;
    
    RETURN COALESCE(current_streak, 0);
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- VIEWS FOR COMMON QUERIES
-- =============================================================================

-- View for user dashboard data
CREATE VIEW user_dashboard_view AS
SELECT 
    u.id as user_id,
    u.name,
    u.email,
    up.total_lessons,
    up.completed_lessons,
    CASE 
        WHEN up.total_lessons > 0 THEN ROUND((up.completed_lessons::decimal / up.total_lessons) * 100, 2)
        ELSE 0 
    END as completion_percentage,
    up.total_time_spent,
    up.current_streak,
    up.longest_streak,
    up.average_quiz_score,
    up.last_activity,
    u.created_at as start_date
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
WHERE u.status = 'active';

-- View for lesson statistics
CREATE VIEW lesson_stats_view AS
SELECT 
    l.id,
    l.title,
    l.category,
    l.difficulty,
    l.duration_minutes,
    COUNT(lp.id) as total_completions,
    AVG(lp.time_spent) as avg_time_spent,
    COUNT(DISTINCT lp.user_id) as unique_learners,
    AVG(qa.percentage) as avg_quiz_score,
    COUNT(qa.id) as total_quiz_attempts
FROM lessons l
LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.completed_at IS NOT NULL
LEFT JOIN quiz_attempts qa ON l.id = qa.lesson_id
WHERE l.status = 'published'
GROUP BY l.id, l.title, l.category, l.difficulty, l.duration_minutes;

-- =============================================================================
-- PERFORMANCE OPTIMIZATIONS
-- =============================================================================

-- Partial indexes for better performance
CREATE INDEX CONCURRENTLY idx_lesson_progress_active_users 
ON lesson_progress(user_id, last_accessed_at) 
WHERE last_accessed_at >= CURRENT_DATE - INTERVAL '30 days';

CREATE INDEX CONCURRENTLY idx_analytics_events_recent 
ON analytics_events(created_at, event_name) 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days';

-- =============================================================================
-- SECURITY & CONSTRAINTS
-- =============================================================================

-- Row Level Security (RLS) for multi-tenant security
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Example RLS policy (would be customized based on application needs)
CREATE POLICY lesson_progress_user_policy ON lesson_progress
    FOR ALL TO authenticated_users
    USING (user_id = current_setting('app.user_id')::INTEGER);

-- =============================================================================
-- MAINTENANCE PROCEDURES
-- =============================================================================

-- Procedure to clean up old analytics events
CREATE OR REPLACE FUNCTION cleanup_old_analytics_events()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM analytics_events 
    WHERE created_at < CURRENT_DATE - INTERVAL '90 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Procedure to update lesson totals in user_progress
CREATE OR REPLACE FUNCTION refresh_user_lesson_totals()
RETURNS VOID AS $$
BEGIN
    UPDATE user_progress
    SET total_lessons = (
        SELECT COUNT(*)
        FROM lessons
        WHERE status = 'published'
    )
    WHERE total_lessons != (
        SELECT COUNT(*)
        FROM lessons
        WHERE status = 'published'
    );
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE users IS 'Main user accounts table with authentication and profile data';
COMMENT ON TABLE lessons IS 'Course lessons with content and metadata';
COMMENT ON TABLE lesson_progress IS 'Individual user progress through lessons';
COMMENT ON TABLE quiz_attempts IS 'User quiz attempts and results';
COMMENT ON TABLE achievements IS 'Available achievements/badges in the system';
COMMENT ON TABLE user_achievements IS 'Achievements earned by users';
COMMENT ON TABLE learning_sessions IS 'User learning sessions for analytics';
COMMENT ON TABLE analytics_events IS 'Detailed user interaction events';
COMMENT ON TABLE user_feedback IS 'User feedback and support requests';

COMMENT ON COLUMN users.preferences IS 'JSON object containing user preferences like notifications, theme, etc.';
COMMENT ON COLUMN lessons.learning_objectives IS 'JSON array of learning objectives for the lesson';
COMMENT ON COLUMN quiz_questions.options IS 'JSON array of possible answers';
COMMENT ON COLUMN quiz_attempts.answers IS 'JSON array of user submitted answers';
COMMENT ON COLUMN quiz_attempts.results IS 'JSON object with detailed quiz results';

-- =============================================================================
-- SCHEMA VERSION
-- =============================================================================

CREATE TABLE schema_migrations (
    version VARCHAR(20) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schema_migrations (version) VALUES ('1.0.0');