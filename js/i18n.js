/* ==========================================================================
   Internationalization Controller
   ========================================================================== */

class I18nController {
    constructor() {
        this.currentLang = 'en';
        this.translations = {
            en: {
                'brand': 'TiraMess\'d',
                'nav.work': 'Work',
                'nav.about': 'About',
                
                'work.visual': 'Some colors and shapes I put together.',
                'work.interaction': 'Designed to make life a bit easier (I hope).',
                'work.animation': 'Because still things are a bit boring.',
                
                'about.title': 'Just me, doing my best.',
                'about.description': 'I\'m TiraMess\'d, a regular designer. No special talents, just trying to add a bit more warmth to each piece of work.',
                'about.invitation': 'If we have a chance to work together, I\'ll do my best not to disappoint you.',
                'about.cta': 'Let\'s Talk',
                
                'footer.credit': 'Designed by TiraMess\'d – with care, a little chaos, and help from ChatGPT, Claude, and Cursor.',
                'footer.credit.hover': 'Even machines can be inspirational. Thanks, pals!'
            },
            zh: {
                'brand': '提拉没苏',
                'nav.work': '作品',
                'nav.about': '关于',
                
                'work.visual': '这是我拼凑的一些颜色和形状。',
                'work.interaction': '设计是为了让生活稍微容易点（至少我希望如此）。',
                'work.animation': '因为静止的东西有点无聊。',
                
                'about.title': '只是我，在尽力做好。',
                'about.description': '我是提拉没苏，一个普通的设计师。没什么天赋异禀，只是努力让每个作品多一点温度。',
                'about.invitation': '有机会一起合作，我会尽力不让你失望。',
                'about.cta': '聊聊吧',
                
                'footer.credit': '提拉没苏出品——用心带点小混乱，还有来自ChatGPT、Claude和Cursor的助力。',
                'footer.credit.hover': '是的，机器也能带来灵感。谢谢你们，伙计们！'
            }
        };
        
        this.init();
    }

    init() {
        this.setupLanguageToggle();
        this.updateContent();
    }

    setupLanguageToggle() {
        const langToggle = document.querySelector('.navbar__lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                this.currentLang = this.currentLang === 'en' ? 'zh' : 'en';
                this.updateContent();
                this.updateToggleText();
            });
        }
    }

    updateToggleText() {
        const langToggle = document.querySelector('.navbar__lang-toggle');
        if (langToggle) {
            langToggle.textContent = this.currentLang === 'en' ? 'EN/中' : '中/EN';
        }
    }

    updateContent() {
        const elements = document.querySelectorAll('[data-lang-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-lang-key');
            const translation = this.translations[this.currentLang][key];
            
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update hover text for footer
        const footerHover = document.querySelector('.footer__text-hover');
        if (footerHover) {
            footerHover.textContent = this.translations[this.currentLang]['footer.credit.hover'];
        }

        // Update document language
        document.documentElement.lang = this.currentLang;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new I18nController();
}); 