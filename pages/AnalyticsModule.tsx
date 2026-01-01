import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import * as Icons from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

const data = [
  { name: 'Mon', active: 4000, new: 2400 },
  { name: 'Tue', active: 3000, new: 1398 },
  { name: 'Wed', active: 2000, new: 9800 },
  { name: 'Thu', active: 2780, new: 3908 },
  { name: 'Fri', active: 1890, new: 4800 },
  { name: 'Sat', active: 2390, new: 3800 },
  { name: 'Sun', active: 3490, new: 4300 },
];

export const AnalyticsModule: React.FC = () => {
    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Analytics & BI</h1>
                    <p className="text-neutral-400">Deep dive into platform usage and retention.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Icons.Calendar size={16} className="mr-2"/> Last 7 Days</Button>
                    <Button><Icons.Download size={16} className="mr-2"/> Export CSV</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="text-neutral-400 text-sm mb-1">Daily Active Users</div>
                    <div className="text-3xl font-bold text-white">4,291</div>
                    <div className="text-green-400 text-xs mt-2 flex items-center"><Icons.TrendingUp size={12} className="mr-1"/> +12% vs last week</div>
                </Card>
                <Card>
                    <div className="text-neutral-400 text-sm mb-1">Avg Session Duration</div>
                    <div className="text-3xl font-bold text-white">4m 32s</div>
                    <div className="text-neutral-500 text-xs mt-2 flex items-center"><Icons.Minus size={12} className="mr-1"/> 0% vs last week</div>
                </Card>
                <Card>
                    <div className="text-neutral-400 text-sm mb-1">Bounce Rate</div>
                    <div className="text-3xl font-bold text-white">42.5%</div>
                    <div className="text-green-400 text-xs mt-2 flex items-center"><Icons.TrendingDown size={12} className="mr-1"/> -2% vs last week</div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="User Growth">
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', color: '#fff' }} />
                                <Area type="monotone" dataKey="active" stroke="#dc2626" fillOpacity={1} fill="url(#colorActive)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card title="Acquisition Channels">
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', color: '#fff' }} />
                                <Bar dataKey="new" fill="#525252" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};