import React from 'react';
import { usePlayer } from '../context/PlayerContext';

export default function BottomPlayerBar() {
  const { currentSong, isPlaying, togglePlay, setIsNowPlayingOpen } = usePlayer();

  if (!currentSong) return null;

  return (
    <div 
      onClick={() => setIsNowPlayingOpen(true)}
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#181818', borderTop: '1px solid #282828',
        padding: '10px 16px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', zIndex: 999, cursor: 'pointer',
        color: '#fff'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img 
          src={currentSong.coverUrl || 'https://via.placeholder.com/50'} 
          alt={currentSong.title} 
          style={{ width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover' }}
        />
        <div>
          <h4 style={{ fontSize: '14px', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
            {currentSong.title}
          </h4>
          <p style={{ fontSize: '12px', color: '#b3b3b3', margin: 0 }}>{currentSong.artist}</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={togglePlay}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>
    </div>
  );
}
