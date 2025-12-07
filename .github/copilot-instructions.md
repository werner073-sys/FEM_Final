# GitHub Copilot Instructions for FEM

## Project Overview

FEM is an elegant, soft, and bio-luminescent women's health companion built as a Google AI Studio app. The application features:
- Cycle tracking with visual lunar dial representation
- Pregnancy visualization mode
- AI-powered health guidance (The Sage)
- Partner synchronization features
- Safety mode with emergency features
- Symptom logging and tracking

## Tech Stack

- **Framework**: React 19.2.1 with TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **AI Integration**: Google Generative AI (@google/genai)
- **UI**: Lucide React icons, custom Tailwind CSS styling
- **Module System**: ES Modules

## Project Structure

```
/
├── .github/              # GitHub configuration and workflows
├── components/           # React components
│   ├── LunarDial.tsx    # Cycle visualization
│   ├── WombView.tsx     # Pregnancy visualization
│   ├── TheSage.tsx      # AI chat interface
│   ├── PartnerSync.tsx  # Partner features
│   └── SafetyMode.tsx   # Safety and emergency features
├── services/            # Service layer
│   └── geminiService.ts # Google Gemini AI integration
├── App.tsx              # Main application component
├── index.tsx            # Application entry point
├── types.ts             # TypeScript type definitions
├── metadata.json        # AI Studio app metadata
└── vite.config.ts       # Vite configuration
```

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Code Style and Conventions

### TypeScript

- Use TypeScript for all code files
- Define interfaces and types in `types.ts` or colocate with components when specific to that component
- Use enums for fixed sets of values (e.g., `AppMode`, `View`)
- Enable strict type checking
- Use React.FC for functional components with explicit prop types

### React Components

- Use functional components with hooks
- Use React 19.2.1 features
- Define prop interfaces with clear, descriptive names
- Export components as default exports
- Use descriptive variable names (e.g., `currentDay`, `loggedSymptoms`)

### File Organization

- One component per file
- Component files use PascalCase (e.g., `LunarDial.tsx`)
- Service files use camelCase (e.g., `geminiService.ts`)
- Type definitions go in `types.ts`

### Styling

- Use Tailwind CSS utility classes for styling
- Custom colors follow the bio-luminescent, soft aesthetic:
  - `lumina-rose` for primary accent (soft pink/rose)
  - `lumina-soft` for text
  - `lumina-highlight` for emphasis
  - Pastel colors for cycle phases (pink, lilac, gold, blue)
- Use `className` prop for styling
- Prefer inline styles only for dynamic positioning (e.g., animations, transforms)

### API Integration

- All AI calls go through `services/geminiService.ts`
- Use environment variable `GEMINI_API_KEY` for API key (loaded as `process.env.API_KEY` in Vite)
- Three model tiers:
  - `MODEL_FAST`: Quick responses for insights
  - `MODEL_SMART`: Conversational AI (The Sage)
  - `MODEL_VISION`: Image analysis
- Always handle errors gracefully with fallback messages
- Use streaming for chat responses (`streamChatResponse`)

### State Management

- Use React hooks (useState, useEffect) for state
- Keep state close to where it's used
- Use descriptive state variable names
- Avoid prop drilling; pass only necessary props

### Error Handling

- Log errors to console with descriptive messages
- Provide user-friendly fallback messages
- Never expose API keys or sensitive data in error messages
- Gracefully degrade when API is unavailable

### AI Studio App Requirements

- The `index.html` must include a module script tag to load the entry point (required for emulator)
- Define permissions in `metadata.json` (camera, microphone, geolocation)
- App name and description in `metadata.json`

## Specific Guidelines

### When Adding New Features

1. Consider the soft, bio-luminescent aesthetic
2. Maintain the supportive, gentle tone in all user-facing text
3. Ensure mobile responsiveness
4. Add appropriate TypeScript types
5. Handle loading and error states

### When Working with AI Features

1. Use appropriate model tier (Fast/Smart/Vision)
2. Craft prompts that maintain "The Sage" persona: wise, comforting, medically grounded
3. Always include fallback responses
4. Never promise medical diagnosis; suggest consulting healthcare providers
5. Keep responses concise but warm

### When Modifying Components

1. Maintain existing animation and transition patterns
2. Use consistent spacing and layout patterns
3. Preserve accessibility features
4. Keep components focused and single-responsibility
5. Update types.ts if adding new data structures

### Testing and Validation

- Build the project before committing: `npm run build`
- Test in development mode: `npm run dev`
- Verify no TypeScript errors
- Test with and without API key to ensure graceful degradation

## Environment Setup

Required environment variables:
- `GEMINI_API_KEY`: Google Gemini API key (set in `.env.local`)

The Vite config maps this to `process.env.API_KEY` and `process.env.GEMINI_API_KEY` for compatibility.

## Important Notes

- This is a sensitive health application; maintain privacy and security standards
- Never log or expose personal health data
- Follow HIPAA-conscious practices even if not formally required
- Maintain the gentle, supportive tone throughout the application
- Emergency features (Safety Mode) should be thoroughly tested
- Always consider the emotional state of users when designing features
# GitHub Copilot Instructions for FEM (Elegant Health)

