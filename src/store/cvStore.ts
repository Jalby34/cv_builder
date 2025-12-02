import { create } from 'zustand';
import { CVData, AISuggestion, ATSScore } from '../types/cv';

interface CVStore {
  currentCV: CVData | null;
  suggestions: AISuggestion[];
  atsScore: ATSScore | null;
  isLoading: boolean;
  error: string | null;

  setCurrentCV: (cv: CVData) => void;
  updateCV: (updates: Partial<CVData>) => void;
  addSuggestion: (suggestion: AISuggestion) => void;
  acceptSuggestion: (suggestionId: string) => void;
  rejectSuggestion: (suggestionId: string) => void;
  setATSScore: (score: ATSScore) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetCV: () => void;
}

export const useCVStore = create<CVStore>((set) => ({
  currentCV: null,
  suggestions: [],
  atsScore: null,
  isLoading: false,
  error: null,

  setCurrentCV: (cv) => set({ currentCV: cv }),

  updateCV: (updates) =>
    set((state) => ({
      currentCV: state.currentCV
        ? { ...state.currentCV, ...updates, updatedAt: new Date().toISOString() }
        : null,
    })),

  addSuggestion: (suggestion) =>
    set((state) => ({
      suggestions: [...state.suggestions, suggestion],
    })),

  acceptSuggestion: (suggestionId) =>
    set((state) => ({
      suggestions: state.suggestions.map((s) =>
        s.id === suggestionId ? { ...s, accepted: true } : s
      ),
    })),

  rejectSuggestion: (suggestionId) =>
    set((state) => ({
      suggestions: state.suggestions.filter((s) => s.id !== suggestionId),
    })),

  setATSScore: (score) => set({ atsScore: score }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  resetCV: () => set({ currentCV: null, suggestions: [], atsScore: null, error: null }),
}));
