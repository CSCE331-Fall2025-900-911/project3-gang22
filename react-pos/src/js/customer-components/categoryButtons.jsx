export default function CategoryButtons({ setSelectedCategory, t }) {
    return (
        <div className="category-buttons">
            <button className="btn primary" onClick={() => setSelectedCategory('Milk Tea')}>{t('category_milk_tea')}</button>
            <button className="btn primary" onClick={() => setSelectedCategory('Fruit Tea')}>{t('category_fruit_tea')}</button>
            <button className="btn primary" onClick={() => setSelectedCategory('Smoothie')}>{t('category_smoothie')}</button>
            <button className="btn primary" onClick={() => setSelectedCategory('Slush')}>{t('category_slush')}</button>
            <button className="btn primary" onClick={() => setSelectedCategory('Specialty')}>{t('category_specialty')}</button>
        </div>
    )
}