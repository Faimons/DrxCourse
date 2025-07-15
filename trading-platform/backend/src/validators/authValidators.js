import Joi from 'joi';

// Email validation schema
const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .lowercase()
  .max(320)
  .required()
  .messages({
    'string.email': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    'string.empty': 'E-Mail-Adresse ist erforderlich',
    'string.max': 'E-Mail-Adresse ist zu lang',
    'any.required': 'E-Mail-Adresse ist erforderlich'
  });

// Password validation schema
const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
  .required()
  .messages({
    'string.min': 'Passwort muss mindestens 8 Zeichen lang sein',
    'string.max': 'Passwort ist zu lang',
    'string.pattern.base': 'Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten',
    'string.empty': 'Passwort ist erforderlich',
    'any.required': 'Passwort ist erforderlich'
  });

// Simple password schema for login (no complexity requirements)
const loginPasswordSchema = Joi.string()
  .min(1)
  .max(128)
  .required()
  .messages({
    'string.empty': 'Passwort ist erforderlich',
    'any.required': 'Passwort ist erforderlich'
  });

// Name validation schema
const nameSchema = Joi.string()
  .min(2)
  .max(100)
  .pattern(new RegExp('^[a-zA-ZäöüÄÖÜß\\s\\-\\.]+$'))
  .trim()
  .required()
  .messages({
    'string.min': 'Name muss mindestens 2 Zeichen lang sein',
    'string.max': 'Name ist zu lang',
    'string.pattern.base': 'Name darf nur Buchstaben, Leerzeichen, Bindestriche und Punkte enthalten',
    'string.empty': 'Name ist erforderlich',
    'any.required': 'Name ist erforderlich'
  });

// User registration validation
export const validateRegister = (data) => {
  const schema = Joi.object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Passwörter stimmen nicht überein',
        'any.required': 'Passwort-Bestätigung ist erforderlich'
      }),
    name: nameSchema,
    agreeToTerms: Joi.boolean()
      .valid(true)
      .required()
      .messages({
        'any.only': 'Sie müssen den Nutzungsbedingungen zustimmen',
        'any.required': 'Sie müssen den Nutzungsbedingungen zustimmen'
      }),
    agreeToPrivacy: Joi.boolean()
      .valid(true)
      .required()
      .messages({
        'any.only': 'Sie müssen der Datenschutzerklärung zustimmen',
        'any.required': 'Sie müssen der Datenschutzerklärung zustimmen'
      }),
    newsletter: Joi.boolean()
      .default(false)
      .optional()
  }).options({ stripUnknown: true });

  return schema.validate(data);
};

// User login validation
export const validateLogin = (data) => {
  const schema = Joi.object({
    email: emailSchema,
    password: loginPasswordSchema,
    rememberMe: Joi.boolean()
      .default(false)
      .optional()
  }).options({ stripUnknown: true });

  return schema.validate(data);
};

// Password reset request validation
export const validatePasswordResetRequest = (data) => {
  const schema = Joi.object({
    email: emailSchema
  }).options({ stripUnknown: true });

  return schema.validate(data);
};

// Password reset validation
export const validatePasswordReset = (data) => {
  const schema = Joi.object({
    token: Joi.string()
      .required()
      .messages({
        'string.empty': 'Reset-Token ist erforderlich',
        'any.required': 'Reset-Token ist erforderlich'
      }),
    password: passwordSchema,
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Passwörter stimmen nicht überein',
        'any.required': 'Passwort-Bestätigung ist erforderlich'
      })
  }).options({ stripUnknown: true });

  return schema.validate(data);
};

// Change password validation
export const validateChangePassword = (data) => {
  const schema = Joi.object({
    currentPassword: loginPasswordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'Passwörter stimmen nicht überein',
        'any.required': 'Passwort-Bestätigung ist erforderlich'
      })
  }).options({ stripUnknown: true });

  return schema.validate(data);
};

// Email verification validation
export const validateEmailVerification = (data) => {
  const schema = Joi.object({
    token: Joi.string()
      .required()
      .messages({
        'string.empty': 'Verifizierungstoken ist erforderlich',
        'any.required': 'Verifizierungstoken ist erforderlich'
      })
  }).options({ stripUnknown: true });

  return schema.validate(data);
};

