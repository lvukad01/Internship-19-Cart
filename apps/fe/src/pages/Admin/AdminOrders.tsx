import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useMemo } from 'react';
import styles from './AdminSections.module.css';

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const token = localStorage.getItem('token');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return Array.isArray(res.data) ? res.data : res.data.data || [];
    }
  });

  const filteredOrders = useMemo(() => {
    const list = Array.isArray(orders) ? orders : [];
    if (!statusFilter) return list;
    return list.filter((o: any) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await axios.patch(`http://localhost:3000/api/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setSelectedOrder(null);
    }
  });

  if (isLoading) return <div className={styles.loader}>Učitavanje narudžbi...</div>;

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div>
          <h3>Upravljanje Narudžbama</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Ukupno: {filteredOrders.length}</p>
        </div>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">Svi statusi</option>
          <option value="PENDING">PENDING</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="DELIVERED">DELIVERED</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Datum</th>
              <th>Kupac</th>
              <th>Iznos</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o: any) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{new Date(o.createdAt).toLocaleDateString('hr-HR')}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{o.customerName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{o.customerPhone}</div>
                </td>
                <td style={{ fontWeight: 600 }}>{o.totalPrice.toFixed(2)} €</td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[o.status.toLowerCase()]}`}>
                    {o.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className={styles.editBtn} onClick={() => setSelectedOrder(o)}>Detalji</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div className={styles.modal} style={{ maxWidth: '700px' }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h4>Detalji Narudžbe #{selectedOrder.id}</h4>
              <button className={styles.closeModalBtn} onClick={() => setSelectedOrder(null)}>&times;</button>
            </div>
            
            <div className={styles.orderDetailGrid}>
              <div className={styles.detailBlock}>
                <h5>Informacije o dostavi</h5>
                <p><strong>Ime:</strong> {selectedOrder.customerName}</p>
                <p><strong>Telefon:</strong> {selectedOrder.customerPhone}</p>
                <p><strong>Adresa:</strong> {selectedOrder.shippingAddress}</p>
                <p><strong>Metoda:</strong> {selectedOrder.deliveryMethod}</p>
              </div>
              
              <div className={styles.detailBlock}>
                <h5>Plaćanje</h5>
                <p><strong>Metoda:</strong> {selectedOrder.paymentMethod}</p>
                <p><strong>Status:</strong> {selectedOrder.isCompleted ? 'Plaćeno' : 'Nije plaćeno'}</p>
              </div>
            </div>

            <div className={styles.orderItemsList}>
              <h5>Stavke narudžbe</h5>
              <table className={styles.miniTable}>
                <thead>
                  <tr>
                    <th>Proizvod</th>
                    <th>Kol.</th>
                    <th>Cijena</th>
                    <th>Ukupno</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item: any) => (
                    <tr key={item.id}>
                      <td>{item.product?.name || `Product ID: ${item.productId}`}</td>
                      <td>{item.quantity}x</td>
                      <td>{item.price.toFixed(2)} €</td>
                      <td>{(item.quantity * item.price).toFixed(2)} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.orderSummary}>
              <div className={styles.summaryRow}><span>Subtotal:</span> <span>{selectedOrder.subTotal.toFixed(2)} €</span></div>
              <div className={styles.summaryRow}><span>Dostava:</span> <span>{selectedOrder.deliveryPrice.toFixed(2)} €</span></div>
              <div className={styles.summaryRow} style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                <span>UKUPNO:</span> <span>{selectedOrder.totalPrice.toFixed(2)} €</span>
              </div>
            </div>

            <div className={styles.statusUpdateActions}>
              <h5>Promijeni status narudžbe:</h5>
              <div className={styles.statusButtons}>
                {['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'].map((s) => (
                  <button 
                    key={s}
                    disabled={selectedOrder.status === s || updateStatusMutation.isPending}
                    onClick={() => updateStatusMutation.mutate({ id: selectedOrder.id, status: s })}
                    className={`${styles.statusBtn} ${selectedOrder.status === s ? styles.activeStatus : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;