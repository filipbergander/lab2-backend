# Exempel på README.md-fil för ett API
Detta repository innehåller kod för ett enklare REST API byggt med Express. APIet är byggt för att hantera olika kurser som jag studerat under min tid på Mittuniversitetet. 
Grundläggande funktionalitet för CRUD (Create, Read, Update, Delete) är implementerad.

## Länk
En liveversion av APIet finns tillgänglig på följande URL: [https://testserver.test/courses](https://miun.se) 

## Installation, databas
APIet använder en MySQL-databas.
Klona ner källkodsfilerna, kör kommando npm install för att installera nödvändiga npm-paket. Kör installations-skriptet install.js. 
Installations-skriptet skapar databastabeller enligt nedanstående:
|Tabell-namn|Fält  |
|--|--|
|Tabell1  | **id** (int(11), **fält1** (varchar(256), **fält2** (varchar(256)  |
|Tabell2  | **id** (int(11), **fält1** (varchar(256), **fält2** (varchar(256)  |

## Användning
Nedan finns beskrivet hur man nå APIet på olika vis:

|Metod  |Ändpunkt     |Beskrivning                                                                           |
|-------|-------------|--------------------------------------------------------------------------------------|
|GET    |/courses     |Hämtar alla tillgängliga kurser.                                                      |
|GET    |/courses/:ID|Hämtar en specifik kurs med angivet ID.                                               |
|POST   |/courses     |Lagrar en ny kurs. Kräver att ett kurs-objekt skickas med.                            |
|PUT    |/courses/:ID |Uppdaterar en existerande kurs med angivet ID. Kräver att ett kurs-objekt skickas med.|
|DELETE |/courses/:ID |Raderar en kurs med angivet ID.                                                       |

Ett kurs-objekt returneras/skickas som JSON med följande struktur:
```
{
   "code": "DT207G",
   "name": "Backend-baserad utveckling",
   "progression": "B",
   "syllabus": "[https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/Sok-kursplan/kursplan/?kursplanid=21873](https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT207G/)"
}
```