// Refresh token validation
export const validateRefreshToken = (data) => {
  const schema = Joi.object({
    refreshToken: Joi.string()
      .required()
      .messages({
        'string.empty': 'Refresh-Token ist erforderlich',
        'any.required': 'Refresh-Token ist erforderlich'
      })
  }).options({ stripUnknown: true });

  return schema.validate(data);
};

// Two-factor authentication setup validation
export const validateTwoFactorSetup = (data) => {
  const schema = Joi.object({
    code: Joi.string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        'string.length': '2FA-Code muss 6 Ziffern lang sein',
        'string.pattern.base': '2FA-Code darf nur Zahlen enthalten',
        'string.empty': '2FA-Code ist erforderlich',
        'any.required': '2FA-Code ist erforderlich'
      })
  }).options({ stripUnknown: true });

  return schema.validate(data);
};

// Two-factor authentication verification validation
export const validateTwoFactorVerification = (data) => {
  const schema = Joi.object({
    email: emailSchema,
    password: loginPasswordSchema,
    code: Joi.string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        'string.length': '2FA-Code muss 6 Ziffern lang sein',
        'string.pattern.base': '2FA-Code darf nur Zahlen enthalten',
        'string.empty': '2FA-Code ist erforderlich',
        'any.required': '2FA-Code ist erforderlich'
      }),
    rememberMe: Joi.boolean()
      .default(false)
      .optional()
  }).options({ stripUnknown: true });

  return schema.validate(data);
};

// Account deletion validation
export const validateAccountDeletion = (data) => {
  const schema = Joi.object({
    password: loginPasswordSchema,
    confirmDelete: Joi.string()
      .valid('DELETE')
      .required()
      .messages({
        'any.only': 'Geben Sie "DELETE" ein, um die Löschung zu bestätigen',
        'any.required': 'Löschungsbestätigung ist erforderlich'
      }),
    reason: Joi.string()
      .max(500)
      .optional()
      .messages({
        'string.max': 'Grund ist zu lang'
      })
  }).options({ stripUnknown: true });

  return schema.validate(data);
};

// Social login validation
export const validateSocialLogin = (data) => {
  const schema = Joi.object({
    provider: Joi.string()
      .valid('google', 'facebook', 'apple', 'microsoft')
      .required()
      .messages({
        'any.only': 'Ungültiger Social Login Anbieter',
        'any.required': 'Social Login Anbieter ist erforderlich'
      }),
    token: Joi.string()
      .required()
      .messages({
        'string.empty': 'Social Login Token ist erforderlich',
        'any.required': 'Social Login Token ist erforderlich'
      }),
    agreeToTerms: Joi.boolean()
      .valid(true)
      .required()
      .messages({
        'any.only': 'Sie müssen den Nutzungsbedingungen zustimmen',
        'any.required': 'Sie müssen den Nutzungsbedingungen zustimmen'
      })
  }).options({ stripUnknown: true });

  return schema.validate(data);
};

// Common validation patterns
export const patterns = {
  email: emailSchema,
  password: passwordSchema,
  loginPassword: loginPasswordSchema,
  name: nameSchema,
  
  // Additional common patterns
  phoneNumber: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .messages({
      'string.pattern.base': 'Ungültige Telefonnummer'
    }),
    
  url: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .messages({
      'string.uri': 'Ungültige URL'
    }),
    
  uuid: Joi.string()
    .guid({ version: 'uuidv4' })
    .messages({
      'string.guid': 'Ungültige UUID'
    }),
    
  timezone: Joi.string()
    .valid(...Intl.supportedValuesOf('timeZone'))
    .messages({
      'any.only': 'Ungültige Zeitzone'
    }),
    
  language: Joi.string()
    .valid('de', 'en', 'es', 'fr', 'it')
    .default('de')
    .messages({
      'any.only': 'Nicht unterstützte Sprache'
    })
};

// Validation middleware factory
export const validate = (validationFunction) => {
  return (req, res, next) => {
    const { error, value } = validationFunction(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validierungsfehler',
        code: 'VALIDATION_ERROR',
        details: error.details.reduce((acc, detail) => {
          acc[detail.path.join('.')] = detail.message;
          return acc;
        }, {}),
        timestamp: new Date().toISOString()
      });
    }
    
    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};