import { useState, useEffect, useRef } from 'react';

export const useSpeechSynthesis = ({ language = 'mr', onEnd } = {}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(0.95); // Slightly slower for low-literacy clarity
  const [supported, setSupported] = useState(false);

  const utteranceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
    }
  }, []);

  const speak = (text) => {
    if (!supported || !text) return;

    window.speechSynthesis.cancel(); // Stop any previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Set language code
    const langCode = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.lang = langCode;
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    // Pick best available voice for language
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) => v.lang === langCode || v.lang.startsWith(language));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const pause = () => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resume = () => {
    if (!supported) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  return {
    speak,
    stop,
    pause,
    resume,
    isPlaying,
    isPaused,
    supported,
    playbackRate,
    setPlaybackRate,
  };
};
