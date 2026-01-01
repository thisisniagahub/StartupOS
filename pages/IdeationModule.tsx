
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { generateIdeaValidation, generateFounderArchetype, generateMarketingImage, generateStartupEcosystem } from '../services/geminiService';
import { applySynapseData } from '../services/synapseService';
import { FounderArchetype } from '../types';
import * as Icons from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

export const IdeationModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'VISION' | 'VALIDATION'>('VISION');
  const [idea, setIdea] = useState('');
  
  // Validation State
  const [analysis, setAnalysis] = useState('');
  const [validating, setValidating] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  // Vision State
  const [archetype, setArchetype] = useState<FounderArchetype | null>(null);
  const [visionLoading, setVisionLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // Synapse State
  const [synapseLoading, setSynapseLoading] = useState(false);
  const [synapseResult, setSynapseResult] = useState<null | { featuresCount: number, campaignsCount: number, investorsCount: number }>(null);

  // --- Handlers ---

  const handleValidate = async () => {
    if (!idea.trim()) return;
    setValidating(true);
    setAnalysis('');
    try {
      const result = await generateIdeaValidation(idea);
      setAnalysis(result);
      setHistory(prev => [idea, ...prev]);
    } catch (e) {
      setAnalysis("Error connecting to intelligence engine.");
    } finally {
      setValidating(false);
    }
  };

  const handleVision = async () => {
      if (!idea.trim()) return;
      setVisionLoading(true);
      setArchetype(null);
      setSynapseResult(null);
      
      try {
          // 1. Generate Text Archetype
          const arch = await generateFounderArchetype(idea);
          if (arch) {
              setArchetype(arch);
              
              // 2. Generate Image immediately after
              setImageLoading(true);
              const imgUrl = await generateMarketingImage(arch.visualPrompt + " . Cinematic lighting, dreamy, futuristic, high definition, 8k.");
              if (imgUrl) {
                  setArchetype(prev => prev ? ({ ...prev, imageUrl: imgUrl }) : null);
              }
              setImageLoading(false);
          }
      } catch (e) {
          console.error(e);
      } finally {
          setVisionLoading(false);
      }
  };

  const handleManifest = async () => {
      if (!idea || !archetype) return;
      setSynapseLoading(true);
      try {
          const ecosystem = await generateStartupEcosystem(idea, archetype.title);
          if (ecosystem) {
              const stats = applySynapseData(ecosystem);
              setSynapseResult(stats);
          }
      } catch (e) {
          console.error("Synapse failed", e);
      } finally {
          setSynapseLoading(false);
      }
  };

  const transferToValidation = (model: string) => {
      const refinedIdea = `${idea}. Business Model: ${model}. Core Values: ${archetype?.coreValues.join(', ')}.`;
      setIdea(refinedIdea);
      setActiveTab('VALIDATION');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Ideation & Vision</h1>
          <p className="text-neutral-400">Dream it, visualize it, then validate it.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setActiveTab('VISION')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'VISION' ? 'bg-primary-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-neutral-900 text-neutral-400 hover:text-white'}`}
            >
                <Icons.Sparkles size={16} className="inline mr-2" />
                Visionary Mode
            </button>
            <button 
                onClick={() => setActiveTab('VALIDATION')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'VALIDATION' ? 'bg-primary-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'}`}
            >
                <Icons.ClipboardCheck size={16} className="inline mr-2" />
                Validation Mode
            </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* --- VISIONARY MODE (Dreamer Style) --- */}
        {activeTab === 'VISION' && (
             <motion.div 
                key="vision"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]"
             >
                {/* Left: Input */}
                <div className="flex flex-col justify-center space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">
                            What do you dream of building?
                        </h2>
                        <p className="text-neutral-400 text-lg">
                            Don't worry about business models yet. Just describe the future you want to see.
                        </p>
                    </div>

                    <div className="relative">
                        <textarea
                            className="w-full h-40 bg-black/50 border border-neutral-800 rounded-2xl p-6 text-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none placeholder-neutral-700 backdrop-blur-sm transition-all shadow-xl"
                            placeholder="e.g., I dream of a world where cities are silent and transportation is invisible..."
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                        />
                        <div className="absolute bottom-4 right-4">
                             <Button 
                                onClick={handleVision} 
                                isLoading={visionLoading}
                                disabled={!idea}
                                className="rounded-xl px-6 py-3 bg-white text-black hover:bg-neutral-200 font-bold"
                            >
                                <Icons.Wand2 className="mr-2" size={18} />
                                Reveal Archetype
                            </Button>
                        </div>
                    </div>

                    {archetype && (
                        <div className="space-y-4 animate-slide-in">
                            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Recommended Business Models</h3>
                            <div className="flex flex-wrap gap-3">
                                {archetype.suggestedBusinessModels.map((model, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => transferToValidation(model)}
                                        className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-300 hover:border-primary-500 hover:text-white transition-all flex items-center gap-2 group"
                                    >
                                        <span>{model}</span>
                                        <Icons.ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Output (Archetype Card) */}
                <div className="relative">
                    {visionLoading ? (
                         <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900/20 rounded-3xl border border-neutral-800/50 animate-pulse">
                            <Icons.Loader2 size={64} className="text-primary-600 animate-spin mb-4" />
                            <p className="text-neutral-400 font-mono">Consulting the Oracle...</p>
                         </div>
                    ) : archetype ? (
                        <Card className="h-full overflow-hidden border-0 bg-neutral-900/80 backdrop-blur-xl relative group">
                            {/* Image Background Layer */}
                            <div className="absolute inset-0 z-0">
                                {imageLoading ? (
                                    <div className="w-full h-full bg-neutral-900 animate-pulse" />
                                ) : archetype.imageUrl ? (
                                    <>
                                        <img src={archetype.imageUrl} alt="Vision" className="w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-1000" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                                    </>
                                ) : null}
                            </div>

                            <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                                <div className="mb-auto pt-8">
                                    <div className="inline-block px-3 py-1 bg-primary-600/20 border border-primary-500/50 text-primary-300 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                                        Founder Archetype
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-xl">
                                        {archetype.title}
                                    </h2>
                                    <p className="text-lg text-neutral-200 leading-relaxed drop-shadow-md">
                                        {archetype.description}
                                    </p>
                                </div>
                                
                                <div className="mt-8 border-t border-white/10 pt-6">
                                    <h4 className="text-xs font-bold text-neutral-400 uppercase mb-3">Core Values</h4>
                                    <div className="flex gap-4 mb-6">
                                        {archetype.coreValues.map((val, i) => (
                                            <div key={i} className="flex items-center gap-2 text-white">
                                                <Icons.Diamond size={12} className="text-primary-400" />
                                                <span className="text-sm font-medium">{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* THE SYNAPSE ACTION */}
                                    {synapseResult ? (
                                        <div className="bg-green-900/40 border border-green-500/30 p-4 rounded-xl flex items-center justify-between animate-slide-in backdrop-blur-md">
                                            <div>
                                                <div className="text-green-400 font-bold flex items-center gap-2">
                                                    <Icons.CheckCircle size={16} /> Reality Manifested
                                                </div>
                                                <div className="text-xs text-neutral-300 mt-1">
                                                    {synapseResult.featuresCount} Features, {synapseResult.campaignsCount} Campaigns, {synapseResult.investorsCount} Investors added.
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline" onClick={() => setActiveTab('VALIDATION')}>View Details</Button>
                                        </div>
                                    ) : (
                                        <Button 
                                            onClick={handleManifest}
                                            isLoading={synapseLoading}
                                            className="w-full bg-white text-black hover:bg-neutral-200 font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-[1.02]"
                                        >
                                            <Icons.Zap className="mr-2" size={20} />
                                            Manifest Reality (Auto-Build OS)
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 to-black rounded-3xl border border-neutral-800 text-neutral-600">
                             <Icons.Cloud size={80} className="mb-6 opacity-20" />
                             <p className="text-lg">Your vision will manifest here.</p>
                        </div>
                    )}
                </div>
             </motion.div>
        )}

        {/* --- VALIDATION MODE (Standard) --- */}
        {activeTab === 'VALIDATION' && (
            <motion.div 
                key="validation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
            {/* Input Column */}
            <div className="lg:col-span-1 space-y-6">
                <Card title="Concept Input">
                <div className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Describe your startup idea
                    </label>
                    <textarea
                        id="ideation-input" // Targeted by Tutorial
                        className="w-full h-40 bg-black border border-neutral-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none resize-none placeholder-neutral-600"
                        placeholder="e.g., An Uber for dog walkers that uses AI to match personality types..."
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                    />
                    </div>
                    <Button 
                    className="w-full" 
                    onClick={handleValidate} 
                    isLoading={validating}
                    disabled={!idea}
                    >
                    <Icons.ClipboardCheck className="mr-2" size={16} />
                    Validate Feasibility
                    </Button>
                </div>
                </Card>

                {history.length > 0 && (
                    <Card title="History">
                    <ul className="space-y-2">
                        {history.map((h, i) => (
                            <li key={i} className="text-sm text-neutral-400 truncate border-b border-neutral-800 pb-2 last:border-0">
                                {h}
                            </li>
                        ))}
                    </ul>
                    </Card>
                )}
            </div>

            {/* Output Column */}
            <div className="lg:col-span-2">
                <Card className="min-h-[500px] flex flex-col">
                <div className="border-b border-neutral-800 pb-4 mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Validation Report</h3>
                    <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(analysis)}>
                        <Icons.Copy size={14} />
                    </Button>
                    <Button variant="outline" size="sm">
                        <Icons.Download size={14} />
                    </Button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto prose prose-invert prose-sm max-w-none">
                    {validating ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 text-neutral-500">
                        <Icons.Loader2 className="animate-spin text-primary-600" size={40} />
                        <p>Analyzing market fit, competition, and feasibility...</p>
                    </div>
                    ) : analysis ? (
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                    ) : (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-600">
                        <Icons.Lightbulb size={48} className="mb-4 opacity-20" />
                        <p>Enter an idea to generate a comprehensive validation report.</p>
                    </div>
                    )}
                </div>
                </Card>
            </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
