# 🎵 Discord x Spotify Presence 🎵


**Hesabınızın presence kısmını spotify dinliyor olarak istediğiniz şarkıyı dinliyor olarak gösterebilirsiniz.**

---

## ✨ Özellikler

- 🎧 **Sesli Kanala Bağlanma** — İstediğiniz sesli kanala otomatikmenm bağlanır.
- 🔊 **Sesli Kanal Kontrolü** — Eğer bağlanamaz veya sesten düşerse otomatik tekrar bağlanır.
- 🌐 **Website Arayüzü** — Gözükecek şarkıları düzenlemek eklemek silmek için website arayüzü.
- 📋 **Kuyruk Sistemi** — Şarkıları sıraya ekleyip yönetme
- ⚡ **Düşük Gecikme** — Optimize edilmiş performans

---

## 🚀 Kurulum

### 📋 Gereksinimler

- [Node.js](https://nodejs.org/) (v16 veya üstü)
- Discord hesabınızın tokeni
- Spotify Developer Hesabı

### 📥 Adımlar

1. Repoyu klonlayın:
   ```bash
   git clone https://github.com/hasbutcu/spotify-presence.git
   cd spotify-presence
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. `settings.json` dosyasını düzenleyin (ayrıntılar aşağıda)

4. Botu başlatın:
   ```bash
   # Sadece bot için:
   npm start
   
   # Bot ve web arayüzü için:
   npm run server
   ```

---

## ⚙️ Yapılandırma

`settings.json` dosyasını aşağıdaki gibi düzenlemelisiniz:

Eğer Tek Hesap İçin İse:

```json
{
    "tokens": ["DISCORD_USER_TOKEN"],
    "channels": ["VOICE_CHANNEL_ID"],
    "Client": "SPOTIFY_CLIENT_ID",
    "Secret": "SPOTIFY_CLIENT_SECRET"
}
```

Birden Fazla Hesap İçin İse

```json
{
    "tokens": ["DISCORD_USER_TOKEN 1", "DISCORD_USER_TOKEN 2"],
    "channels": ["1.Tokenin Bağlanacağı Kanal", "2.Tokenin Bağlanacağı Kanal"],
    "Client": "SPOTIFY_CLIENT_ID",
    "Secret": "SPOTIFY_CLIENT_SECRET"
}
```

### 🤖 Kendi tokeninizi nasıl alırsınız

Adım adım talimatlar

1) Discord'u tarayıcıda açıyoruz.
2) Ctrl + Shift + C yapıyoruz açılan panelde "Console"' yazan yere tıklıyoruz.
3) Bu kodu yapıştırıyoruz.

```js
(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()
```

### 🔊 Discord Sesli Kanal ID'si Alma

Adım adım talimatlar

1. Discord'da Geliştirici Modunu açın:
   - Kullanıcı Ayarları > Gelişmiş > Geliştirici Modu
2. Botun bağlanmasını istediğiniz sesli kanala sağ tıklayın
3. "ID'yi Kopyala" seçeneğine tıklayın
4. Bu ID'yi `settings.json` dosyasındaki `"channels"` dizisine ekleyin



### 🎵 Spotify API Bilgileri Alma


Adım adım talimatlar

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)'a gidin ve giriş yapın
2. "Create An App" butonuna tıklayın
3. Uygulama adı ve açıklaması girin, "Create" butonuna tıklayın
4. Oluşturulan uygulamanın kontrol panelinde "Client ID" görünecektir
5. "Show Client Secret" butonuna tıklayarak Client Secret'ı görüntüleyin
6. "Edit Settings" butonuna tıklayın ve Redirect URI olarak `http://127.0.0.1:8888/` ekleyin
7. Bu bilgileri `settings.json` dosyasındaki ilgili alanlara ekleyin:
   - Client ID → `"Client"` alanına
   - Client Secret → `"Secret"` alanına

---

## Web Arayüzü


Bot web arayüzü ile çalıştırıldığında, `http://localhost:9999` adresinden kontrol paneline erişebilirsiniz.

## 📜 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

---


  
  **made with 💗 by oxy!**
