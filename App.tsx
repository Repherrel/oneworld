
import React, { useState, useCallback, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import VideoGrid from './components/VideoGrid';
import Auth from './components/Auth';
import VideoPlayerModal from './components/VideoPlayerModal';
import ProModal from './components/ProModal';
import { OneworldLogo } from './components/icons/OneworldLogo';
import type { Video, User } from './types';
import { performIntelligentSearch, performDirectSearch } from './services/oneworldService';
import { ErrorIcon } from './components/icons/ErrorIcon';
import { auth } from './services/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User as FirebaseUser } from "firebase/auth";
import ExampleSearches from './components/ExampleSearches';


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
  const [loadingMessage, setLoadingMessage] = useState<string>('');


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
      setError(null);
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Google Sign-In Error", error);
      setError("Google Sign-In failed. Please check your Firebase project setup (API key, authorized domains) and try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign Out Error", error);
    }
  };
  
  const resetToHome = () => {
    setHasSearched(false);
    setVideos([]);
    setError(null);
    setSearchQuery('');
    setLoadingMessage('');
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
    setLoadingMessage(`Searching for "${query}"...`);

    let hasDirectResults = false;

    // 1. Perform an INSTANT direct search with the original query.
    try {
      const directResults = await performDirectSearch(query);
      if (directResults.length > 0) {
        hasDirectResults = true;
      }
      setVideos(directResults); // Show initial results immediately
    } catch (e) {
      // This catch is unlikely to be hit because performDirectSearch returns [] on error
      console.error("Direct search failed, proceeding with intelligent search.", e);
    } finally {
      // IMPORTANT: Stop the main loader after the first, fast search completes.
      setIsLoading(false);
      setLoadingMessage('');
    }

    // 2. In the background, perform the INTELLIGENT search for enhanced results.
    try {
      if (!user?.isPro) {
        setSearchCount(prev => prev - 1);
      }
      
      const { videos: intelligentResults, translatedQuery } = await performIntelligentSearch(query);
      
      // 3. Seamlessly update the UI with the enhanced results.
      if (translatedQuery && translatedQuery.toLowerCase() !== query.toLowerCase()) {
        setSearchQuery(translatedQuery);
      } else {
        setSearchQuery(''); // Don't show "results for" if it's the same
      }

      setVideos(intelligentResults); // Replace initial results with smarter ones

    } catch (e) {
      // If the intelligent search fails, we still have the direct search results.
      // We only show an error if the direct search *also* failed.
      if (!hasDirectResults) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred during the intelligent search.');
        }
      }
      console.error("Intelligent search failed:", e);
    }
  }, [user, searchCount]);

  const renderContent = () => {
    // Show skeleton loader ONLY during the initial, brief loading phase.
    if (isLoading && videos.length === 0) {
      return (
        <div>
           {loadingMessage && <p className="text-center text-gray-400 mb-6 animate-fade-in">{loadingMessage}</p>}
           <VideoGrid videos={[]} isLoading={true} onVideoSelect={() => {}} />
        </div>
      );
    }

    if (error) {
      return (
        <div className="mt-20 flex flex-col items-center justify-center gap-4 text-center bg-red-900/20 border border-red-500 text-red-300 px-4 py-5 rounded-lg max-w-md mx-auto">
          <ErrorIcon className="w-12 h-12 text-red-400" />
          <div>
            <h3 className="font-bold text-lg">An Error Occurred</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      );
    }

    if (!hasSearched) {
        return (
            <div className="text-center mt-12 sm:mt-20 flex flex-col items-center text-gray-400 animate-fade-in">
                <OneworldLogo className="w-20 h-20 sm:w-24 sm:h-24" />
                <h2 className="text-2xl sm:text-3xl font-semibold mt-6 text-gray-100">Search in any language.</h2>
                <p className="mt-2 max-w-md text-base">We translate your query to English and find videos from across the globe. Try it out:</p>
                <ExampleSearches onSearch={handleSearch} />
            </div>
        );
    }

    if (videos.length > 0) {
      return <VideoGrid videos={videos} isLoading={false} onVideoSelect={setSelectedVideo} />;
    }

    // Show "No Results" only if a search has completed and there are no videos and no loader.
    if (hasSearched && !isLoading && videos.length === 0) {
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
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 h-16 bg-[#0f0f0f]/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-4">
          <button onClick={resetToHome} aria-label="Go to homepage">
            <OneworldLogo className="w-9 h-9" />
          </button>
          <h1 className="text-xl font-bold tracking-tighter hidden sm:block">oneworld</h1>
        </div>
        <div className="flex-1 flex justify-center px-4">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
        <div className="flex items-center justify-end">
          <Auth 
            user={user} 
            isLoading={authIsLoading}
            onGoogleSignIn={handleGoogleSignIn}
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
        {searchQuery && !isLoading && !error && videos.length > 0 &&(
          <p className="text-sm text-center text-gray-400 mb-6 animate-fade-in">
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
