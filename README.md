# kitakarítunk.

Egyoldalas (single-page) céges weboldal budapesti otthon- és irodatakarítási szolgáltatást nyújtó vállalkozás számára, magyar nyelven, a budapesti piacra optimalizálva. A vizuális stílus a kijevi Uberem.com.ua takarítási cég oldalának letisztult, lila-fehér design-nyelvét követi.

🔗 **Élő oldal:** https://vargagyorgy1204-create.github.io/kitakaritunk/ *(ha a GitHub Pages be van kapcsolva a repóban)*

## Áttekintés

A weboldal egy modern, minimalista takarítási szolgáltató landing page-ét mutatja be: bemutatkozás, szolgáltatási folyamat, árazás, csapat, vélemények, garanciák és GYIK egyetlen görgethető oldalon.

### Fő szekciók

- **Fejléc** – logó, Otthon/Iroda váltó, Budapest jelvény, szolgáltatás-navigáció, telefonszám + 0-24 jelvény, CTA gomb, hamburger menü
- **Hero** – nagy, könnyed megjelenésű cím, alcím, hero fotó
- **Bizalmi elemek** – ellenőrzött szakemberek, környezetbarát vegyszerek, minőségellenőrzés, 0-24 elérhetőség
- **Hogyan takarítunk** – helyiségenkénti (konyha, szobák, fürdőszoba, előszoba) részletes checklist
- **Árazás** – előfizetéses / egyszeri takarítás váltó, szobaszám szerinti árkártyák
- **Minőségbiztosítás**, **Csapat carousel**, **Statisztika sáv**, **Vélemények**
- **Biztosítás / garancia szekció**
- **GYIK** – accordion, 11 kérdés-válasz
- **Bővített SEO/árazási blokk** – 5 részletes árazási táblázat
- **Mitől függ az ár**, **Szolgáltatás típusok**, **Miért bízhat bennünk**, **Kiegészítő szolgáltatások**, **Biztonság**, **Helyszín**
- **Lábléc** – linkek, közösségi média, jogi infó, "Made by VarBro" kredit

## Technológia

Tiszta, függőségmentes front-end stack — nincs build lépés, nincs keretrendszer:

- **HTML5** – szemantikus jelölés
- **CSS3** – egyedi design token-rendszer (lila accent, pill gombok, Onest betűtípus)
- **Vanilla JavaScript** – mobilmenü, pill-váltók, árazás toggle, FAQ accordion, csapat carousel, animált számláló (`IntersectionObserver`)

## Projektstruktúra

```
├── index.html          # Az oldal teljes tartalma és szerkezete
├── css/
│   └── style.css        # Design tokenek, layout, komponensek, reszponzív stílusok
├── js/
│   └── script.js         # Interakciók (menü, toggle-ok, accordion, carousel, számláló)
└── images/               # Hero, feature, folyamat, csapat és vélemény fotók
```

## Megjegyzés

Ez egy demó/portfólió oldal: az űrlapok és a "Takarítást rendelek" gomb nem küldenek valódi kérést, kizárólag a bemutatót szolgálják.
