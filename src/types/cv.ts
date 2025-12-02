export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  portfolio?: string;
  github?: string;
  website?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'other';
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  verified?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
  startDate: string;
  endDate?: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface CVData {
  id: string;
  personalInfo: PersonalInfo;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages?: { language: string; proficiency: string }[];
  customSections?: { title: string; content: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface AISuggestion {
  id: string;
  type: 'achievement' | 'skill' | 'improvement' | 'keyword' | 'format';
  section: string;
  original?: string;
  suggestion: string;
  reasoning: string;
  accepted?: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface ATSScore {
  score: number;
  maxScore: number;
  percentage: number;
  issues: {
    type: 'critical' | 'warning' | 'info';
    message: string;
    section?: string;
  }[];
  strengths: string[];
  recommendations: string[];
}

export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  url?: string;
  postedDate: string;
}

export type BuildMode = 'quick' | 'detailed' | 'linkedin';

export interface QuestionResponse {
  question: string;
  answer: string;
  followUp?: string;
}
