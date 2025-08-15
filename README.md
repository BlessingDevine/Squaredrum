# SquareDrum Record Label

A modern music platform built with Next.js, featuring artist profiles, music releases, and an integrated music player.

## Features

- **Artist Profiles**: Detailed pages for each artist with photo galleries and music
- **Music Player**: Integrated audio player with playlist support
- **Releases**: Browse and download music compilations
- **Responsive Design**: Optimized for all devices
- **Contact Form**: Get in touch with the label
- **Newsletter Subscription**: Stay updated with new releases

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Audio**: HTML5 Audio API
- **TypeScript**: Full type safety

## Getting Started

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd squaredrum-record-label
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── artists/           # Artist pages
│   ├── contact/           # Contact page
│   ├── news/              # News page
│   ├── privacy/           # Privacy policy
│   ├── releases/          # Music releases
│   └── terms/             # Terms of service
├── components/            # React components
│   ├── ui/               # UI primitives
│   └── ...               # Custom components
├── lib/                  # Utility functions and data
├── public/               # Static assets
│   ├── audio/            # Music files
│   └── images/           # Images and photos
└── styles/               # Global styles
\`\`\`

## Key Components

- **Global Music Player**: Persistent audio player across pages
- **Artist Gallery**: Dynamic photo galleries for each artist
- **Compilation Cards**: Interactive music compilation browsers
- **Contact Form**: Functional contact form with validation
- **Newsletter Signup**: Email subscription functionality

## Music Library

The platform includes several music compilations:
- **Afro Square**: African-inspired tracks
- **Country Square**: Country music collection
- **R&B Square**: R&B and soul music
- **Pop Square**: Pop music hits
- **Reggaeton Square**: Latin urban music
- **Dancehall Square**: Caribbean dancehall tracks

## Artists

Featured artists include:
- J Cruz
- Lucas Meno
- Neilly Storm
- Danni Blaze
- Virgo Dunst
- Saka
- Tonez
- Neka
- Sadie Rose
- Lunah
- Echo Bloom
- Riven Cole
- Cedar Line

## API Endpoints

- `POST /api/contact` - Contact form submission
- `POST /api/newsletter/subscribe` - Newsletter subscription

## Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is proprietary and confidential.

## Support

For support, email info@squaredrum.com or visit our contact page.
