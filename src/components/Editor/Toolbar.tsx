'use client';

import { Editor } from '@tiptap/react';
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
    Quote
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface ToolbarProps {
    editor: Editor;
    onAddCallout: (type: 'info' | 'best-practice' | 'warning' | 'error') => void;
}

const calloutTypes = [
    { type: 'info', icon: Info, label: 'Information', color: 'text-blue-500' },
    { type: 'best-practice', icon: CheckCircle2, label: 'Best Practice', color: 'text-green-500' },
    { type: 'warning', icon: AlertTriangle, label: 'Warning', color: 'text-amber-500' },
    { type: 'error', icon: AlertCircle, label: 'Error', color: 'text-red-500' },
] as const;

export function Toolbar({ editor, onAddCallout }: ToolbarProps) {
    if (!editor) {
        return null;
    }

    return (
        <div className="border-b border-gray-200 bg-white px-3 py-2 flex items-center gap-1 flex-wrap overflow-x-auto sticky top-0 z-10">
            <div className="flex items-center gap-1 mr-2">
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-100 text-blue-600' : 'text-gray-700'}`}
                    title="Heading 1 (H1)"
                >
                    <Heading1 className="w-5 h-5" />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-100 text-blue-600' : 'text-gray-700'}`}
                    title="Heading 2 (H2)"
                >
                    <Heading2 className="w-5 h-5" />
                </button>
            </div>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            <div className="flex items-center gap-1 mr-2">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('bold') ? 'bg-gray-100 text-blue-600' : 'text-gray-700'}`}
                    title="Bold (Mod+B)"
                >
                    <Bold className="w-5 h-5" />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('italic') ? 'bg-gray-100 text-blue-600' : 'text-gray-700'}`}
                    title="Italic (Mod+I)"
                >
                    <Italic className="w-5 h-5" />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-100 text-blue-600' : 'text-gray-700'}`}
                    title="Blockquote"
                >
                    <Quote className="w-5 h-5" />
                </button>
            </div>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            <div className="flex items-center gap-1 mr-2">
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-100 text-blue-600' : 'text-gray-700'}`}
                    title="Bullet List"
                >
                    <List className="w-5 h-5" />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-100 text-blue-600' : 'text-gray-700'}`}
                    title="Ordered List"
                >
                    <ListOrdered className="w-5 h-5" />
                </button>
            </div>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button
                        className={`flex items-center gap-1 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-gray-700 ${editor.isActive('callout') ? 'bg-gray-100 text-blue-600' : ''}`}
                        title="Add Callout (Mod+Shift+C)"
                    >
                        <Info className="w-5 h-5" />
                        <span className="text-sm font-medium">Callout</span>
                        <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="min-w-[220px] bg-white rounded-md shadow-lg border border-gray-200 py-1 animate-in fade-in-0 zoom-in-95"
                        sideOffset={5}
                    >
                        {calloutTypes.map(({ type, icon: Icon, label, color }) => (
                            <DropdownMenu.Item
                                key={type}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer outline-none"
                                onClick={() => onAddCallout(type)}
                            >
                                <Icon className={`w-5 h-5 ${color}`} />
                                <span className="text-sm font-medium">{label}</span>
                            </DropdownMenu.Item>
                        ))}
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    );
} 