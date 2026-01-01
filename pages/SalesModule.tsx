
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getSalesDeals } from '../services/salesService';
import { generateSalesEmail } from '../services/geminiService';
import { SalesDeal, SalesStage } from '../types';
import * as Icons from 'lucide-react';

export const SalesModule: React.FC = () => {
    const [deals, setDeals] = useState<SalesDeal[]>([]);
    const [selectedDeal, setSelectedDeal] = useState<SalesDeal | null>(null);
    const [emailDraft, setEmailDraft] = useState('');
    const [drafting, setDrafting] = useState(false);
    const [objection, setObjection] = useState('');

    useEffect(() => {
        getSalesDeals().then(setDeals);
    }, []);

    const handleDraftEmail = async () => {
        if (!selectedDeal) return;
        setDrafting(true);
        const context = `Lead: ${selectedDeal.leadName} from ${selectedDeal.company}. Value: $${selectedDeal.value}. Stage: ${selectedDeal.stage}.`;
        const text = await generateSalesEmail(context, objection);
        setEmailDraft(text);
        setDrafting(false);
    };

    const StageColumn = ({ stage, title }: { stage: SalesStage, title: string }) => (
        <div className="flex-1 min-w-[250px] bg-neutral-900/30 rounded-xl border border-neutral-800 p-3 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="font-semibold text-neutral-300 text-sm">{title}</h3>
                <span className="text-xs text-neutral-500">{deals.filter(d => d.stage === stage).length}</span>
            </div>
            <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                {deals.filter(d => d.stage === stage).map(deal => (
                    <div 
                        key={deal.id} 
                        onClick={() => setSelectedDeal(deal)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedDeal?.id === deal.id ? 'bg-primary-900/20 border-primary-600' : 'bg-black border-neutral-800 hover:border-neutral-600'}`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-white text-sm">{deal.company}</span>
                            <span className="text-xs text-green-400 font-mono">${deal.value.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-neutral-400 mb-2">{deal.leadName}</p>
                        <div className="flex items-center justify-between text-[10px] text-neutral-500">
                            <span>{deal.probability}% Prob</span>
                            <span>{deal.lastActivity}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6">
            {/* Kanban Board */}
            <div className="flex-1 flex flex-col min-w-0" id="sales-pipeline"> {/* Targeted by Tutorial */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Sales Pipeline</h1>
                    <Button><Icons.Plus size={16} className="mr-2"/> New Deal</Button>
                </div>
                
                <div className="flex gap-4 overflow-x-auto flex-1 pb-4">
                    <StageColumn stage="NEW" title="New Leads" />
                    <StageColumn stage="DISCOVERY" title="Discovery" />
                    <StageColumn stage="PROPOSAL" title="Proposal" />
                    <StageColumn stage="NEGOTIATION" title="Negotiation" />
                    <StageColumn stage="CLOSED_WON" title="Closed Won" />
                </div>
            </div>

            {/* AI Assistant Sidebar */}
            <div className="w-80 shrink-0 bg-neutral-900/50 border-l border-neutral-800 -my-8 p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-6 text-primary-500">
                    <Icons.Bot size={20} />
                    <h2 className="font-bold text-white">Sales Copilot</h2>
                </div>

                {selectedDeal ? (
                    <div className="flex-1 flex flex-col space-y-4">
                        <div className="p-3 bg-neutral-900 rounded border border-neutral-800">
                            <h3 className="text-sm font-medium text-white">{selectedDeal.company}</h3>
                            <p className="text-xs text-neutral-400 mt-1">Contact: {selectedDeal.leadName}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-neutral-400">Handle Objection (Optional)</label>
                            <input 
                                type="text" 
                                className="w-full bg-black border border-neutral-800 rounded p-2 text-xs text-white"
                                placeholder="e.g. 'Too expensive'..."
                                value={objection}
                                onChange={(e) => setObjection(e.target.value)}
                            />
                        </div>

                        <Button onClick={handleDraftEmail} isLoading={drafting} size="sm">
                            <Icons.PenTool size={14} className="mr-2"/> Draft Email
                        </Button>

                        {emailDraft && (
                            <div className="flex-1 bg-black border border-neutral-800 rounded p-3 overflow-y-auto">
                                <p className="text-xs text-neutral-300 whitespace-pre-wrap leading-relaxed">{emailDraft}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-neutral-600">
                        <Icons.MousePointerClick size={32} className="mb-2" />
                        <p className="text-sm">Select a deal to get AI assistance.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
