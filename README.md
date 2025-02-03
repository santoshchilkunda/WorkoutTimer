# Workout Timer

A modern, feature-rich workout timer application designed to help you track and manage your exercise routines effectively. Built with React and TypeScript, this application provides a comprehensive timer system with customizable workout and rest periods, YouTube music integration, and audio notifications.

## Features

- **Multiple Set Management**: Create and manage multiple workout sets with different configurations
- **Customizable Timers**: 
  - Set workout duration
  - Configure rest periods
  - Adjust initial countdown
  - Define number of rounds per set
- **Audio Features**:
  - YouTube music integration for workout background music
  - Audio notifications for phase changes and countdowns
  - Independent volume controls for notifications and music
- **Workout Details**:
  - Add detailed notes for each workout set
  - Track progress with current set/round indicators
  - Visual progress bar with percentage completion
- **Mobile-Optimized**:
  - Responsive design that works on all devices
  - Touch-friendly controls
  - Adaptive layout for different screen sizes

## Technologies Used

- React with TypeScript
- Tailwind CSS for styling
- ShadcN UI components
- Web Audio API for sound effects
- YouTube Player API for music integration
- PostgreSQL for data persistence

## macOS Setup Instructions

### Prerequisites

1. **Node.js**: Install using Homebrew
   ```bash
   brew install node@20
   ```

2. **PostgreSQL**: Install and start the service
   ```bash
   brew install postgresql@15
   brew services start postgresql@15
   ```

### Installation Steps

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd workout-timer
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up the database
   ```bash
   # Create a new PostgreSQL database
   createdb workout_timer

   # Push the database schema
   npm run db:push
   ```

4. Create a `.env` file in the project root
   ```bash
   # Development environment variables
   DATABASE_URL="postgresql://localhost:5432/workout_timer"
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

6. Open your browser to [http://localhost:3000](http://localhost:3000)

## Usage Guide

1. **Setup Mode**:
   - Add workout sets using the + button
   - Configure duration, rest periods, and rounds
   - Add workout details/instructions
   - Click "Start" when ready

2. **Workout Mode**:
   - View the circular timer showing current phase
   - Use Play/Pause to control the workout
   - Add YouTube music using the music player
   - Adjust volumes as needed
   - Back button returns to setup mode

3. **Audio Controls**:
   - Separate volume controls for notifications and music
   - Mute button for all audio
   - YouTube music player with URL input

## Development Tools

- **Visual Studio Code** (Recommended)
  - Install the ESLint and Prettier extensions
  - Enable "Format on Save" for automatic code formatting

## Troubleshooting

### Common Issues on macOS

1. **PostgreSQL Connection Issues**
   - Ensure PostgreSQL service is running:
     ```bash
     brew services list
     ```
   - Check database existence:
     ```bash
     psql -l
     ```

2. **Port Conflicts**
   - If port 3000 is in use, the server will automatically try the next available port
   - Check terminal output for the correct URL

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is MIT licensed.