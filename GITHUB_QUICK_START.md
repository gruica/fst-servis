# 🚀 Quick Start: GitHub + APK Build

## 1️⃣ Kreiraj GitHub Repozitorij
- Idi na https://github.com/new
- Naziv: `fst-servis`
- Klikni "Create repository"
- Kopiraj URL (vidiće ga na sljedećoj stranici)

## 2️⃣ Poveži iz Replit-a (3 komande)

Pokreni ove komande u Replit terminalu:

```bash
git config --global user.name "Tvoje Ime"
git config --global user.email "tvoj@email.com"
git remote set-url origin https://github.com/TVOJE-KONTO/fst-servis.git
git push -u origin main
```

(Zamijeni `TVOJE-KONTO` sa tvojim GitHub korisničkim imenom)

## 3️⃣ Kreiraj EAS Token
1. Idi na https://expo.dev (prijavi se ili kreiraj nalog)
2. Settings → Access Tokens → Create Token
3. Kopiraj token

## 4️⃣ Dodaj Secret na GitHub
1. GitHub repozitorij → Settings → Secrets and variables → Actions
2. New repository secret:
   - Name: `EAS_TOKEN`
   - Value: (prilepi token iz korak 3)

## 5️⃣ Pokreni Build
- Bilo koji push na `main` → Build počinje automatski
- Ili: Actions tab → Build APK → "Run workflow"

## ✅ Gdje je APK?
- Actions tab → Završeni build → Artifacts → `android-apk`

---

**To je to!** GitHub Actions će automatski praviti APK svaki put kada pushuj kod.
