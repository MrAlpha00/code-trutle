import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, ShieldAlert, Star } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({ total: 0, avgScore: 0, riskData: [] });
    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Fetch all reviews
                const res = await axios.get('/api/reviews', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const reviews = res.data;
                const total = reviews.length;

                if (total === 0) {
                    setLoading(false);
                    return;
                }

                const avgScore = (reviews.reduce((acc, curr) => acc + curr.qualityScore, 0) / total).toFixed(1);

                const risks = { LOW: 0, MEDIUM: 0, HIGH: 0 };
                reviews.forEach(r => risks[r.securityRisk]++);
                const riskData = [
                    { name: 'Low', value: risks.LOW, color: '#22c55e' },
                    { name: 'Medium', value: risks.MEDIUM, color: '#eab308' },
                    { name: 'High', value: risks.HIGH, color: '#ef4444' },
                ];

                // Format trend data (last 7 reviews or grouped by date)
                const recentReviews = [...reviews].reverse().slice(-10); // get oldest first to show timeline
                const lineData = recentReviews.map((r, i) => ({
                    name: `Rev ${i + 1}`,
                    score: r.qualityScore
                }));

                setStats({ total, avgScore, riskData });
                setTrendData(lineData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [token]);

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
                Dashboard Overview
            </h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-premium card-hover flex items-center gap-5 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                    <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 shadow-sm border border-blue-100/50">
                        <Activity className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Reviews</p>
                        <p className="text-3xl font-extrabold text-gray-900">{stats.total}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-premium card-hover flex items-center gap-5 animate-slide-up" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
                    <div className="bg-yellow-50 p-4 rounded-2xl text-yellow-600 shadow-sm border border-yellow-100/50">
                        <Star className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Avg Quality Score</p>
                        <p className="text-3xl font-extrabold text-gray-900">{stats.avgScore} <span className="text-gray-400 text-lg font-medium">/ 10</span></p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-premium card-hover flex items-center gap-5 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                    <div className="bg-red-50 p-4 rounded-2xl text-red-600 shadow-sm border border-red-100/50">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">High Risk Findings</p>
                        <p className="text-3xl font-extrabold text-gray-900">{stats.riskData.find(r => r.name === 'High')?.value || 0}</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            {stats.total > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-premium card-hover animate-slide-up" style={{ animationDelay: '250ms', animationFillMode: 'both' }}>
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-2 h-6 rounded-full bg-blue-500"></span> Quality Score Trend
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                    <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
                                    <RechartsTooltip cursor={{ stroke: '#E5E7EB', strokeWidth: 2 }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                    <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 2, fill: '#fff', stroke: '#2563eb' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-premium card-hover animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-2 h-6 rounded-full bg-indigo-500"></span> Security Risk Distribution
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.riskData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {stats.riskData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex justify-center gap-6 mt-6">
                                {stats.riskData.map(risk => (
                                    <div key={risk.name} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                        <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: risk.color }}></div>
                                        <span className="text-sm font-semibold text-gray-700">{risk.name}:</span>
                                        <span className="text-sm font-bold text-gray-900">{risk.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
