import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useMemo } from 'react';
import styles from './AdminSections.module.css';

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  const [formData, setFormData] = useState({ 
    name: '', 
    price: '', 
    stock: '', 
    brand: '',
    description: '', 
    categoryId: '', 
    colors: '', 
    sizes: '', 
    images: [] as string[] 
  });

  const token = localStorage.getItem('token');

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/products');
      return Array.isArray(res.data) ? res.data : res.data.data || [];
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/categories');
      return Array.isArray(res.data) ? res.data : res.data.data || [];
    }
  });

  const filteredProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    return list.filter((p: any) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === '' || p.categoryId === Number(filterCategory);
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, filterCategory]);

  const productMutation = useMutation({
    mutationFn: async (data: any) => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingProduct) {
        return await axios.patch(`http://localhost:3000/api/products/${editingProduct.id}`, data, config);
      }
      return await axios.post('http://localhost:3000/api/products', data, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!window.confirm('Jeste li sigurni da želite trajno obrisati ovaj proizvod?')) return;
      await axios.delete(`http://localhost:3000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] })
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const uploadData = new FormData();
    for (let i = 0; i < files.length; i++) uploadData.append('files', files[i]);

    try {
      const res = await axios.post('http://localhost:3000/api/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      setFormData(prev => ({ ...prev, images: [...prev.images, ...res.data.urls] }));
    } catch (err) {
      alert("Greška pri uploadu slika");
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const openModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        brand: product.brand || '',
        description: product.description || '',
        categoryId: product.categoryId?.toString() || '',
        colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
        sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
        images: product.images || []
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', stock: '', brand: '', description: '', categoryId: '', colors: '', sizes: '', images: [] });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  if (productsLoading) return <div className={styles.loader}>Učitavanje podataka...</div>;

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3>Upravljanje Proizvodima</h3>
        <button className={styles.addBtn} onClick={() => openModal()}>+ Novi Proizvod</button>
      </div>

      <div className={styles.toolbar}>
        <input 
          type="text" 
          placeholder="Pretraži po nazivu ili brendu..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">Sve kategorije</option>
          {Array.isArray(categories) && categories.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Proizvod</th>
              <th>Cijena</th>
              <th>Dostupnost</th>
              <th style={{ textAlign: 'right' }}>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p: any) => (
              <tr key={p.id}>
                <td>#{p.id}</td>
                <td className={styles.productCell}>
                  <img src={p.images?.[0] ? `http://localhost:3000${p.images[0]}` : '/placeholder.png'} className={styles.adminThumb} alt="" />
                  <div>
                    <div className={styles.prodName}>{p.name}</div>
                    <div className={styles.prodBrand}>{p.brand}</div>
                  </div>
                </td>
                <td>{p.price.toFixed(2)} €</td>
                <td>
                  <span className={p.stock > 0 ? styles.inStock : styles.lowStock}>
                    {p.stock > 0 ? `${p.stock} na zalihi` : 'Nema na zalihi'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className={styles.editBtn} onClick={() => openModal(p)}>Uredi</button>
                  <button className={styles.deleteBtn} onClick={() => deleteMutation.mutate(p.id)}>Obriši</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h4>{editingProduct ? 'Uređivanje Proizvoda' : 'Novi Proizvod'}</h4>
              <button className={styles.closeModalBtn} onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              productMutation.mutate({
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                categoryId: parseInt(formData.categoryId),
                colors: formData.colors.split(',').map(s => s.trim()).filter(Boolean),
                sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean)
              });
            }}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Naziv proizvoda</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Brend</label>
                  <input type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Cijena (€)</label>
                  <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Zaliha (Dostupnost)</label>
                  <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Kategorija</label>
                  <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} required>
                    <option value="">Odaberi kategoriju</option>
                    {Array.isArray(categories) && categories.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Veličine (odvojeno zarezom)</label>
                  <input type="text" placeholder="npr. S, M, L, XL" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Boje (odvojeno zarezom)</label>
                <input type="text" placeholder="npr. Crna, Bijela, Crvena" value={formData.colors} onChange={e => setFormData({...formData, colors: e.target.value})} />
              </div>

              <div className={styles.formGroup}>
                <label>Opis proizvoda</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
              </div>

              <div className={styles.uploadSection}>
                <label>Slike proizvoda</label>
                <div className={styles.uploadTrigger}>
                  <input type="file" multiple onChange={handleImageUpload} id="file-upload" className={styles.fileInput} />
                  <label htmlFor="file-upload" className={styles.fileLabel}>Odaberi slike</label>
                </div>
                <div className={styles.previewGrid}>
                  {formData.images.map((img, idx) => (
                    <div key={idx} className={styles.previewItem}>
                      <img src={`http://localhost:3000${img}`} alt="" />
                      <button type="button" onClick={() => removeImage(idx)} className={styles.removeImgBtn}>&times;</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={closeModal} className={styles.cancelBtn}>Odustani</button>
                <button type="submit" className={styles.saveBtn} disabled={productMutation.isPending}>
                  {productMutation.isPending ? 'Spremanje...' : 'Spremi Proizvod'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;