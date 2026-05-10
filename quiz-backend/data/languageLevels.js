/**
 * This file defines learning levels per language.
 * Each level focuses on a SMALL set of words (Duolingo-style).
 * These words are reused across multiple games until mastery.
 */

module.exports = {
  German: {
    1: {
      focusWords: ['ich', 'bin', 'ein', 'Student'],
      sentences: [
        'ich bin ein Student'
      ]
    },
    2: {
      focusWords: ['du', 'bist', 'ein', 'Lehrer'],
      sentences: [
        'du bist ein Lehrer'
      ]
    },
    3: {
      focusWords: ['er', 'ist', 'ein', 'Arzt'],
      sentences: [
        'er ist ein Arzt'
      ]
    }
  },

  Spanish: {
    1: {
      focusWords: ['yo', 'soy', 'un', 'estudiante'],
      sentences: [
        'yo soy un estudiante'
      ]
    },
    2: {
      focusWords: ['tu', 'eres', 'un', 'profesor'],
      sentences: [
        'tu eres un profesor'
      ]
    }
  }
};
