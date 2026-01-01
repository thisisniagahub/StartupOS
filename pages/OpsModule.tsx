import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import * as Icons from 'lucide-react';
import { getSOPs } from '../services/phase2Services';
import { SOP } from '../types';

export const OpsModule: React.FC = () => {
    const [sops, setSops] = useState<SOP[]>([]);

    useEffect(() => { getSOPs().then(setSops); }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Operations & SOPs</h1>
                    <p className="text-neutral-400">Standardize processes and knowledge base.</p>
                </div>
                <Button><Icons.Plus size={16} className="mr-2"/> New SOP</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-3" title="Standard Operating Procedures">
                    <table className="w-full text-left text-sm">
                        <thead className="text-neutral-500 border-b border-neutral-800">
                            <tr>
                                <th className="pb-3 font-medium">Title</th>
                                <th className="pb-3 font-medium">Category</th>
                                <th className="pb-3 font-medium">Last Updated</th>
                                <th className="pb-3 font-medium">Status</th>
                                <th className="pb-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-neutral-300">
                            {sops.map(sop => (
                                <tr key={sop.id} className="border-b border-neutral-800/50 last:border-0 hover:bg-neutral-900/30 transition-colors">
                                    <td className="py-4 font-medium text-white">{sop.title}</td>
                                    <td className="py-4"><span className="px-2 py-1 rounded bg-neutral-800 text-neutral-400 text-xs">{sop.category}</span></td>
                                    <td className="py-4 text-neutral-500">{sop.lastUpdated}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded text-xs ${sop.status === 'PUBLISHED' ? 'bg-green-900/20 text-green-400' : 'bg-yellow-900/20 text-yellow-400'}`}>
                                            {sop.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <Button variant="ghost" size="sm"><Icons.Edit2 size={14}/></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
                
                <div className="space-y-6">
                    <Card title="Quick Stats">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Total SOPs</span>
                                <span className="text-xl font-bold text-white">14</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Drafts</span>
                                <span className="text-xl font-bold text-white">3</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Views (30d)</span>
                                <span className="text-xl font-bold text-primary-500">245</span>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-neutral-900 to-black border-dashed">
                        <div className="flex flex-col items-center justify-center text-center py-6">
                            <Icons.BookOpen size={32} className="text-neutral-600 mb-4" />
                            <h3 className="text-white font-medium">AI Documentation</h3>
                            <p className="text-xs text-neutral-500 mt-2 mb-4">Generate SOPs from rough notes.</p>
                            <Button variant="outline" size="sm">Try Generator</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};