
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import * as Icons from 'lucide-react';
import { db } from '../services/localStorageDb';
import { ProductFeature } from '../types';

export const ProductModule: React.FC = () => {
    // Standard mock data for roadmap
    const [features, setFeatures] = useState<ProductFeature[]>([]);

    useEffect(() => {
        // Init DB or get existing
        const data = db.get<ProductFeature[]>('product_features', [
            { id: 1, name: 'Auth System', status: 'Done', priority: 'High' },
            { id: 2, name: 'Billing Integration', status: 'In Progress', priority: 'High' },
            { id: 3, name: 'Mobile App', status: 'Backlog', priority: 'Medium' },
        ]);
        setFeatures(data);
    }, []);

    const updateStatus = (id: string | number, newStatus: ProductFeature['status']) => {
        const updated = features.map(f => f.id === id ? { ...f, status: newStatus } : f);
        setFeatures(updated);
        db.set('product_features', updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Product Roadmap</h1>
                    <p className="text-neutral-400">Plan, track, and ship.</p>
                </div>
                <Button><Icons.Plus size={16} className="mr-2"/> New Feature</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="product-board"> {/* Targeted by Tutorial */}
                {['Backlog', 'In Progress', 'Done'].map((status) => (
                    <div key={status} className="bg-neutral-900/30 rounded-xl border border-neutral-800 p-4 min-h-[400px]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-neutral-300">{status}</h3>
                            <span className="text-xs bg-neutral-800 text-neutral-500 px-2 py-1 rounded">
                                {features.filter(f => f.status === status).length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {features.filter(f => f.status === status).map(feature => (
                                <div key={feature.id} className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-neutral-600 cursor-pointer shadow-sm group animate-fade-in">
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-medium text-white">{feature.name}</span>
                                        <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                                             {status !== 'Backlog' && <Icons.ArrowLeft size={14} className="text-neutral-500 hover:text-white" onClick={() => updateStatus(feature.id, status === 'Done' ? 'In Progress' : 'Backlog')} />}
                                             {status !== 'Done' && <Icons.ArrowRight size={14} className="text-neutral-500 hover:text-white" onClick={() => updateStatus(feature.id, status === 'Backlog' ? 'In Progress' : 'Done')} />}
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                            feature.priority === 'High' ? 'border-red-900 text-red-400 bg-red-900/10' :
                                            feature.priority === 'Medium' ? 'border-yellow-900 text-yellow-400 bg-yellow-900/10' :
                                            'border-blue-900 text-blue-400 bg-blue-900/10'
                                        }`}>
                                            {feature.priority}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <button className="w-full py-2 text-xs border border-dashed border-neutral-800 text-neutral-500 rounded hover:bg-neutral-800 hover:text-neutral-300 transition-colors">
                                + Add Task
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
