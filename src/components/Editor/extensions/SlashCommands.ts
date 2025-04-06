import { Extension } from '@tiptap/core';
import Suggestion, { SuggestionProps } from '@tiptap/suggestion';
import { FC } from 'react';
import {
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Quote,
    Bold,
    Italic,
    Info,
    AlertTriangle,
    AlertCircle,
    CheckCircle2,
    LucideIcon
} from 'lucide-react';

export interface SlashCommandItem {
    title: string;
    description: string;
    icon: FC;
    command: ({ editor, range }: { editor: any; range: Record<string, any> }) => void;
}

export const SlashCommands = Extension.create({
    name: 'slashCommands',

    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({ editor, range, props }: { editor: any; range: any; props: any }) => {
                    props.command({ editor, range });
                },
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
                items: ({ query }: { query: string }) => {
                    const items: SlashCommandItem[] = [
                        {
                            title: 'Heading 1',
                            description: 'Large section heading',
                            icon: Heading1,
                            command: ({ editor, range }) => {
                                editor
                                    .chain()
                                    .focus()
                                    .deleteRange(range)
                                    .setNode('heading', { level: 1 })
                                    .run();
                            },
                        },
                        {
                            title: 'Heading 2',
                            description: 'Medium section heading',
                            icon: Heading2,
                            command: ({ editor, range }) => {
                                editor
                                    .chain()
                                    .focus()
                                    .deleteRange(range)
                                    .setNode('heading', { level: 2 })
                                    .run();
                            },
                        },
                        {
                            title: 'Bullet List',
                            description: 'Create a simple bullet list',
                            icon: List,
                            command: ({ editor, range }) => {
                                editor.chain().focus().deleteRange(range).toggleBulletList().run();
                            },
                        },
                        {
                            title: 'Numbered List',
                            description: 'Create a numbered list',
                            icon: ListOrdered,
                            command: ({ editor, range }) => {
                                editor.chain().focus().deleteRange(range).toggleOrderedList().run();
                            },
                        },
                        {
                            title: 'Blockquote',
                            description: 'Capture a quote',
                            icon: Quote,
                            command: ({ editor, range }) => {
                                editor.chain().focus().deleteRange(range).toggleBlockquote().run();
                            },
                        },
                        {
                            title: 'Bold',
                            description: 'Make text bold',
                            icon: Bold,
                            command: ({ editor, range }) => {
                                editor.chain().focus().deleteRange(range).toggleBold().run();
                            },
                        },
                        {
                            title: 'Italic',
                            description: 'Make text italic',
                            icon: Italic,
                            command: ({ editor, range }) => {
                                editor.chain().focus().deleteRange(range).toggleItalic().run();
                            },
                        },
                        {
                            title: 'Info Callout',
                            description: 'Add informational callout',
                            icon: Info,
                            command: ({ editor, range }) => {
                                editor.chain().focus().deleteRange(range).insertCallout({ type: 'info' }).run();
                            },
                        },
                        {
                            title: 'Warning Callout',
                            description: 'Add warning callout',
                            icon: AlertTriangle,
                            command: ({ editor, range }) => {
                                editor.chain().focus().deleteRange(range).insertCallout({ type: 'warning' }).run();
                            },
                        },
                        {
                            title: 'Error Callout',
                            description: 'Add error callout',
                            icon: AlertCircle,
                            command: ({ editor, range }) => {
                                editor.chain().focus().deleteRange(range).insertCallout({ type: 'error' }).run();
                            },
                        },
                        {
                            title: 'Best Practice Callout',
                            description: 'Add best practice callout',
                            icon: CheckCircle2,
                            command: ({ editor, range }) => {
                                editor.chain().focus().deleteRange(range).insertCallout({ type: 'best-practice' }).run();
                            },
                        },
                    ];

                    if (!query) {
                        return items;
                    }

                    return items.filter(item => {
                        return item.title.toLowerCase().includes(query.toLowerCase());
                    });
                },
                render: () => {
                    let popup: HTMLElement | null = null;
                    let commandsList: HTMLElement | null = null;
                    let selectedIndex = 0;

                    const createCommandsList = (items: SlashCommandItem[], commandCallback: (item: SlashCommandItem) => void) => {
                        const list = document.createElement('div');
                        list.className = 'slash-commands-list bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 min-w-[200px] z-50';
                        list.style.cssText = `
                            position: absolute;
                            border-radius: 0.5rem;
                            box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.1);
                            padding: 0.5rem;
                            overflow-y: auto;
                            max-height: 14rem;
                            z-index: 50;
                            width: 20rem;
                        `;

                        // Check if dark mode is enabled
                        const isDarkMode = document.documentElement.classList.contains('dark');
                        if (isDarkMode) {
                            list.style.background = '#1f2937'; // bg-gray-800
                            list.style.boxShadow = '0 0 0 1px rgba(255, 255, 255, 0.1), 0 10px 20px rgba(0, 0, 0, 0.3)';
                        }

                        items.forEach((item, index) => {
                            const listItem = document.createElement('div');
                            listItem.className = `slash-commands-item ${selectedIndex === index ? 'selected' : ''}`;
                            listItem.dataset.index = String(index);

                            listItem.style.cssText = `
                                display: flex;
                                align-items: center;
                                padding: 0.5rem;
                                border-radius: 0.25rem;
                                cursor: pointer;
                                margin-bottom: 0.25rem;
                                ${selectedIndex === index ? (isDarkMode ? 'background: #374151;' : 'background: #f3f4f6;') : ''}
                            `;

                            listItem.innerHTML = `
                                <div class="icon" style="margin-right: 0.75rem; color: ${getIconColor(item.title, isDarkMode)};">
                                    ${getIconSvg(item.title)}
                                </div>
                                <div style="flex: 1;">
                                    <div style="font-weight: 500; font-size: 0.875rem; color: ${isDarkMode ? '#ffffff' : '#1f2937'};">
                                        ${item.title}
                                    </div>
                                    <div style="font-size: 0.75rem; color: ${isDarkMode ? '#9ca3af' : '#6b7280'};">
                                        ${item.description}
                                    </div>
                                </div>
                            `;

                            // Set a more explicit click handler that calls the command function
                            listItem.addEventListener('click', () => {
                                // Find the item at this index and trigger its command
                                const selectedItem = items[index];
                                if (selectedItem) {
                                    // Execute the command with proper context
                                    commandCallback(selectedItem);
                                }
                                // Remove the popup after command execution
                                popup?.remove();
                            });

                            listItem.addEventListener('mouseenter', () => {
                                const prevSelected = commandsList?.querySelector('.selected');
                                prevSelected?.classList.remove('selected');
                                prevSelected?.setAttribute('style', `
                                    display: flex;
                                    align-items: center;
                                    padding: 0.5rem;
                                    border-radius: 0.25rem;
                                    cursor: pointer;
                                    margin-bottom: 0.25rem;
                                `);

                                listItem.classList.add('selected');
                                listItem.style.background = isDarkMode ? '#374151' : '#f3f4f6';
                                selectedIndex = Number(listItem.dataset.index || 0);
                            });

                            list.appendChild(listItem);
                        });

                        return list;
                    };

                    const getIconColor = (title: string, isDarkMode: boolean) => {
                        if (title.includes('Heading')) return isDarkMode ? '#93c5fd' : '#2563eb';
                        if (title.includes('List')) return isDarkMode ? '#a7f3d0' : '#059669';
                        if (title.includes('Blockquote')) return isDarkMode ? '#c4b5fd' : '#7c3aed';
                        if (title.includes('Bold') || title.includes('Italic')) return isDarkMode ? '#fcd34d' : '#d97706';
                        if (title.includes('Info')) return '#3b82f6';
                        if (title.includes('Warning')) return '#f59e0b';
                        if (title.includes('Error')) return '#ef4444';
                        if (title.includes('Best Practice')) return '#10b981';
                        return isDarkMode ? '#e5e7eb' : '#4b5563';
                    };

                    const getIconSvg = (title: string) => {
                        const size = 20;

                        if (title === 'Heading 1') {
                            return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16"></path><path d="M4 18V6"></path><path d="M20 18V6"></path></svg>`;
                        }

                        if (title === 'Heading 2') {
                            return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16"></path><path d="M4 18V6"></path><path d="M12 18V6"></path><path d="M20 18v-1a5 5 0 0 0-5-5 5 5 0 0 0 5-5V6"></path></svg>`;
                        }

                        if (title === 'Bullet List') {
                            return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`;
                        }

                        if (title === 'Numbered List') {
                            return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>`;
                        }

                        if (title === 'Blockquote') {
                            return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>`;
                        }

                        if (title === 'Bold') {
                            return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>`;
                        }

                        if (title === 'Italic') {
                            return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>`;
                        }

                        if (title === 'Info Callout') {
                            return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
                        }

                        if (title === 'Warning Callout') {
                            return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
                        }

                        if (title === 'Error Callout') {
                            return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
                        }

                        if (title === 'Best Practice Callout') {
                            return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
                        }

                        return '';
                    };

                    return {
                        onStart: props => {
                            popup = document.createElement('div');
                            popup.className = 'slash-commands-popup';
                            popup.style.position = 'absolute';

                            // Position near where the user is typing safely
                            const view = (props as any).view;
                            const rect = props.clientRect ? props.clientRect() : null;

                            popup.style.zIndex = '50';

                            if (rect) {
                                popup.style.left = `${rect.left}px`;
                                popup.style.top = `${rect.bottom + 10}px`;
                            } else if (view && view.state) {
                                const { state } = view;
                                const { selection } = state;
                                const { ranges } = selection;
                                const from = Math.min(...ranges.map((range: any) => range.$from.pos));
                                const domStart = view.coordsAtPos(from);

                                popup.style.left = `${domStart.left}px`;
                                popup.style.top = `${domStart.bottom + 10}px`;
                            } else {
                                // Fallback positioning if neither method works
                                popup.style.left = '50%';
                                popup.style.top = '50%';
                                popup.style.transform = 'translate(-50%, -50%)';
                            }

                            selectedIndex = 0; // Reset selection index
                            commandsList = createCommandsList(props.items, props.command);
                            popup.appendChild(commandsList);
                            document.body.appendChild(popup);

                            // Create a separate function for updating the selected item
                            const updateSelectedItem = (newIndex: number) => {
                                const items = props.items;
                                if (!items.length || !commandsList) return;

                                // Ensure index is in bounds
                                selectedIndex = (newIndex + items.length) % items.length;

                                // Update visual selection without recreating the entire list
                                const allItems = commandsList.querySelectorAll('.slash-commands-item');
                                const isDarkMode = document.documentElement.classList.contains('dark');

                                // Remove selection from all items
                                allItems.forEach((item) => {
                                    item.classList.remove('selected');
                                    (item as HTMLElement).style.background = 'transparent';
                                });

                                // Add selection to the current item
                                const currentItem = allItems[selectedIndex];
                                if (currentItem) {
                                    currentItem.classList.add('selected');
                                    (currentItem as HTMLElement).style.background = isDarkMode ? '#374151' : '#f3f4f6';

                                    // Ensure selected item is visible (auto-scroll)
                                    currentItem.scrollIntoView({ block: 'nearest' });
                                }
                            };

                            // Handle keyboard navigation
                            const handleKeyDown = (e: KeyboardEvent) => {
                                if (!popup || !commandsList) return;

                                if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updateSelectedItem(selectedIndex + 1);
                                    return false;
                                }

                                if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updateSelectedItem(selectedIndex - 1);
                                    return false;
                                }

                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    console.log("Enter key pressed, selecting item at index:", selectedIndex);

                                    const items = props.items;
                                    if (items[selectedIndex]) {
                                        // Get the selected item
                                        const selectedItem = items[selectedIndex];
                                        console.log("Selected item:", selectedItem.title);

                                        // Call the command with the selected item
                                        props.command(selectedItem);

                                        // Remove the popup
                                        popup?.remove();
                                    }

                                    // Return false to prevent default Enter behavior
                                    return false;
                                }

                                if (e.key === 'Escape') {
                                    e.preventDefault();
                                    popup?.remove();
                                }
                            };

                            // Add event listener with capture to ensure it gets triggered first
                            document.addEventListener('keydown', handleKeyDown, true);

                            // Cleanup
                            setTimeout(() => {
                                const handleClickOutside = (e: MouseEvent) => {
                                    if (popup && !popup.contains(e.target as Node)) {
                                        popup.remove();
                                        document.removeEventListener('mousedown', handleClickOutside);
                                        document.removeEventListener('keydown', handleKeyDown, true);
                                    }
                                };

                                document.addEventListener('mousedown', handleClickOutside);
                            }, 0);
                        },

                        onUpdate: props => {
                            if (!popup || !commandsList) return;

                            // Update position safely
                            const rect = props.clientRect ? props.clientRect() : null;
                            const view = (props as any).view;

                            if (rect) {
                                popup.style.left = `${rect.left}px`;
                                popup.style.top = `${rect.bottom + 10}px`;
                            } else if (view && view.state) {
                                const { state } = view;
                                const { selection } = state;
                                const { ranges } = selection;
                                const from = Math.min(...ranges.map((range: any) => range.$from.pos));
                                const domStart = view.coordsAtPos(from);

                                popup.style.left = `${domStart.left}px`;
                                popup.style.top = `${domStart.bottom + 10}px`;
                            }

                            // Update items
                            commandsList.remove();
                            selectedIndex = 0; // Reset selection when items change
                            commandsList = createCommandsList(props.items, props.command);
                            popup.innerHTML = '';
                            popup.appendChild(commandsList);
                        },

                        onKeyDown: props => {
                            // Check if popup exists before handling keys
                            if (!popup || !commandsList) return false;

                            // Handle escape key
                            if (props.event.key === 'Escape') {
                                popup?.remove();
                                return true;
                            }

                            // Handle arrow keys and enter - prevent these from propagating
                            // to the editor and explicitly handle them in our handler
                            if (props.event.key === 'ArrowUp' ||
                                props.event.key === 'ArrowDown' ||
                                props.event.key === 'Enter') {
                                props.event.preventDefault();
                                props.event.stopPropagation();
                                return true;
                            }

                            return false;
                        },

                        onExit: () => {
                            popup?.remove();
                            popup = null;
                            commandsList = null;
                        },
                    };
                },
            }),
        ];
    },
}); 