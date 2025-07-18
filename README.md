# Weather Dashboard

A simple Vue 3 weather dashboard that fetches current weather and a 5‑day forecast from the OpenWeatherMap API. Built with Vite, Pinia, and Composition API.

## Features

- 📍 Auto‑detect location or search by city  
- 🌡️ Current weather display  
- 📅 Toggleable 5‑day forecast with smooth animations  
- 🔀 Shuffle and explore fallback cities  

## Prerequisites

- Node.js (v14+)  
- An OpenWeatherMap API key

## Setup

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-username/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the project root with your API key:  
   ```
   VITE_OPENWEATHER_API_KEY=832c9909b91f46017a8ec645c8fdf04d
   ```
   If you don’t have a key, replace the value with your own:
   ```
   VITE_OPENWEATHER_API_KEY=YOUR_API_KEY_HERE
   ```

4. **Start the development server**  
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

To create a production build:
```bash
npm run build
```

## License

MIT © [Your Name]
