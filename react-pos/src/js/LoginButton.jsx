const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function LoginButton() {
    return (
        <a href={`${API}/auth/google`}>
            <button
                style={{
                    backgroundColor: '#4285F4',
                    color: 'white',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                }}
            >
                Login with Google
            </button>
        </a>
    );
}
