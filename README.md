# Proteanics Editor

A rich text editor built with Next.js, React, TypeScript, and Tiptap. Features include a custom callout component and AI-powered editing capabilities.

## Features

- Rich text editing with Tiptap
- Custom callout component with four types:
  - Information
  - Best Practice
  - Warning
  - Error
- Support for nested callouts
- AI-powered text editing
- Keyboard shortcuts for common actions
- Dark mode support

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up your OpenAI API key:
   - Create a `.env.local` file in the root directory
   - Add your OpenAI API key: `OPENAI_API_KEY=your_api_key_here`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Keyboard Shortcuts

- **Mod+B**: Toggle bold
- **Mod+I**: Toggle italic
- **Mod+Shift+C**: Insert/toggle callout
- **Mod+Shift+E**: Trigger AI edit on selected text

## Callout Usage

Callouts can be added in two ways:
1. Using the keyboard shortcut **Mod+Shift+C**
2. Clicking the callout button in the toolbar and selecting a type

You can switch between callout types using the dropdown menu in the toolbar.

## AI Edit Feature

The AI Edit feature allows you to modify text using natural language instructions:

1. Select text in the editor
2. Press **Mod+Shift+E** to open the AI edit interface
3. Enter instructions for how you want to modify the text (e.g., "make this more formal", "fix grammar mistakes")
4. Review the proposed changes in the diff view
5. Accept or reject the changes

The AI Edit feature uses OpenAI's GPT-3.5-turbo model to generate text modifications based on your instructions.

## Implementation Details

The editor is built using:
- Next.js 14 with App Router
- Tiptap for rich text editing
- Tailwind CSS for styling
- Radix UI for accessible components
- OpenAI API for AI-powered editing

The callout implementation uses Tiptap's custom node extension system, allowing for:
- Nested content
- Type switching
- Custom styling
- Keyboard shortcuts

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
