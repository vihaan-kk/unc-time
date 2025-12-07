# UNC Chapel Hill Time

A smart class schedule and countdown application designed for University of North Carolina at Chapel Hill students. This React application parses your official ConnectCarolina PDF schedule and transforms it into a dynamic "Smart Clock" that keeps you on track.

## Features

- **Smart Countdown Timer**:
  - **"Class Ends In..."**: When you are currently in a class, see exactly how much time is left.
  - **"Next Class In..."**: During breaks, see a countdown to your next upcoming class.
  - **"Free Time"**: Know when you are done for the day or have no immediate classes.
- **PDF Schedule Parsing**: Directly upload your schedule PDF exported from ConnectCarolina. The app automatically extracts class names, times, and days.
- **Privacy Focused**: All PDF parsing happens locally in your browser. Your schedule data never leaves your device.
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing day or night.
- **Schedule View**: Toggle a sidebar to view your full list of parsed classes.

## How to Use

1. **Export your Schedule**:
   - Log in to ConnectCarolina.
   - Go to your Student Center -> My Class Schedule.
   - Save/Print the page as a **PDF**.
2. **Upload**:
   - Click "Choose PDF File" in the app.
   - Select your saved schedule PDF.
3. **Track**:
   - The clock will immediately update to show your current status.

## Development Setup

This project is built with [React](https://react.dev/) and [Vite](https://vitejs.dev/).

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/vihaan-kk/unc-time.git
   cd unc-time
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Technologies Used

- **React**: UI Library
- **Vite**: Build tool and development server
- **pdfjs-dist**: For client-side PDF text extraction
- **CSS Modules & Variables**: For styling and theming

## License

[MIT](LICENSE)
