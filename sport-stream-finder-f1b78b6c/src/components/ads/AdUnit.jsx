import { useEffect, useRef } from 'react';

export default function AdUnit({ 
  slot, 
  style = { display: 'block' },
  format = 'auto',
  responsive = true,
  className = ""
}) {
  const adRef = useRef(null);

  useEffect(() => {
    const consentGiven = localStorage.getItem('user_consent_given');
    if (consentGiven === 'true' && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, []);

  const consentGiven = localStorage.getItem('user_consent_given');
  if (consentGiven !== 'true') {
    return null; // Don't show ads if consent not given
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-5533856110998537"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
}