export default function CategoryButtons({ setSelectedCategory }) {
    return (
        <div className="category-buttons">
            <button className="btn primary" onClick={() => setSelectedCategory('Milk Tea')}>Milk Tea</button>
            <button className="btn primary" onClick={() => setSelectedCategory('Fruit Tea')}>Fruit Tea</button>
            <button className="btn primary" onClick={() => setSelectedCategory('Smoothie')}>Smoothie</button>
            <button className="btn primary" onClick={() => setSelectedCategory('Slush')}>Slush</button>
            <button className="btn primary" onClick={() => setSelectedCategory('Specialty')}>Specialty</button>
        </div>
    )
}