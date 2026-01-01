import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import * as Icons from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    website: '',
    teamEmails: [''],
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else onComplete();
  };

  const addEmailField = () => {
    setFormData({ ...formData, teamEmails: [...formData.teamEmails, ''] });
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...formData.teamEmails];
    newEmails[index] = value;
    setFormData({ ...formData, teamEmails: newEmails });
  };

  const renderStep1 = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Welcome to StartupOS</h2>
        <p className="text-neutral-400">Let's set up your operational headquarters.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-1">Company Name</label>
        <input
          type="text"
          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white focus:border-primary-600 outline-none transition-colors"
          placeholder="Acme Inc."
          value={formData.companyName}
          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-1">Industry</label>
        <select 
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white focus:border-primary-600 outline-none transition-colors"
            value={formData.industry}
            onChange={(e) => setFormData({...formData, industry: e.target.value})}
        >
            <option value="">Select an industry...</option>
            <option value="saas">SaaS / Software</option>
            <option value="fintech">Fintech</option>
            <option value="health">Health & Bio</option>
            <option value="consumer">Consumer</option>
        </select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Assemble Your Team</h2>
        <p className="text-neutral-400">Invite co-founders and early employees.</p>
      </div>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {formData.teamEmails.map((email, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="email"
              className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white focus:border-primary-600 outline-none"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => updateEmail(idx, e.target.value)}
            />
            {idx === formData.teamEmails.length - 1 && (
                <button onClick={addEmailField} className="p-3 bg-neutral-800 rounded-lg text-neutral-400 hover:text-white">
                    <Icons.Plus size={20} />
                </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Initial Focus</h2>
        <p className="text-neutral-400">Which modules do you need right now?</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {['Fundraising', 'Product Roadmap', 'Hiring', 'Market Research'].map((mod) => (
            <label key={mod} className="flex items-center gap-3 p-4 border border-neutral-800 rounded-lg bg-neutral-900/50 cursor-pointer hover:border-primary-600/50 transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded border-neutral-600 text-primary-600 bg-neutral-800 focus:ring-primary-600" defaultChecked />
                <span className="text-sm text-white font-medium">{mod}</span>
            </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-black border border-neutral-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-neutral-900">
          <div 
            className="h-full bg-primary-600 transition-all duration-500 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        <div className="mb-8 flex justify-between items-center">
            <div className="flex items-center gap-2 text-primary-600">
                <Icons.Zap size={24} fill="currentColor" />
                <span className="font-bold tracking-tight text-white">StartupOS Setup</span>
            </div>
            <span className="text-xs text-neutral-500 font-mono">STEP {step}/{totalSteps}</span>
        </div>

        <div className="min-h-[300px]">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-neutral-900">
            <Button variant="ghost" onClick={onComplete}>Skip Setup</Button>
            <div className="flex gap-3">
                {step > 1 && (
                    <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
                )}
                <Button onClick={handleNext}>
                    {step === totalSteps ? 'Launch OS' : 'Next Step'}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};