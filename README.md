> Full-stack demo app combining Ruby on Rails (backend) and React (frontend) using GraphQL API.  
> Created as a learning sandbox for authentication, user roles, and modern development stack integration.

# MealMatch

## About

MealMatch is a web application built with Ruby on Rails and React, utilizing GraphQL for API interactions and Devise for authentication.  
The application allows users to register, log in, search for recipes using selected ingredients, and manage their accounts.

## Project Status

Active demo & learning project. Not intended for production use; open to future improvements and suggestions.

## Features

- User registration with email confirmation
- User login with "Remember me" functionality
- Password reset functionality
- User authentication using Devise
- GraphQL API for client-server communication
- React frontend with Bootstrap for styling
- Recipe search functionality based on selected ingredients
- Multi-language support with translations (English and French)

### Typical workflow

- Register or log in
- Search for recipes by ingredient
- Switch app language and explore the multi-language UI
- Manage your profile (change password, email, etc.)

## Tech Stack

- Ruby 3.3
- Rails 7.1
- Node.js 14+
- React (via webpack)
- PostgreSQL
- GraphQL
- Devise (user authentication)
- Docker, docker-compose (optional for setup)

## Prerequisites

- Ruby 3.3.3
- Rails 7.1.3.4
- Node.js 14.x or later
- Yarn package manager
- PostgreSQL database

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/szymoniwacz/meal_match.git
   cd meal_match
   ```

2. **Install dependencies:**

   ```sh
   bundle install
   yarn install
   ```

3. **Setup the database:**

   ```sh
   rails db:create
   rails db:migrate
   ```

## Configuration

1. **Setup environment variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```env
   DATABASE_USERNAME=your_database_username
   DATABASE_PASSWORD=your_database_password
   SECRET_KEY_BASE=your_secret_key_base
   ```

2. **Configure Devise mailer settings:**

   Edit `config/environments/development.rb` (and `production.rb` accordingly) to set up the mailer:

   ```ruby
   config.action_mailer.delivery_method = :smtp
   config.action_mailer.smtp_settings = {
     address: 'smtp.gmail.com',
     port: 587,
     domain: 'example.com',
     user_name: '<your_email>',
     password: '<your_password>',
     authentication: 'plain',
     enable_starttls_auto: true
   }
   config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }
   ```

## Usage

1. **Start the Rails server:**

   ```sh
   rails server
   ```

2. **Start the Webpack dev server:**

   ```sh
   ./bin/webpack-dev-server
   ```

3. **Access the application:**

   Open your browser and go to `http://localhost:3000`.

## Recipe Search Functionality

The Recipe Search feature allows users to find recipes based on selected ingredients. Users can type in ingredients, select from suggested options, and then submit the search to find matching recipes.

### How It Works:

- **Ingredient Input:** Type the names of ingredients you have.
- **Suggestions:** As you type, suggestions appear based on ingredients in the database.
- **Selection:** Select ingredients from the suggestions list. Selected ingredients are added to the search criteria.
- **Search:** Submit the search to find recipes matching the selected ingredients.
- **Results:** Matching recipes are displayed in a sorted table.

## Translation Management

MealMatch supports multiple languages, currently including English and French. All text is fully translatable using the `i18n` gem. The `config/locales` directory contains the translation files for supported languages. Additional languages can be added by including appropriate translation files.

### How It Works:

- **Language Switching:** Switch between English and French using the language switcher in the application.
- **Translations:** Text keys are managed by the `i18n` gem and stored in YAML files in `config/locales/`.
- **Adding New Languages:** To add more languages, create new locale files in `config/locales/` following the structure of the existing ones.

## Testing

Automated feature and unit tests are planned for critical flows (user registration, recipe search, permissions).  
Manual exploratory testing was used in initial development.

## Deployment

1. **Precompile assets:**

   ```sh
   RAILS_ENV=production bundle exec rails assets:precompile
   ```

2. **Migrate the database:**

   ```sh
   RAILS_ENV=production bundle exec rails db:migrate
   ```

3. **Start the server:**

   ```sh
   RAILS_ENV=production bundle exec rails server
   ```

## Contributing

1. **Fork the repository:**

   Click the "Fork" button at the top right of this page to create a copy of this repository under your GitHub account.

2. **Clone your fork:**

   ```sh
   git clone https://github.com/yourusername/meal_match.git
   cd meal_match
   ```

3. **Create a new branch:**

   ```sh
   git checkout -b my-feature-branch
   ```

4. **Make your changes and commit:**

   ```sh
   git commit -am 'Add some feature'
   ```

5. **Push to your branch:**

   ```sh
   git push origin my-feature-branch
   ```

6. **Create a Pull Request:**

   Open a Pull Request on the original repository to merge your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
