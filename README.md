# AI Design Studio



## Overview

AI Design Studio is a modern web application that empowers users to design and visualize interior room layouts with the assistance of advanced AI tools. Whether you're an interior designer, homeowner, or enthusiast, this platform provides an intuitive interface for uploading images, selecting products, and generating customized room designs.

## Features

- **Image Upload and Analysis**: Upload room images for AI-powered analysis and design suggestions.
- **Product Picker**: Browse and select from a wide range of furniture and decor items.
- **Item Selector**: Customize and place items within your room layout.
- **Room Templates**: Access pre-designed templates to kickstart your projects.
- **User Authentication**: Secure login and registration system for personalized experiences.
- **3D Visualization**: Leverage Three.js for immersive 3D room previews.
- **Responsive Design**: Optimized for desktop and mobile devices.

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **3D Graphics**: Three.js
- **Icons**: Lucide React, React Icons
- **HTTP Client**: Axios
- **Image Zoom**: React Medium Image Zoom

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-design-studio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173` (default Vite port).

## Usage

1. **Register/Login**: Create an account or log in to access personalized features.
2. **Upload Images**: Use the Image Uploader to add photos of your space.
3. **Select Products**: Browse the Product Picker to choose items for your design.
4. **Customize Layout**: Utilize the Item Selector to position and adjust elements.
5. **Visualize**: View your design in 3D using the integrated visualization tools.

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary.
