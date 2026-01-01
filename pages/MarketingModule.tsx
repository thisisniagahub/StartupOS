
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { generateMarketingCopy, generateMarketingImage, generateMarketingVideo } from '../services/geminiService';
import * as Icons from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const MarketingModule: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'COPY' | 'IMAGE' | 'VIDEO'>('COPY');
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        setError('');
        setResult(null);

        try {
            if (activeTab === 'COPY') {
                const text = await generateMarketingCopy(prompt, 'Social');
                setResult(text);
            } else if (activeTab === 'IMAGE') {
                const imageUrl = await generateMarketingImage(prompt);
                setResult(imageUrl);
            } else if (activeTab === 'VIDEO') {
                // Check Key Selection for Veo
                const aiStudio = (window as any).aistudio;
                if (aiStudio && typeof aiStudio.hasSelectedApiKey === 'function') {
                     const hasKey = await aiStudio.hasSelectedApiKey();
                     if (!hasKey) {
                        await aiStudio.openSelectKey();
                     }
                     // Race condition mitigation handled by awaiting selection, 
                     // but in real app we might need to verify key is present in env or re-instantiate client
                }
                const videoUrl = await generateMarketingVideo(prompt);
                setResult(videoUrl);
            }
        } catch (err) {
            console.error(err);
            setError("Generation failed. For Video/Image, ensure you have a paid API key selected.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Growth Engine</h1>
                    <p className="text-neutral-400">Create campaigns, assets, and copy with generative AI.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Icons.LayoutTemplate size={16} className="mr-2"/> Campaigns</Button>
                    <Button><Icons.Plus size={16} className="mr-2"/> New Asset</Button>
                </div>
            </div>

            <div className="flex gap-6">
                {/* Controls */}
                <div className="w-1/3 h-fit" id="marketing-controls"> {/* Targeted by Tutorial (Wrapper div) */}
                    <Card>
                        <div className="flex border-b border-neutral-800 mb-4">
                            <button 
                                onClick={() => { setActiveTab('COPY'); setResult(null); }}
                                className={`flex-1 pb-2 text-sm font-medium ${activeTab === 'COPY' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-neutral-400'}`}
                            >
                                Copy
                            </button>
                            <button 
                                onClick={() => { setActiveTab('IMAGE'); setResult(null); }}
                                className={`flex-1 pb-2 text-sm font-medium ${activeTab === 'IMAGE' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-neutral-400'}`}
                            >
                                Image
                            </button>
                            <button 
                                onClick={() => { setActiveTab('VIDEO'); setResult(null); }}
                                className={`flex-1 pb-2 text-sm font-medium ${activeTab === 'VIDEO' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-neutral-400'}`}
                            >
                                Video
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    {activeTab === 'COPY' ? 'Topic & Tone' : activeTab === 'IMAGE' ? 'Image Description' : 'Video Prompt'}
                                </label>
                                <textarea
                                    className="w-full h-32 bg-black border border-neutral-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary-600 outline-none resize-none"
                                    placeholder={
                                        activeTab === 'COPY' ? "e.g., Launch post for new AI feature. Exciting tone." :
                                        activeTab === 'IMAGE' ? "e.g., A futuristic dashboard glowing with red neon lights on a desk." :
                                        "e.g., A cinematic tracking shot of a robot typing on a laptop."
                                    }
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                            </div>
                            
                            {activeTab === 'VIDEO' && (
                                <div className="p-3 bg-neutral-900/50 rounded border border-neutral-800 text-xs text-neutral-400">
                                    <Icons.Info size={12} className="inline mr-1"/>
                                    Veo Video generation takes 1-2 minutes. Please be patient.
                                </div>
                            )}

                            <Button className="w-full" onClick={handleGenerate} isLoading={loading} disabled={!prompt}>
                                <Icons.Sparkles size={16} className="mr-2" />
                                Generate {activeTab === 'COPY' ? 'Copy' : activeTab === 'IMAGE' ? 'Image' : 'Video'}
                            </Button>
                            
                            {error && (
                                <div className="p-3 bg-red-900/20 border border-red-900/50 rounded text-red-200 text-sm">
                                    {error}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Output Display */}
                <Card className="flex-1 min-h-[500px] flex items-center justify-center bg-neutral-900/20">
                    {loading ? (
                        <div className="text-center text-neutral-500">
                            <Icons.Loader2 className="animate-spin mb-2 mx-auto" size={32} />
                            <p>Generating {activeTab.toLowerCase()}...</p>
                        </div>
                    ) : result ? (
                        activeTab === 'COPY' ? (
                            <div className="w-full h-full p-4 overflow-y-auto prose prose-invert">
                                <ReactMarkdown>{result}</ReactMarkdown>
                            </div>
                        ) : activeTab === 'IMAGE' ? (
                            <img src={result} alt="Generated" className="max-w-full max-h-[500px] rounded-lg shadow-2xl" />
                        ) : (
                            <video controls src={result} className="max-w-full max-h-[500px] rounded-lg shadow-2xl" />
                        )
                    ) : (
                        <div className="text-center text-neutral-600">
                            <Icons.BoxSelect size={48} className="mx-auto mb-4 opacity-20" />
                            <p>Generated assets will appear here.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};
