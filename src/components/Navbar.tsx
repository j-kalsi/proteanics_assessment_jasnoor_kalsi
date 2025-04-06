import React, { useState, useEffect } from 'react';
import { Sun, Moon, Save, Download, Share2 } from 'lucide-react';

interface NavbarProps {
    theme: 'light' | 'dark';
    documentTitle: string;
    onTitleChange: (title: string) => void;
    onThemeChange?: (theme: 'light' | 'dark') => void;
}

export function Navbar({ theme, documentTitle, onTitleChange, onThemeChange }: NavbarProps) {
    const [localTheme, setLocalTheme] = useState<'light' | 'dark'>(theme);

    useEffect(() => {
        setLocalTheme(theme);
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = localTheme === 'light' ? 'dark' : 'light';
        setLocalTheme(newTheme);
        if (onThemeChange) {
            onThemeChange(newTheme);
        }
    };

    return (
        <div className={`border-b ${localTheme === 'light' ? 'border-gray-200 bg-white' : 'border-gray-700 bg-gray-800'} px-4 py-2 flex items-center justify-between sticky top-0 z-20`}>
            <div className="flex items-center space-x-4">
                <h1 className={`text-xl font-bold ${localTheme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    Proteanics Editor
                </h1>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                <input
                    type="text"
                    value={documentTitle}
                    onChange={(e) => onTitleChange(e.target.value)}
                    className={`bg-transparent border-none outline-none text-lg ${localTheme === 'light' ? 'text-gray-700' : 'text-white'} placeholder-gray-400`}
                    placeholder="Untitled Document"
                />
            </div>

            <div className="flex items-center space-x-2">
                <button
                    className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${localTheme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
                    title="Save Document"
                >
                    <Save className="w-5 h-5" />
                </button>

                <button
                    className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${localTheme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
                    title="Export Document"
                >
                    <Download className="w-5 h-5" />
                </button>

                <button
                    className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${localTheme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
                    title="Share Document"
                >
                    <Share2 className="w-5 h-5" />
                </button>

                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>

                <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${localTheme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
                    title={localTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                    {localTheme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
} 