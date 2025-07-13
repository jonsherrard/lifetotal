# Life Total Tracker

A responsive single-page application for tracking life totals in Magic: The Gathering games, built with Next.js and Tailwind CSS.

## Features

### Core Functionality
- **Multi-player support**: Handles 3-5 players with responsive grid layout
- **Life total tracking**: Default 40 life, customizable starting life (20, 30, 40, or custom amount)
- **Direct life editing**: Click on life total to edit directly
- **Life adjustment buttons**: Quick +/-1 and +/-5 life buttons
- **Visual indicators**: Color-coded life totals (red for low life, yellow for critical)

### Commander Format Support
- **Commander damage tracking**: Individual commander damage from each opponent
- **Position-based layout**: Players arranged in proper multiplayer positions
- **Starting player selection**: Random starting player selection
- **Player elimination**: Visual indication when players are eliminated

### Advanced Features
- **Life Link**: Toggle life link effect for specific players
- **Settings modal**: Player-oriented settings that appear from the correct position
- **Responsive design**: Works on mobile, tablet, and desktop
- **Dark theme**: Modern dark UI optimized for gaming environments

### Settings Menu
The settings menu can be opened by clicking the gear icon on any player's card. The modal will appear oriented toward the player who opened it:
- **Player count**: Switch between 3, 4, or 5 players
- **Starting life**: Quick presets (20, 30, 40) or custom amounts
- **Game format toggles**: Commander format and Life Link
- **Game actions**: Reset game and randomize starting player

## Layout

### 3 Players
- 2x2 grid with third player spanning two columns

### 4 Players
- 2x2 grid with each player in a corner

### 5 Players
- 3x2 grid with optimized spacing

## Usage

1. **Start the app**: Players begin with 40 life each
2. **Adjust life totals**: Use +/- buttons or click to edit directly
3. **Track commander damage**: Click "Commander Damage" to expand tracking
4. **Use settings**: Click the gear icon on any player to access settings
5. **Reset or randomize**: Use settings menu to reset game or choose starting player

## Technical Features

- **TypeScript**: Full type safety throughout the application
- **React Hooks**: Modern React with hooks for state management
- **Responsive Grid**: CSS Grid with Tailwind for perfect layouts
- **Touch-friendly**: Optimized for mobile and tablet use
- **Performance**: Efficient re-renders with React useCallback and useMemo

## Development

### Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Project Structure

```
src/
├── app/
│   ├── page.tsx           # Main game component
│   ├── layout.tsx         # App layout
│   └── globals.css        # Global styles
├── components/
│   ├── PlayerCard.tsx     # Individual player component
│   └── SettingsModal.tsx  # Settings modal component
└── types/
    └── index.ts           # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this for your Magic: The Gathering games!
