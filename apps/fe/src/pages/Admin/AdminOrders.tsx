import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import styles from "./AdminSections.module.css";

const AdminOrders = () => {
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    },
  });

  const orders = Array.isArray(response) ? response : response?.data || [];

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await axios.patch(
        `http://localhost:3000/api/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  if (isLoading) return <div>Učitavanje narudžbi...</div>;

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3>Upravljanje Narudžbama</h3>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Korisnik</th>
            <th>Iznos</th>
            <th>Datum</th>
            <th>Status</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.user?.email || "Gost"}</td>
              <td>{order.total} $</td>
              <td>{new Date(order.createdAt).toLocaleDateString("hr-HR")}</td>
              <td>
                <span className={`${styles.statusBadge} ${styles[order.status?.toLowerCase()]}`}>
                  {order.status}
                </span>
              </td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatusMutation.mutate({
                      id: order.id,
                      status: e.target.value,
                    })
                  }
                  className={styles.statusSelect}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
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