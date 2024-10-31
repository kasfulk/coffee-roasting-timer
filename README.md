Sure, here's a `README.md` file for deploying the Coffee Roasting Timer application:

```markdown
# Coffee Roasting Timer

This application is a timer that calculates the Maillard Ratio, Development Ratio, and Drying Ratio during the coffee roasting process. It is built with HTML, JavaScript, and Tailwind CSS, and can be served using NPM and PM2.

## Features

- Start the roasting timer
- Calculate Drying Ratio from the start of the timer
- Calculate Maillard Ratio from the end of the drying phase
- Calculate Development Ratio from the start of the first crack phase
- Display all ratios in percentage and time

## Prerequisites

- Node.js and NPM installed
- PM2 installed globally

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kasfulk/coffee-roasting-timer
   cd coffee-roasting-timer
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build Tailwind CSS:

   ```bash
   npm run build:css
   ```

## Running the Application

### Using NPM

To start the application using NPM:

```bash
npm run serve
```

The application will be served at `http://localhost:6070`.

### Using PM2

1. Start the application with PM2:

   ```bash
   pm2 start npm --name "coffee-roasting-timer" -- run serve
   ```

2. Save the PM2 process list:

   ```bash
   pm2 save
   ```

3. Set up PM2 to start on system boot:

   ```bash
   pm2 startup
   ```

### Using PM2 with Ecosystem File

1. Create a PM2 ecosystem file named `ecosystem.config.js` in the root directory with the following content:

   ```javascript
   module.exports = {
     apps: [
       {
         name: "coffee-roasting-timer",
         script: "npm",
         args: "run serve",
         watch: true,
         env: {
           "PORT": 6070
         }
       }
     ]
   }
   ```

2. Start the application with PM2:

   ```bash
   pm2 start ecosystem.config.js
   ```

3. Save the PM2 process list:

   ```bash
   pm2 save
   ```

4. Set up PM2 to start on system boot:

   ```bash
   pm2 startup
   ```

## Usage

1. Open your browser and navigate to `http://localhost:6070`.
2. Click "Charge" to start the timer.
3. Click "Dry End" to mark the end of the drying phase.
4. Click "First Crack" to mark the start of the first crack phase.
5. Click "End" to stop the timer.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License.
```

Replace `https://github.com/kasfulk/coffee-roasting-timer` with the actual URL of your repository. This `README.md` provides a clear guide on how to install, run, and deploy the application using both NPM and PM2, as well as how to contribute to the project.