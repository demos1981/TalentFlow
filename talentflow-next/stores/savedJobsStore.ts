import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SavedJobsStore {
  savedJobIds: string[];
  isSaved: (jobId: string) => boolean;
  toggleJob: (jobId: string) => void;
  removeJob: (jobId: string) => void;
  clearAll: () => void;
}

export const useSavedJobsStore = create<SavedJobsStore>()(
  persist(
    (set, get) => ({
      savedJobIds: [],
      
      isSaved: (jobId: string) => {
        return get().savedJobIds.includes(jobId);
      },
      
      toggleJob: (jobId: string) => {
        set((state) => {
          const isAlreadySaved = state.savedJobIds.includes(jobId);
          
          if (isAlreadySaved) {
            // Видаляємо вакансію
            return {
              savedJobIds: state.savedJobIds.filter(id => id !== jobId)
            };
          } else {
            // Додаємо вакансію
            return {
              savedJobIds: [...state.savedJobIds, jobId]
            };
          }
        });
      },
      
      removeJob: (jobId: string) => {
        set((state) => ({
          savedJobIds: state.savedJobIds.filter(id => id !== jobId)
        }));
      },
      
      clearAll: () => {
        set({
          savedJobIds: []
        });
      }
    }),
    {
      name: 'saved-jobs-storage',
    }
  )
);

// Selector для count
export const useSavedJobsCount = () => useSavedJobsStore((state) => state.savedJobIds.length);
