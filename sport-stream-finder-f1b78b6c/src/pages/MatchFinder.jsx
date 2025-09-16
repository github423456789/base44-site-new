
import React, { useState, useEffect, useCallback } from 'react';
import { SportsEvent } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Search, Filter, Info, Shield, Trophy } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SearchBox from '../components/search/SearchBox';
import StreamingOptions from '../components/matches/StreamingOptions';
import CountdownTimer from '../components/matches/CountdownTimer';
import { getGeoFromIp } from '@/api/functions'; // Import the new function

export default function MatchFinder() {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [nextMatch, setNextMatch] = useState(null);
  const [userCountry, setUserCountry] = useState(null); // State for the detected country
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const filterMatches = useCallback(() => {
    let filtered = [...matches];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(match =>
        match.home_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.away_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.league.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(match => isToday(new Date(match.start_time)));
          break;
        case 'tomorrow':
          filtered = filtered.filter(match => isTomorrow(new Date(match.start_time)));
          break;
        case 'week':
          const weekFromNow = new Date();
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          filtered = filtered.filter(match => 
            new Date(match.start_time) <= weekFromNow && 
            new Date(match.start_time) >= new Date()
          );
          break;
      }
    }

    setFilteredMatches(filtered);
    
    // Set next match if no matches are found for the current filters
    if (filtered.length === 0 && !loading) {
        const upcoming = matches
            .filter(m => new Date(m.start_time) > new Date())
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        if (upcoming.length > 0) {
            setNextMatch(upcoming[0]);
        } else {
            setNextMatch(null); // No upcoming matches at all
        }
    } else {
        setNextMatch(null); // Filtered matches exist, or still loading
    }

  }, [matches, searchQuery, dateFilter, loading]);

  useEffect(() => {
    // Get user's country and initial matches
    const initializePage = async () => {
        setLoading(true);
        try {
            const geoResponse = await getGeoFromIp();
            if (geoResponse.data?.country) {
                setUserCountry(geoResponse.data.country);
            }
            
            const events = await SportsEvent.filter({ league: 'UEFA Champions League' }, 'start_time', 200);
            const now = new Date();
            const upcomingOrLiveMatches = events.filter(match => {
                const matchDate = new Date(match.start_time);
                return match.status === 'live' || (match.status === 'scheduled' && matchDate >= now);
            });
            setMatches(upcomingOrLiveMatches);

        } catch (error) {
            console.error('Error loading matches or country:', error);
            setUserCountry("United States of America"); // Fallback
        }
        setLoading(false);
    };
    
    initializePage();
    
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, []); // Empty dependency array means this effect runs once on mount.

  useEffect(() => {
    filterMatches();
  }, [filterMatches]);

  // The loadMatches function is no longer needed as its logic has been moved into the useEffect.

  const handleMatchClick = (match) => {
    setSelectedMatch(match);
  };

  const getMatchStatus = (match) => {
    const now = new Date();
    const matchTime = new Date(match.start_time);
    
    if (match.status === 'live') return { text: 'LIVE', color: 'bg-red-500 text-white animate-pulse' };
    if (match.status === 'finished') return { text: 'FINISHED', color: 'bg-gray-500 text-white' };
    if (matchTime < now && match.status !== 'live') return { text: 'FINISHED', color: 'bg-gray-500 text-white' };
    
    if (isToday(matchTime)) {
      return { text: format(matchTime, 'HH:mm'), color: 'bg-blue-500 text-white' };
    }
    if (isTomorrow(matchTime)) {
      return { text: 'Tomorrow', color: 'bg-green-500 text-white' };
    }
    return { text: format(matchTime, 'MMM d'), color: 'bg-slate-500 text-white' };
  };

  // Helper function to format time in local timezone
  const formatLocalTime = (utcDate) => {
    const date = new Date(utcDate);
    return new Intl.DateTimeFormat('en-US', {
      timeZone: userTimeZone,
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            UEFA Champions League Fixtures
          </h1>
          <p className="text-slate-600">Find official broadcast information for every match. Schedule data is sourced directly from football-data.org.</p>
        </div>
        
        {/* Data source info */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-blue-800">
                        This schedule is automatically updated using the official API from <a href="https://www.football-data.org/" target="_blank" rel="noopener noreferrer" className="font-semibold underline">football-data.org</a>.
                    </p>
                </div>
            </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <SearchBox 
                onSearch={setSearchQuery}
                placeholder="Search teams, leagues, or matches..."
              />
              
              <div className="flex flex-wrap gap-4">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Matches List */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {searchQuery ? `Search Results (${filteredMatches.length})` : 'Upcoming Matches'}
            </h2>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-20 bg-slate-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredMatches.length > 0 && filteredMatches.map((match) => {
                  const status = getMatchStatus(match);
                  const matchDate = new Date(match.start_time);
                  return (
                    <Card 
                      key={match.id} 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedMatch?.id === match.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => handleMatchClick(match)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-slate-600">{match.round || match.league}</span>
                          <Badge className={status.color}>
                            {status.text}
                          </Badge>
                        </div>

                        {/* Teams */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-200 rounded flex items-center justify-center">
                              {match.home_team_logo ? (
                                <img src={match.home_team_logo} alt={match.home_team} className="w-6 h-6 object-contain" />
                              ) : (
                                <span className="text-xs font-bold">
                                  {match.home_team.slice(0,3).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">{match.home_team}</h3>
                            </div>
                          </div>

                          <div className="text-center px-4">
                            <div className="text-sm font-bold text-slate-400">VS</div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <h3 className="font-semibold text-slate-900">{match.away_team}</h3>
                            </div>
                            <div className="w-8 h-8 bg-slate-200 rounded flex items-center justify-center">
                              {match.away_team_logo ? (
                                <img src={match.away_team_logo} alt={match.away_team} className="w-6 h-6 object-contain" />
                              ) : (
                                <span className="text-xs font-bold">
                                  {match.away_team.slice(0,3).toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <div className="flex items-center gap-1" title={`UTC: ${format(matchDate, 'MMM d, HH:mm')}Z`}>
                            <Clock className="w-3 h-3" />
                            {formatLocalTime(match.start_time)} (local)
                          </div>
                          {match.venue && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {match.venue}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {filteredMatches.length === 0 && !loading && !nextMatch && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-600 mb-2">
                        No matches found
                      </h3>
                      <p className="text-slate-500">
                        Try adjusting your search terms or filters.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {filteredMatches.length === 0 && !loading && nextMatch && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Trophy className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-600 mb-2">
                        No matches for this selection.
                      </h3>
                      <p className="text-slate-500 mb-6">
                        The next Champions League match kicks off in:
                      </p>
                      <CountdownTimer targetDate={nextMatch.start_time} />
                      <Button asChild className="mt-6" onClick={() => window.location.reload()}>
                        <Link to="#">
                          Show All Upcoming Matches
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Streaming Options */}
          <div>
            {selectedMatch ? (
              <StreamingOptions match={selectedMatch} userCountry={userCountry} />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">
                    Select a match
                  </h3>
                  <p className="text-slate-500">
                    Click on any match to see legal streaming options and official broadcasters.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
