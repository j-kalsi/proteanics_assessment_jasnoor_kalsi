import React from 'react';
import { diffLines, Change } from 'diff';

interface DiffViewProps {
    originalText: string;
    modifiedText: string;
    onAccept: () => void;
    onReject: () => void;
}

export const DiffView: React.FC<DiffViewProps> = ({
    originalText,
    modifiedText,
    onAccept,
    onReject,
}) => {
    const changes = diffLines(originalText, modifiedText);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-auto">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Review Changes</h3>

                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-md overflow-auto max-h-[50vh]">
                        {changes.map((part: Change, index: number) => (
                            <div
                                key={index}
                                className={`font-mono text-sm ${part.added
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                        : part.removed
                                            ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                            : 'text-gray-800 dark:text-white'
                                    }`}
                            >
                                {part.value.split('\n').map((line: string, i: number) => (
                                    <div key={i} className="py-1">
                                        {part.added ? '+ ' : part.removed ? '- ' : '  '}
                                        {line}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onReject}
                            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
                        >
                            Reject
                        </button>
                        <button
                            onClick={onAccept}
                            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Accept
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 