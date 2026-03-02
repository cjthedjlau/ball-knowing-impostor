import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsOfService() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white px-5 py-8 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/60 hover:text-white mb-6 text-sm">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-2xl font-black mb-1">Terms of Service</h1>
      <p className="text-white/40 text-xs mb-6">Last updated: February 28, 2026</p>

      <div className="space-y-6 text-sm text-white/70 leading-relaxed">
        <section>
          <h2 className="text-white font-bold mb-2">Entertainment Purposes Only</h2>
          <p>Ball Knowing Imposter is provided for entertainment purposes only. The app is a social party game and is not intended for any commercial, professional, or competitive use.</p>
        </section>

        <section>
          <h2 className="text-white font-bold mb-2">Age Requirement</h2>
          <p>By using this app, you confirm that you are at least 13 years of age, or the minimum digital age of consent in your country. If you are under 13, please use this app only under parental supervision.</p>
        </section>

        <section>
          <h2 className="text-white font-bold mb-2">Third-Party Advertising</h2>
          <p>This app displays advertisements served by third-party ad networks including Google AdSense. The developer is not responsible for any content served by third-party ad networks. Ad content is determined solely by the advertising providers.</p>
        </section>

        <section>
          <h2 className="text-white font-bold mb-2">Disclaimer of Liability</h2>
          <p>The app is provided "as is" without warranties of any kind. The developer is not liable for any direct, indirect, incidental, or consequential damages arising from your use of the app.</p>
        </section>

        <section>
          <h2 className="text-white font-bold mb-2">Contact</h2>
          <p>Questions about these Terms of Service? Reach us at <a href="mailto:support@ballknowingimpostor.com" className="text-[#3b82f6] underline">support@ballknowingimpostor.com</a>.</p>
        </section>
      </div>
    </div>
  );
}