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
