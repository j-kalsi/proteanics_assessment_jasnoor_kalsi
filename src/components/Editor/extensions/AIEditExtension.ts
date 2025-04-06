import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { Editor } from '@tiptap/core';

// Extend the RawCommands interface to include our custom commands
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        aiEdit: {
            triggerAIEdit: () => ReturnType;
            acceptAIEdit: () => ReturnType;
            rejectAIEdit: () => ReturnType;
            setAIInstructions: (instructions: string) => ReturnType;
        }
    }
}

export interface AIEditState {
    isActive: boolean;
    selectedText: string;
    originalText: string;
    modifiedText: string | null;
    instructions: string;
    decorations: DecorationSet | null;
    error: string | null;
}

export const AIEditPluginKey = new PluginKey('aiEdit');

export const AIEditExtension = Extension.create({
    name: 'aiEdit',

    addOptions() {
        return {
            keyboardShortcut: 'Mod-Shift-E',
        };
    },

    addStorage() {
        return {
            state: {
                isActive: false,
                selectedText: '',
                originalText: '',
                modifiedText: null,
                instructions: '',
                decorations: null,
                error: null,
            } as AIEditState,
        };
    },

    addCommands() {
        return {
            triggerAIEdit:
                () =>
                    ({ editor }: { editor: Editor }) => {
                        const { state } = editor;
                        const { selection } = state;

                        if (selection.empty) {
                            return false;
                        }

                        const selectedText = state.doc.textBetween(
                            selection.from,
                            selection.to,
                            ' '
                        );

                        if (!selectedText) {
                            return false;
                        }

                        this.storage.state = {
                            ...this.storage.state,
                            isActive: true,
                            selectedText,
                            originalText: selectedText,
                            modifiedText: null,
                            instructions: '',
                            decorations: null,
                            error: null,
                        };

                        return true;
                    },

            acceptAIEdit:
                () =>
                    ({ editor, tr }: { editor: Editor; tr: any }) => {
                        const { state } = this.storage;

                        if (!state.isActive || !state.modifiedText) {
                            return false;
                        }

                        const { selection } = editor.state;

                        tr.replaceWith(
                            selection.from,
                            selection.to,
                            editor.schema.text(state.modifiedText)
                        );

                        this.storage.state = {
                            ...this.storage.state,
                            isActive: false,
                            decorations: null,
                        };

                        return true;
                    },

            rejectAIEdit:
                () =>
                    ({ editor }: { editor: Editor }) => {
                        this.storage.state = {
                            ...this.storage.state,
                            isActive: false,
                            decorations: null,
                        };
                        return true;
                    },

            setAIInstructions:
                (instructions: string) =>
                    ({ editor }: { editor: Editor }) => {
                        this.storage.state = {
                            ...this.storage.state,
                            instructions,
                        };
                        return true;
                    },
        };
    },

    addKeyboardShortcuts() {
        return {
            [this.options.keyboardShortcut]: () => this.editor.commands.triggerAIEdit(),
        };
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: AIEditPluginKey,
                state: {
                    init: () => this.storage.state,
                    apply: (tr, value) => {
                        const meta = tr.getMeta(AIEditPluginKey);
                        if (meta) {
                            return { ...value, ...meta };
                        }
                        return value;
                    },
                },
            }),
        ];
    },
}); 