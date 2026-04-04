import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import styles from './AdminSections.module.css';

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  const { data: orders } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    }
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      await axios.patch(`http://localhost:3000/api/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
  });

  return (
    <div className={styles.section}>
      <h3>Sve Narudžbe</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Kupac</th>
            <th>Iznos</th>
            <th>Status</th>
            <th>Promijeni Status</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((o: any) => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td>{o.customerName}</td>
              <td>{o.totalPrice} $</td>
              <td className={styles[`status${o.status}`]}>{o.status}</td>
              <td>
                <select 
                  value={o.status} 
                  onChange={(e) => updateStatus.mutate({ id: o.id, status: e.target.value })}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;