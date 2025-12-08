import React, { useState } from 'react';
import { signUp, signIn } from '../services/authService';
import { Flower2 } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          setError('Please enter your name');
          setIsLoading(false);
          return;
        }
        await signUp(email, password, displayName);
      } else {
        await signIn(email, password);
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-lumina-base text-lumina-highlight overflow-hidden relative font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-lumina-base via-white to-lumina-base z-0 pointer-events-none"></div>

      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-lumina-lavender/30 blur-[100px] rounded-full pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-lumina-rose/20 blur-[100px] rounded-full pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Flower2 className="w-8 h-8 text-lumina-rose" />
              <h1 className="font-serif text-4xl text-lumina-highlight tracking-tight">FEM</h1>
              <Flower2 className="w-8 h-8 text-lumina-rose" />
            </div>
            <p className="text-lumina-rose text-sm uppercase tracking-[0.25em] font-medium">Elegant. Soft. You.</p>
          </div>

          <div className="glass-panel p-8 rounded-3xl">
            <h2 className="text-2xl font-serif text-lumina-highlight mb-6 text-center tracking-wide">
              {isSignUp ? 'Begin Your Journey' : 'Welcome Back'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm text-lumina-highlight/60 mb-2 font-medium">Your Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-lumina-soft/20 rounded-xl text-lumina-highlight placeholder-lumina-highlight/40 focus:outline-none focus:border-lumina-rose/30 focus:bg-white transition-all"
                    placeholder="Elena"
                    disabled={isLoading}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-lumina-highlight/60 mb-2 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-lumina-soft/20 rounded-xl text-lumina-highlight placeholder-lumina-highlight/40 focus:outline-none focus:border-lumina-rose/30 focus:bg-white transition-all"
                  placeholder="you@example.com"
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-lumina-highlight/60 mb-2 font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-lumina-soft/20 rounded-xl text-lumina-highlight placeholder-lumina-highlight/40 focus:outline-none focus:border-lumina-rose/30 focus:bg-white transition-all"
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-lumina-rose to-lumina-lavender text-white rounded-xl font-serif tracking-wide hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-lumina-highlight/60 text-sm">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setEmail('');
                    setPassword('');
                    setDisplayName('');
                  }}
                  className="text-lumina-rose hover:text-lumina-lavender font-medium transition-colors"
                >
                  {isSignUp ? 'Sign In' : 'Create Account'}
                </button>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-lumina-highlight/40 mt-6">
            Your data is encrypted and protected. We respect your privacy.
          </p>
        </div>
      </div>
    </div>
  );
}
