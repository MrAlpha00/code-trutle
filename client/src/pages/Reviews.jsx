import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import clsx from 'clsx';
import { FileText } from 'lucide-react'; // Placeholder

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [repos, setRepos] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState('');
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reposRes, reviewsRes] = await Promise.all([
                    axios.get('/api/repos', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`/api/reviews${selectedRepo ? `?repositoryId=${selectedRepo}` : ''}`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setRepos(reposRes.data);
                setReviews(reviewsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token, selectedRepo]);

    if (loading) return <div>Loading reviews...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
                    Review History
                </h1>
                <select
                    value={selectedRepo}
                    onChange={e => setSelectedRepo(e.target.value)}
                    className="rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-4 py-2.5 bg-white transition-shadow hover:shadow-md cursor-pointer font-medium text-gray-700"
                >
                    <option value="">All Repositories</option>
                    {repos.map(repo => (
                        <option key={repo.id} value={repo.id}>{repo.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-6 pb-8">
                {reviews.map((review, idx) => (
                    <div key={review.id} className="bg-white rounded-2xl shadow-premium border border-gray-100 overflow-hidden card-hover animate-slide-up" style={{ animationDelay: `${100 + (idx * 50)}ms`, animationFillMode: 'both' }}>
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-base font-bold text-gray-900">{review.repository.name} <span className="text-gray-400 font-normal mx-2">|</span> PR #{review.prNumber}</h3>
                                <p className="text-xs text-gray-500 font-medium mt-1">
                                    {new Date(review.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                </p>
                            </div>
                            <div className="flex gap-3 items-center">
                                <span className={clsx(
                                    "px-3 py-1 rounded-lg text-xs font-bold border shadow-sm",
                                    review.qualityScore >= 8 ? "bg-green-50 text-green-700 border-green-200" :
                                        review.qualityScore >= 5 ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                            "bg-red-50 text-red-700 border-red-200"
                                )}>
                                    Quality: {review.qualityScore}/10
                                </span>
                                <span className={clsx(
                                    "px-3 py-1 rounded-lg text-xs font-bold border shadow-sm",
                                    review.securityRisk === 'LOW' ? "bg-green-50 text-green-700 border-green-200" :
                                        review.securityRisk === 'MEDIUM' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                            "bg-red-50 text-red-700 border-red-200"
                                )}>
                                    Risk: {review.securityRisk}
                                </span>
                            </div>
                        </div>
                        <div className="p-6 text-sm text-gray-700 font-mono whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed bg-gray-50/30">
                            {review.aiReview}
                        </div>
                    </div>
                ))}
                {reviews.length === 0 && (
                    <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-900">No reviews found.</p>
                        <p className="text-sm mt-1">Try selecting a different repository or trigger a new AI review.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
