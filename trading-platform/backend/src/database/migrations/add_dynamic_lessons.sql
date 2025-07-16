-- trading-platform/backend/src/database/migrations/add_dynamic_lessons.sql

-- 1. Lessons Table für migrierte Lektionen
CREATE TABLE IF NOT EXISTS dynamic_lessons (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    module VARCHAR(100) DEFAULT 'Trading Masterclass',
    difficulty ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Intermediate',
    estimated_time INT DEFAULT 20,
    objectives JSON,
    metadata JSON,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Slides Table für alle Slide-Daten
CREATE TABLE IF NOT EXISTS dynamic_slides (
    id VARCHAR(50) PRIMARY KEY,
    lesson_id VARCHAR(50) NOT NULL,
    slide_order INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    type ENUM('welcome', 'definition', 'concept', 'example', 'quiz', 'summary') NOT NULL,
    duration INT DEFAULT 3,
    content JSON NOT NULL,
    speech_script TEXT,
    interactive_components JSON,
    original_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES dynamic_lessons(id) ON DELETE CASCADE,
    INDEX idx_lesson_order (lesson_id, slide_order)
);

-- 3. User Progress für neue Lektionen
CREATE TABLE IF NOT EXISTS dynamic_lesson_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_id VARCHAR(50) NOT NULL,
    slide_id VARCHAR(50),
    completed_at TIMESTAMP NULL,
    time_spent INT DEFAULT 0,
    quiz_score INT NULL,
    quiz_passed BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES dynamic_lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (slide_id) REFERENCES dynamic_slides(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_lesson_slide (user_id, lesson_id, slide_id)
);

-- 4. Migration Status Tracking
CREATE TABLE IF NOT EXISTS migration_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_file VARCHAR(255) NOT NULL,
    lesson_id VARCHAR(50) NOT NULL,
    status ENUM('pending', 'migrated', 'verified', 'published') DEFAULT 'pending',
    migration_date TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES dynamic_lessons(id) ON DELETE CASCADE
);

-- 5. Indexes für Performance
CREATE INDEX idx_lessons_module ON dynamic_lessons(module);
CREATE INDEX idx_lessons_difficulty ON dynamic_lessons(difficulty);
CREATE INDEX idx_slides_type ON dynamic_slides(type);
CREATE INDEX idx_progress_user ON dynamic_lesson_progress(user_id);
CREATE INDEX idx_progress_lesson ON dynamic_lesson_progress(lesson_id);

-- 6. Views für einfache Abfragen
CREATE VIEW lesson_overview AS
SELECT 
    l.id,
    l.title,
    l.subtitle,
    l.module,
    l.difficulty,
    l.estimated_time,
    COUNT(s.id) as total_slides,
    COUNT(CASE WHEN s.type = 'quiz' THEN 1 END) as quiz_slides,
    COUNT(CASE WHEN JSON_EXTRACT(s.interactive_components, '$.hasTTS') = true THEN 1 END) as tts_slides,
    COUNT(CASE WHEN JSON_EXTRACT(s.interactive_components, '$.hasCharts') = true THEN 1 END) as chart_slides
FROM dynamic_lessons l
LEFT JOIN dynamic_slides s ON l.id = s.lesson_id
WHERE l.is_active = true
GROUP BY l.id;

-- 7. Sample Data für Testing (Optional)
INSERT INTO dynamic_lessons (id, title, subtitle, difficulty, estimated_time, objectives) VALUES
('demo-lesson-1', 'Demo Trading Basics', 'Ein Beispiel für migrierte Lektionen', 'Beginner', 15, 
 JSON_ARRAY('Trading verstehen', 'Charts lesen', 'Grundlagen anwenden'));

INSERT INTO dynamic_slides (id, lesson_id, slide_order, title, type, content) VALUES
('demo-slide-1', 'demo-lesson-1', 1, 'Willkommen', 'welcome', 
 JSON_OBJECT('description', 'Demo Slide für Testing', 'keyPoints', JSON_ARRAY('Punkt 1', 'Punkt 2')));