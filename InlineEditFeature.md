Link to demo video: https://drive.google.com/file/d/1FOuIVU1hzo0pmzlMNLorO_zwwRUO-z5C/view?usp=sharing
# AI-Enabled Inline Edits - Design Document

## 1. Executive Summary

This document outlines the implementation of AI-powered inline text editing in a Tiptap-based rich text editor. The feature allows users to select text, provide natural language instructions for desired modifications, and view/accept AI-generated changes with an intuitive diff view.

## 2. High-Level Design (HLD)

### 2.1 Feature Overview

The AI-enabled inline edit feature consists of four primary phases:

1. **Selection & Instruction**: User selects text and provides modification instructions
2. **AI Processing**: Selected text is processed by an LLM based on user instructions
3. **Diff Visualization**: Original and modified text are compared to generate a visual diff
4. **Review & Confirmation**: User reviews the proposed changes and accepts or rejects them

### 2.2 Core Components

1. **Selection Manager**: Handles text selection state and coordinates with ProseMirror's selection system
2. **AI Interface Component**: Floating UI for collecting user instructions
3. **LLM Integration Service**: Manages communication with the OpenAI API
4. **Diff Engine**: Compares original and modified text to generate structured diff data

### 2.3 User Experience Flow

1. User selects text in editor and activates feature (via keyboard shortcut Cmd/Ctrl+Shift+E)
2. Floating interface appears near selection, requesting modification instructions
3. User inputs instructions and submits
4. Loading indicator shown while processing
5. Diff view appears with additions and deletions highlighted
6. User can accept all changes or reject all changes
7. On acceptance, changes are applied to the document

### 2.4 Major Technical Challenges

1. **Structure Preservation**: Maintaining document structure when applying changes
2. **Error Handling**: Gracefully managing LLM failures or invalid responses
3. **Performance Optimization**: Ensuring smooth operation for large documents

## 3. Low-Level Design (LLD)

### 3.1 ProseMirror & Tiptap Integration

#### 3.1.1 Key ProseMirror Primitives Used

1. **Transactions**: For modifying document state
   - Transaction API for batching multiple edits
   - `tr.replaceWith()` for replacing content

2. **Selection**: For handling text selection
   - `TextSelection` for regular text selection

#### 3.1.2 Tiptap Integration Points

1. **Extensions**: Creating a custom extension for AI editing
   - Extension lifecycle hooks
   - Command registration
   - Keyboard shortcut handling

2. **Commands**: For editor operations
   - Custom commands for triggering AI edits
   - Commands for accepting/rejecting changes

3. **Plugin System**: For state management
   - ProseMirror plugin for tracking edit state

### 3.2 Core Module Specifications

#### 3.2.1 Selection Manager

**Responsibilities:**
- Track user selection state
- Validate if selection can be processed

**Key Methods:**
- `getCurrentSelection()`: Get current selection details
- `isValidSelection()`: Validate if selection can be processed

#### 3.2.2 AI Interface Component

**Responsibilities:**
- Display floating UI for user instructions
- Show loading state during processing
- Present error messages if failures occur
- Provide accept/reject controls

**Key Features:**
- Positioning based on selection coordinates
- Input field for instructions
- Progress indicator
- Error handling and display
- Action buttons

#### 3.2.3 LLM Integration Service

**Responsibilities:**
- Interface with OpenAI API
- Handle authentication
- Process text and instructions
- Format and validate LLM responses

**Key Methods:**
- `processEdit(text, instructions)`: Send text and instructions to OpenAI
- `validateResponse(response)`: Ensure response meets requirements
- `formatPrompt(text, instructions)`: Create effective LLM prompt

#### 3.2.4 Diff Engine

**Responsibilities:**
- Compare original and modified text
- Generate structured diff representation
- Handle special characters and whitespace

**Key Methods:**
- `computeDiff(original, modified)`: Generate diff between texts
- `normalizeDiff(diff)`: Clean up and normalize diff output

### 3.3 Edge Case Handling

#### 3.3.1 Error Handling

For API errors or invalid responses:
- Display user-friendly error messages
- Allow users to retry or cancel the operation
- Preserve the original text if errors occur

## 4. Implementation Phases

### 4.1 Phase 1: Core Selection & UI

1. Implement selection manager
2. Create floating UI component
3. Add keyboard shortcut activation
4. Implement basic state management

**Dependencies:**
- Tiptap editor instance
- ProseMirror selection API
- React UI framework

### 4.2 Phase 2: LLM Integration

