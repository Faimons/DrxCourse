import Joi from 'joi';

// Profile update validation
export const validateProfileUpdate = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .pattern(new RegExp('^[a-zA-ZäöüÄÖÜß\\s\\-\\.]+$'))
      .trim()
      .optional()
      .messages({
        'string.min': 'Name muss mindestens 2 Zeichen lang sein',
        'string.max': 'Name ist zu lang',
        'string.pattern.base': 'Name darf nur Buchstaben, Leerzeichen, Bindestriche und Punkte enthalten'
      }),
    
    timezone: Joi.string()
      .valid(...Intl.supportedValuesOf('timeZone'))
      .optional()
      .messages({
        'any.only': 'Ungültige Zeitzone'
      }),
    
    preferences: Joi.object({
      notifications: Joi.boolean().default(true),
      darkMode: Joi.boolean().default(false),
      language: Joi.string().valid('de', 'en', 'es', 'fr').default('de'),
      autoplay: Joi.boolean().default(true),
      subtitles: Joi.boolean().default(false),
      playbackSpeed: Joi.number().valid(0.5, 0.75, 1.0, 1.25, 1.5, 2.0).default(1.0),
      emailDigest: Joi.boolean().default(true),
      marketingEmails: Joi.boolean().default(false),
      reminderEmails: Joi.boolean().default(true),
      weeklyGoal: Joi.number().integer().min(1).max(50).default(5),
      preferredLearningTime: Joi.string().valid('morning', 'afternoon', 'evening', 'night').default('evening')
    }).optional()
  }).options({ stripUnknown: true });

  return schema.validate(data);
};

// Settings update validation
export const validateSettingsUpdate = (data) => {
  const schema = Joi.object({
    timezone: Joi.string()
      .valid(...Intl.supportedValuesOf('timeZone'))
      .optional()
      .messages({
        'any.only': 'Ungültige Zeitzone'
      }),
    
    preferences: Joi.object({
      notifications: Joi.boolean(),
      darkMode: Joi.boolean(),
      language: Joi.string().valid('de', 'en', 'es', 'fr'),
      autoplay: Joi.boolean(),
      subtitles: Joi.boolean(),
      playbackSpeed: Joi.number().valid(0.5, 0.75, 1.0, 1.25, 1.5, 2.0),
      emailDigest: Joi.boolean(),
      marketingEmails: Joi.boolean(),
      reminderEmails: Joi.boolean(),
      weeklyGoal: Joi.number().integer().min(1).max(50),
      preferredLearningTime: Joi.string().valid('morning', 'afternoon', 'evening', 'night')
    }).optional()
  }).options({ stripUnknown: true });

  return schema.validate(data);
};

// User creation validation (admin)
export const validateUserCreate = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .lowercase()
      .max(320)
      .required()
      .messages({
        'string.email': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
        'string.empty': 'E-Mail-Adresse ist erforderlich',
        'any.required': 'E-Mail-Adresse ist erforderlich'
      }),
    
    name: Joi.string()
      .min(2)
      .max(100)
      .pattern(new RegExp('^[a-zA-ZäöüÄÖÜß\\s\\-\\.]+$'))
      .trim()
      .required()
      .messages({
        'string.min': 'Name muss mindestens 2 Zeichen lang sein',
        'string.max': 'Name ist zu lang',
        'string.pattern.base': 'Name darf nur Buchstaben, Leerzeichen, Bindestriche und Punkte enthalten',
        'any.required': 'Name ist erforderlich'
      }),
    
    role: Joi.string()
      .valid('student', 'instructor', 'admin')
      .default('student')
      .messages({
        'any.only': 'Ungültige Benutzerrolle'
      }),
    
    status: Joi.string()
      .valid('active', 'inactive', 'suspended')
      .default('active')
      .messages({
        'any.only': 'Ungültiger Benutzerstatus'
      }),
    
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
      .required()
      .messages({
        'string.min': 'Passwort muss mindestens 8 Zeichen lang sein',
        'string.pattern.base': 'Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten',
        'any.required': 'Passwort ist erforderlich'
      }),
    
    sendWelcomeEmail: Joi.boolean().default(true)
  }).options({ stripUnknown: true });

  return schema.validate(data);
};

// User update validation (admin)
export const validateUserUpdate = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .pattern(new RegExp('^[a-zA-ZäöüÄÖÜß\\s\\-\\.]+$'))
      .trim()
      .optional(),
    
    role: Joi.string()
      .valid('student', 'instructor', 'admin')
      .optional(),
    
    status: Joi.string()
      .valid('active', 'inactive', 'suspended')
      .optional(),
    
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .lowercase()
      .max(320)
      .optional()
  }).options({ stripUnknown: true });

  return schema.validate(data);
};

// User search/filter validation
export const validateUserSearch = (data) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().max(100).optional(),
    role: Joi.string().valid('student', 'instructor', 'admin').optional(),
    status: Joi.string().valid('active', 'inactive', 'suspended').optional(),
    sortBy: Joi.string().valid('name', 'email', 'created_at', 'last_login').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    dateFrom: Joi.date().iso().optional(),
    dateTo: Joi.date().iso().min(Joi.ref('dateFrom')).optional()
  }).options({ stripUnknown: true });

  return schema.validate(data);
};

