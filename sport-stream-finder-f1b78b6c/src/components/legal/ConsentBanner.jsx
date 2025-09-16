
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, BarChart2, DollarSign, MapPin } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function ConsentBanner({ onAccept }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleAccept = () => {
    if (isChecked) {
      localStorage.setItem('user_consent_given', 'true');
      onAccept();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
      <Card className="max-w-lg w-full mx-4 bg-white shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 md:w-6 h-5 md:h-6 text-blue-600" />
            <CardTitle className="text-lg md:text-2xl">Your Privacy is Important</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-700 text-sm md:text-base">
          <p>
            To provide the best experience, this site uses cookies and other technologies for the following purposes:
          </p>
          <ul className="space-y-3 pl-2">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 md:w-5 h-4 md:h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <strong className="font-medium">Geolocation:</strong> We use your IP address to determine your country to show you official, region-specific streaming options.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <BarChart2 className="w-4 md:w-5 h-4 md:h-5 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <strong className="font-medium">Analytics (Google Analytics):</strong> To understand how visitors use our site so we can improve it.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <DollarSign className="w-4 md:w-5 h-4 md:h-5 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <strong className="font-medium">Advertising (Google AdSense):</strong> To show you relevant ads that help keep this service free.
              </div>
            </li>
          </ul>
          <p className="text-sm md:text-base">
            By checking the box and continuing, you consent to our use of your data for these purposes. You can find more details in our <Link to={createPageUrl('Legal')} className="text-blue-600 underline hover:text-blue-700">Privacy Policy</Link>.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 bg-slate-50 p-4 md:p-6 rounded-b-lg">
          <div className="flex items-start space-x-2 w-full">
            <Checkbox id="terms" checked={isChecked} onCheckedChange={setIsChecked} className="mt-1" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-5 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the terms and data use described.
            </label>
          </div>
          <Button 
            onClick={handleAccept} 
            disabled={!isChecked}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
            size="lg"
          >
            Continue to Site
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