## Project Overview
FEM is a Google AI Studio app - an elegant, bio-luminescent themed women's health tracking application built with React, TypeScript, and Vite. The app features menstrual cycle tracking, pregnancy mode, AI-powered health insights using Gemini API, and safety features.

## Key Technologies
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **AI Integration**: Google Gemini API (@google/genai)
- **Icons**: Lucide React
- **Deployment**: Google AI Studio

## Code Style and Conventions

### React Components
- Use functional components with `React.FC` type annotation
- Define prop interfaces explicitly above component declarations
- Example:
  ```typescript
  interface ComponentProps {
    prop1: string;
    prop2: number;
  }
  
  const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
    // implementation
  };
  ```

### Design Principles
- Maintain a soft, bio-luminescent aesthetic with pastel colors
- Use the lumina color palette defined in index.html:
  - `lumina-base`: #FFF5F7 (background)
  - `lumina-highlight`: #4A4058 (primary text)
  - `lumina-rose`: #FFB7C5 (accents)
  - `lumina-gold`: #FDF2C6, `lumina-mint`: #D2F5E3, `lumina-lavender`: #E0BBE4
- Keep tone gentle, supportive, and compassionate in all user-facing content

### TypeScript
- Use explicit types for all function parameters and return values
- Define interfaces in types.ts for shared types
- Use enums for fixed sets of values (AppMode, View, etc.)

### Styling
- Use Tailwind CSS utility classes
- Follow the pastel, glass-morphism design pattern with `.glass-panel` classes
- Prefer `font-serif` for headers and elegant text, `font-sans` for body text

### AI Integration
- API key is configured via `GEMINI_API_KEY` environment variable
- Mapped to `process.env.API_KEY` in vite.config.ts
- Three models available in geminiService.ts:
  - `MODEL_FAST`: gemini-flash-lite-latest (quick responses)
  - `MODEL_SMART`: gemini-3-pro-preview (intelligent chat)
  - `MODEL_VISION`: gemini-3-pro-preview (image analysis)

### File Structure
- `/components`: React components (LunarDial, TheSage, WombView, etc.)
- `/services`: API services (geminiService.ts)
- `/types.ts`: Shared TypeScript interfaces and enums
- `App.tsx`: Main application component with routing and state
- `index.html`: Entry point with Tailwind config and AI Studio importmap

## Development Workflow

### Running the App
```bash
npm install          # Install dependencies
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Environment Setup
Create a `.env.local` file with:
```
GEMINI_API_KEY=your_api_key_here
```

### Google AI Studio Requirements
- This is a Google AI Studio app
- index.html MUST include a module script tag loading the entry point (`<script type="module" src="/index.tsx"></script>`)
- Uses importmap for AI Studio CDN dependencies
- metadata.json configures AI Studio permissions

## Common Patterns

### State Management
- Use React hooks (useState, useEffect) for component state
- Lift state up to App.tsx for shared state
- Example from App.tsx:
  ```typescript
  const [currentDay, setCurrentDay] = useState(8);
  const [loggedSymptoms, setLoggedSymptoms] = useState<Symptom[]>([]);
  ```

### AI Service Calls
- Always wrap in try-catch blocks
- Provide fallback messages on error
- Show loading states to users ("Consulting the stars...")
- Example:
  ```typescript
  try {
    const response = await ai.models.generateContent({...});
    return response.text || fallbackMessage;
  } catch (error) {
    console.error("Error:", error);
    return fallbackMessage;
  }
  ```

### Drag and Drop Pattern
- See App.tsx for symptom logging drag-and-drop implementation
- Use React's onDragStart, onDragOver, onDrop events
- Store data in e.dataTransfer.setData/getData

## Testing and Quality
- Test all changes with `npm run dev`
- Verify build with `npm run build`
- Ensure mobile responsiveness (responsive design is critical)
- Test AI features with valid API key
- Verify accessibility (ARIA labels, keyboard navigation)

## Safety and Privacy
- Never commit API keys to source control
- Use environment variables for sensitive data
- Follow HIPAA-like privacy practices for health data
- Implement SafetyMode features responsibly

## Best Practices for Changes
1. Maintain the gentle, supportive tone in all user-facing text
2. Keep the pastel aesthetic consistent
3. Test AI integrations thoroughly
4. Ensure mobile-first responsive design
5. Add appropriate TypeScript types for new features
6. Follow existing component patterns
7. Keep accessibility in mind (screen readers, keyboard nav)
8. Document new environment variables or config changes

## Troubleshooting
- If build fails: Check TypeScript errors, ensure all imports are correct
- If AI features fail: Verify GEMINI_API_KEY is set in .env.local
- If styles break: Check Tailwind classes, verify lumina color usage
- If emulator doesn't work: Ensure index.html has module script tag

## Additional Resources
- React 19 docs: https://react.dev/
- Vite docs: https://vitejs.dev/
- Google Gemini API: https://ai.google.dev/
- Tailwind CSS: https://tailwindcss.com/
