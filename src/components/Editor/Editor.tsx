'use client';

import { useEditor, EditorContent, Editor as TiptapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect, useState } from 'react';
import { CalloutNode } from './extensions/CalloutNode';
import { SlashCommands } from './extensions/SlashCommands';
import { AIEditExtension } from './extensions/AIEditExtension';
import { AIEditUI } from './components/AIEditUI';
import { DiffView } from './components/DiffView';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    AlertCircle,
    AlertTriangle,
    Info,
    CheckCircle2,
    ChevronDown,
    Heading1,
    Heading2,
    Quote,
    Sun,
    Moon
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Navbar } from '../Navbar';
import { DocumentHeader } from '../DocumentHeader';

interface ToolbarProps {
    editor: any;
    onAddCallout: (type: 'info' | 'best-practice' | 'warning' | 'error') => void;
    theme: 'light' | 'dark';
}

const calloutTypes = [
    { type: 'info' as const, icon: Info, label: 'Information', color: 'text-blue-500' },
    { type: 'best-practice' as const, icon: CheckCircle2, label: 'Best Practice', color: 'text-green-500' },
    { type: 'warning' as const, icon: AlertTriangle, label: 'Warning', color: 'text-amber-500' },
    { type: 'error' as const, icon: AlertCircle, label: 'Error', color: 'text-red-500' },
];

