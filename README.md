# LoveLingo Custom 01

Customer-specific copy of the LoveLingo greeting experience.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Customer additions

- External bonus course opens `https://shortlink.win/1yTtJ` in a new tab.
- Final chest waits for the external course to be opened after the internal lessons are complete.
- Final chest includes a Notion gift button.
- Final chest includes a certificate-of-adoption button.
- Gift music starts when the chest itself is opened.
- External gift links open in a new tab so the LoveLingo page can keep playing the music.

## Required binary assets

Place these exact files in `public/assets/`:

```text
public/assets/hanya-untukmu.m4a
public/assets/certificate-adoption.pdf
```

The customer integration already points to those paths.
