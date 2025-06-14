const express = require('express');
const fs = require('fs');
const path = require('path');
let fetch;
(async () => {
  const fetchModule = await import('node-fetch');
  fetch = fetchModule.default;
})();

const config = require ('./settings.json')

const app = express();
const PORT = 9999;
const dataFile = path.join(process.cwd(), 'src','Spotify', 'Data.json');
const statusFile = path.join(process.cwd(), 'src', 'Databases', 'status.json');

const SPOTIFY_CLIENT_ID = config.Client
const SPOTIFY_CLIENT_SECRET = config.Secret
let spotifyToken = null;
let tokenExpiration = 0;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'src', 'public')));


const readStatus = () => {
  if (fs.existsSync(statusFile)) {
    try {
      return JSON.parse(fs.readFileSync(statusFile, 'utf-8')).started || false;
    } catch (error) {
      return false;
    }
  }
  return false;
};


const writeStatus = (started) => {
  fs.writeFileSync(statusFile, JSON.stringify({ started }, null, 2));
};

let isStarted = false;
writeStatus(isStarted);
async function getSpotifyToken() {
  if (spotifyToken && Date.now() < tokenExpiration) {
    return spotifyToken;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`Failed to get Spotify token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    spotifyToken = data.access_token;
    tokenExpiration = Date.now() + (data.expires_in - 60) * 1000; 
    return spotifyToken;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    throw error;
  }
}


async function getSpotifyTrackInfo(spotifyUrl) {
  try {
    const formattedUrl = spotifyUrl
      .replace('https://open.spotify.com/intl-tr', 'https://open.spotify.com')
      .split('?')[0];
    const parts = formattedUrl.split('/');
    const trackId = parts[parts.length - 1];
    const apiUrl = `https://api.spotify.com/v1/tracks/${trackId}`;

    const token = await getSpotifyToken();
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.id) {
      throw new Error('Invalid track data received from Spotify');
    }

    if (!data.artists || data.artists.length === 0) {
      throw new Error('No artists found in the response');
    }

    const result = {
      track: {
        album: {
          artists: data.artists.map(artist => ({
            external_urls: { spotify: artist.external_urls.spotify },
            href: artist.href,
            id: artist.id,
            name: artist.name,
            type: "artist",
            uri: artist.uri
          })),
          href: data.album.href,
          images: data.album.images,
          name: data.album.name,
          uri: data.album.uri
        },
        duration_ms: data.duration_ms,
        id: data.id,
        name: data.name
      }
    };

    return result;
  } catch (error) {
    console.error(`Error processing Spotify URL ${spotifyUrl}:`, error);
    throw error;
  }
}


const readData = () => {
  if (fs.existsSync(dataFile)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
      return parsed.items || [];
    } catch (error) {
      return [];
    }
  }
  return [];
};

const writeData = (songs) => {
  fs.writeFileSync(dataFile, JSON.stringify({ items: songs }, null, 2));
};


app.get('/songs', (req, res) => {
  const songs = readData();
  res.json(songs);
});


app.post('/songs', (req, res) => {
  const newSong = req.body;
  const songs = readData();
  songs.push(newSong);
  writeData(songs);
  res.json({ message: 'Song added', songs });
});


app.post('/songs/links', async (req, res) => {
  const { links } = req.body;
  if (!links) {
    return res.status(400).json({ error: 'No links provided' });
  }

  const linksArray = links.split(/[\n,]+/).map(l => l.trim()).filter(l => l.length > 0);
  let newSongs = [];
  let errors = [];

  for (const link of linksArray) {
    try {
      if (!link.includes('spotify.com') || !link.includes('/track/')) {
        errors.push({ link, error: 'Invalid Spotify track URL' });
        continue;
      }

      const songData = await getSpotifyTrackInfo(link);
      newSongs.push(songData);
    } catch (error) {
      errors.push({ link, error: error.message });
      console.error(`Error fetching song for link ${link}: ${error.message}`);
    }
  }

  let songs = readData();
  songs = songs.concat(newSongs);
  writeData(songs);

  res.json({
    message: `Added ${newSongs.length} songs${errors.length > 0 ? ` with ${errors.length} errors` : ''}`,
    added: newSongs,
    errors: errors
  });
});


app.delete('/songs/:id', (req, res) => {
  const songId = req.params.id;
  let songs = readData();
  songs = songs.filter(song => song.track && song.track.id !== songId);
  writeData(songs);
  res.json({ message: 'Song deleted', songs });
});


app.put('/songs/:id', (req, res) => {
  const songId = req.params.id;
  const updatedSong = req.body;
  let songs = readData();
  songs = songs.map(song => {
    if (song.track && song.track.id === songId) {
      return updatedSong;
    }
    return song;
  });
  writeData(songs);
  res.json({ message: 'Song updated', songs });
});


app.post('/restart', (req, res) => {
  console.log('Sistem Baslatiliyor...');
  res.json({ message: 'Sistem yeniden başlatılıyor' });

  setTimeout(() => {
    try {
      const indexPath = path.join(process.cwd(), 'index.js');
      if (require.cache[indexPath]) {
        delete require.cache[indexPath];
      }
      require('./index.js');
      console.log('index.js başlatıldı');
    } catch (error) {
      console.error('index.js yeniden yüklenirken hata oluştu:', error);
    }
  }, 2000);
});


app.get('/status', (req, res) => {
  res.json({ started: isStarted });
});

app.post('/start-button', (req, res) => {
  isStarted = true;
  writeStatus(isStarted);
  
  console.log('Sistem Baslatiliyor...');
  
  setTimeout(() => {
    console.log('Sistem yeniden başlatılıyor! index.js yeniden çalıştırılacak...');

    try {
      const indexPath = path.join(process.cwd(), 'index.js');
      if (require.cache[indexPath]) {
        delete require.cache[indexPath];
      }
      require('./index.js');
      console.log('index.js başarıyla yeniden yüklendi');
    } catch (error) {
      console.error('index.js yeniden yüklenirken hata oluştu:', error);
    }
  }, 2000);
  
  res.json({ success: true, message: 'Başlatıldı' });
});

app.listen(PORT, () => {
  console.log(`Sunucu şurda çalıştırılıyor: http://localhost:${PORT}`);
});