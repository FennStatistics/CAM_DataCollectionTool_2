# CAM DCT (Vite + JATOS)

This project is a browser-based study tool. It is built with Vite, a fast build system that turns the source files into a simple static website you can run locally or upload to JATOS.

The instructions below are written for non web developers and include every command you need to type.

## What is Vite (simple explanation)

Vite is a tool that does two things:

1) **Development server**: Starts a local website on your computer so you can test changes quickly.
2) **Production build**: Creates a folder of static files (HTML, JS, CSS) that can be uploaded to servers like JATOS.

In this project, the production build is created in the `dist/` folder.

## Prerequisites

- Node.js (includes npm)
- Git (optional, only if you want to clone the repository)

Check that Node.js and npm are installed:

```bash
node --version
npm --version
```

## Get the project (if you do not have it yet)

If you already have the project folder, skip this step.

```bash
git clone https://github.com/FennStatistics/CAM_DataCollectionTool_2.git
cd cam-dct-vite
```

## Install dependencies

```bash
npm install
```

## Run locally (for quick checks)

Start the development server:

```bash
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`). Open that in your browser.

## Build for JATOS

This project uses a special build mode that injects `jatos.js` into `index.html` so JATOS can provide study data.

Run the JATOS build:

```bash
npm run build:jatos
```

The build output is in:

```
dist/
```

## JATOS 3.8.x+ setup (step by step)

### 1) Start JATOS locally

If you already have a running JATOS server, skip this step.

Download JATOS from the official site (https://www.jatos.org/Installation.html), unzip it, then run:

macOS / Linux:

```bash
cd /path/to/jatos
./start-jatos.sh
```

Windows (PowerShell):

```powershell
cd C:\path\to\jatos
start-jatos.bat
```

Open the JATOS UI in your browser (default is usually `http://localhost:9000`).

### 2) Create a new study

In the JATOS UI:

1) Go to **Studies**.
2) Click **New Study**.
3) Give it a name and create it.

### 3) Create a component and upload the build

In your new study:

1) Click **New Component**.
2) Choose **HTML** as the component type.
3) Upload the files from `dist/`.

Important: upload the **contents** of `dist/` (including `index.html`), not the `dist/` folder itself.

### 4) Set the HTML entry file

In the component settings:

1) Set the **HTML file** (entry point) to:

```
index.html
```

2) Save the component.

### 5) Export the study as `.jzip`

In JATOS 3.8.x or higher:

1) Open the study overview.
2) Use the **Study** menu and choose **Export**.
3) Download the `.jzip` file.

### 6) Upload the `.jzip` to a server accessible via internet

On the target JATOS server (internet-accessible):

1) Sign in to that JATOS instance.
2) Go to **Studies**.
3) Choose **Import Study** and upload the `.jzip` file.
4) After import, open the study and run it.

## Common pitfalls (quick fixes)

- **Study loads but JATOS features are missing**: make sure you ran the JATOS build.

```bash
npm run build:jatos
```

- **Blank page or 404 inside JATOS**: you likely uploaded the `dist/` folder itself. Upload the *contents* of `dist/` instead (including `index.html`).

- **Changes not showing up**: rebuild and re-upload the `dist/` files.

```bash
npm run build:jatos
```

## Useful commands (all in one place)

```bash
npm install
npm run dev
npm run build
npm run build:jatos
npm run preview
```
