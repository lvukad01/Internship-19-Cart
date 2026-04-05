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
  const [imageUrlInput, setImageUrlInput] = useState('');
  
  const [formData, setFormData] = useState({ 
    name: '', 
    price: '', 
    stock: '', 
    categoryId: '', 
    colors: '', 
    sizes: '', 
    images: [] as string[] 
  });

  const token = localStorage.getItem('token');

  const { data: productsRes, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/products?limit=1000');
      return res.data;
    }
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/categories');
      return res.data;
    }
  });

  const products = useMemo(() => productsRes?.data || (Array.isArray(productsRes) ? productsRes : []), [productsRes]);
  const categories = useMemo(() => categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : []), [categoriesRes]);

  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
      const searchLower = searchTerm.toLowerCase().trim();
      const pName = String(p.name).toLowerCase();
      const pCatId = String(p.categoryId);
      
      const matchesSearch = pName.includes(searchLower);
      const matchesCategory = filterCategory === '' || pCatId === filterCategory;
      
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

  const isValidUrl = (urlString: string) => {
    try {
      return Boolean(new URL(urlString));
    } catch (e) {
      return false;
    }
  };

  const addImageUrl = () => {
    const trimmedUrl = imageUrlInput.trim();
    if (!trimmedUrl) return;

    if (isValidUrl(trimmedUrl)) {
      setFormData(prev => ({ ...prev, images: [...prev.images, trimmedUrl] }));
      setImageUrlInput('');
    } else {
      alert('Molimo unesite ispravan URL format (npr. https://example.com/slika.jpg)');
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
        categoryId: product.categoryId?.toString() || '',
        colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
        sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
        images: Array.isArray(product.images) ? product.images : []
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', stock: '', categoryId: '', colors: '', sizes: '', images: [] });
    }
    setImageUrlInput('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const getImageUrl = (url: string) => {
    if (!url) return '/placeholder.png';
    return url.startsWith('http') ? url : `http://localhost:3000${url}`;
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
          placeholder="Pretraži po nazivu..." 
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
          {categories.map((c: any) => (
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
                  <img src={getImageUrl(p.images?.[0])} className={styles.adminThumb} alt="" />
                  <div>
                    <div className={styles.prodName}>{p.name}</div>
                  </div>
                </td>
                <td>{Number(p.price).toFixed(2)} €</td>
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
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Veličine (odvojeno zarezom)</label>
                  <input type="text" placeholder="npr. S, M, L, XL" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>Boje (odvojeno zarezom)</label>
                  <input type="text" placeholder="npr. Crna, Bijela" value={formData.colors} onChange={e => setFormData({...formData, colors: e.target.value})} />
                </div>
              </div>

              <div className={styles.uploadSection}>
                <label>Slike proizvoda (URL)</label>
                <div className={styles.urlInputGroup} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input 
                    type="url" 
                    placeholder="Unesite URL slike (https://...)" 
                    value={imageUrlInput} 
                    onChange={e => setImageUrlInput(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={addImageUrl} className={styles.addBtn}>Dodaj</button>
                </div>
                <div className={styles.previewGrid}>
                  {formData.images.map((img, idx) => (
                    <div key={idx} className={styles.previewItem}>
                      <img src={getImageUrl(img)} alt="" />
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