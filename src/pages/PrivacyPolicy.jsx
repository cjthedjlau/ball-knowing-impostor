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
          <p className="mt-2">We do not collect any data for advertising purposes within this app. All advertising functionality is implemented through AdMob, Google's mobile advertising platform, in accordance with Google's mobile advertising policies.</p>
        </section>

        <section>
          <h2 className="text-white font-bold mb-2">Third-Party Data Services</h2>
          <p>This app fetches athlete photo data from TheSportsDB (thesportsdb.com), a third-party sports data service. No personal user data is transmitted in these requests. We do not store or log any user information on our servers.</p>
        </section>

        <section>
          <h2 className="text-white font-bold mb-2">Cookies</h2>
          <p>This app uses a single cookie solely to remember your cookie consent preference. No advertising or tracking cookies are set by this application directly.</p>
        </section>

        <section>
          <h2 className="text-white font-bold mb-2">Contact</h2>
          <p>If you have any questions about this privacy policy, please contact us at <a href="mailto:support@ballknowingimpostor.com" className="text-[#3b82f6] underline">support@ballknowingimpostor.com</a>.</p>
          <p className="mt-2">To request deletion of any data associated with your use of this app (including any advertising identifiers), please email <a href="mailto:support@ballknowingimpostor.com" className="text-[#3b82f6] underline">support@ballknowingimpostor.com</a> with the subject line "Data Deletion Request".</p>
        </section>
      </div>
    </div>
  );
}