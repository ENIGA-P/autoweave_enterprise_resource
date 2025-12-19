import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import ThemedInput from '../../components/common/ThemedInput';
import { Lock } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(username, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError('Invalid credentials. Use: samytex@gmail.com');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pastel-mint-100 via-pastel-lavender-100 to-pastel-blue-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white border-2 border-pastel-mint-300 rounded-2xl shadow-soft-lg p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pastel-mint-200 to-pastel-lavender-200 border-2 border-pastel-mint-400 mb-4 shadow-soft">
                        <Lock className="w-8 h-8 text-text-primary" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-bold text-text-primary">AutoWeave</h2>
                    <p className="text-text-secondary mt-2 font-medium">Sign in to access the ERP</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-status-faulty-light border-2 border-status-faulty-main text-status-faulty-text px-4 py-3 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <ThemedInput
                        label="Email"
                        type="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />

                    <ThemedInput
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />

                    <Button
                        type="submit"
                        className="w-full py-3 text-lg"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-text-muted">
                    <p className="font-medium">Restricted Access System</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
