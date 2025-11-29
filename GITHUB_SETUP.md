# GitHub Setup za APK Build

## Korak 1: Kreiraj GitHub Repozitorij

1. Idi na https://github.com/new
2. Popuni:
   - **Repository name:** `fst-servis` (ili kako god želiš)
   - **Description:** FST Servis - White Appliance Service Management
   - **Visibility:** Public (ili Private ako želiš)
   - **Initialize:** Ostavi prazno (bez README-a, .gitignore-a, itd.)
3. Klikni "Create repository"
4. **Kopiraj URL** (vidite ga nakon kreiranja, npr. `https://github.com/tvoje-konto/fst-servis.git`)

## Korak 2: Poveži Replit sa GitHub-om

U Replit-u, u terminalu pokreni:

```bash
# Konfiguruj Git (ako nije konfiguriran)
git config --global user.name "Tvoje Ime"
git config --global user.email "tvoj-email@example.com"

# Postavi remote
git remote add origin https://github.com/TVOJE-KONTO/fst-servis.git

# Prebaci na main granu
git branch -M main

# Pushuj kod
git push -u origin main
```

## Korak 3: Kreiraj EAS Token

1. Idi na https://expo.dev i prijavi se (ili kreiraj novi nalog)
2. Idi u Settings → Access Tokens
3. Klikni "Create Token"
4. Kopiraj token (trebati će ti za GitHub)

## Korak 4: Dodaj GitHub Secret

1. Idi na GitHub repozitorij
2. Settings → Secrets and variables → Actions
3. Klikni "New repository secret"
4. Popuni:
   - **Name:** `EAS_TOKEN`
   - **Value:** Prilepi token koji si kopirao
5. Klikni "Add secret"

## Korak 5: Omogući GitHub Actions

1. U GitHub repozitoriju, idi na "Actions" tab
2. Klikni "I understand my workflows, go ahead and enable them"

## Korak 6: Trigeuj Build

Sada build počinje automatski:
- **Svaki push na `main` granu** → Build se pokreće
- **Ili**: Idi na Actions → Build APK → "Run workflow"

## Šta se dešava?

GitHub Actions će:
1. ✅ Preuzeti kod
2. ✅ Instalirati zavisnosti
3. ✅ Pokrenuti `eas build --platform android`
4. ✅ Preuzeti APK sa EAS servera
5. ✅ Staviti APK kao "artifact" (za preuzimanje)

## Preuzmi APK

1. Idi na Actions tab
2. Klikni na završeni build ("Build APK")
3. Skroluj dolje i klikni "Artifacts"
4. Preuzmi `android-apk` fajl

---

## Dodatna Napomena za Proizvodnju

Za production build, trebati će:
- Android keystore fajl (za potpisivanje APK-a)
- Google Play Console nalog (za objavljivanje)

Trenutno ovo je development build, ali će raditi na test uređajima.

## Pomoć

- **EAS Docs:** https://docs.expo.dev/eas-update/introduction/
- **GitHub Actions:** https://docs.github.com/en/actions
