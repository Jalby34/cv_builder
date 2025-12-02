# AI CV Builder & Customizer

An intelligent, ATS-friendly CV builder that helps job seekers create professional resumes with AI-powered suggestions and human-in-the-loop validation.

## Features

### 🚀 Multiple Creation Paths
- **Quick AI Build**: Answer 5-10 targeted questions for a fast CV generation
- **Detailed Builder**: Step-by-step guided creation with comprehensive AI assistance
- **LinkedIn Import**: Import and enhance your LinkedIn profile

### 🎨 CV Customizer
- Edit and refine existing CVs
- AI-powered suggestions for improvements
- Real-time ATS compatibility scoring

### 💼 Smart Features
- **Achievement Prompts**: Helps users remember and articulate their accomplishments
- **Portfolio Integration**: Prompts for work samples and projects
- **Skill Recommendations**: Suggests relevant, in-demand skills for target roles
- **Human-in-the-Loop**: All AI suggestions require user validation
- **No Fabrication**: Ethical AI that doesn't invent experience or stats

### 🎯 Job Matching
- Find relevant job postings
- Match your CV to job requirements
- Optimize CV for specific positions

### 📄 ATS-Friendly Templates
- Multiple professional templates
- Optimized for Applicant Tracking Systems
- Clean, parseable formatting

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Node.js + Express
- **AI**: OpenAI API
- **PDF Generation**: @react-pdf/renderer
- **State Management**: Zustand

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cv_builder
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_API_URL=http://localhost:3001
```

4. Run development server:
```bash
# Frontend (port 5173)
npm run dev

# Backend (port 3001)
npm run server
```

5. Open http://localhost:5173

## Project Structure

```
cv_builder/
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── services/        # API and AI services
│   ├── store/           # State management
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── templates/       # CV templates
├── server/              # Backend API
├── public/              # Static assets
└── package.json
```

## Key Principles

1. **Accuracy First**: Never fabricate information or statistics
2. **Human Control**: All AI suggestions require user approval
3. **ATS Optimization**: Ensure all CVs are ATS-friendly
4. **Guided Experience**: Ask the right questions to maximize success
5. **Achievement Focus**: Help users identify and articulate accomplishments

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details
