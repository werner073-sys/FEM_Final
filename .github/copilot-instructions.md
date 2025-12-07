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
