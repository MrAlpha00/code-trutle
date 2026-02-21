import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, MessageCircle, Globe } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex justify-center space-x-6 md:order-2">
                        <a href="https://github.com/mralpha00" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
                            <span className="sr-only">GitHub</span>
                            <Github className="h-5 w-5" aria-hidden="true" />
                        </a>
                        <a href="https://linkedin.com/in/mralpha00" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors">
                            <span className="sr-only">LinkedIn</span>
                            <Linkedin className="h-5 w-5" aria-hidden="true" />
                        </a>
                        <a href="https://x.com/mralpha00" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
                            <span className="sr-only">X (Twitter)</span>
                            <Twitter className="h-5 w-5" aria-hidden="true" />
                        </a>
                        <a href="https://discord.com/users/mralpha00" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-500 transition-colors">
                            <span className="sr-only">Discord</span>
                            <MessageCircle className="h-5 w-5" aria-hidden="true" />
                        </a>
                        <a href="https://suhasm.online" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
                            <span className="sr-only">Portfolio</span>
                            <Globe className="h-5 w-5" aria-hidden="true" />
                        </a>
                    </div>
                    <div className="mt-8 md:mt-0 md:order-1">
                        <div className="flex justify-center md:justify-start space-x-6 text-sm font-medium text-gray-500 mb-4">
                            <Link to="/" className="hover:text-blue-600 transition-colors">Dashboard Overview</Link>
                            <Link to="/repos" className="hover:text-blue-600 transition-colors">Repositories</Link>
                            <Link to="/reviews" className="hover:text-blue-600 transition-colors">Review History</Link>
                        </div>
                        <p className="text-center md:text-left text-sm text-gray-400">
                            &copy; {new Date().getFullYear()} Built by <a href="https://suhasm.online" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 font-medium transition-colors">Suhas M</a>. CodeTurtle SaaS.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
