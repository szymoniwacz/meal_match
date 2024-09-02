# frozen_string_literal: true

source 'https://rubygems.org'

ruby '3.3.3'

gem 'bootsnap', require: false
gem 'devise', '4.9.4'
gem 'dotenv-rails', '~> 3.1'
gem 'graphql', '2.3.5'
gem 'jwt', '2.8.2'
gem 'pg', '~> 1.1'
gem 'rack-cors', '2.0.2'
gem 'rails', '~> 7.1.3', '>= 7.1.3.4'
gem 'redis', '>= 4.0.1'
gem 'ruby-progressbar'
gem 'sprockets-rails', '3.5.1'
gem 'tzinfo-data', platforms: %i[ windows jruby ]
gem 'webpacker', '~> 5.4'

group :development, :test do
  gem 'database_cleaner-active_record'
  gem 'debug', platforms: %i[ mri windows ]
  gem 'factory_bot_rails'
  gem 'faker'
  gem 'graphiql-rails', '1.10.0'
  gem 'letter_opener', '1.10.0'
  gem 'rspec-rails'
  gem 'rubocop', '~> 1.64', require: false
  gem 'rubocop-performance', '1.21.1', require: false
  gem 'rubocop-rails', '~> 2.25', require: false
  gem 'rubocop-rspec', '~> 3.0', require: false
  gem 'shoulda-matchers'
end

group :development do
  gem 'dockerfile-rails', '>= 1.6'
  gem 'web-console'
end

group :test do
  gem 'capybara'
  gem 'selenium-webdriver'
end
