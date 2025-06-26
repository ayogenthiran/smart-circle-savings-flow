import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCircle } from '../hooks/useCircle';
import { useDeals } from '../hooks/useDeals';
import { useChallenges } from '../hooks/useChallenges';
import { useSavings } from '../hooks/useSavings';
import { useNotifications } from '../hooks/useNotifications';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { CircleDashboard } from '@/components/CircleDashboard';
import { GroupDeals } from '@/components/GroupDeals';
import { AINotifications } from '@/components/AINotifications';
import { supabase } from '../api/supabaseClient';

export default function Home() {
  const { user, loading } = useCurrentUser();
  const userId = user?.id;
  const navigate = useNavigate();
  // Always call hooks at the top level
  const { circleId, members } = useCircle(userId);
  const { deals, join: joinDeal } = useDeals(userId, circleId || '');
  const { challenges, join: joinChallenge } = useChallenges(userId, circleId || '');
  const { rewards, participations } = useSavings(userId);
  const { notifications } = useNotifications(userId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // If not logged in, prompt for login
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your dashboard.</h2>
          <a href="/login" className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Debug log to verify data
  console.log({ circleId, members, deals });

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      {/* Header - Matching Landing Page Style */}
      <header className="bg-white/70 backdrop-blur-md border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <h1 className="text-3xl font-bold text-gray-900">SmartCircles</h1>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Dashboard
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Deals
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Challenges
              </a>
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-300">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "User"}</p>
                  <p className="text-xs text-orange-600">Circle {circleId || 'N/A'}</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center cursor-pointer" onClick={handleLogout} title="Log out">
                  <span className="text-orange-600 font-medium">
                    {user?.user_metadata?.full_name?.[0] || user?.user_metadata?.name?.[0] || user?.email?.[0] || 'U'}
                  </span>
                </div>
              </div>
            </nav>
            {/* Mobile user info */}
            <div className="md:hidden flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "User"}</p>
                <p className="text-xs text-orange-600">Circle {circleId || 'N/A'}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center cursor-pointer" onClick={handleLogout} title="Log out">
                <span className="text-orange-600 font-medium">
                  {user?.user_metadata?.full_name?.[0] || user?.user_metadata?.name?.[0] || user?.email?.[0] || 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* AI Notifications */}
      <AINotifications />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/80 p-6 transition-all duration-300 hover:shadow-xl">
              <CircleDashboard circleId={circleId} members={members} />
            </div>
          </div>
          
          {/* Right Column - Deals */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/80 p-6 transition-all duration-300 hover:shadow-xl">
              <GroupDeals deals={deals} joinDeal={joinDeal} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}