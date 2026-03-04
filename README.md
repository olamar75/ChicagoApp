# Chicago Poängräknare 🎴

En mobilanpassad webbapp för att hålla koll på poängen i kortspelet Chicago.

## Funktioner

- ✅ Stöd för 2-4 spelare
- ✅ Snabbknappar för alla poäng (1-15 + Chicago 52p)
- ✅ Automatiskt köpstopp när en spelare når >= 47 poäng
- ✅ Chicago-knappen inaktiveras när spelare har >= 32 poäng
- ✅ Ångra-funktion för att ta tillbaka senaste poängen
- ✅ Automatisk växling till nästa spelare
- ✅ Visuell markering av aktiv spelare
- ✅ Vinnarskärm när någon når 52 poäng
- ✅ Responsiv design för mobil och surfplatta

## Användning

1. Öppna `index.html` i en webbläsare
2. Välj antal spelare (2-4)
3. Ange spelarnamn (eller använd standardnamnen)
4. Klicka på "Starta spel"
5. Klicka på en spelares kort för att välja hen som aktiv
6. Använd snabbknapparna för att lägga till poäng
7. Första spelaren som når 52 poäng vinner!

## Spelregler

- **Köpstopp**: När en spelare når 47 poäng eller mer kan de inte få fler vanliga poäng (endast Chicago)
- **Chicago**: Kan endast tas av spelare med mindre än 32 poäng
- **Vinnare**: Första spelaren som når exakt 52 poäng (genom Chicago) vinner

## Teknisk information

- Ren HTML, CSS och vanilla JavaScript
- Ingen serverbaserad kod eller externa beroenden
- Fungerar offline
- Optimerad för mobila enheter
- Responsiv design som anpassar sig till olika skärmstorlekar

## Filer

- `index.html` - Applikationens struktur
- `styles.css` - Styling och layout
- `app.js` - Spellogik och interaktivitet

## Installation

Du kan köra appen direkt från filsystemet eller:

1. **Lokal server**: Använd en enkel HTTP-server
   ```bash
   python -m http.server 8000
   # eller
   npx serve
   ```

2. **Öppna direkt**: Dubbelklicka på `index.html`

## Anpassningar

Du kan enkelt anpassa appen genom att:
- Ändra poängknapparna i HTML (lägg till/ta bort knappar)
- Justera färgscheman i CSS (se variablerna för färger)
- Modifiera spelreglerna i JavaScript (gränser för köpstopp och Chicago)

## Stöd

Appen fungerar i alla moderna webbläsare:
- Chrome/Edge (rekommenderad)
- Safari (iOS/macOS)
- Firefox
- Opera

## Version

1.0.0 - Initial release
