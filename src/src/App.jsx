import React from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import BottomPlayerBar from './components/BottomPlayerBar';
import NowPlayingModal from './components/NowPlayingModal';

// Ek sample home component jahan se aap gaana play karke test kar soco
function MainContent() {
  const { playSong } = usePlayer();

  const sampleSong = {
    id: '1',
    title: 'Celestial Dream',
    artist: 'Aura Music',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    lyrics: 'Looking at the stars above...\nFeeling the eternal rhythm of love...'
  };

  return (
    <div style={{ background: '#121212', color: '#fff', minHeight: '100vh', padding: '20px', paddingBottom: '100px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Celestial Sound 🌙</h1>
      <p style={{ color: '#b3b3b3', marginBottom: '20px' }}>Tap the track below to test the full-screen player and lyrics:</p>
      
      <div 
        onClick={() => playSong(sampleSong)}
        style={{
          background: '#181818', padding: '15px', borderRadius: '12px',
          display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer',
          border: '1px solid #282828'
        }}
      >
        <img src={sampleSong.coverUrl} alt="" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{sampleSong.title}</h3>
          <p style={{ margin: 0, color: '#b3b3b3', fontSize: '14px' }}>{sampleSong.artist}</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <MainContent />
      <BottomPlayerBar />
      <NowPlayingModal />
    </PlayerProvider>
  );
}
