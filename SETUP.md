# AI CV Builder - Setup Guide

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your OpenAI API key:

```
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
VITE_API_URL=http://localhost:3001
PORT=3001
```

**Get your OpenAI API key:**
- Go to https://platform.openai.com/api-keys
- Create a new secret key
- Copy and paste it into your `.env` file

### 3. Run the Application

You'll need two terminal windows:

**Terminal 1 - Frontend:**
```bash
npm run dev
```
This starts the React app on http://localhost:5173

**Terminal 2 - Backend:**
```bash
npm run server
```
This starts the AI API server on http://localhost:3001

### 4. Open the App

Navigate to http://localhost:5173 in your browser

## Features Guide

### 1. Quick AI Build (Recommended for First-Time Users)
- Answer 5-10 targeted questions
- AI follows up on important points
- Generates complete CV in under 5 minutes
- Perfect for getting started quickly

### 2. Detailed Builder
- Step-by-step guided process
- AI suggests achievements you might have forgotten
- Includes portfolio prompts
- Full control over every section
- Best for comprehensive CVs

### 3. LinkedIn Import
- Import your LinkedIn data
- AI enhances and restructures
- Adds ATS optimization
- Suggests improvements

### 4. CV Customizer
- **Human-in-the-Loop Validation**: All AI suggestions require your approval
- Real-time ATS compatibility scoring
- Section-specific improvements
- Skill recommendations based on target role
- Portfolio item suggestions
- Accept or reject each suggestion individually

### 5. Job Finder (Coming Soon)
- Match CV to job postings
- Identify skill gaps
- Optimize CV for specific roles

## Key Principles

### 1. No Fabrication
The AI **never** invents:
- Statistics or metrics
- Job experiences
- Skills you don't have
- Achievements you didn't accomplish

It only works with information you provide.

### 2. Human-in-the-Loop
Every AI suggestion requires your approval:
- ✅ Accept suggestions you agree with
- ❌ Reject suggestions that don't fit
- You have complete control

### 3. ATS Optimization
All CVs are optimized for Applicant Tracking Systems:
- Clean, parseable formatting
- Keyword optimization
- Standard section headings
- Professional structure

### 4. Achievement Focus
The AI helps you remember and articulate:
- Career accomplishments
- Project impacts
- Portfolio items
- Measurable results

## Architecture

```
cv_builder/
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/            # Main application pages
│   │   ├── LandingPage.tsx
│   │   ├── QuickBuild.tsx
│   │   ├── DetailedBuilder.tsx
│   │   ├── CVCustomizer.tsx
│   │   ├── LinkedInImport.tsx
│   │   └── JobFinder.tsx
│   ├── services/         # API and AI services
│   │   └── aiService.ts
│   ├── store/           # Zustand state management
│   │   └── cvStore.ts
│   ├── types/           # TypeScript type definitions
│   │   └── cv.ts
│   └── App.tsx          # Main app with routing
├── server/              # Backend API
│   └── index.js        # Express server with OpenAI
└── package.json
```

## API Endpoints

The backend provides these AI-powered endpoints:

- `POST /api/ai/quick-questions` - Generate intelligent questions
- `POST /api/ai/follow-up` - Generate follow-up questions
- `POST /api/ai/generate-cv` - Create CV from answers
- `POST /api/ai/suggest-achievements` - Suggest achievement bullets
- `POST /api/ai/suggest-skills` - Recommend relevant skills
- `POST /api/ai/improve-section` - Improve CV sections
- `POST /api/ai/analyze-ats` - Analyze ATS compatibility
- `POST /api/ai/suggest-portfolio` - Suggest portfolio items

## Troubleshooting

### "Failed to generate CV"
- Check your OpenAI API key is correct
- Ensure you have credits on your OpenAI account
- Verify the backend server is running

### Backend won't start
- Check port 3001 is not in use: `lsof -i :3001`
- Verify `.env` file exists and has the API key

### Frontend won't start
- Check port 5173 is not in use
- Try `rm -rf node_modules && npm install`

### OpenAI API Errors
- Verify your API key is active
- Check you have sufficient credits
- Ensure you're using a valid model (GPT-4 or GPT-3.5-turbo)

## Cost Considerations

This application uses OpenAI's API:
- GPT-4: ~$0.01-0.05 per CV generation
- GPT-3.5-turbo: ~$0.001-0.01 per CV generation

To reduce costs during development:
- Edit `server/index.js` and change model from 'gpt-4' to 'gpt-3.5-turbo'
- Note: GPT-3.5 may provide lower quality suggestions

## Next Steps

1. **Try Quick Build**: Create your first CV in 5 minutes
2. **Use Customizer**: Review and improve with AI suggestions
3. **Accept/Reject**: Practice the human-in-the-loop workflow
4. **Export**: Download your ATS-optimized CV

## Development

### Adding New Features

1. **New CV Section**:
   - Add to `src/types/cv.ts`
   - Update `DetailedBuilder.tsx`
   - Add AI endpoint in `server/index.js`

2. **New AI Suggestion Type**:
   - Add to `AISuggestion` type
   - Update `CVCustomizer.tsx`
   - Implement in `aiService.ts`

3. **New Template**:
   - Create in `src/templates/`
   - Add to template selector

### Testing

```bash
# Frontend
npm run dev

# Backend
npm run server

# Build for production
npm run build
```

## Support

For issues or questions:
1. Check this setup guide
2. Review the main README.md
3. Check the console for error messages
4. Verify your OpenAI API key and credits

## License

MIT License - See LICENSE file
