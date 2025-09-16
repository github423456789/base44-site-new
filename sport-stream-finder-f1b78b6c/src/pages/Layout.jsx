

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Menu, X, Shield, Bot, Trophy, Calendar
} from 'lucide-react';
import LanguageSwitcher from './components/language/LanguageSwitcher';
import { getGeoFromIp } from '@/api/functions';
import ConsentBanner from './components/legal/ConsentBanner';
import AdSenseScript from './components/ads/AdSenseScript';

const countryCodeToLangCode = {
  US: 'en', GB: 'en', AU: 'en', CA: 'en', NZ: 'en', IE: 'en',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es',
  FR: 'fr',
  DE: 'de', AT: 'de', CH: 'de',
  IT: 'it',
  PT: 'pt', BR: 'pt',
  SA: 'ar', AE: 'ar', EG: 'ar',
  IL: 'he',
  IN: 'hi',
  ID: 'id',
  TH: 'th',
  CN: 'zh',
  JP: 'ja',
  KR: 'ko',
  RU: 'ru',
  NL: 'nl', BE: 'nl',
  PL: 'pl',
  TR: 'tr',
  SE: 'sv',
  DK: 'da',
  NO: 'no',
  FI: 'fi',
  CZ: 'cs',
  HU: 'hu',
  RO: 'ro',
  BG: 'bg',
  HR: 'hr',
  SK: 'sk',
  SI: 'sl',
  EE: 'et',
  LV: 'lv',
  LT: 'lt',
  UA: 'uk',
  VN: 'vi',
  MY: 'ms',
  PH: 'tl',
};

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check for consent on initial load
    const consentGiven = localStorage.getItem('user_consent_given');
    if (!consentGiven) {
      setShowConsent(true);
    }

    const setInitialLanguage = async () => {
      // Only run if user has no language preference saved
      if (!localStorage.getItem('preferredLanguage')) {
        try {
          const response = await getGeoFromIp();
          const countryCode = response.data?.country_code;
          const langCode = countryCodeToLangCode[countryCode];

          if (langCode) {
            localStorage.setItem('preferredLanguage', langCode);
            window.location.reload(); // Refresh to apply the new language setting
          }
        } catch (error) {
          console.error("Failed to set initial language:", error);
        }
      }
    };
    setInitialLanguage();
  }, []);

  const navigation = [
    { name: 'Home', href: createPageUrl('Home'), icon: Trophy, current: currentPageName === 'Home' },
    { name: 'Fixtures Finder', href: createPageUrl('MatchFinder'), icon: Calendar, current: currentPageName === 'MatchFinder' },
    { name: 'Admin', href: createPageUrl('Admin'), icon: Bot, current: currentPageName === 'Admin' },
    { name: 'Legal', href: createPageUrl('Legal'), icon: Shield, current: currentPageName === 'Legal' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* AdSense Script */}
      <AdSenseScript />
      
      {/* Consent Banner */}
      {showConsent && <ConsentBanner onAccept={() => setShowConsent(false)} />}

      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Top bar for mobile - moved above sidebar */}
      <header className="bg-white border-b border-gray-200 lg:hidden sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <Link to={createPageUrl('Home')} className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">CL Finder</span>
          </Link>
          <div className="w-10"></div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between h-16 px-6 border-b lg:justify-center">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">CL Finder</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="px-4 py-6 space-y-2 flex-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Language Switcher in Sidebar */}
          <div className="px-4 py-4 border-t">
            <LanguageSwitcher />
          </div>

          {/* Trust Badge */}
          <div className="px-4 pb-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 text-green-800 text-sm font-medium mb-1">
                  <Shield className="w-4 h-4" />
                  100% Legal
                </div>
                <p className="text-xs text-green-600">
                  Only official broadcasters & verified streaming services
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-h-screen flex flex-col lg:ml-0">
          {/* Page content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 px-4 py-8 mt-auto">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="md:col-span-2 lg:col-span-1">
                  <Link to={createPageUrl('Home')} className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg text-slate-900">CL Finder</span>
                  </Link>
                  <p className="text-sm text-slate-600">
                    Find legal ways to watch the UEFA Champions League. Schedule data sourced from UEFA.com.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Browse</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li><Link to={createPageUrl('MatchFinder')} className="hover:text-blue-600">Upcoming Fixtures</Link></li>
                    <li><Link to={createPageUrl('Home')} className="hover:text-blue-600">Home</Link></li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Legal</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li><Link to={createPageUrl('Legal')} className="hover:text-blue-600">Terms of Service</Link></li>
                    <li><Link to={createPageUrl('Legal')} className="hover:text-blue-600">Privacy Policy</Link></li>
                    <li><Link to={createPageUrl('Legal')} className="hover:text-blue-600">Copyright Policy</Link></li>
                    <li><Link to={createPageUrl('Legal')} className="hover:text-blue-600">Contact Us</Link></li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Trust & Safety</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-slate-600">100% Legal Sources</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-slate-600">Official Broadcasters</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-slate-600">Verified Streaming</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-slate-500">
                <p>&copy; 2024 CL Finder. All rights reserved. Not affiliated with UEFA.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

