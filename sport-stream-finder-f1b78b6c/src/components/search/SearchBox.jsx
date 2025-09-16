
import React, { useState, useRef, useEffect } from 'react';
import { Search, TrendingUp, MapPin, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SearchBox({ onSearch, placeholder = "Search team, league, or country..." }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const trendingSearches = [
    { text: "Real Madrid vs Barcelona", type: "match", icon: Calendar },
    { text: "Premier League", type: "league", icon: TrendingUp },
    { text: "Champions League", type: "league", icon: TrendingUp },
    { text: "Watch in USA", type: "country", icon: MapPin },
    { text: "Bundesliga", type: "league", icon: TrendingUp },
    { text: "Manchester City", type: "team", icon: TrendingUp },
    { text: "Liverpool", type: "team", icon: TrendingUp },
    { text: "Primera Division", type: "league", icon: TrendingUp },
  ];

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        navigate(createPageUrl(`MatchFinder?q=${encodeURIComponent(searchQuery)}`));
      }
      setShowSuggestions(false);
    }
  };

  const handleTrendingClick = (search) => {
    setQuery(search.text);
    handleSearch(search.text);
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          onFocus={() => setShowSuggestions(query.length <= 2)}
          placeholder={placeholder}
          className="pl-12 pr-24 py-4 text-lg border-2 border-slate-200 focus:border-blue-500 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-200 placeholder:text-slate-400"
        />
        <Button
          onClick={() => handleSearch()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl shadow-md transition-all duration-200"
        >
          Search
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <Card className="absolute top-full mt-2 w-full z-50 border-slate-200 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending Searches
            </h4>
            <div className="space-y-2">
              {trendingSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleTrendingClick(search)}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors duration-150 flex items-center gap-3"
                >
                  <search.icon className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-600 text-sm">{search.text}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {search.type}
                  </Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
