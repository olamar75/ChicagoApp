# Chicago Poängräknare 🎴

En mobilanpassad Progressive Web App (PWA) för att hålla koll på poängen i kortspelet Chicago. Kan installeras på mobilen och fungerar offline!

## 🌐 Live Demo

- **Vercel**: [https://chicago-app-lac.vercel.app](https://chicago-app-lac.vercel.app)
- **GitHub Pages**: [https://olamar75.github.io/ChicagoApp/](https://olamar75.github.io/ChicagoApp/)

## ✨ Funktioner

### Spelhantering
- ✅ Stöd för 2-4 spelare
- ✅ Anpassningsbara spelarnamn
- ✅ Automatisk växling till nästa spelare
- ✅ Visuell markering av aktiv spelare
- ✅ Vinnarskärm när någon når 52 poäng
- ✅ Ångra-funktion för att ta tillbaka senaste poängen
- ✅ Poänghistorik med fullständig matris över alla givar

### Poängsystem
- ✅ Snabbknappar för alla pokerhänder (1-8 poäng)
- ✅ Chicago +15 och -15 knappar
- ✅ Royal Flush specialknapp (52 poäng)
- ✅ Automatiskt köpstopp när spelare når >= 47 poäng
- ✅ Chicago-knappen inaktiveras när spelare har >= 32 poäng
- ✅ Byträknare med max 3 byten per giv

### PWA & Tekniska Funktioner
- ✅ Installeras som app på mobilen/surfplattan
- ✅ Fungerar offline med Service Worker
- ✅ Responsiv design för alla skärmstorlekar
- ✅ Optimerad för mobila enheter (ner till 320px bredd)
- ✅ Landskapsläge-stöd
- ✅ Ingen data skickas online - allt sparas lokalt

## 📱 Användning

### Första gången
1. Besök live-versionen eller öppna `index.html`
2. På mobilen: klicka på "Dela" → "Lägg till på hemskärmen" för att installera som app

### Spela
1. Välj antal spelare (2-4)
2. Ange spelarnamn (eller använd standardnamn: Spelare 1, 2, 3, 4)
3. Klicka på "Starta spel"
4. Klicka på en spelares kort för att välja hen som aktiv
5. Använd snabbknapparna för att lägga till poäng:
   - **Par** (1p), **Två par** (2p), **Triss** (3p)
   - **Stege** (4p), **Färg** (5p), **Kåk** (6p)
   - **Fyrtal** (7p), **Färgstege** (8p)
   - **Spelet** (5p)
   - **Chicago +15** eller **Chicago -15**
   - **Royal Flush** (52p direkt vinst)
6. Använd "+1 byte" för att räkna antal byten (max 3 per giv)
7. Klicka "Nästa giv" för att fortsätta till nästa runda
8. Klicka "📊 Historik" för att se fullständig poängmatris
9. Första spelaren som når 52 poäng vinner!

## 🎮 Spelregler

- **Köpstopp**: När en spelare når 47 poäng eller mer kan de inte få fler vanliga poäng (endast Chicago eller Royal Flush)
- **Chicago**: Kan endast tas av spelare med mindre än 32 poäng
- **Byten**: Max 3 byten per giv (räknaren återställs vid "Nästa giv")
- **Vinnare**: Första spelaren som når exakt 52 poäng vinner
- **Ångra**: Du kan alltid ångra den senaste poängen om du gjort fel

## 🔧 Teknisk information

### Arkitektur
- **Frontend**: Ren HTML5, CSS3 och vanilla JavaScript (ES6+)
- **PWA**: Implementerad med Service Worker och Web Manifest
- **Hosting**: Vercel (primär) + GitHub Pages (backup)
- **Ingen backend**: Allt körs i webbläsaren, data sparas lokalt

### PWA-funktioner
- **Service Worker** (`sw.js`): Cachar alla filer för offline-åtkomst
- **Web Manifest** (`manifest.json`): Möjliggör installation som app
- **Responsive**: Fungerar på alla enheter från 320px och uppåt
- **Offline-first**: Fungerar utan internetanslutning efter första besöket

### Browser-stöd
- ✅ Chrome/Edge (rekommenderad)
- ✅ Safari (iOS/macOS)
- ✅ Firefox
- ✅ Opera
- ✅ Alla moderna mobila browsers

### Projektfiler
- `index.html` - HTML-struktur och innehåll
- `styles.css` - CSS-styling med responsiv design
- `app.js` - Spellogik, state management och interaktivitet
- `sw.js` - Service Worker för offline-funktionalitet
- `manifest.json` - PWA manifest för installation
- `icon-192.png` & `icon-512.png` - App-ikoner

## 🚀 Deploy & Installation

### Lokal utveckling

1. **Klona repot**:
   ```bash
   git clone https://github.com/olamar75/ChicagoApp.git
   cd ChicagoApp
   ```

2. **Kör lokal server**:
   ```bash
   # Med Python
   python -m http.server 8000
   
   # Med Node.js
   npx serve
   
   # Med PHP
   php -S localhost:8000
   ```

3. **Öppna i webbläsare**: `http://localhost:8000`

### Deploy till Vercel

1. **Installera Vercel CLI** (om du inte redan har det):
   ```bash
   npm install -g vercel
   ```

2. **Logga in**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   # Deploy till preview
   vercel
   
   # Deploy till production
   vercel --prod
   ```

4. **Konfiguration**: Ingen särskild konfiguration behövs - Vercel upptäcker automatiskt att det är en statisk webbapp

### Deploy till GitHub Pages

1. **Pusha till GitHub**:
   ```bash
   git add .
   git commit -m "Update app"
   git push origin master
   ```

2. **Aktivera GitHub Pages**:
   - Gå till Repository Settings
   - Scrolla ner till "GitHub Pages"
   - Välj branch: `master` och root: `/` (root)
   - Spara

3. **Tillgänglig på**: `https://[username].github.io/ChicagoApp/`

## 🛠️ Anpassningar

Du kan enkelt anpassa appen genom att:

- **Ändra poängknappar**: Redigera HTML i `index.html` (sektion `.quick-buttons`)
- **Justera färgschema**: Ändra färger i `styles.css` (gradient-färger och button-färger)
- **Modifiera spelregler**: Uppdatera logik i `app.js` (gränser för köpstopp och Chicago)
- **Byta ikoner**: Ersätt `icon-192.png` och `icon-512.png` med dina egna
- **Ändra app-namn**: Uppdatera `manifest.json` och `<title>` i `index.html`

## 📝 Changelog

### Version 1.1.1 (2026-03-10)
- ✅ Fixad mobil layout för Google Pixel 11 och andra små skärmar
- ✅ Ökat media query tröskel till 768px för bättre mobilstöd
- ✅ Minskade padding och font-storlekar för optimerad layout på små skärmar
- ✅ Förbättrad header-layout med mindre knappar på mobil
- ✅ Optimerad round-info sektion för smalare skärmar

### Version 1.1.0 (2026-03-10)
- ✅ Initial mobil layout förbättring
- ✅ Förbättrad responsiv design

### Version 1.0.0 (2026-03)
- 🎉 Initial release
- ✅ Grundläggande spellogik
- ✅ PWA-funktionalitet
- ✅ Poänghistorik
- ✅ Offline-stöd

## 📄 Licens

Detta projekt är öppen källkod och tillgängligt för fri användning.

## 👤 Författare

**Ola Mårtensson**
- GitHub: [@olamar75](https://github.com/olamar75)

## 🤝 Bidra

Bidrag, problem och funktionsförfrågningar är välkomna!

1. Forka projektet
2. Skapa en feature branch (`git checkout -b feature/AmazingFeature`)
3. Committa dina ändringar (`git commit -m 'Add some AmazingFeature'`)
4. Pusha till branchen (`git push origin feature/AmazingFeature`)
5. Öppna en Pull Request

---

**Tack för att du använder Chicago Poängräknare! 🎴**