1. Set up OpenAI API integration
2. Implement prompt formatting
3. Add error handling
4. Create response parser

**Dependencies:**
- OpenAI API credentials
- Network request handling

### 4.3 Phase 3: Diff Implementation

1. Implement diff algorithm using the 'diff' library
2. Create diff visualization component
3. Add CSS for diff visualization

**Dependencies:**
- Diff algorithm (diff library)
- React component system

### 4.4 Phase 4: Change Application

1. Implement text replacement
2. Add error handling and recovery

**Dependencies:**
- ProseMirror transaction API

## 5. Technical Considerations

### 5.1 Performance Considerations

1. **Debouncing & Throttling:**
   - Debounce selection changes
   - Throttle LLM requests

2. **Large Document Handling:**
   - Optimize transaction batching

3. **Memory Management:**
   - Clean up state after application
   - Handle response data efficiently

### 5.2 Security Considerations

1. **Input Validation:**
   - Sanitize user instructions before sending to LLM
   - Validate LLM responses before processing
   - Prevent markup injection via LLM responses

2. **API Key Security:**
   - Store API key in environment variables
   - Never expose API key in client-side code
   - Use server-side API routes to proxy requests

3. **Content Validation:**
   - Ensure modified content maintains document validity
   - Prevent structure corruption from invalid changes

### 5.3 Accessibility Considerations

1. **Keyboard Navigation:**
   - Full keyboard support for all actions
   - Focus management for floating UI
   - Clear keyboard shortcuts

2. **Screen Reader Support:**
   - Proper ARIA attributes for diff view
   - Descriptive announcements for state changes
   - Accessible instructions UI

3. **Visual Accessibility:**
   - High contrast diff visualization
   - Multiple visual cues (not just color-based)
   - Configurable UI positioning

## 6. Testing Strategy

### 6.1 Unit Testing

Focus areas:
1. Diff algorithm accuracy
2. Selection handling
3. Error handling

### 6.2 Integration Testing

Focus areas:
1. OpenAI API integration
2. UI interaction with editor state
3. Transaction application

### 6.3 End-to-End Testing

Focus areas:
1. Complete user flows
2. Cross-browser compatibility
3. Error recovery

## 7. API Specifications

### 7.1 OpenAI API Integration

**Endpoint Structure:**
```
POST /api/ai/edit
```

**Request Format:**
```json
{
  "text": "Original selected text",
  "instructions": "User modification instructions",
  "context": {
    "nodeType": "Type of current node"
  }
}
```

**Response Format:**
```json
{
  "modifiedText": "AI modified text result",
  "status": "success|error",
  "message": "Error message if applicable"
}
```

### 7.2 Editor Extension API

The extension exposes the following commands:

1. `editor.commands.triggerAIEdit()`: Activate AI edit on current selection
2. `editor.commands.acceptAIEdit()`: Accept proposed changes
3. `editor.commands.rejectAIEdit()`: Reject proposed changes

## 8. CSS Implementation Details

### 8.1 Diff View Styling

```css
/* Addition styling */
.ai-edit-addition {
  background-color: rgba(0, 255, 0, 0.2);
  text-decoration: underline;
  text-decoration-color: green;
  text-decoration-thickness: 2px;
}

/* Deletion styling */
.ai-edit-deletion {
  background-color: rgba(255, 0, 0, 0.2);
  text-decoration: line-through;
  text-decoration-color: red;
  text-decoration-thickness: 2px;
}

/* Processing state */
.ai-edit-processing {
  opacity: 0.7;
  cursor: wait;
}
```

### 8.2 Floating UI Styling

Key considerations:
1. Positioning based on selection coordinates
2. Responsive design for various viewport sizes
3. Accessible color contrast
4. Clear focus states
5. Transition animations

## 9. Implementation Risks & Mitigations

| Risk                                    | Impact | Likelihood | Mitigation                            |
| --------------------------------------- | ------ | ---------- | ------------------------------------- |
| LLM produces invalid content            | High   | Medium     | Implement validation and sanitization |
| Performance issues with large documents | High   | Medium     | Optimize transaction batching         |
| Rate limiting from LLM provider         | Medium | High       | Implement retry with backoff          |
| Browser compatibility issues            | Medium | Low        | Cross-browser testing                 |

## 10. References

1. ProseMirror Documentation: https://prosemirror.net/docs/
2. Tiptap Documentation: https://tiptap.dev/docs
3. diff Library: https://www.npmjs.com/package/diff
4. OpenAI API Documentation: https://platform.openai.com/docs/api-reference
