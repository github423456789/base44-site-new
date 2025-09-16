
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, Globe, Trophy, Shield, ExternalLink, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { SportsEvent } from '@/api/entities';
import { Broadcaster } from '@/api/entities';
import { getGeoFromIp } from '@/api/functions';
import { format, isToday, isTomorrow } from 'date-fns';
import AdUnit from '../components/ads/AdUnit';

// A new component to show a preview of broadcasters
const BroadcasterPreview = ({ match, userCountry }) => {
  const [broadcasters, setBroadcasters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBroadcasters = async () => {
      if (!userCountry) { // Wait until userCountry is detected
        setLoading(false); // Stop loading animation if country is not yet available
        return;
      }
      setLoading(true);
      try {
        const allBroadcasters = await Broadcaster.list();
        
        // Filter broadcasters by the detected user country
        const countryBroadcasters = allBroadcasters
            .filter(b => b.country === userCountry)
            .slice(0, 3); // Show top 3 for the preview
        
        setBroadcasters(countryBroadcasters);
      } catch (error) {
        console.error("Failed to fetch broadcasters:", error);
        setBroadcasters([]); // Clear broadcasters on error
      }
      setLoading(false);
    };
    fetchBroadcasters();
  }, [userCountry, match]); // Dependency array includes userCountry

  if (loading) {
    return (
      <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="text-xs font-medium text-green-800 mb-2 flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Finding streams in {userCountry || 'your region'}...
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-slate-200 rounded animate-pulse w-20"></div>
          <div className="h-6 bg-slate-200 rounded animate-pulse w-16"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
      <div className="text-xs font-medium text-green-800 mb-2 flex items-center gap-1">
        <Shield className="w-3 h-3" />
        Streams in {userCountry}:
      </div>
      <div className="flex flex-wrap gap-2">
        {broadcasters.length > 0 ? (
          broadcasters.map((streamer, idx) => (
            <Button
              key={idx}
              size="sm"
              variant="outline"
              className="h-6 text-xs border-green-300 text-green-700 hover:bg-green-100"
              onClick={() => window.open(streamer.official_url, '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              {streamer.name}
            </Button>
          ))
        ) : (
          <p className="text-xs text-slate-600">No official broadcasters found for your region.</p>
        )}
      </div>
    </div>
  );
};

export default function Home() {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [userCountry, setUserCountry] = useState(null); // State for the detected country

  useEffect(() => {
    // Fetch user's country on initial load
    const detectCountry = async () => {
        try {
            const response = await getGeoFromIp();
            if (response.data?.country) {
                setUserCountry(response.data.country);
            }
        } catch (error) {
            console.error("Country detection failed:", error);
            setUserCountry("United States of America"); // Fallback
        }
    };
    detectCountry();
  }, []);


  useEffect(() => {
    const fetchUpcomingMatches = async () => {
      setLoadingMatches(true);
      try {
        // Fetch recent and upcoming Champions League matches
        const allMatches = await SportsEvent.filter(
          { league: 'UEFA Champions League' },
          'start_time', // Sort by start time ascending
          50 // Get more matches to filter from
        );
        
        const now = new Date();
        // Filter to only show scheduled future matches or live matches
        const upcomingMatches = allMatches
          .filter(match => {
              const matchDate = new Date(match.start_time);
              return match.status === 'live' || (match.status === 'scheduled' && matchDate >= now);
          })
          .slice(0, 3); // Take only the first 3 valid upcoming matches
        
        setUpcomingMatches(upcomingMatches);
      } catch (error) {
        console.error("Failed to fetch upcoming matches:", error);
      }
      setLoadingMatches(false);
    };

    fetchUpcomingMatches();
  }, []);

  // handleSearch function removed
  // searchQuery state removed

  const handleViewMatch = (matchName) => {
    window.location.href = createPageUrl(`MatchFinder?q=${encodeURIComponent(matchName)}`);
  };

  const getMatchTimeDisplay = (match) => {
    if (match.status === 'live') return 'LIVE';
    
    const matchDate = new Date(match.start_time);

    if (isToday(matchDate)) {
      return format(matchDate, 'HH:mm');
    }
    if (isTomorrow(matchDate)) {
      return `Tomorrow ${format(matchDate, 'HH:mm')}`;
    }
    return format(matchDate, 'MMM d, HH:mm');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-32">
          <div className="text-center space-y-6 md:space-y-8">
            <div className="space-y-4">
              {/* Champions League Logo */}
              <div className="flex justify-center mb-4 md:mb-6">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                    ⚽ UEFA
                  </div>
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-400 tracking-wider">
                    CHAMPIONS LEAGUE
                  </div>
                  <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto mt-2 rounded"></div>
                </div>
              </div>
              
              <Badge className="bg-white/20 text-white border-white/30 px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm font-medium">
                <Trophy className="w-3 md:w-4 h-3 md:h-4 mr-2" />
                The Ultimate UEFA Champions League Hub
              </Badge>
              <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold leading-tight px-2">
                Watch The Champions
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent block pb-2 md:pb-4">
                  Legally & Safely
                </span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed pt-2 md:pt-4 px-4">
                Your home for official broadcasters and verified streaming services for every Champions League match.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex justify-center gap-6 md:gap-8 lg:gap-16 text-center pt-6 md:pt-8">
              <div>
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-400">1</div>
                <div className="text-xs md:text-sm lg:text-base text-blue-200">Best League</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-400">190+</div>
                <div className="text-xs md:text-sm lg:text-base text-blue-200">Countries</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-400">100%</div>
                <div className="text-xs md:text-sm lg:text-base text-blue-200">Legal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-12 md:space-y-16">
        {/* Today's Top Matches */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 md:w-6 h-5 md:h-6 text-blue-600" />
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Upcoming Champions League Matches</h2>
            </div>
            <Link to={createPageUrl("MatchFinder")}>
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 w-full md:w-auto">
                View All Fixtures
              </Button>
            </Link>
          </div>

          {/* Ad Unit - Top of matches */}
          <div className="mb-8">
            <AdUnit 
              slot="1234567890" 
              style={{ display: 'block', textAlign: 'center' }}
              className="mb-6"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {loadingMatches ? (
              [1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-5 bg-slate-200 rounded w-1/4"></div>
                    </div>
                    <div className="h-16 bg-slate-200 rounded"></div>
                    <div className="h-20 bg-slate-200 rounded"></div>
                    <div className="h-10 bg-slate-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : upcomingMatches.length > 0 ? (
              upcomingMatches.map((match) => (
              <Card key={match.id} className="group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/80 backdrop-blur-sm hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-slate-600">{match.league}</span>
                    </div>
                    <Badge className={`whitespace-nowrap ${match.status === 'live' ? 'bg-red-500 animate-pulse text-white' : 'bg-blue-500 text-white'}`}>
                      {getMatchTimeDisplay(match)}
                    </Badge>
                  </div>

                  {/* Teams */}
                  <div className="flex items-center justify-between mb-6 space-x-2">
                    {/* Home Team */}
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1 border flex-shrink-0">
                        {match.home_team_logo ? <img src={match.home_team_logo} alt={match.home_team} className="w-10 h-10 object-contain" /> : <span className="text-xs font-bold">{match.home_team.slice(0,3).toUpperCase()}</span>}
                      </div>
                      <h3 className="font-bold text-slate-900 truncate">{match.home_team}</h3>
                    </div>
                    
                    {/* VS */}
                    <div className="text-center px-2 flex-shrink-0">
                      <div className="text-xl font-bold text-slate-400">VS</div>
                    </div>
                    
                    {/* Away Team */}
                    <div className="flex items-center justify-end space-x-3 flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 truncate text-right">{match.away_team}</h3>
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1 border flex-shrink-0">
                        {match.away_team_logo ? <img src={match.away_team_logo} alt={match.away_team} className="w-10 h-10 object-contain" /> : <span className="text-xs font-bold">{match.away_team.slice(0,3).toUpperCase()}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Streaming Options (Now Dynamic with Geolocation) */}
                  <BroadcasterPreview match={match} userCountry={userCountry} />

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleViewMatch(`${match.home_team} vs ${match.away_team}`)}
                    >
                      More Viewing Options
                    </Button>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Official broadcasters & verified sources only
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
            ) : (
              <Card className="md:col-span-3">
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">No Upcoming Matches</h3>
                  <p className="text-slate-500">Check back later or use the Admin panel to fetch the latest fixtures.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Ad Unit - Middle of page */}
        <div className="my-12">
          <AdUnit 
            slot="0987654321" 
            style={{ display: 'block', textAlign: 'center' }}
            format="rectangle"
          />
        </div>

        {/* Grid Layout - Where to Watch */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Data source section */}
             <section>
                <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-5 md:w-6 h-5 md:h-6 text-blue-600" />
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900">Accurate & Official Schedule</h2>
                </div>
                <div className="p-6 bg-white rounded-lg border border-slate-200">
                    <p className="text-slate-700">
                        We take accuracy seriously. Our match schedule is automatically scraped and updated directly from the official <a href="https://www.uefa.com/uefachampionsleague/fixtures-results/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">UEFA.com website</a>.
                    </p>
                    <p className="text-slate-700 mt-2">
                        This means you get the most reliable fixture information without needing to check multiple sources.
                    </p>
                </div>
            </section>
          {/* Where to Watch by Country */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 md:w-6 h-5 md:h-6 text-green-600" />
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">Where to Watch by Country</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { name: "United States", flag: "🇺🇸", topStreamer: "Paramount+" },
                { name: "United Kingdom", flag: "🇬🇧", topStreamer: "TNT Sports" },
                { name: "Spain", flag: "🇪🇸", topStreamer: "Movistar+" },
                { name: "Germany", flag: "🇩🇪", topStreamer: "DAZN" },
                { name: "France", flag: "🇫🇷", topStreamer: "Canal+" },
                { name: "Italy", flag: "🇮🇹", topStreamer: "Mediaset" }
              ].map((country, index) => (
                <Card key={index} className="hover:shadow-md transition-all duration-200 border-slate-200 bg-white/80 backdrop-blur-sm group cursor-pointer" onClick={() => handleViewMatch(`Champions League streaming in ${country.name}`)}>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                      {country.flag}
                    </div>
                    <h3 className="font-medium text-slate-900 text-sm">{country.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">via {country.topStreamer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Link to={createPageUrl("Countries")} className="mt-4 inline-block">
              <Button variant="outline" className="w-full">
                View All Countries
              </Button>
            </Link>
          </section>
        </div>

        {/* Trust & Legal Section */}
        <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 md:p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">🔒 100% Legal Champions League Streaming</h2>
            <p className="text-base md:text-lg text-slate-700 mb-6">
              We only list official broadcasters, verified streaming services, and licensed content providers for the UEFA Champions League. 
              Never worry about illegal streams or unsafe sites again.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-xs md:text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Official Broadcasters
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Licensed Streaming
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Verified Sources
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                All UCL Matches
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
