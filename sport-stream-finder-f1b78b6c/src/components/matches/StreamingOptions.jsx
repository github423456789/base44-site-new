
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Tv, Smartphone, Globe, DollarSign, MapPin, Clock } from 'lucide-react';
import { Broadcaster } from '@/api/entities';

export default function StreamingOptions({ match, userCountry }) {
  const [broadcasters, setBroadcasters] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStreamingOptions = useCallback(async () => {
    if (!userCountry) return; // Wait for country detection
    setLoading(true);
    try {
      // Get all broadcasters and filter by user's country
      const allBroadcasters = await Broadcaster.list();
      
      // Filter broadcasters that match the user's country
      const filtered = allBroadcasters.filter(b => b.country === userCountry);
      
      setBroadcasters(filtered);
    } catch (error) {
      console.error('Error loading streaming options:', error);
    }
    setLoading(false);
  }, [userCountry]); // 'match' removed from dependency array as its related filtering logic was removed

  useEffect(() => {
    loadStreamingOptions();
  }, [loadStreamingOptions]);

  const handleWatchNow = (broadcaster) => {
    // Open broadcaster's official site in new tab
    window.open(broadcaster.official_url, '_blank', 'noopener,noreferrer');
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'tv': return <Tv className="w-4 h-4" />;
      case 'streaming': return <Globe className="w-4 h-4" />;
      case 'app': return <Smartphone className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tv className="w-5 h-5" />
            Finding streams in {userCountry || 'your region'}...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (broadcasters.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tv className="w-5 h-5" />
            Legal Streaming Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Tv className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">
              No Official Streams Available
            </h3>
            <p className="text-slate-500 mb-4">
              We couldn't find legal streaming options for this match in {userCountry}.
            </p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <Clock className="w-4 h-4 mr-2" />
                Get Match Alerts
              </Button>
              <Button variant="outline" className="w-full">
                <Globe className="w-4 h-4 mr-2" />
                Check Live Scores
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tv className="w-5 h-5" />
          Legal Streaming Options in {userCountry}
        </CardTitle>
        <p className="text-sm text-slate-600">
          Official broadcasters and verified streaming services only
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {broadcasters.map((broadcaster, index) => (
          <div key={index}>
            <div className="flex items-start justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  {broadcaster.logo ? (
                    <img 
                      src={broadcaster.logo} 
                      alt={broadcaster.name}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    getPlatformIcon(broadcaster.platform)
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-slate-900">{broadcaster.name}</h3>
                    <Badge variant={broadcaster.subscription_required ? "secondary" : "success"}>
                      {broadcaster.subscription_required ? "Subscription" : "Free"}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {broadcaster.platform}
                    </Badge>
                  </div>
                  
                  {broadcaster.price_note && (
                    <p className="text-sm text-slate-600 mb-2 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {broadcaster.price_note}
                    </p>
                  )}
                  
                  {broadcaster.devices && broadcaster.devices.length > 0 && (
                    <p className="text-xs text-slate-500">
                      Available on: {broadcaster.devices.join(', ')}
                    </p>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={() => handleWatchNow(broadcaster)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Watch Now
              </Button>
            </div>
            
            {index < broadcasters.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            100% Legal & Safe
          </div>
          <p className="text-sm text-green-700">
            All streaming options listed are official broadcasters with proper licensing rights. 
            No illegal streams or unsafe sites.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
