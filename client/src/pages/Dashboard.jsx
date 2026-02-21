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
                const res = await axios.get('http://localhost:3000/api/reviews', {
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
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                        <Activity className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Reviews</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600">
                        <Star className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Avg Quality Score</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.avgScore} <span className="text-gray-400 text-lg">/ 10</span></p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="bg-red-100 p-3 rounded-xl text-red-600">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">High Risk Findings</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.riskData.find(r => r.name === 'High')?.value || 0}</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            {stats.total > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Quality Score Trend</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis domain={[0, 10]} axisLine={false} tickLine={false} />
                                    <RechartsTooltip />
                                    <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Risk Distribution</h3>
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
                                    >
                                        {stats.riskData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex justify-center gap-6 mt-4">
                                {stats.riskData.map(risk => (
                                    <div key={risk.name} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: risk.color }}></div>
                                        <span className="text-sm text-gray-600">{risk.name}: {risk.value}</span>
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
