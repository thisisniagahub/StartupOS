
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import * as Icons from 'lucide-react';
import { getInvestors, getCurrentRound } from '../services/investorService';
import { generateInvestorPitch, analyzePitchDeckImage } from '../services/geminiService';
import { Investor, FundingRound, InvestorStatus, PitchAnalysis } from '../types';
import ReactMarkdown from 'react-markdown';

export const InvestorModule: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'PIPELINE' | 'UPDATES' | 'DOCS' | 'PITCH'>('PIPELINE');
    const [investors, setInvestors] = useState<Investor[]>([]);
    const [round, setRound] = useState<FundingRound | null>(null);
    const [loading, setLoading] = useState(true);

    // Pitch Generator State
    const [pitchForm, setPitchForm] = useState({
        companyName: '',
        problem: '',
        solution: '',
        traction: '',
        ask: ''
    });
    const [pitchResult, setPitchResult] = useState('');
    const [pitchLoading, setPitchLoading] = useState(false);

    // Deck Analyzer State
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<PitchAnalysis | null>(null);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const [invData, roundData] = await Promise.all([getInvestors(), getCurrentRound()]);
            setInvestors(invData);
            setRound(roundData);
            setLoading(false);
        };
        loadData();
    }, []);

    const calculateProgress = () => {
        if (!round) return 0;
        return (round.raisedAmount / round.targetAmount) * 100;
    };

    const handleGeneratePitch = async () => {
        if (!pitchForm.companyName || !pitchForm.problem) return;
        setPitchLoading(true);
        const result = await generateInvestorPitch(pitchForm);
        setPitchResult(result);
        setPitchLoading(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setUploadedImage(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyzeDeck = async () => {
        if (!uploadedImage) return;
        setAnalyzing(true);
        const base64Data = uploadedImage.split(',')[1];
        const result = await analyzePitchDeckImage(base64Data);
        setAnalysisResult(result);
        setAnalyzing(false);
    };

    const StatusColumn = ({ title, status, items }: { title: string, status: InvestorStatus, items: Investor[] }) => (
        <div className="flex-1 min-w-[280px] bg-neutral-900/30 rounded-xl border border-neutral-800 flex flex-col h-full">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center sticky top-0 bg-neutral-900/90 backdrop-blur-sm rounded-t-xl z-10">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                        status === 'COMMITTED' ? 'bg-green-500' : 
                        status === 'DUE_DILIGENCE' ? 'bg-yellow-500' : 
                        'bg-neutral-500'
                    }`} />
                    <h3 className="font-semibold text-neutral-300 text-sm">{title}</h3>
                </div>
                <span className="text-xs bg-neutral-800 text-neutral-500 px-2 py-0.5 rounded-full">
                    {items.length}
                </span>
            </div>
            <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                {items.map(inv => (
                    <div key={inv.id} className="p-4 bg-black border border-neutral-800 rounded-lg shadow-sm hover:border-primary-600/50 cursor-pointer group transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-white text-sm">{inv.name}</span>
                            <Icons.MoreHorizontal size={14} className="text-neutral-600 opacity-0 group-hover:opacity-100" />
                        </div>
                        <p className="text-xs text-neutral-400 mb-3">{inv.firm}</p>
                        
                        {inv.checkSize && (
                            <div className="inline-block px-2 py-1 bg-green-900/20 text-green-400 text-xs rounded border border-green-900/30 mb-2">
                                {inv.checkSize}
                            </div>
                        )}
                        
                        <div className="flex items-center gap-1 text-[10px] text-neutral-500 mt-2 border-t border-neutral-800 pt-2">
                            <Icons.Clock size={10} />
                            <span>{inv.lastContact}</span>
                        </div>
                    </div>
                ))}
                <button className="w-full py-2 text-xs border border-dashed border-neutral-800 text-neutral-500 rounded hover:bg-neutral-800 hover:text-neutral-300 transition-colors">
                    + Add Investor
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            {/* Header Area */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-white">Investor Relations</h1>
                    <p className="text-neutral-400">Manage fundraising, pipeline, and communications.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Icons.Download size={16} className="mr-2"/> Report</Button>
                    <Button><Icons.Plus size={16} className="mr-2"/> New Investor</Button>
                </div>
            </div>

            {/* Funding Round Summary */}
            {round && (
                <Card className="shrink-0 bg-gradient-to-r from-neutral-900 to-neutral-950">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 w-full">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-white">{round.name}</span>
                                <span className="text-sm text-neutral-400">
                                    ${round.raisedAmount.toLocaleString()} / ${round.targetAmount.toLocaleString()}
                                </span>
                            </div>
                            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary-600 rounded-full transition-all duration-1000"
                                    style={{ width: `${calculateProgress()}%` }}
                                />
                            </div>
                        </div>
                        <div className="flex gap-8 text-center shrink-0">
                            <div>
                                <div className="text-2xl font-bold text-white">${(round.preMoneyValuation / 1000000).toFixed(1)}M</div>
                                <div className="text-xs text-neutral-500 uppercase tracking-wide">Pre-Money Val</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{investors.filter(i => i.status === 'COMMITTED').length}</div>
                                <div className="text-xs text-neutral-500 uppercase tracking-wide">Commits</div>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Tabs */}
            <div className="flex border-b border-neutral-800 shrink-0" id="investor-tabs"> {/* Targeted by Tutorial */}
                <button 
                    onClick={() => setActiveTab('PIPELINE')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'PIPELINE' ? 'border-primary-600 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}
                >
                    Pipeline Board
                </button>
                <button 
                    onClick={() => setActiveTab('UPDATES')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'UPDATES' ? 'border-primary-600 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}
                >
                    Investor Updates
                </button>
                <button 
                    onClick={() => setActiveTab('DOCS')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'DOCS' ? 'border-primary-600 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}
                >
                    Pitch & Docs
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'PIPELINE' && (
                <div className="flex gap-4 overflow-x-auto h-full pb-2">
                    <StatusColumn title="Prospects" status="PROSPECT" items={investors.filter(i => i.status === 'PROSPECT')} />
                    <StatusColumn title="Contacted" status="CONTACTED" items={investors.filter(i => i.status === 'CONTACTED')} />
                    <StatusColumn title="Meetings" status="MEETING" items={investors.filter(i => i.status === 'MEETING')} />
                    <StatusColumn title="Due Diligence" status="DUE_DILIGENCE" items={investors.filter(i => i.status === 'DUE_DILIGENCE')} />
                    <StatusColumn title="Committed" status="COMMITTED" items={investors.filter(i => i.status === 'COMMITTED')} />
                </div>
            )}

            {activeTab === 'UPDATES' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                    <div className="lg:col-span-2 space-y-4">
                        <Card title="Draft New Update">
                            <textarea 
                                className="w-full h-64 bg-black border border-neutral-800 rounded-lg p-4 text-white focus:ring-2 focus:ring-primary-600 outline-none resize-none"
                                placeholder="Hi everyone, quick update on our Q3 progress..."
                            />
                            <div className="mt-4 flex justify-end gap-3">
                                <Button variant="ghost">Save Draft</Button>
                                <Button>Preview & Send</Button>
                            </div>
                        </Card>
                    </div>
                    <div className="space-y-4">
                        <Card title="Past Updates">
                            <div className="space-y-4">
                                {[1,2,3].map(i => (
                                    <div key={i} className="pb-4 border-b border-neutral-800 last:border-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-sm font-medium text-white">October Investor Update</h4>
                                            <span className="text-xs text-neutral-500">Oct 1, 2024</span>
                                        </div>
                                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                                            We hit $12k MRR and closed our first enterprise deal...
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === 'DOCS' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                     {/* Text Generator */}
                    <div className="flex flex-col gap-6">
                        <Card title="Deck Generator" className="flex-1">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1">Company Name</label>
                                    <input 
                                        className="w-full bg-black border border-neutral-800 rounded-lg p-2 text-white focus:border-primary-600 outline-none"
                                        placeholder="e.g. Acme AI"
                                        value={pitchForm.companyName}
                                        onChange={(e) => setPitchForm({...pitchForm, companyName: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1">Problem</label>
                                    <textarea 
                                        className="w-full bg-black border border-neutral-800 rounded-lg p-2 text-white focus:border-primary-600 outline-none resize-none h-20"
                                        placeholder="What pain point are you solving?"
                                        value={pitchForm.problem}
                                        onChange={(e) => setPitchForm({...pitchForm, problem: e.target.value})}
                                    />
                                </div>
                                <Button 
                                    className="w-full mt-4" 
                                    onClick={handleGeneratePitch} 
                                    isLoading={pitchLoading}
                                    disabled={!pitchForm.companyName}
                                >
                                    <Icons.Sparkles size={16} className="mr-2" />
                                    Generate Deck Structure
                                </Button>
                            </div>
                        </Card>
                        {pitchResult && (
                             <Card className="flex-1 overflow-y-auto max-h-[400px]">
                                <div className="prose prose-invert max-w-none text-sm">
                                    <ReactMarkdown>{pitchResult}</ReactMarkdown>
                                </div>
                             </Card>
                        )}
                    </div>

                    {/* Image Analyzer */}
                    <div className="flex flex-col gap-6">
                         <Card title="Deck AI Grader" className="flex-1 flex flex-col">
                             {!uploadedImage ? (
                                 <div className="flex-1 border-2 border-dashed border-neutral-800 rounded-xl flex flex-col items-center justify-center p-8 hover:bg-neutral-900/50 transition-colors relative">
                                    <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    <Icons.UploadCloud size={48} className="text-neutral-600 mb-4" />
                                    <h3 className="text-neutral-300 font-medium">Upload Slide Image</h3>
                                    <p className="text-xs text-neutral-500 mt-2 text-center">Upload a screenshot of your pitch deck slide.<br/>Gemini Vision will grade it.</p>
                                 </div>
                             ) : (
                                 <div className="flex-1 flex flex-col">
                                     <div className="relative h-48 rounded-xl overflow-hidden mb-4 border border-neutral-800">
                                         <img src={uploadedImage} alt="Uploaded Slide" className="w-full h-full object-cover" />
                                         <button onClick={() => setUploadedImage(null)} className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-red-500"><Icons.X size={16}/></button>
                                     </div>
                                     <Button onClick={handleAnalyzeDeck} isLoading={analyzing} disabled={!uploadedImage}>
                                         <Icons.Eye size={16} className="mr-2" /> Analyze Slide
                                     </Button>
                                 </div>
                             )}

                             {analysisResult && (
                                 <div className="mt-6 animate-slide-in">
                                     <div className="flex items-center justify-between mb-4">
                                         <h3 className="font-bold text-white">Score</h3>
                                         <div className={`text-2xl font-black ${analysisResult.score > 70 ? 'text-green-500' : analysisResult.score > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                                             {analysisResult.score}/100
                                         </div>
                                     </div>
                                     <div className="bg-neutral-900 p-4 rounded-lg mb-4 text-sm text-neutral-300 italic border-l-2 border-primary-500">
                                         "{analysisResult.critique}"
                                     </div>
                                     <h4 className="font-bold text-white text-sm mb-2">Improvements:</h4>
                                     <ul className="space-y-2">
                                         {analysisResult.improvements.map((imp, i) => (
                                             <li key={i} className="flex items-start gap-2 text-sm text-neutral-400">
                                                 <Icons.CheckCircle2 size={16} className="text-primary-500 shrink-0 mt-0.5" />
                                                 {imp}
                                             </li>
                                         ))}
                                     </ul>
                                 </div>
                             )}
                         </Card>
                    </div>
                </div>
            )}
        </div>
    );
};
