import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white px-5 py-8 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/60 hover:text-white mb-6 text-sm">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-2xl font-black mb-1">Privacy Policy</h1>
      <p className="text-white/40 text-xs mb-6">Last updated: February 28, 2026</p>

      <div className="space-y-6 text-sm text-white/70 leading-relaxed">
        <section>
          <h2 className="text-white font-bold mb-2">Data Collection</h2>
          <p>Ball Knowing Imposter does not collect, store, or process any personal user data. We do not require account registration, and no personally identifiable information is gathered by this application.</p>
        </section>

        <section>
          <h2 className="text-white font-bold mb-2">Google AdSense &amp; Advertising</h2>
          <p>This app uses Google AdSense to display advertisements. Google AdSense may use cookies and collect anonymous usage data to serve personalized ads based on your interests.</p>
          <p className="mt-2">Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this app or other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to this and/or other sites on the internet.</p>
        </section>

        <section>
          <h2 className="text-white font-bold mb-2">Opt-Out of Personalized Ads</h2>
          <p>You may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] underline">Google's Ads Settings</a> at adssettings.google.com.</p>
        </section>

        <section>
          <h2 className="text-white font-bold mb-2">Cookies</h2>
          <p>This app may use cookies solely through Google AdSense for ad personalization and frequency capping. No first-party cookies are set by this application.</p>
        </section>

        <section>
          <h2 className="text-white font-bold mb-2">Contact</h2>
          <p>If you have any questions about this privacy policy, please contact us at <a href="mailto:support@ballknowingimpostor.com" className="text-[#3b82f6] underline">support@ballknowingimpostor.com</a>.</p>
        </section>
      </div>
    </div>
  );
}