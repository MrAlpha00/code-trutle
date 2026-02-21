import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import clsx from 'clsx';
import { FormViewer } from 'lucide-react'; // Placeholder

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
                    axios.get('http://localhost:3000/api/repos', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`http://localhost:3000/api/reviews${selectedRepo ? `?repositoryId=${selectedRepo}` : ''}`, { headers: { Authorization: `Bearer ${token}` } })
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Review History</h1>
                <select
                    value={selectedRepo}
                    onChange={e => setSelectedRepo(e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2 bg-white"
                >
                    <option value="">All Repositories</option>
                    {repos.map(repo => (
                        <option key={repo.id} value={repo.id}>{repo.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-4">
                {reviews.map(review => (
                    <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">{review.repository.name} - PR #{review.prNumber}</h3>
                                <p className="text-xs text-gray-500 flex items-center gap-4 mt-1">
                                    <span>{new Date(review.createdAt).toLocaleString()}</span>
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <span className={clsx(
                                    "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                    review.qualityScore >= 8 ? "bg-green-50 text-green-700 border-green-200" :
                                        review.qualityScore >= 5 ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                            "bg-red-50 text-red-700 border-red-200"
                                )}>
                                    Quality: {review.qualityScore}/10
                                </span>
                                <span className={clsx(
                                    "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                    review.securityRisk === 'LOW' ? "bg-green-50 text-green-700 border-green-200" :
                                        review.securityRisk === 'MEDIUM' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                            "bg-red-50 text-red-700 border-red-200"
                                )}>
                                    Risk: {review.securityRisk}
                                </span>
                            </div>
                        </div>
                        <div className="px-6 py-4 text-sm text-gray-700 font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
                            {review.aiReview}
                        </div>
                    </div>
                ))}
                {reviews.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No reviews found.</div>
                )}
            </div>
        </div>
    );
}
