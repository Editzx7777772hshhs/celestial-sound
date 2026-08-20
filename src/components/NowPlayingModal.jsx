import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';

export default function NowPlayingModal() {
  const { currentSong, isPlaying, togglePlay, isNowPlayingOpen, setIsNowPlayingOpen, likedSongs, toggleLike } = usePlayer();
  const [activeTab, setActiveTab] = useState('player'); // 'player' or 'lyrics'

  if (!isNowPlayingOpen || !currentSong) return null;

  const isLiked = likedSongs.some(s => s.id === currentSong.id);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#121212', zIndex: 1000,
      display: 'flex', flexDirection: 'column', color: '#fff', padding: '20px',
      overflowY: 'auto'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button 
          onClick={() => setIsNowPlayingOpen(false)}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}
        >
          ↓
        </button>
        <div style={{ display: 'flex', gap: '10px', background: '#282828', padding: '4px', borderRadius: '20px' }}>
          <button 
            onClick={() => setActiveTab('player')}
            style={{
              background: activeTab === 'player' ? '#fff' : 'transparent',
              color: activeTab === 'player' ? '#000' : '#fff',
              border: 'none', padding: '6px 16px', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            Player
          </button>
          <button 
            onClick={() => setActiveTab('lyrics')}
            style={{
              background: activeTab === 'lyrics' ? '#fff' : 'transparent',
              color: activeTab === 'lyrics' ? '#000' : '#fff',
              border: 'none', padding: '6px 16px', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            Lyrics
          </button>
        </div>
        <div style={{ width: '24px' }}></div> {/* Spacer */}
      </div>

      {activeTab === 'player' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center' }}>
          {/* Artwork */}
          <img 
            src={currentSong.coverUrl || 'https://via.placeholder.com/300'} 
            alt={currentSong.title} 
            style={{ width: '280px', height: '280px', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', marginBottom: '30px' }}
          />

          {/* Song Info & Like */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 10px' }}>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: '22px', margin: '0 0 5px 0' }}>{currentSong.title}</h2>
              <p style={{ color: '#b3b3b3', margin: 0, fontSize: '16px' }}>{currentSong.artist}</p>
            </div>
            <button 
              onClick={() => toggleLike(currentSong)}
              style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: isLiked ? '#1db954' : '#fff' }}
            >
              {isLiked ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Controls */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', marginTop: '20px' }}>
            <button 
              onClick={togglePlay}
              style={{ background: '#fff', border: 'none', width: '70px', height: '70px', borderRadius: '50%', fontSize: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
        </div>
      ) : (
        /* Lyrics Tab */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
          <h3 style={{ color: '#b3b3b3', marginBottom: '20px' }}>Live Lyrics</h3>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1db954', lineHeight: '1.6' }}>
            {currentSong.lyrics || "Synchronized lyrics coming soon for this track..."}
          </p>
        </div>
      )}
    </div>
  );
}
