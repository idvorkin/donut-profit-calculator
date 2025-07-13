# Project Instructions for AI Agents

This file provides context for AI assistants working on this project.

## Project Overview

This project is a single-page web application that helps donut shop owners calculate their potential profit. It was built using React and is designed to be a simple, interactive tool.

## Key Technologies

- **Frontend:** React (Create React App)
- **Styling:** Plain CSS
- **Charting:** Recharts
- **UI Components:** rc-slider
- **Deployment:** Surge.sh (for static site hosting)

## Development

The application code is located in the `donut-calculator` directory.

- **Run the development server:**
  ```bash
  cd donut-calculator
  npm start
  ```

- **Build for production:**
  ```bash
  cd donut-calculator
  npm run build
  ```

## Deployment

The application is deployed as a static site to Surge.sh.

- **Live URL:** https://abrupt-carpenter.surge.sh/
- **Deployment command (from `donut-calculator` directory):**
  ```bash
  npx surge --project ./build
  ```

## Source Control

The project is hosted on GitHub.

- **Repository URL:** https://github.com/idvorkin/donut-profit-calculator
- **Default Branch:** `main`