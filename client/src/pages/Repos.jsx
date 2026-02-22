import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert, Star, Activity, Plus, Key, FolderGit2 } from 'lucide-react';

export default function Repos() {
    const [repos, setRepos] = useState([]);
    const [name, setName] = useState('');
    const [githubRepoUrl, setGithubRepoUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    const fetchRepos = async () => {
        try {
            const res = await axios.get('/api/repos', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRepos(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRepos();
    }, [token]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/repos',
                { name, githubRepoUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setName('');
            setGithubRepoUrl('');
            fetchRepos();
        } catch (err) {
            console.error('Failed to create repo', err);
        }
    };

    const regenerateKey = async (id) => {
        if (!confirm('Are you sure? This will invalidate the old API key.')) return;
        try {
            await axios.post(`/api/repos/${id}/regenerate-key`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchRepos();
        } catch (err) {
            console.error('Failed to regenerate key', err);
        }
    };

    if (loading) return <div>Loading repositories...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
                Repositories
            </h1>

            <div className="bg-white p-6 rounded-2xl shadow-premium border border-gray-100 card-hover animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FolderGit2 className="w-5 h-5 text-blue-500" />
                    Add Repository
                </h2>
                <form onSubmit={handleCreate} className="flex gap-4 items-end flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Repository Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-4 py-2.5 transition-shadow"
                            placeholder="e.g. backend-api"
                        />
                    </div>
                    <div className="flex-1 min-w-[250px]">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">GitHub URL</label>
                        <input
                            type="url"
                            required
                            value={githubRepoUrl}
                            onChange={e => setGithubRepoUrl(e.target.value)}
                            className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-4 py-2.5 transition-shadow"
                            placeholder="e.g. https://github.com/user/repo"
                        />
                    </div>
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 font-semibold text-sm transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </form>
            </div>

            <div className="bg-white shadow-premium rounded-2xl border border-gray-100 overflow-hidden animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Repository</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">API Key</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {repos.map((repo, idx) => (
                            <tr key={repo.id} className="hover:bg-blue-50/30 transition-colors animate-fade-in" style={{ animationDelay: `${250 + (idx * 50)}ms`, animationFillMode: 'both' }}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-bold text-gray-900 text-sm">{repo.name}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{repo.githubRepoUrl}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <code className="bg-gray-100/80 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-mono border border-gray-200/60 shadow-inner">
                                            {repo.apiKey}
                                        </code>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => regenerateKey(repo.id)}
                                        className="text-white bg-gray-900 hover:bg-gray-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 justify-end ml-auto transition-all hover:shadow-md active:scale-95 text-xs font-semibold"
                                    >
                                        <Key className="w-3.5 h-3.5 text-gray-300" /> Regenerate
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {repos.length === 0 && (
                            <tr>
                                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                    <FolderGit2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    No repositories added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
