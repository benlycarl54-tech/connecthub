import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { RegisterProvider } from './context/RegisterContext';
import { FBAuthProvider } from './context/AuthContext';
import SearchPage from './pages/SearchPage';
import UserProfile from './pages/UserProfile';
import AdminPanel from './pages/AdminPanel';
import Messages from './pages/Messages';
import LivePage from './pages/LivePage';
import FriendsPage from './pages/FriendsPage';
import NotificationsPage from './pages/NotificationsPage';
import VideosPage from './pages/VideosPage';
import CreateStory from './pages/CreateStory';
import StoryViewer from './pages/StoryViewer';

import Landing from './pages/Landing';
import Join from './pages/Join';
import NameStep from './pages/register/NameStep';
import BirthdayStep from './pages/register/BirthdayStep';
import GenderStep from './pages/register/GenderStep';
import MobileStep from './pages/register/MobileStep';
import PasswordStep from './pages/register/PasswordStep';
import TermsStep from './pages/register/TermsStep';
import ConfirmationStep from './pages/register/ConfirmationStep';
import PictureStep from './pages/register/PictureStep';
import WelcomeStep from './pages/register/WelcomeStep';
import FriendsStep from './pages/register/FriendsStep';
import Home from './pages/Home';
import Profile from './pages/Profile';

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
        <Route path="/register/name" element={<NameStep />} />
        <Route path="/register/birthday" element={<BirthdayStep />} />
        <Route path="/register/gender" element={<GenderStep />} />
        <Route path="/register/mobile" element={<MobileStep />} />
        <Route path="/register/password" element={<PasswordStep />} />
        <Route path="/register/terms" element={<TermsStep />} />
        <Route path="/register/confirmation" element={<ConfirmationStep />} />
        <Route path="/register/picture" element={<PictureStep />} />
        <Route path="/register/welcome" element={<WelcomeStep />} />
        <Route path="/register/friends" element={<FriendsStep />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/live" element={<LivePage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/create-story" element={<CreateStory />} />
        <Route path="/story-viewer" element={<StoryViewer />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </RegisterProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <FBAuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </FBAuthProvider>
    </AuthProvider>
  );
}

export default App;