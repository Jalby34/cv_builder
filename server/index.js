import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
});

// Helper function to call OpenAI
async function callOpenAI(systemPrompt, userPrompt, temperature = 0.7) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Error:', error);
    throw error;
  }
}

// Generate quick build questions
app.post('/api/ai/quick-questions', async (req, res) => {
  try {
    const { targetRole } = req.body;

    const systemPrompt = `You are an expert career coach and CV builder. Generate intelligent, targeted questions to help create a professional CV.`;

    const userPrompt = `Generate 8-10 specific questions to build a CV${
      targetRole ? ` for a ${targetRole} role` : ''
    }. Questions should help uncover achievements, skills, and experience. Return as JSON array of strings.`;

    const response = await callOpenAI(systemPrompt, userPrompt);
    const questions = JSON.parse(response);

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

// Generate follow-up question
app.post('/api/ai/follow-up', async (req, res) => {
  try {
    const { question, answer, context } = req.body;

    const systemPrompt = `You are an AI career coach. Based on the user's answer, determine if a follow-up question would help get more specific, measurable information. If yes, generate ONE concise follow-up question. If the answer is already detailed enough, return null.`;

    const userPrompt = `Question: "${question}"
Answer: "${answer}"

Previous context: ${JSON.stringify(context)}

Should we ask a follow-up? If yes, what specific follow-up question would help maximize their job prospects? Focus on achievements, metrics, or portfolio items they might have forgotten. Return just the question text or null.`;

    const response = await callOpenAI(systemPrompt, userPrompt, 0.8);

    if (response.toLowerCase().includes('null') || response.toLowerCase().includes('no follow-up')) {
      res.json(null);
    } else {
      res.json(response.replace(/^["']|["']$/g, ''));
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate follow-up' });
  }
});

// Generate CV from answers
app.post('/api/ai/generate-cv', async (req, res) => {
  try {
    const { responses, targetRole } = req.body;

    const systemPrompt = `You are an expert CV writer. Create a professional, ATS-friendly CV based on the user's responses.

IMPORTANT RULES:
1. NEVER fabricate information, statistics, or achievements
2. Only use information explicitly provided by the user
3. If information is missing, use empty arrays or null
4. Structure output as valid JSON matching CVData type
5. Extract contact info, experiences, education, skills, and projects from responses
6. Write in third person, action-verb focused style
7. Highlight achievements with specific metrics when provided`;

    const userPrompt = `Create a CV for ${targetRole || 'a professional'} based on these responses:

${responses.map((r, i) => `Q${i + 1}: ${r.question}\nA: ${r.answer}${r.followUp ? `\nFollow-up: ${r.followUp}` : ''}`).join('\n\n')}

Return ONLY a valid JSON object matching this structure:
{
  "id": "unique-id",
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedIn": "",
    "portfolio": "",
    "github": "",
    "website": ""
  },
  "summary": "",
  "experiences": [],
  "education": [],
  "skills": [],
  "projects": [],
  "certifications": [],
  "languages": [],
  "createdAt": "",
  "updatedAt": ""
}

Extract information only from the provided responses. Do not invent details.`;

    const response = await callOpenAI(systemPrompt, userPrompt, 0.7);

    // Parse and validate JSON
    let cvData;
    try {
      cvData = JSON.parse(response);
      cvData.id = cvData.id || `cv-${Date.now()}`;
      cvData.createdAt = new Date().toISOString();
      cvData.updatedAt = new Date().toISOString();
    } catch (parseError) {
      throw new Error('Invalid JSON response from AI');
    }

    res.json(cvData);
  } catch (error) {
    console.error('Generate CV Error:', error);
    res.status(500).json({ error: 'Failed to generate CV' });
  }
});

// Suggest achievements
app.post('/api/ai/suggest-achievements', async (req, res) => {
  try {
    const { experienceDescription, role, company } = req.body;

    const systemPrompt = `You are a career coach specializing in achievement-focused CV writing. Based on a job description, suggest specific achievement statements using the STAR method (Situation, Task, Action, Result). Focus on measurable outcomes.`;

    const userPrompt = `Role: ${role} at ${company}
Description: ${experienceDescription}

Suggest 3-5 achievement bullet points that might be missing. Each should:
1. Start with a strong action verb
2. Include specific metrics or outcomes when possible
3. Highlight impact and value delivered
4. Be ATS-friendly

Return as JSON array of strings. Only suggest achievements that are realistic for this role - DO NOT fabricate specific numbers.`;

    const response = await callOpenAI(systemPrompt, userPrompt, 0.8);
    const achievements = JSON.parse(response);

    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to suggest achievements' });
  }
});

// Suggest skills
app.post('/api/ai/suggest-skills', async (req, res) => {
  try {
    const { currentSkills, targetRole, experiences } = req.body;

    const systemPrompt = `You are a career advisor specializing in skill development and CV optimization. Based on the target role and experience, suggest relevant, in-demand skills.`;

    const userPrompt = `Target Role: ${targetRole}
Current Skills: ${currentSkills.join(', ')}
Experience Summary: ${JSON.stringify(experiences)}

Suggest 5-10 additional skills that:
1. Are relevant to the target role
2. Are in high demand in the current job market
3. The candidate likely has based on their experience
4. Would make their CV more competitive

For each skill, provide:
- name: skill name
- reasoning: why this skill is valuable
- priority: 'high', 'medium', or 'low'

Return as JSON array of objects. DO NOT suggest skills they clearly don't have.`;

    const response = await callOpenAI(systemPrompt, userPrompt, 0.7);
    const suggestions = JSON.parse(response);

    res.json(suggestions.map((s, i) => ({
      id: `suggestion-${Date.now()}-${i}`,
      type: 'skill',
      section: 'skills',
      suggestion: s.name,
      reasoning: s.reasoning,
      priority: s.priority,
      accepted: false,
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to suggest skills' });
  }
});

// Improve section
app.post('/api/ai/improve-section', async (req, res) => {
  try {
    const { sectionType, content, context } = req.body;

    const systemPrompt = `You are a professional CV editor. Provide specific, actionable suggestions to improve CV sections for ATS compatibility and impact.`;

    const userPrompt = `Section Type: ${sectionType}
Current Content: ${content}
Context: ${JSON.stringify(context)}

Provide 3-5 specific improvements for this section. For each suggestion:
- Identify what to change
- Explain why it matters
- Provide the improved version
- Rate priority (high/medium/low)

Focus on:
1. ATS keywords
2. Action verbs
3. Measurable outcomes
4. Clarity and conciseness
5. Professional formatting

Return as JSON array with format:
[{
  "original": "text to replace",
  "suggestion": "improved text",
  "reasoning": "why this is better",
  "priority": "high|medium|low"
}]`;

    const response = await callOpenAI(systemPrompt, userPrompt, 0.7);
    const improvements = JSON.parse(response);

    res.json(improvements.map((imp, i) => ({
      id: `improvement-${Date.now()}-${i}`,
      type: 'improvement',
      section: sectionType,
      original: imp.original,
      suggestion: imp.suggestion,
      reasoning: imp.reasoning,
      priority: imp.priority,
      accepted: false,
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to improve section' });
  }
});

// Analyze ATS compatibility
app.post('/api/ai/analyze-ats', async (req, res) => {
  try {
    const { cv } = req.body;

    const systemPrompt = `You are an ATS (Applicant Tracking System) expert. Analyze CVs for ATS compatibility and provide actionable feedback.`;

    const userPrompt = `Analyze this CV for ATS compatibility:

${JSON.stringify(cv, null, 2)}

Provide:
1. Overall score (0-100)
2. Critical issues that would cause ATS to reject
3. Warnings that might lower ranking
4. Strengths that help ATS parsing
5. Specific recommendations

Return as JSON:
{
  "score": number,
  "maxScore": 100,
  "percentage": number,
  "issues": [{"type": "critical|warning|info", "message": "", "section": ""}],
  "strengths": [""],
  "recommendations": [""]
}`;

    const response = await callOpenAI(systemPrompt, userPrompt, 0.5);
    const analysis = JSON.parse(response);

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze ATS compatibility' });
  }
});

// Suggest portfolio items
app.post('/api/ai/suggest-portfolio', async (req, res) => {
  try {
    const { experiences, projects } = req.body;

    const systemPrompt = `You are a career coach. Based on experience and projects, suggest portfolio items or work samples that job seekers often forget to mention.`;

    const userPrompt = `Experiences: ${JSON.stringify(experiences)}
Projects: ${JSON.stringify(projects)}

Suggest portfolio items they might have forgotten, such as:
- Presentations or talks
- Open source contributions
- Blog posts or articles
- Certifications or courses
- Awards or recognition
- Case studies
- Design work
- Research papers

Return as JSON array of strings with specific suggestions based on their background.`;

    const response = await callOpenAI(systemPrompt, userPrompt, 0.8);
    const suggestions = JSON.parse(response);

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to suggest portfolio items' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 AI CV Builder API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
