import React, { createContext, useContext, useState } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const toggleLike = (song) => {
    setLikedSongs((prev) => 
      prev.some(s => s.id === song.id) 
        ? prev.filter(s => s.id !== song.id) 
        : [...prev, song]
    );
  };

  return (
    <PlayerContext.Provider value={{
      currentSong, isPlaying, playSong, togglePlay,
      isNowPlayingOpen, setIsNowPlayingOpen,
      likedSongs, toggleLike
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
