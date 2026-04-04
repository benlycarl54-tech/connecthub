import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { RegisterProvider } from './context/RegisterContext';

// Pages
import Landing from './pages/Landing';
import Join from './pages/Join';
import Name from './pages/register/Name';
import Birthday from './pages/register/Birthday';
import Gender from './pages/register/Gender';
import Mobile from './pages/register/Mobile';
import Email from './pages/register/Email';
import Password from './pages/register/Password';
import Terms from './pages/register/Terms';
import Confirm from './pages/register/Confirm';
import Photo from './pages/register/Photo';
import Welcome from './pages/register/Welcome';
import Friends from './pages/register/Friends';
import Home from './pages/Home';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <RegisterProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/join" element={<Join />} />
        <Route path="/register/name" element={<Name />} />
        <Route path="/register/birthday" element={<Birthday />} />
        <Route path="/register/gender" element={<Gender />} />
        <Route path="/register/mobile" element={<Mobile />} />
        <Route path="/register/email" element={<Email />} />
        <Route path="/register/password" element={<Password />} />
        <Route path="/register/terms" element={<Terms />} />
        <Route path="/register/confirm" element={<Confirm />} />
        <Route path="/register/photo" element={<Photo />} />
        <Route path="/register/welcome" element={<Welcome />} />
        <Route path="/register/friends" element={<Friends />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </RegisterProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App