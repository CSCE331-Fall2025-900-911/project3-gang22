export default function LanguageSelectorDropdown({
  currentLanguage,
  setCurrentLanguage,
  availableLanguages = []
}) {
  return (
    <div className="language-selector" data-no-translate>
      <select
        value={currentLanguage}
        onChange={(e) => setCurrentLanguage(e.target.value)}
      >
        {availableLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
