const Favorites = () => {
  return (
    <div className="p-4">
      <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Favorites</h1>
      <div style={{ marginTop: '100px', textAlign: 'center' }}>
        <span style={{ fontSize: '48px' }}>❤️</span>
        <h2 style={{ marginTop: '20px' }}>No favorites yet</h2>
        <p style={{ color: 'var(--text)' }}>Items you heart will show up here.</p>
      </div>
    </div>
  );
};

export default Favorites;