function Toolbar({ editor, onAddCallout, theme }: ToolbarProps) {
    if (!editor) {
        return null;
    }

    return (
        <div className={`border-b border-gray-200 dark:border-gray-700 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} px-3 py-2 flex items-center gap-1 flex-wrap overflow-x-auto sticky top-0 z-10`}>
            <div className="flex items-center gap-1 mr-2">
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
                    title="Heading 1 (H1)"
                >
                    <Heading1 className="w-5 h-5" />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
                    title="Heading 2 (H2)"
                >
                    <Heading2 className="w-5 h-5" />
                </button>
            </div>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

            <div className="flex items-center gap-1 mr-2">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.isActive('bold') ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
                    title="Bold (Mod+B)"
                >
                    <Bold className="w-5 h-5" />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.isActive('italic') ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
                    title="Italic (Mod+I)"
                >
                    <Italic className="w-5 h-5" />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
                    title="Blockquote"
                >
                    <Quote className="w-5 h-5" />
                </button>
            </div>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

            <div className="flex items-center gap-1 mr-2">
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
                    title="Bullet List"
                >
                    <List className="w-5 h-5" />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
                    title="Ordered List"
                >
                    <ListOrdered className="w-5 h-5" />
                </button>
            </div>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button
                        className={`flex items-center gap-1 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.isActive('callout') ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
                        title="Add Callout (Mod+Shift+C)"
                    >
                        <Info className="w-5 h-5" />
                        <span className="text-sm font-medium">Callout</span>
                        <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className={`min-w-[220px] ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-md shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'} py-1 animate-in fade-in-0 zoom-in-95`}
                        sideOffset={5}
                    >
                        {calloutTypes.map(({ type, icon: Icon, label, color }) => (
                            <DropdownMenu.Item
                                key={type}
                                className={`flex items-center gap-2 px-3 py-2 ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'} cursor-pointer outline-none`}
                                onClick={() => onAddCallout(type)}
                            >
                                <Icon className={`w-5 h-5 ${color}`} />
                                <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{label}</span>
                            </DropdownMenu.Item>
                        ))}
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    );
}

export function Editor() {
    const [isMounted, setIsMounted] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [showDiff, setShowDiff] = useState(false);
    const [documentTitle, setDocumentTitle] = useState('Untitled Document');
    const [documentAuthor, setDocumentAuthor] = useState('Anonymous');
    const [documentTags, setDocumentTags] = useState<string[]>(['draft']);
    const [lastModified, setLastModified] = useState(new Date().toLocaleString());

    // Only initialize the editor after the component has mounted
    useEffect(() => {
        setIsMounted(true);

        // Check for user's system preference for dark mode
        if (typeof window !== 'undefined') {
            const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(isDarkMode ? 'dark' : 'light');
        }

        return () => {
            // Cleanup function
        };
    }, []);

    useEffect(() => {
        // Apply theme class to document with a smooth transition
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            // Add a global style for dark mode text
            const style = document.createElement('style');
            style.innerHTML = `
                .dark .ProseMirror {
                    color: white !important;
                }
                .dark .ProseMirror p {
                    color: white !important;
                }
                .dark .ProseMirror h1, 
                .dark .ProseMirror h2, 
                .dark .ProseMirror h3, 
                .dark .ProseMirror h4, 
                .dark .ProseMirror h5, 
                .dark .ProseMirror h6 {
                    color: white !important;
                }
                .dark .ProseMirror li {
                    color: white !important;
                }
                .dark .ProseMirror blockquote {
                    color: white !important;
                }
                .dark .ProseMirror strong,
                .dark .ProseMirror b {
                    color: white !important;
                }
            `;
            document.head.appendChild(style);
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const handleThemeChange = useCallback((newTheme: 'light' | 'dark') => {
        // Add a small delay to make the transition smoother
        setTimeout(() => {
            setTheme(newTheme);
        }, 50);
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit,
            CalloutNode,
            SlashCommands,
            AIEditExtension,
        ],
        content: '<p>Hello World! 🌍</p>',
        editorProps: {
            attributes: {
                class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4 text-base leading-relaxed ${theme === 'light' ? 'text-gray-800' : 'text-white'}`,
            },
        },
    });

    const addCallout = useCallback((type: 'info' | 'best-practice' | 'warning' | 'error') => {
        if (!editor) return;

        console.log("Adding callout with type:", type);

        // Check if we're inside a callout
        if (editor.isActive('callout')) {
            console.log("Updating existing callout to type:", type);
            // Update the type of the current callout instead of nesting
            editor.chain()
                .focus()
                .updateAttributes('callout', { type: type })
                .run();
        } else {
            console.log("Inserting new callout with type:", type);
            // Use the insertCallout command directly
            editor.chain()
                .focus()
                .insertCallout({ type: type })
                .run();
        }
    }, [editor]);

    const handleCloseAIEdit = () => {
        editor?.commands.rejectAIEdit();
    };

    const handleShowDiff = () => {
        setShowDiff(true);
    };

    const handleAcceptAIEdit = () => {
        editor?.commands.acceptAIEdit();
        setShowDiff(false);
    };

    const handleRejectAIEdit = () => {
        editor?.commands.rejectAIEdit();
        setShowDiff(false);
    };

    // Add effect to handle theme changes
    useEffect(() => {
        // Apply dark theme class to document
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Force editor to update when theme changes
        if (editor) {
            // This will trigger a re-render of all nodes, including callouts
            editor.view.updateState(editor.state);

            // Add a small delay to ensure the DOM has updated
            setTimeout(() => {
                // Force a re-render of the editor content
                editor.view.updateState(editor.state);
            }, 50);
        }
    }, [theme, editor]);

    if (!editor) {
        return (
            <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'} flex items-center justify-center`}>
                <div className={`animate-pulse p-8 rounded-lg ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} shadow-sm`}>
                    <div className={`h-6 w-32 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'} rounded mb-4`}></div>
                    <div className={`h-4 w-64 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'} rounded`}></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'} transition-colors duration-500`}>
            <Navbar
                theme={theme}
                documentTitle={documentTitle}
                onTitleChange={setDocumentTitle}
                onThemeChange={handleThemeChange}
            />

            <DocumentHeader
                theme={theme}
                author={documentAuthor}
                lastModified={lastModified}
                tags={documentTags}
            />

            <div className="max-w-5xl mx-auto pt-8 pb-16">
                <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-lg shadow-sm overflow-hidden transition-colors duration-500`}>
                    <Toolbar editor={editor} onAddCallout={addCallout} theme={theme} />
                    <div className={`border-t ${theme === 'light' ? 'border-gray-100' : 'border-gray-700'} transition-colors duration-500`}>
                        <EditorContent editor={editor} className={`${theme === 'light' ? 'text-gray-800' : 'text-white'} transition-colors duration-500`} />
                    </div>
                </div>
                <div className={`px-4 mt-4 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} transition-colors duration-500`}>
                    <p className="mb-2">Keyboard Shortcuts:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className={`flex items-center ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} p-2 rounded-md transition-colors duration-500`}>
                            <kbd className={`px-2 py-1 text-xs font-semibold ${theme === 'light' ? 'bg-white' : 'bg-gray-700'} ${theme === 'light' ? 'border-gray-200' : 'border-gray-600'} border rounded mr-2 transition-colors duration-500`}>Cmd/Ctrl+Shift+E</kbd>
                            <span>AI Edit</span>
                        </div>
                        <div className={`flex items-center ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} p-2 rounded-md transition-colors duration-500`}>
                            <kbd className={`px-2 py-1 text-xs font-semibold ${theme === 'light' ? 'bg-white' : 'bg-gray-700'} ${theme === 'light' ? 'border-gray-200' : 'border-gray-600'} border rounded mr-2 transition-colors duration-500`}>Cmd/Ctrl+Shift+C</kbd>
                            <span>Add Callout</span>
                        </div>
                        <div className={`flex items-center ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} p-2 rounded-md transition-colors duration-500`}>
                            <kbd className={`px-2 py-1 text-xs font-semibold ${theme === 'light' ? 'bg-white' : 'bg-gray-700'} ${theme === 'light' ? 'border-gray-200' : 'border-gray-600'} border rounded mr-2 transition-colors duration-500`}>/</kbd>
                            <span>Quick Commands</span>
                        </div>
                    </div>
                </div>
            </div>

            {editor.storage.aiEdit.state.isActive && !showDiff && (
                <AIEditUI
                    editor={editor}
                    state={editor.storage.aiEdit.state}
                    onClose={handleCloseAIEdit}
                    onShowDiff={handleShowDiff}
                />
            )}

            {showDiff && editor.storage.aiEdit.state.modifiedText && (
                <DiffView
                    originalText={editor.storage.aiEdit.state.originalText}
                    modifiedText={editor.storage.aiEdit.state.modifiedText}
                    onAccept={handleAcceptAIEdit}
                    onReject={handleRejectAIEdit}
                />
            )}
        </div>
    );
} 