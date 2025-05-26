import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AccountTypeSelection from './pages/AccountTypeSelection';
import Bookings from './pages/Bookings';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import AIQuery from './pages/AIQuery';
import Contact from './pages/Contact';
import DesignDiary from './pages/DesignDiary';
import HappyClients from './pages/features/HappyClients';
import ProjectsCompleted from './pages/features/ProjectsCompleted';
import CitiesCovered from './pages/features/CitiesCovered';
import SatisfactionRate from './pages/features/SatisfactionRate';
import LicensedInsured from './pages/features/LicensedInsured';
import ExpertTeam from './pages/features/ExpertTeam';
import OnTimeService from './pages/features/OnTimeService';
import FairPricing from './pages/features/FairPricing';
import InteriorPainting from './pages/services/InteriorPainting';
import ExteriorPainting from './pages/services/ExteriorPainting';
import CabinetRefinishing from './pages/services/CabinetRefinishing';
import AllServices from './pages/AllServices';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <div className="min-h-screen bg-gray-50 w-full">
          <Navbar />
          <main className="w-full px-4 py-8 min-h-[calc(100vh-64px)]">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/sign-in/*" element={<SignIn />} />
              <Route path="/sign-up/*" element={<SignUp />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/design-diary" element={<DesignDiary />} />

              {/* Protected Routes */}
              <Route
                path="/account-type"
                element={
                  <>
                    <SignedIn>
                      <AccountTypeSelection />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <>
                    <SignedIn>
                      <Dashboard />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              <Route
                path="/bookings"
                element={
                  <>
                    <SignedIn>
                      <Bookings />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              <Route
                path="/profile"
                element={
                  <>
                    <SignedIn>
                      <Profile />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              <Route
                path="/ai-query"
                element={
                  <>
                    <SignedIn>
                      <AIQuery />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              {/* Professional Type Routes */}
              <Route
                path="/painter/*"
                element={
                  <>
                    <SignedIn>
                      <Dashboard type="painter" />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              <Route
                path="/plumber/*"
                element={
                  <>
                    <SignedIn>
                      <Dashboard type="plumber" />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              <Route
                path="/contractor/*"
                element={
                  <>
                    <SignedIn>
                      <Dashboard type="contractor" />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              {/* Features Routes */}
              <Route path="/features/happy-clients" element={<HappyClients />} />
              <Route path="/features/projects-completed" element={<ProjectsCompleted />} />
              <Route path="/features/cities-covered" element={<CitiesCovered />} />
              <Route path="/features/satisfaction-rate" element={<SatisfactionRate />} />
              <Route path="/features/licensed-insured" element={<LicensedInsured />} />
              <Route path="/features/expert-team" element={<ExpertTeam />} />
              <Route path="/features/on-time-service" element={<OnTimeService />} />
              <Route path="/features/fair-pricing" element={<FairPricing />} />

              {/* New service pages routes */}
              <Route path="/services/interior-painting" element={<InteriorPainting />} />
              <Route path="/services/exterior-painting" element={<ExteriorPainting />} />
              <Route path="/services/cabinet-refinishing" element={<CabinetRefinishing />} />

              {/* All Services page route */}
              <Route path="/services" element={<AllServices />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App; 