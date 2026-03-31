import { useState } from 'react';

const Search = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="p-4">
      <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Search</h1>
      <input 
        type="text" 
        placeholder="Search sneakers..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          marginTop: '10px'
        }}
      />
      <div className="mt-4 text-center text-gray-400">
        <p>Start typing to find your style 👟</p>
      </div>
    </div>
  );
};

export default Search;