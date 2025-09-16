import React from 'react';

export default function Legal() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Privacy Policy</h1>
          <p className="mt-4 text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          <div className="mt-6 prose prose-lg text-gray-600 mx-auto">
            <p>
              This is a placeholder for your Privacy Policy. It is essential to replace this text with a comprehensive policy that accurately reflects your data handling practices and complies with regulations like GDPR and CCPA.
            </p>
            <p>
              <strong>Disclaimer:</strong> This is not legal advice. You should consult with a legal professional to ensure your policy is compliant.
            </p>
            
            <h2 className="font-semibold">Data We Collect</h2>
            <p>
              When you use our website, we may collect the following types of information:
            </p>
            <ul>
              <li>
                <strong>Geolocation Data:</strong> We use your IP address to determine your approximate geographical location (country-level). This allows us to provide you with content relevant to your region, such as a list of official broadcasters for sports events.
              </li>
              <li>
                <strong>Usage Data (via Google Analytics):</strong> We collect information about how you interact with our site, including pages visited, time spent on pages, links clicked, and other browsing activities. This helps us understand user behavior and improve our service.
              </li>
              <li>
                <strong>Advertising Data (via Google AdSense):</strong> Google and its partners use cookies to serve ads based on your prior visits to our website or other websites. This may include collecting data to personalize the ads you see.
              </li>
            </ul>

            <h2 className="font-semibold">How We Use Your Data</h2>
            <p>
              Your data is used for the following purposes:
            </p>
            <ul>
              <li>To operate and maintain our service.</li>
              <li>To personalize your experience by showing relevant streaming information.</li>
              <li>To analyze and understand our audience to improve the website.</li>
              <li>To display advertisements that support our service.</li>
            </ul>
            
            <h2 className="font-semibold">Your Consent</h2>
            <p>
              By using our website, you consent to the collection and use of information in accordance with this policy. We will request your explicit consent via a banner before any non-essential data collection begins.
            </p>
          </div>
        </div>

        <div className="border-t pt-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Terms of Service</h1>
          <div className="mt-6 prose prose-lg text-gray-600 mx-auto">
            <p>
              This is a placeholder for your Terms of Service. You should outline the rules and guidelines for using your website.
            </p>
            <p>
              By accessing our website, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service.
            </p>
            
            <h2 className="font-semibold">Content</h2>
            <p>
              Our service provides information about official and legal broadcasters for sports events. We strive for accuracy but do not guarantee it. We are not affiliated with UEFA or any other sports organization.
            </p>
            
            <h2 className="font-semibold">Limitation of Liability</h2>
            <p>
              In no event shall our website, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages...
            </p>
          </div>
        </div>

        <div className="border-t pt-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Copyright Policy</h1>
          <p className="mt-4 text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          <div className="mt-6 prose prose-lg text-gray-600 mx-auto">
            <h2 className="font-semibold">Intellectual Property Rights</h2>
            <p>
              We respect the intellectual property rights of others and expect our users to do the same. This Copyright Policy outlines our approach to copyright-related matters.
            </p>

            <h2 className="font-semibold">Our Use of Third-Party Content</h2>
            <p>
              Our website may display or reference the following types of third-party content:
            </p>
            <ul>
              <li><strong>Team Logos and Names:</strong> We may display team logos, names, and related imagery for informational and editorial purposes under fair use provisions.</li>
              <li><strong>League Logos and Branding:</strong> References to UEFA Champions League, league logos, and tournament branding are used for informational purposes only.</li>
              <li><strong>Broadcaster Logos:</strong> We may display logos of official broadcasters and streaming services to help users identify legitimate viewing options.</li>
              <li><strong>Match Data:</strong> We source fixture information from official APIs and publicly available data sources.</li>
            </ul>

            <h2 className="font-semibold">Fair Use and Editorial Content</h2>
            <p>
              We believe our use of copyrighted materials falls under fair use provisions because:
            </p>
            <ul>
              <li>The content is used for informational and educational purposes</li>
              <li>We do not compete with or replace the original sources</li>
              <li>We use only the minimal amount necessary to identify teams, leagues, and broadcasters</li>
              <li>Our use serves the public interest by directing users to legal viewing options</li>
            </ul>

            <h2 className="font-semibold">No Affiliation Disclaimer</h2>
            <p>
              We are not affiliated with, endorsed by, or connected to UEFA, any football clubs, leagues, or broadcasting companies mentioned on our website. All trademarks, logos, and brand names are the property of their respective owners.
            </p>

            <h2 className="font-semibold">DMCA Compliance</h2>
            <p>
              We comply with the Digital Millennium Copyright Act (DMCA) and will respond to valid takedown requests. If you believe your copyrighted work has been used inappropriately on our website, please contact us with the following information:
            </p>
            <ul>
              <li>A description of the copyrighted work you claim has been infringed</li>
              <li>A description of where the allegedly infringing material is located on our site</li>
              <li>Your contact information (email address, phone number, and mailing address)</li>
              <li>A statement that you have a good faith belief that the use is not authorized</li>
              <li>A statement that the information in your notice is accurate</li>
              <li>Your physical or electronic signature</li>
            </ul>

            <h2 className="font-semibold">Copyright Infringement Claims</h2>
            <p>
              Send DMCA takedown requests to: <strong>[Your Email Address]</strong>
            </p>
            <p>
              We will investigate all valid claims and remove infringing content when appropriate. Please note that filing false claims may result in legal consequences.
            </p>

            <h2 className="font-semibold">User-Generated Content</h2>
            <p>
              If our website allows user submissions in the future, users will be responsible for ensuring they have the right to share any content they upload. Users grant us a license to use, display, and distribute their submissions for the operation of our service.
            </p>

            <h2 className="font-semibold">Changes to This Policy</h2>
            <p>
              We may update this Copyright Policy from time to time. We will notify users of any significant changes by posting the new policy on this page with an updated date.
            </p>

            <h2 className="font-semibold">Contact Information</h2>
            <p>
              If you have questions about this Copyright Policy or need to report copyright infringement, please contact us at: <strong>[Your Contact Email]</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}