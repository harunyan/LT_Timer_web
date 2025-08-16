import React from 'react';

interface AudioPlayerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  srcFile: string;
  fallbackSrcFile: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioRef, srcFile, fallbackSrcFile }) => {
  const baseUrl = import.meta.env.BASE_URL;
  const primarySrc = srcFile ? baseUrl + srcFile : '';
  const fallbackSrc = fallbackSrcFile ? baseUrl + fallbackSrcFile : '';

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const audio = e.currentTarget;
    if (audio.src !== fallbackSrc && fallbackSrc) { // Prevent infinite loop and ensure fallback exists
      audio.src = fallbackSrc;
    }
  };

  return (
    <audio
      ref={audioRef}
      src={primarySrc}
      preload="auto"
      onError={handleAudioError}
    ></audio>
  );
};

export default AudioPlayer;
