
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { getFinancialMetrics, getRunwayData } from '../services/financeService';
import { FinancialMetric } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line } from 'recharts';
import * as Icons from 'lucide-react';

export const FinanceModule: React.FC = () => {
    const [metrics, setMetrics] = useState<FinancialMetric[]>([]);
    const [runway, setRunway] = useState<any>(null);

    useEffect(() => {
        getFinancialMetrics().then(setMetrics);
        getRunwayData().then(setRunway);
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Finance & Operations</h1>

            {/* Top Cards */}
            {runway && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card id="finance-runway-card"> {/* Targeted by Tutorial */}
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-900/20 text-red-500 rounded-lg">
                                <Icons.Flame size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-neutral-400">Monthly Burn</p>
                                <h3 className="text-2xl font-bold text-white">${runway.burnRate.toLocaleString()}</h3>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-900/20 text-green-500 rounded-lg">
                                <Icons.Wallet size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-neutral-400">Cash on Hand</p>
                                <h3 className="text-2xl font-bold text-white">${runway.cashOnHand.toLocaleString()}</h3>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-900/20 text-blue-500 rounded-lg">
                                <Icons.Hourglass size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-neutral-400">Runway</p>
                                <h3 className="text-2xl font-bold text-white">{runway.runwayMonths} Months</h3>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Revenue vs Expenses">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer>
                            <BarChart data={metrics}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis dataKey="month" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{fill: '#262626'}}
                                />
                                <Legend />
                                <Bar dataKey="revenue" fill="#dc2626" radius={[4, 4, 0, 0]} name="Revenue" />
                                <Bar dataKey="expenses" fill="#404040" radius={[4, 4, 0, 0]} name="Expenses" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Cash Balance Trend">
                    <div className="h-[300px] w-full">
                         <ResponsiveContainer>
                            <LineChart data={metrics}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis dataKey="month" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="cashBalance" stroke="#22c55e" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
            
            <Card title="Recent Transactions">
                <table className="w-full text-sm text-left">
                    <thead className="text-neutral-500 border-b border-neutral-800">
                        <tr>
                            <th className="py-3 font-medium">Description</th>
                            <th className="py-3 font-medium">Category</th>
                            <th className="py-3 font-medium">Date</th>
                            <th className="py-3 font-medium text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="text-neutral-300">
                        <tr className="border-b border-neutral-800/50">
                            <td className="py-3">AWS Infrastructure</td>
                            <td className="py-3"><span className="px-2 py-1 rounded bg-neutral-800 text-xs">Software</span></td>
                            <td className="py-3">May 24</td>
                            <td className="py-3 text-right">-$1,240.00</td>
                        </tr>
                        <tr className="border-b border-neutral-800/50">
                            <td className="py-3">Stripe Payout</td>
                            <td className="py-3"><span className="px-2 py-1 rounded bg-green-900/20 text-green-400 text-xs">Revenue</span></td>
                            <td className="py-3">May 23</td>
                            <td className="py-3 text-right text-green-400">+$4,500.00</td>
                        </tr>
                        <tr>
                            <td className="py-3">WeWork Rent</td>
                            <td className="py-3"><span className="px-2 py-1 rounded bg-neutral-800 text-xs">Office</span></td>
                            <td className="py-3">May 01</td>
                            <td className="py-3 text-right">-$2,000.00</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        </div>
    );
};
