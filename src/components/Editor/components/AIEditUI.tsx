import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tiptap/core';
import { AIEditState } from '../extensions/AIEditExtension';

interface AIEditUIProps {
    editor: Editor;
    state: AIEditState;
    onClose: () => void;
    onShowDiff: () => void;
}

export const AIEditUI: React.FC<AIEditUIProps> = ({ editor, state, onClose, onShowDiff }) => {
    const [instructions, setInstructions] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (state.isActive && containerRef.current) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                if (containerRef.current) {
                    containerRef.current.style.position = 'absolute';
                    containerRef.current.style.top = `${rect.bottom + window.scrollY + 10}px`;
                    containerRef.current.style.left = `${rect.left + window.scrollX}px`;
                }
            }
        }
    }, [state.isActive]);

    const handleSubmit = async () => {
        if (!instructions.trim()) return;

        setIsProcessing(true);
        try {
            const response = await fetch('/api/ai/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: state.selectedText,
                    instructions,
                    context: {
                        nodeType: 'text',
                    },
                }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                editor.storage.aiEdit.state = {
                    ...editor.storage.aiEdit.state,
                    modifiedText: data.modifiedText,
                    instructions,
                };

                onShowDiff();
            } else {
                throw new Error(data.message || 'Failed to process edit');
            }
        } catch (error) {
            console.error('AI edit error:', error);
            editor.storage.aiEdit.state = {
                ...editor.storage.aiEdit.state,
                error: error instanceof Error ? error.message : 'An error occurred',
            };
        } finally {
            setIsProcessing(false);
        }
    };

    if (!state.isActive) return null;

    return (
        <div
            ref={containerRef}
            className="ai-edit-ui bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 min-w-[300px] z-50"
        >
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">AI Edit</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Selected text: {state.selectedText}
                </p>
            </div>

            <div className="mb-4">
                <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Enter instructions for the AI..."
                    className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white text-gray-800"
                    rows={3}
                />
            </div>

            {state.error && (
                <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md">
                    {state.error}
                </div>
            )}

            <div className="flex justify-end gap-2">
                <button
                    onClick={onClose}
                    className="px-3 py-1 text-sm rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isProcessing || !instructions.trim()}
                    className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                >
                    {isProcessing ? 'Processing...' : 'Submit'}
                </button>
            </div>
        </div>
    );
}; 