// Avatar upload validation
export const validateAvatarUpload = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 2 * 1024 * 1024; // 2MB
  
  const errors = [];
  
  if (!file) {
    errors.push('Keine Datei ausgewählt');
    return { isValid: false, errors };
  }
  
  if (!allowedTypes.includes(file.mimetype)) {
    errors.push('Nur Bilddateien sind erlaubt (JPEG, PNG, WebP)');
  }
  
  if (file.size > maxSize) {
    errors.push('Datei ist zu groß (max. 2MB)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Password change validation
export const validatePasswordChange = (data) => {
  const schema = Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        'any.required': 'Aktuelles Passwort ist erforderlich'
      }),
    
    newPassword: Joi.string()
      .min(8)
      .max(128)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
      .required()
      .messages({
        'string.min': 'Neues Passwort muss mindestens 8 Zeichen lang sein',
        'string.pattern.base': 'Neues Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten',
        'any.required': 'Neues Passwort ist erforderlich'
      }),
    
    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'Passwörter stimmen nicht überein',
        'any.required': 'Passwort-Bestätigung ist erforderlich'
      })
  }).options({ stripUnknown: true });

  return schema.validate(data);
};

// Email change validation
export const validateEmailChange = (data) => {
  const schema = Joi.object({
    newEmail: Joi.string()
      .email({ tlds: { allow: false } })
      .lowercase()
      .max(320)
      .required()
      .messages({
        'string.email': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
        'any.required': 'Neue E-Mail-Adresse ist erforderlich'
      }),
    
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Passwort zur Bestätigung erforderlich'
      })
  }).options({ stripUnknown: true });

  return schema.validate(data);
};

// Learning preferences validation
export const validateLearningPreferences = (data) => {
  const schema = Joi.object({
    weeklyGoal: Joi.number()
      .integer()
      .min(1)
      .max(50)
      .required()
      .messages({
        'number.min': 'Wochenziel muss mindestens 1 Lektion sein',
        'number.max': 'Wochenziel darf höchstens 50 Lektionen sein',
        'any.required': 'Wochenziel ist erforderlich'
      }),
    
    preferredLearningTime: Joi.string()
      .valid('morning', 'afternoon', 'evening', 'night')
      .required()
      .messages({
        'any.only': 'Ungültige Lernzeit',
        'any.required': 'Bevorzugte Lernzeit ist erforderlich'
      }),
    
    reminderDays: Joi.array()
      .items(Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'))
      .min(1)
      .max(7)
      .unique()
      .optional()
      .messages({
        'array.min': 'Mindestens ein Erinnerungstag erforderlich',
        'array.max': 'Höchstens 7 Erinnerungstage erlaubt',
        'array.unique': 'Doppelte Erinnerungstage nicht erlaubt'
      }),
    
    studyBreakDuration: Joi.number()
      .integer()
      .min(5)
      .max(60)
      .default(15)
      .messages({
        'number.min': 'Pausendauer muss mindestens 5 Minuten sein',
        'number.max': 'Pausendauer darf höchstens 60 Minuten sein'
      }),
    
    difficultyLevel: Joi.string()
      .valid('beginner', 'intermediate', 'advanced')
      .default('beginner')
      .messages({
        'any.only': 'Ungültiges Schwierigkeitslevel'
      })
  }).options({ stripUnknown: true });

  return schema.validate(data);
};

// Privacy settings validation
export const validatePrivacySettings = (data) => {
  const schema = Joi.object({
    profileVisibility: Joi.string()
      .valid('public', 'friends', 'private')
      .default('private')
      .messages({
        'any.only': 'Ungültige Profil-Sichtbarkeit'
      }),
    
    showProgress: Joi.boolean().default(false),
    showAchievements: Joi.boolean().default(false),
    allowFriendRequests: Joi.boolean().default(true),
    showOnlineStatus: Joi.boolean().default(false),
    
    dataProcessing: Joi.object({
      analytics: Joi.boolean().default(true),
      marketing: Joi.boolean().default(false),
      thirdParty: Joi.boolean().default(false)
    }).optional()
  }).options({ stripUnknown: true });

  return schema.validate(data);
};

// Notification settings validation
export const validateNotificationSettings = (data) => {
  const schema = Joi.object({
    email: Joi.object({
      lessonReminders: Joi.boolean().default(true),
      achievementNotifications: Joi.boolean().default(true),
      weeklyProgress: Joi.boolean().default(true),
      courseUpdates: Joi.boolean().default(true),
      marketingEmails: Joi.boolean().default(false),
      systemNotifications: Joi.boolean().default(true)
    }).optional(),
    
    push: Joi.object({
      lessonReminders: Joi.boolean().default(true),
      achievements: Joi.boolean().default(true),
      streakReminders: Joi.boolean().default(true),
      newContent: Joi.boolean().default(false)
    }).optional(),
    
    inApp: Joi.object({
      all: Joi.boolean().default(true),
      achievements: Joi.boolean().default(true),
      progress: Joi.boolean().default(true),
      social: Joi.boolean().default(true)
    }).optional()
  }).options({ stripUnknown: true });

  return schema.validate(data);
};