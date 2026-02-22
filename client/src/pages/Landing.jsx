import { Link } from 'react-router-dom';
import { Bot, GitMerge, ShieldCheck, Zap, ArrowRight, CheckCircle2, Github } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-200 selection:text-blue-900">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 glass border-b border-gray-200 bg-white/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-blue-600">🐢 CodeTurtle</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                                Sign in
                            </Link>
                            <Link
                                to="/signup"
                                className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">

                    {/* Decorative background blobs */}
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse-slow"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>

                    <div className="text-center animate-fade-in relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                            The Next Evolution of Code Review
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 drop-shadow-sm">
                            AI-Powered Code Reviews <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                Before They Merge.
                            </span>
                        </h1>

                        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                            CodeTurtle acts as your AI co-reviewer. It catches bugs, explains complex changes, and speeds up your PR velocity allowing your team to ship faster and safer.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/signup"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto text-lg"
                            >
                                Start Reviewing for Free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Features/Benefits Section */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Everything you need to ship confident code</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-premium card-hover border border-gray-100">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-6">
                                <Bot className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Summaries</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Automatically generate high-level summaries and walk-throughs for every pull request, saving reviewers time trying to understand the context.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-premium card-hover border border-gray-100">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mb-6">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Security & Bug Detection</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Spot vulnerabilities, logic flaws, and performance bottlenecks line-by-line before they ever make it to production.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-premium card-hover border border-gray-100">
                            <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 mb-6">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Feedback</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Don't wait hours for a human review. CodeTurtle provides immediate, context-aware suggestions the moment you open a PR.
                            </p>
                        </div>
                    </div>
                </div>

                {/* How it Works Section */}
                <div className="bg-gray-900 text-white mt-32 py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold sm:text-4xl">How CodeTurtle works</h2>
                            <p className="mt-4 text-xl text-gray-400">Integrates directly into your existing workflow</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12 text-center">
                            <div>
                                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-2xl font-bold mx-auto mb-6 text-blue-400 border border-gray-700">1</div>
                                <h3 className="text-xl font-semibold mb-3">Connect your Repo</h3>
                                <p className="text-gray-400">Securely link your GitHub repositories in seconds. No complex setup required.</p>
                            </div>
                            <div>
                                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-2xl font-bold mx-auto mb-6 text-purple-400 border border-gray-700">2</div>
                                <h3 className="text-xl font-semibold mb-3">Open a Pull Request</h3>
                                <p className="text-gray-400">Continue your normal workflow. CodeTurtle automatically detects new pull requests.</p>
                            </div>
                            <div>
                                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-2xl font-bold mx-auto mb-6 text-pink-400 border border-gray-700">3</div>
                                <h3 className="text-xl font-semibold mb-3">Get AI Insights</h3>
                                <p className="text-gray-400">Receive comprehensive summaries and actionable line-by-line feedback instantly.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold text-gray-900">🐢 CodeTurtle</span>
                    </div>
                    <p className="text-gray-500 text-sm">© {new Date().getFullYear()} CodeTurtle. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
