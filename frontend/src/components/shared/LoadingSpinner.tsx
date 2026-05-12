export default function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem' }}>
      <div style={{
        width: 40, height: 40,
        border: '3px solid var(--timeline-line)',
        borderTopColor: 'var(--accent-color)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  );
}
