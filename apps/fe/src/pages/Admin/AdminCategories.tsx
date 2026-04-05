import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useMemo } from 'react';
import styles from './AdminSections.module.css';

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const token = localStorage.getItem('token');

  const { data: categoriesRes, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/categories');
      return res.data;
    }
  });

  const categories = useMemo(() => {
    const data = categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : []);
    return Array.isArray(data) ? data : [];
  }, [categoriesRes]);

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      return await axios.post('http://localhost:3000/api/categories', { name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsModalOpen(false);
      setNewCategoryName('');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Greška pri kreiranju kategorije");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (category: any) => {
      const productCount = category._count?.products ?? category.products?.length ?? 0;
      
      let confirmMsg = `Jeste li sigurni da želite obrisati kategoriju "${category.name}"?`;
      
      if (productCount > 0) {
        confirmMsg = `UPOZORENJE: Kategorija "${category.name}" sadrži ${productCount} proizvoda. 
Brisanjem kategorije obrisat ćete i SVE povezane proizvode! 
Želite li nastaviti?`;
      }

      if (!window.confirm(confirmMsg)) return;
      
      await axios.delete(`http://localhost:3000/api/categories/${category.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Došlo je do greške pri brisanju");
    }
  });

  if (isLoading) return <div className={styles.loader}>Učitavanje kategorija...</div>;

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div>
          <h3>Upravljanje Kategorijama</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Ukupno: {categories.length}</p>
        </div>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>+ Nova Kategorija</button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Naziv Kategorije</th>
              <th>Broj Proizvoda</th>
              <th style={{ textAlign: 'right' }}>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c: any) => {
              const count = c._count?.products ?? c.products?.length ?? 0;
              return (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>
                    <span className={count > 0 ? styles.badge : styles.lowStock}>
                      {count} proizvoda
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className={styles.deleteBtn} 
                      onClick={() => deleteMutation.mutate(c)}
                    >
                      Obriši
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h4>Dodaj Novu Kategoriju</h4>
              <button className={styles.closeModalBtn} onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate(newCategoryName);
            }}>
              <div className={styles.formGroup}>
                <label>Naziv kategorije</label>
                <input 
                  type="text" 
                  value={newCategoryName} 
                  onChange={e => setNewCategoryName(e.target.value)} 
                  placeholder="npr. Laptopi, Pametni satovi..." 
                  required 
                  autoFocus
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>Odustani</button>
                <button type="submit" className={styles.saveBtn} disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Spremanje...' : 'Kreiraj Kategoriju'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;