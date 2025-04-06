import React from 'react';
import { Clock, User, Calendar, Tag } from 'lucide-react';

interface DocumentHeaderProps {
    theme: 'light' | 'dark';
    author?: string;
    lastModified?: string;
    tags?: string[];
}

export function DocumentHeader({ theme, author = 'Anonymous', lastModified = new Date().toLocaleString(), tags = [] }: DocumentHeaderProps) {
    return (
        <div className={`border-b ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-gray-700 bg-gray-900'} px-4 py-3 flex items-center justify-between text-sm transition-colors duration-500`}>
            <div className="flex items-center space-x-4">
                <div className={`flex items-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} transition-colors duration-500`}>
                    <User className="w-4 h-4 mr-1" />
                    <span>{author}</span>
                </div>

                <div className={`flex items-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} transition-colors duration-500`}>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Last modified: {lastModified}</span>
                </div>

                <div className={`flex items-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} transition-colors duration-500`}>
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Created: {new Date().toLocaleDateString()}</span>
                </div>
            </div>

            {tags.length > 0 && (
                <div className="flex items-center space-x-2">
                    <Tag className={`w-4 h-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} transition-colors duration-500`} />
                    <div className="flex flex-wrap gap-1">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className={`px-2 py-0.5 rounded-full text-xs ${theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-gray-700 text-gray-300'} transition-colors duration-500`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 