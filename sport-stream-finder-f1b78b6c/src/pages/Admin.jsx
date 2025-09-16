
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, CheckCircle, AlertCircle, Calendar, Database } from 'lucide-react';
import { fetchFixtures } from '@/api/functions';

export default function Admin() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFetchFixtures = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetchFixtures();
      setResult({
        success: true,
        data: response.data
      });
    } catch (error) {
      setResult({
        success: false,
        error: error.response?.data?.error || error.message
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-600" />
            Admin Dashboard
          </h1>
          <p className="text-slate-600">Manage fixtures and system operations</p>
        </div>

        {/* Fixtures Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              UEFA Champions League Fixtures
            </CardTitle>
            <p className="text-sm text-slate-600">
              Fetch the latest match data from football-data.org API
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleFetchFixtures}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Update Fixtures Now
                  </>
                )}
              </Button>
              
              {result && (
                <Badge className={result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {result.success ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <AlertCircle className="w-3 h-3 mr-1" />
                  )}
                  {result.success ? "Success" : "Error"}
                </Badge>
              )}
            </div>

            {result && (
              <Card className={`border-l-4 ${result.success ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'}`}>
                <CardContent className="p-4">
                  {result.success ? (
                    <div>
                      <h4 className="font-medium text-green-900 mb-2">✅ Fixtures Updated Successfully</h4>
                      <p className="text-sm text-green-800">{result.data.message}</p>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-medium text-red-900 mb-2">❌ Update Failed</h4>
                      <p className="text-sm text-red-800">{result.error}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="text-xs text-slate-500 bg-slate-100 p-3 rounded-lg">
              <strong>Note:</strong> This function searches for Champions League matches from today until one year from now.
              It will create new matches and update existing ones if scores or status have changed.
              The free plan for the API allows 10 requests per minute.
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>
              <strong>1. API Key:</strong> Make sure you've added your <code>football_data_org</code> API key in the project secrets.
            </p>
            <p>
              <strong>2. Automation:</strong> Set up a cron job in your project settings to run <code>fetchFixtures</code> every 30-60 minutes.
            </p>
            <p>
              <strong>3. Rate Limits:</strong> The free plan allows 10 requests per minute. The function respects this limit.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
