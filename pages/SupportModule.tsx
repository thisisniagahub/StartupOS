
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import * as Icons from 'lucide-react';
import { getTickets } from '../services/phase2Services';
import { Ticket } from '../types';

export const SupportModule: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    useEffect(() => { getTickets().then(setTickets); }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Customer Support</h1>
                    <p className="text-neutral-400">Inbox and ticket management.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Settings</Button>
                    <Button><Icons.Inbox size={16} className="mr-2"/> New Ticket</Button>
                </div>
            </div>

            <Card className="min-h-[600px] flex flex-col" id="support-inbox"> {/* Targeted by Tutorial */}
                <div className="flex items-center gap-4 border-b border-neutral-800 pb-4 mb-4">
                    <div className="relative flex-1">
                        <Icons.Search className="absolute left-3 top-2.5 text-neutral-500" size={16} />
                        <input type="text" placeholder="Search tickets..." className="w-full bg-neutral-900 border border-neutral-800 rounded pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary-600" />
                    </div>
                    <select className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none">
                        <option>All Statuses</option>
                        <option>Open</option>
                        <option>Resolved</option>
                    </select>
                </div>

                <div className="space-y-1 overflow-y-auto flex-1">
                    {tickets.map(ticket => (
                        <div key={ticket.id} className="flex items-center justify-between p-4 hover:bg-neutral-900/50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-neutral-800 group">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${ticket.status === 'OPEN' ? 'bg-blue-500' : ticket.status === 'RESOLVED' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                <div>
                                    <h4 className="text-white font-medium text-sm group-hover:text-primary-400 transition-colors">{ticket.subject}</h4>
                                    <p className="text-xs text-neutral-500">{ticket.customer} • {ticket.created}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide 
                                    ${ticket.priority === 'HIGH' ? 'bg-red-900/30 text-red-400' : 
                                      ticket.priority === 'MEDIUM' ? 'bg-yellow-900/30 text-yellow-400' : 
                                      'bg-neutral-800 text-neutral-400'}`}>
                                    {ticket.priority}
                                </span>
                                <Icons.ChevronRight size={16} className="text-neutral-600" />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
