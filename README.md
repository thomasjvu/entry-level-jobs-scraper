# Game Jobs Scraper

This project is an example web scraper that automatically collects job listings from and stores them in a Supabase database. It's designed to run both locally and on Render.com.

## Features

- Scrapes job listings from GameJobs.co (as a learnable template)
- Stores job data in a Supabase database
- Avoids duplicate entries
- Runs on a daily schedule using node-cron
- Configurable for both local development and cloud deployment (Render.com)

## Prerequisites

- npm
- Node.js
- A Supabase account and project
- (Optional) A Render.com account for deployment

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/game-jobs-scraper.git
   cd game-jobs-scraper
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_API_KEY=your_supabase_api_key
   SCRAPER_EMAIL=your_scraper_user_email
   SCRAPER_PASSWORD=your_scraper_user_password
   ```

## Usage

To run the scraper locally:

```
npm start
```

The scraper will run immediately and then on a schedule defined in `src/server.js`.

## Deployment

This project is configured for deployment on Render.com.

1. Push your code to a GitHub repository.
2. In Render.com, create a new Web Service and connect it to your GitHub repo.
3. Use the following settings:
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node src/server.js`
4. Add the environment variables from your `.env` file in the Render dashboard.
5. Deploy the service.

## Project Structure

- `src/server.js`: Main entry point, sets up the server and scheduling
- `src/scrapers/gameJobsScraper.js`: Contains the scraping logic for GameJobs.co
- `src/services/jobService.js`: Handles database operations
- `src/utils/auth.js`: Manages authentication with Supabase
- `src/db/supabase.js`: Sets up the Supabase client
- `src/config.js`: Loads environment variables

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
