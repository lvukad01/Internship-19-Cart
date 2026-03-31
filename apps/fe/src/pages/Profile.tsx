const Profile = () => {
  return (
    <div className="p-4">
      <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Profile</h1>
      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          👤
        </div>
        <div>
          <h2 style={{ margin: 0 }}>User Name</h2>
          <p style={{ color: 'var(--text)', fontSize: '14px' }}>user@dump.hr</p>
        </div>
      </div>
      
      <button style={{ marginTop: '30px', width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'red' }}>
        Log Out
      </button>
    </div>
  );
};

export default Profile;