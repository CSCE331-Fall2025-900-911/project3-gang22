export default function CategoryButtons({ setSelectedCategory }) {
    return (
        <div className="category-buttons">
            {/* Row 1 */}
            <button className="btn" onClick={() => setSelectedCategory('Classics')}>Classics</button>
            <button className="btn" onClick={() => setSelectedCategory('Milk Tea')}>Milk Tea</button>
            <button className="btn" onClick={() => setSelectedCategory('Fruit Tea')}>Fruit Tea</button>
            <button className="btn" onClick={() => setSelectedCategory('Smoothie')}>Smoothie</button>

            {/* Row 2 */}
            <button className="btn" onClick={() => setSelectedCategory('Slush')}>Slush</button>
            <button className="btn" onClick={() => setSelectedCategory('Matchas')}>Matchas</button>
            <button className="btn" onClick={() => setSelectedCategory('Specialty')}>Specialty</button>
        </div>
    );
}
