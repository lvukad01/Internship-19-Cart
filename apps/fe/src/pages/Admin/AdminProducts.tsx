import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import styles from './AdminSections.module.css';

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem('token');

const { data: products, isLoading } = useQuery({
  queryKey: ['admin-products'],
  queryFn: async () => {
    const res = await axios.get('http://localhost:3000/api/products');
    // Vrati samo 'data' dio jer je on Array(10)
    return res.data.data; 
  }
});
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!window.confirm('Jeste li sigurni da želite obrisati ovaj proizvod?')) return;
      await axios.delete(`http://localhost:3000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] })
  });

  if (isLoading) return <p>Učitavanje proizvoda...</p>;

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3>Upravljanje Proizvodima</h3>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>+ Novi Proizvod</button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Slika</th>
            <th>Naziv</th>
            <th>Cijena</th>
            <th>Stock</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((p: any) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td><img src={`http://localhost:3000${p.images[0]}`} className={styles.adminThumb} /></td>
              <td>{p.name}</td>
              <td>{p.price} $</td>
              <td>{p.stock}</td>
              <td>
                <button className={styles.editBtn}>Uredi</button>
                <button className={styles.deleteBtn} onClick={() => deleteMutation.mutate(p.id)}>Obriši</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
};

export default AdminProducts;