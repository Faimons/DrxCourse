-- trading-platform/backend/src/database/migrations/add_dynamic_lessons.sql
-- PostgreSQL Version

-- 1. Erstelle ENUM Types (PostgreSQL braucht das)
CREATE TYPE difficulty_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');
CREATE TYPE slide_type AS ENUM ('welcome', 'definition', 'concept', 'example', 'quiz', 'summary');
CREATE TYPE migration_status_type AS ENUM ('pending', 'migrated', 'verified', 'published');

-- 2. Lessons Table für migrierte Lektionen
CREATE TABLE IF NOT EXISTS dynamic_lessons (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    module VARCHAR(100) DEFAULT 'Trading Masterclass',
    difficulty difficulty_level DEFAULT 'Intermediate',
    estimated_time INTEGER DEFAULT 20,
    objectives JSONB,
    metadata JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Update Trigger für updated_at (PostgreSQL braucht das manuell)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_dynamic_lessons_updated_at 
    BEFORE UPDATE ON dynamic_lessons 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Slides Table für alle Slide-Daten
CREATE TABLE IF NOT EXISTS dynamic_slides (
    id VARCHAR(50) PRIMARY KEY,
    lesson_id VARCHAR(50) NOT NULL,
    slide_order INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    type slide_type NOT NULL,
    duration INTEGER DEFAULT 3,
    content JSONB NOT NULL,
    speech_script TEXT,
    interactive_components JSONB,
    original_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES dynamic_lessons(id) ON DELETE CASCADE
);

-- 5. User Progress für neue Lektionen
CREATE TABLE IF NOT EXISTS dynamic_lesson_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    lesson_id VARCHAR(50) NOT NULL,
    slide_id VARCHAR(50),
    completed_at TIMESTAMP NULL,
    time_spent INTEGER DEFAULT 0,
    quiz_score INTEGER NULL,
    quiz_passed BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES dynamic_lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (slide_id) REFERENCES dynamic_slides(id) ON DELETE CASCADE,
    UNIQUE (user_id, lesson_id, slide_id)
);

-- Update Trigger für progress
CREATE TRIGGER update_dynamic_lesson_progress_updated_at 
    BEFORE UPDATE ON dynamic_lesson_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Migration Status Tracking
CREATE TABLE IF NOT EXISTS migration_status (
    id SERIAL PRIMARY KEY,
    original_file VARCHAR(255) NOT NULL,
    lesson_id VARCHAR(50) NOT NULL,
    status migration_status_type DEFAULT 'pending',
    migration_date TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES dynamic_lessons(id) ON DELETE CASCADE
);

-- 7. Indexes für Performance
CREATE INDEX IF NOT EXISTS idx_lessons_module ON dynamic_lessons(module);
CREATE INDEX IF NOT EXISTS idx_lessons_difficulty ON dynamic_lessons(difficulty);
CREATE INDEX IF NOT EXISTS idx_slides_type ON dynamic_slides(type);
CREATE INDEX IF NOT EXISTS idx_lesson_order ON dynamic_slides(lesson_id, slide_order);
CREATE INDEX IF NOT EXISTS idx_progress_user ON dynamic_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson ON dynamic_lesson_progress(lesson_id);

-- 8. Views für einfache Abfragen (PostgreSQL Syntax)
CREATE OR REPLACE VIEW lesson_overview AS
SELECT 
    l.id,
    l.title,
    l.subtitle,
    l.module,
    l.difficulty,
    l.estimated_time,
    COUNT(s.id) as total_slides,
    COUNT(CASE WHEN s.type = 'quiz' THEN 1 END) as quiz_slides,
    COUNT(CASE WHEN s.interactive_components->>'hasTTS' = 'true' THEN 1 END) as tts_slides,
    COUNT(CASE WHEN s.interactive_components->>'hasCharts' = 'true' THEN 1 END) as chart_slides
FROM dynamic_lessons l
LEFT JOIN dynamic_slides s ON l.id = s.lesson_id
WHERE l.is_active = true
GROUP BY l.id, l.title, l.subtitle, l.module, l.difficulty, l.estimated_time;

-- 9. Sample Data für Testing (PostgreSQL JSON Syntax)
INSERT INTO dynamic_lessons (id, title, subtitle, difficulty, estimated_time, objectives) VALUES
('demo-lesson-1', 'Demo Trading Basics', 'Ein Beispiel für migrierte Lektionen', 'Beginner', 15, 
 '["Trading verstehen", "Charts lesen", "Grundlagen anwenden"]'::jsonb);

INSERT INTO dynamic_slides (id, lesson_id, slide_order, title, type, content) VALUES
('demo-slide-1', 'demo-lesson-1', 1, 'Willkommen', 'welcome', 
 '{"description": "Demo Slide für Testing", "keyPoints": ["Punkt 1", "Punkt 2"]}'::jsonb);