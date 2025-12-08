export default function LanguageSelector({ currentLanguage, switchLanguage }) {
    return (
        <div className="language-selector">
            <button 
                onClick={() => switchLanguage('en')} 
                className={currentLanguage === 'en' ? 'active' : ''}
            >
                English
            </button>
            <button 
                onClick={() => switchLanguage('es')} 
                className={currentLanguage === 'es' ? 'active' : ''}
            >
                Español
            </button>
        </div>
    );
}