import React, { useState, useCallback, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import VideoGrid from './components/VideoGrid';
import Auth from './components/Auth';
import VideoPlayerModal from './components/VideoPlayerModal';
import ProModal from './components/ProModal';
import { PlayLogoIcon } from './components/icons/PlayLogoIcon';
import type { Video, User } from './types';
import { translateText, detectLanguage } from './services/geminiService';
import { searchVideos } from './services/youtubeService';
import { ErrorIcon } from './components/icons/ErrorIcon';
import { auth } from './services/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User as FirebaseUser } from "firebase/auth";


const FREE_SEARCH_LIMIT = 5;

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [searchCount, setSearchCount] = useState<number>(FREE_SEARCH_LIMIT);
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);
  const [authIsLoading, setAuthIsLoading] = useState<boolean>(true);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Here you could fetch user's Pro status from your own database
        setUser({
          name: firebaseUser.displayName || 'User',
          avatarUrl: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName}&background=random`,
          isPro: false, // Default to false for this example
        });
      } else {
        setUser(null);
      }
      setAuthIsLoading(false);
    });
    return () => unsubscribe();
  }, []);


  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In Error", error);
      setError("Could not sign in with Google. Please try again.");
    }
  };

  const handleAppleSignIn = () => {
    // This is a placeholder. Real Apple Sign-In requires a paid Apple Developer account
    // and server-side configuration.
    alert("Real Apple Sign-In requires an Apple Developer account setup.");
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign Out Error", error);
    }
  };

  const handleUpgradeToPro = () => {
    if (user) {
      // In a real app, this would trigger a payment flow.
      // After successful payment, you'd update the user's status in your database.
      setUser({ ...user, isPro: true });
    } else {
      // Prompt non-signed-in users to sign in first to upgrade
      handleGoogleSignIn();
    }
    setIsProModalOpen(false);
  };

  const handleSearch = useCallback(async (query: string) => {
    if (!query) return;

    if (!user?.isPro && searchCount <= 0) {
      setIsProModalOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setVideos([]);
    setSearchQuery('');

    try {
      if (!user?.isPro) {
        setSearchCount(prev => prev - 1);
      }

      const lang = await detectLanguage(query);
      let englishQuery = query;

      if (lang !== 'en') {
        englishQuery = await translateText(query);
      }
      
      setSearchQuery(englishQuery);
      
      if (englishQuery) {
        const results = await searchVideos(englishQuery);
        setVideos(results);
      } else {
        setVideos([]);
      }

    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, searchCount]);

  const renderContent = () => {
    if (isLoading) {
      return <VideoGrid videos={[]} isLoading={true} onVideoSelect={() => {}} />;
    }

    if (error) {
      return (
        <div className="mt-20 flex flex-col items-center justify-center gap-4 text-center bg-red-900/20 border border-red-500 text-red-300 px-4 py-5 rounded-lg max-w-md mx-auto">
          <ErrorIcon className="w-12 h-12 text-red-400" />
          <div>
            <h3 className="font-bold text-lg">Search Failed</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      );
    }

    if (!hasSearched) {
        return (
            <div className="text-center mt-20 flex flex-col items-center text-gray-400">
                <PlayLogoIcon className="w-24 h-24 text-red-600" />
                <h2 className="text-2xl font-semibold mt-6">Welcome to oneworld</h2>
                <p className="mt-2 max-w-sm">Your portal to global video content. Search in any language to discover videos from around the world.</p>
            </div>
        );
    }

    if (videos.length > 0) {
      return <VideoGrid videos={videos} isLoading={false} onVideoSelect={setSelectedVideo} />;
    }

    if (hasSearched && !isLoading) {
        return (
            <div className="text-center mt-20 text-gray-400">
                <h2 className="text-2xl font-semibold">No Results Found</h2>
                <p className="mt-2">Try a different search query. Results are powered by YouTube.</p>
            </div>
        );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      <header className="sticky top-0 z-20 grid grid-cols-3 items-center px-4 h-14 bg-[#0f0f0f] border-b border-white/10 gap-4">
        <div className="flex items-center gap-3">
            <PlayLogoIcon className="w-8 h-8 text-red-600" />
            <h1 className="text-xl font-bold tracking-tighter hidden sm:block">oneworld</h1>
        </div>
        <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} user={user} searchCount={searchCount} />
        </div>
        <div className="flex items-center justify-end">
          <Auth 
            user={user} 
            isLoading={authIsLoading}
            onGoogleSignIn={handleGoogleSignIn} 
            onAppleSignIn={handleAppleSignIn} 
            onSignOut={handleSignOut}
            onUpgrade={() => setIsProModalOpen(true)}
          />
        </div>
      </header>
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        {hasSearched && !isLoading && !error && !user && videos.length > 0 && (
          <div className="text-center bg-white/5 border border-white/10 rounded-lg p-3 mb-6 max-w-2xl mx-auto">
            <p className="text-sm text-gray-300">
              Sign in to enjoy an ad-free experience with your YouTube Premium.
            </p>
          </div>
        )}
        {searchQuery && !isLoading && (
          <p className="text-sm text-center text-gray-400 mb-6">
            Showing results for: <span className="font-semibold text-gray-200">"{searchQuery}"</span>
          </p>
        )}
        {renderContent()}
      </main>
      <footer className="text-center p-4 border-t border-white/10 text-xs text-gray-500">
        <p>Powered by the YouTube Data API and Google Gemini.</p>
      </footer>
      {selectedVideo && <VideoPlayerModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
      <ProModal 
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        onUpgrade={handleUpgradeToPro}
      />
    </div>
  );
};

export default App;