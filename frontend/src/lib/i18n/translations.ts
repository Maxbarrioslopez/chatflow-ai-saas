/**
 * Sistema de traducción i18n - ChatMBL
 * Soporte: español (es) por defecto, inglés (en)
 * Detecta automáticamente el idioma del navegador
 */

export type Language = 'es' | 'en';

export const translations: Record<Language, Record<string, string>> = {
  es: {
    // Global / Navegación
    'app.name': 'ChatMBL',
    'nav.signin': 'Iniciar sesión',
    'nav.signup': 'Registrarse',
    'nav.features': 'Características',
    'nav.pricing': 'Precios',
    'nav.testimonials': 'Testimonios',
    'nav.dashboard': 'Panel',

    // Hero
    'hero.badge': 'Plataforma de Chatbots con IA',
    'hero.title1': 'Crea Chatbots',
    'hero.title2': 'Inteligentes en Minutos',
    'hero.subtitle': 'Crea chatbots con IA mediante arrastrar y soltar. Capta leads, aumenta ventas y brinda soporte 24/7.',
    'hero.cta': 'Prueba Gratis',
    'hero.demo': 'Ver Demo',
    'hero.nocc': 'Sin tarjeta de crédito',
    'hero.trial': '14 días gratis',
    'hero.cancel': 'Cancela cuando quieras',

    // Features
    'features.title': 'Todo lo que necesitas',
    'features.subtitle': 'Funciones potentes para crear, desplegar y optimizar tus chatbots con IA',
    'features.smart': 'Chatbots Inteligentes',
    'features.smart_desc': 'Chatbots con IA que entienden contexto y responden como humanos',
    'features.analytics': 'Analíticas Completas',
    'features.analytics_desc': 'Seguimiento de conversaciones, leads y satisfacción',
    'features.leads': 'Captura de Leads',
    'features.leads_desc': 'Captura y califica leads automáticamente desde las conversaciones',
    'features.kb': 'Base de Conocimiento',
    'features.kb_desc': 'Sube PDFs, DOCX o texto. La IA solo responde con tu contenido.',
    'features.security': 'Seguridad Empresarial',
    'features.security_desc': 'Control de acceso, moderación de contenido y auditoría',
    'features.whitelabel': 'Marca Blanca',
    'features.whitelabel_desc': 'Dominio personalizado, sin branding, control total del diseño',

    // Pricing
    'pricing.title': 'Precios simples y transparentes',
    'pricing.subtitle': 'Elige el plan que se ajuste a tus necesidades. Mejora cuando quieras.',
    'pricing.popular': 'Más Popular',
    'pricing.month': 'mes',
    'pricing.year': 'año',
    'pricing.free': 'Gratis',
    'pricing.starter': 'Profesional',
    'pricing.pro': 'Negocios',
    'pricing.enterprise': 'Empresarial',
    'pricing.permonth': '/mes',
    'pricing.peryear': '/año',
    'pricing.getstarted': 'Empezar gratis',
    'pricing.subscribe': 'Suscribirse',

    // Testimonials
    'testimonials.title': 'Equipos que confían en nosotros',
    'testimonials.subtitle': 'Lo que dicen nuestros clientes',

    // CTA
    'cta.title': '¿Listo para empezar?',
    'cta.subtitle': 'Crea tu primer chatbot con IA en minutos. Sin tarjeta de crédito.',

    // Footer
    'footer.rights': 'Todos los derechos reservados.',

    // Dashboard
    'dashboard.home': 'Inicio',
    'dashboard.chatbots': 'Chatbots',
    'dashboard.conversations': 'Conversaciones',
    'dashboard.leads': 'Leads',
    'dashboard.analytics': 'Analíticas',
    'dashboard.knowledge': 'Base de Conocimiento',
    'dashboard.workflows': 'Automatizaciones',
    'dashboard.agents': 'Agentes IA',
    'dashboard.prompts': 'Editor de Prompts',
    'dashboard.theme': 'Personalizar',
    'dashboard.settings': 'Configuración',
    'dashboard.billing': 'Facturación',
    'dashboard.profile': 'Perfil',
    'dashboard.logout': 'Cerrar sesión',
    'dashboard.search': 'Buscar...',
    'dashboard.free': 'Plan Gratuito',

    // Login
    'login.title': 'Iniciar sesión',
    'login.email': 'Correo electrónico',
    'login.password': 'Contraseña',
    'login.button': 'Entrar',
    'login.loading': 'Entrando...',
    'login.noaccount': '¿No tienes cuenta?',
    'login.register': 'Regístrate',

    // Register
    'register.title': 'Crear cuenta',
    'register.name': 'Nombre',
    'register.email': 'Correo electrónico',
    'register.password': 'Contraseña',
    'register.org': 'Nombre de la empresa',
    'register.button': 'Crear cuenta',
    'register.loading': 'Creando...',
    'register.haveaccount': '¿Ya tienes cuenta?',
    'register.signin': 'Inicia sesión',

    // Generales
    'common.saving': 'Guardando...',
    'common.saved': '¡Guardado!',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.create': 'Crear',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.confirm': 'Confirmar',
    'common.search': 'Buscar',
    'common.noresults': 'Sin resultados',
    'common.copy': 'Copiar',
    'common.copied': '¡Copiado!',
    'common.test': 'Probar',
    'common.import': 'Importar',
    'common.export': 'Exportar',
  },

  en: {
    // Global / Navigation
    'app.name': 'ChatMBL',
    'nav.signin': 'Sign In',
    'nav.signup': 'Get Started',
    'nav.features': 'Features',
    'nav.pricing': 'Pricing',
    'nav.testimonials': 'Testimonials',
    'nav.dashboard': 'Dashboard',

    // Hero
    'hero.badge': 'AI-Powered Chatbot Platform',
    'hero.title1': 'Build Smarter',
    'hero.title2': 'Chatbots in Minutes',
    'hero.subtitle': 'Create intelligent chatbots with drag-and-drop simplicity. Capture leads, boost sales, and deliver support 24/7.',
    'hero.cta': 'Start Free Trial',
    'hero.demo': 'Watch Demo',
    'hero.nocc': 'No credit card',
    'hero.trial': '14-day free trial',
    'hero.cancel': 'Cancel anytime',

    // Features
    'features.title': 'Everything you need',
    'features.subtitle': 'Powerful features to create, deploy, and optimize your AI chatbots',
    'features.smart': 'Smart Chatbots',
    'features.smart_desc': 'AI-powered chatbots that understand context and provide human-like responses',
    'features.analytics': 'Rich Analytics',
    'features.analytics_desc': 'Track conversations, leads, and satisfaction with beautiful dashboards',
    'features.leads': 'Lead Capture',
    'features.leads_desc': 'Automatically capture and qualify leads from conversations',
    'features.kb': 'Knowledge Base',
    'features.kb_desc': 'Upload PDFs, DOCX, or text. AI only answers from your content.',
    'features.security': 'Enterprise Security',
    'features.security_desc': 'Role-based access, content moderation, and audit logging',
    'features.whitelabel': 'White-label',
    'features.whitelabel_desc': 'Custom domains, remove branding, full design control',

    // Pricing
    'pricing.title': 'Simple, transparent pricing',
    'pricing.subtitle': 'Choose the plan that fits your needs. Upgrade anytime.',
    'pricing.popular': 'Most Popular',
    'pricing.month': 'month',
    'pricing.year': 'year',
    'pricing.free': 'Free',
    'pricing.starter': 'Starter',
    'pricing.pro': 'Professional',
    'pricing.enterprise': 'Enterprise',
    'pricing.permonth': '/mo',
    'pricing.peryear': '/yr',
    'pricing.getstarted': 'Get Started Free',
    'pricing.subscribe': 'Subscribe',

    // Testimonials
    'testimonials.title': 'Trusted by teams',
    'testimonials.subtitle': 'See what our customers say',

    // CTA
    'cta.title': 'Ready to get started?',
    'cta.subtitle': 'Create your first AI chatbot in minutes. No credit card required.',

    // Footer
    'footer.rights': 'All rights reserved.',

    // Dashboard
    'dashboard.home': 'Dashboard',
    'dashboard.chatbots': 'Chatbots',
    'dashboard.conversations': 'Conversations',
    'dashboard.leads': 'Leads',
    'dashboard.analytics': 'Analytics',
    'dashboard.knowledge': 'Knowledge Base',
    'dashboard.workflows': 'Workflows',
    'dashboard.agents': 'AI Agents',
    'dashboard.prompts': 'Prompt Studio',
    'dashboard.theme': 'Theme',
    'dashboard.settings': 'Settings',
    'dashboard.billing': 'Billing',
    'dashboard.profile': 'Profile',
    'dashboard.logout': 'Logout',
    'dashboard.search': 'Search...',
    'dashboard.free': 'Free Plan',

    // Login
    'login.title': 'Sign In',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.button': 'Sign In',
    'login.loading': 'Signing in...',
    'login.noaccount': "Don't have an account?",
    'login.register': 'Register',

    // Register
    'register.title': 'Create Account',
    'register.name': 'Name',
    'register.email': 'Email',
    'register.password': 'Password',
    'register.org': 'Organization Name',
    'register.button': 'Create Account',
    'register.loading': 'Creating...',
    'register.haveaccount': 'Already have an account?',
    'register.signin': 'Sign In',

    // Common
    'common.saving': 'Saving...',
    'common.saved': 'Saved!',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    'common.search': 'Search',
    'common.noresults': 'No results',
    'common.copy': 'Copy',
    'common.copied': 'Copied!',
    'common.test': 'Test',
    'common.import': 'Import',
    'common.export': 'Export',
  },
};
