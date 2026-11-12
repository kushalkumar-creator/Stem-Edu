/**
 * Offline Local Storage Management (P2-12.4, P2-12.5, P2-12.6)
 * Enables offline access to CBSE lessons, MCQ tests, and personal notes.
 */

const STORAGE_KEYS = {
  LESSONS: 'stem_offline_lessons',
  MCQS: 'stem_offline_mcqs',
  NOTES: 'stem_offline_notes',
  SYNC_QUEUE: 'stem_offline_sync_queue'
};

export const offlineStorage = {
  // --- Lessons ---
  saveLesson(lessonId, lessonData) {
    try {
      const all = this.getAllLessons();
      all[lessonId] = { ...lessonData, cachedAt: Date.now() };
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(all));
    } catch (e) {
      console.warn('Offline storage error:', e);
    }
  },

  getLesson(lessonId) {
    const all = this.getAllLessons();
    return all[lessonId] || null;
  },

  getAllLessons() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.LESSONS) || '{}');
    } catch {
      return {};
    }
  },

  // --- MCQs for Offline Practice Testing (P2-12.5) ---
  saveChapterMCQs(chapterId, questions) {
    try {
      const all = this.getAllMCQs();
      all[chapterId] = {
        chapterId,
        questions,
        cachedAt: Date.now()
      };
      localStorage.setItem(STORAGE_KEYS.MCQS, JSON.stringify(all));
    } catch (e) {
      console.warn('Error saving offline MCQs:', e);
    }
  },

  getChapterMCQs(chapterId) {
    const all = this.getAllMCQs();
    return all[chapterId]?.questions || null;
  },

  getAllMCQs() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.MCQS) || '{}');
    } catch {
      return {};
    }
  },

  // --- Offline Notes (P2-12.6) ---
  saveNoteLocally(note) {
    try {
      const notes = this.getAllLocalNotes();
      const existingIdx = notes.findIndex(n => n.id === note.id);
      if (existingIdx >= 0) {
        notes[existingIdx] = note;
      } else {
        notes.unshift(note);
      }
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.warn('Error saving local note:', e);
    }
  },

  getAllLocalNotes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES) || '[]');
    } catch {
      return [];
    }
  },

  // Check whether device is currently online
  isOnline() {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }
};

