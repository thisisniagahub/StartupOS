
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import * as Icons from 'lucide-react';

export const DeveloperPage: React.FC = () => {
    const [keys, setKeys] = useState([
        { id: 'pk_live_1234', name: 'Production Key', created: '2 months ago', lastUsed: 'Just now' },
        { id: 'pk_test_5678', name: 'Staging Key', created: '1 week ago', lastUsed: '2 days ago' },
    ]);

    const createKey = () => {
        const newKey = { id: `pk_live_${Date.now()}`, name: 'New API Key', created: 'Just now', lastUsed: 'Never' };
        setKeys([...keys, newKey]);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Developer Settings</h1>
                    <p className="text-neutral-400">Manage API keys and Webhooks.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="API Keys">
                        <div className="space-y-4" id="dev-api-keys"> {/* Targeted by Tutorial */}
                            {keys.map(key => (
                                <div key={key.id} className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
                                    <div>
                                        <div className="font-medium text-white">{key.name}</div>
                                        <div className="font-mono text-xs text-neutral-500 mt-1">{key.id}</div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                                        <span>Last used: {key.lastUsed}</span>
                                        <Button variant="outline" size="sm">Revoke</Button>
                                    </div>
                                </div>
                            ))}
                            <Button onClick={createKey} className="w-full border-dashed border-neutral-700 bg-transparent hover:bg-neutral-800">
                                <Icons.Plus size={14} className="mr-2"/> Generate New Secret Key
                            </Button>
                        </div>
                    </Card>

                    <Card title="Webhooks">
                        <div className="p-8 text-center text-neutral-500">
                            <Icons.Webhook size={48} className="mx-auto mb-4 opacity-30" />
                            <p>No endpoints configured. <span className="text-primary-400 cursor-pointer">Add Endpoint</span></p>
                        </div>
                    </Card>
                </div>
                
                <div className="space-y-6">
                    <Card title="Documentation">
                        <ul className="space-y-2">
                            {['Authentication', 'Rate Limits', 'Errors', 'Pagination'].map(item => (
                                <li key={item} className="flex items-center justify-between p-2 hover:bg-neutral-900 rounded cursor-pointer group">
                                    <span className="text-sm text-neutral-400 group-hover:text-white">{item}</span>
                                    <Icons.ChevronRight size={14} className="text-neutral-600 group-hover:text-white" />
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};
