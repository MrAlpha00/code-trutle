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
            const res = await axios.get('http://localhost:3000/api/repos', {
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
            await axios.post('http://localhost:3000/api/repos',
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
            await axios.post(`http://localhost:3000/api/repos/${id}/regenerate-key`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchRepos();
        } catch (err) {
            console.error('Failed to regenerate key', err);
        }
    };

    if (loading) return <div>Loading repositories...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Repositories</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Add Repository</h2>
                <form onSubmit={handleCreate} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Repository Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                            placeholder="e.g. backend-api"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
                        <input
                            type="url"
                            required
                            value={githubRepoUrl}
                            onChange={e => setGithubRepoUrl(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                            placeholder="e.g. https://github.com/user/repo"
                        />
                    </div>
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium text-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </form>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repository</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Key</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {repos.map(repo => (
                            <tr key={repo.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{repo.name}</div>
                                    <div className="text-sm text-gray-500">{repo.githubRepoUrl}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                                            {repo.apiKey}
                                        </code>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => regenerateKey(repo.id)}
                                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1 justify-end ml-auto"
                                    >
                                        <Key className="w-4 h-4" /> Regenerate
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {repos.length === 0 && (
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No repositories added yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
