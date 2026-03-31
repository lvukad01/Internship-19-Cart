import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/products';

export const Home = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  return (
    <div className="page-container">
      <h1>Explore</h1>
      <div className="products-grid">
        {isLoading && <p>Loading products...</p>}
        {products?.map((p: any) => (
          <div key={p.id} className="product-card" style={{ borderRadius: '8px' }}>
            <img src={p.images[0]} alt={p.name} />
            <h2>{p.name}</h2>
            <p>{p.price} €</p>
          </div>
        ))}
      </div>
    </div>
  );
};