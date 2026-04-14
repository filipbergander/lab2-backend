# API för att hämta och skriva ut arbetslivserfarenheter som ett CV
Detta repository innehåller kod för ett enklare REST API byggt med Express.

## Installation, databas
APIet använder en MySQL-databas.
Inom install.js finns kod för att kunna skapa tabellen inom databasen.

## Användning
Nedan finns beskrivet hur man nå APIet på olika vis:

|Metod  |Ändpunkt     |Beskrivning                                                                           |
|-------|-------------|--------------------------------------------------------------------------------------|
|GET    |/workexperience     |Hämtar alla sparade arbetserfarenheter.                                                      |
|GET    |/workexperience/:ID|Hämtar en specifik arbetserfarenhet genom ID.                                             |
|POST   |/workexperience    |Lagrar ett nytt jobb. 
                          |
|PUT    |/workexperience/:ID |Uppdaterar en redan sparad arbetserfarenhet.
|DELETE |/workexperience/:ID |Raderar en specifik arbetserfarenhet, med angivet ID.                                                       |

Ett CV-objekt returneras/skickas som JSON med följande struktur:
```
 {
  "companyName" : "Storsjöbadet",
  "jobTitle": "Badhustekniker",
  "location": "Östersund",
  "description": "Se över badhusanläggningen och åtgärda problem"
}
```

För att uppdatera eller radera en CV-post behöver ID tas med. Struktur:
```
 {
   "id": "4",
  "companyName" : "Storsjöbadet",
  "jobTitle": "Badhustekniker",
  "location": "Östersund",
  "description": "Se över badhusanläggningen och åtgärda problem"
}
```