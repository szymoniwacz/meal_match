# MealMatch

MealMatch is a web application built with Ruby on Rails and React, utilizing GraphQL for API interactions and Devise for authentication.

**Note: This application is currently in progress.**

## Features

- User registration with email confirmation
- User login with "Remember me" functionality
- Password reset functionality
- User authentication using Devise
- GraphQL API for client-server communication
- React frontend with Bootstrap for styling

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

   Open your browser and navigate to `http://localhost:3000`.

## Testing

**IN PROGRESS**

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
   <<<<<<< HEAD
   git clone https://github.com/yourusername/base.git
   cd base
   =======
   git clone https://github.com/yourusername/meal_match.git
   cd meal_match
   >>>>>>> f3d24ca (Update README.md)
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
