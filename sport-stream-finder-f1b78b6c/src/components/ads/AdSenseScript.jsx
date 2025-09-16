import { useEffect } from 'react';

export default function AdSenseScript() {
  useEffect(() => {
    // Only load AdSense if user has given consent
    const consentGiven = localStorage.getItem('user_consent_given');
    if (consentGiven === 'true') {
      // Check if script is already loaded to prevent duplicates
      const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5533856110998537';
        script.crossOrigin = 'anonymous';
        
        document.head.appendChild(script);
      }

      return () => {
        // Cleanup on unmount
        const scriptToRemove = document.querySelector('script[src*="adsbygoogle.js"]');
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, []);

  return null;
}