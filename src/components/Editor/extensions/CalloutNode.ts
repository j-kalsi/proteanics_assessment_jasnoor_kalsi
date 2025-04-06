import { mergeAttributes, Node } from '@tiptap/core';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        callout: {
            /**
             * Add a callout
             */
            insertCallout: (attributes: { type: 'info' | 'warning' | 'error' | 'best-practice' }) => ReturnType;
        };
    }
}

export interface CalloutOptions {
    HTMLAttributes: Record<string, any>;
}

export const CalloutNode = Node.create<CalloutOptions>({
    name: 'callout',

    addOptions() {
        return {
            HTMLAttributes: {
                class: 'callout',
            },
        };
    },

    group: 'block',

    content: 'block+',

    defining: true,

    addAttributes() {
        return {
            type: {
                default: 'info',
                parseHTML: element => {
                    // Get type from data attribute or class
                    const type = element.getAttribute('data-type');
                    console.log("parseHTML found type:", type);
                    return type || 'info';
                },
                renderHTML: attributes => {
                    // Nothing needed here, we'll handle this in the main renderHTML
                    return {};
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-callout]',
            },
            {
                tag: 'div.callout',
            },
        ];
    },

    renderHTML({ node }) {
        // Access the type directly from the node.attrs
        const type = node.attrs.type || 'info';
        console.log("Node type:", type);

        // Create final attributes with explicit class and data attributes
        const attrs = mergeAttributes(
            this.options.HTMLAttributes,
            {
                'class': `callout callout-${type}`,
                'data-callout': 'true',
                'data-type': type,
                'style': `
                    position: relative !important;
                    padding: 1rem !important;
                    margin: 1rem 0 !important;
                    border-radius: 0.5rem !important;
                `,
            }
        );

        console.log("Final callout attributes:", attrs);

        return ['div', attrs, 0];
    },

    addCommands() {
        return {
            insertCallout: attributes => ({ commands }) => {
                console.log("insertCallout command called with:", attributes);
                return commands.insertContent({
                    type: this.name,
                    attrs: attributes,
                    content: [{ type: 'paragraph' }],
                });
            }
        };
    },

    addKeyboardShortcuts() {
        return {
            'Mod-Shift-c': () => {
                console.log("Keyboard shortcut triggered for callout");
                return this.editor.commands.insertCallout({ type: 'info' });
            },
        };
    },
});