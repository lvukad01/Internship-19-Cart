const Cart = () => {
  return (
    <div className="p-4">
      <h1 style={{ fontSize: '24px', fontWeight: 700 }}>My Cart</h1>
      <div style={{ marginTop: '20px', border: '1px dashed var(--border)', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
        <p>Your cart is empty.</p>
      </div>
      
      <button style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '390px',
        background: 'var(--text-h)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontWeight: 'bold'
      }}>
        Checkout - 0.00 €
      </button>
    </div>
  );
};

export default Cart;