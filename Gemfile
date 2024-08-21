# frozen_string_literal: true

source 'https://rubygems.org'

ruby '3.3.3'

gem 'bootsnap', require: false
gem 'dotenv-rails', '~> 3.1'
gem "pg", "~> 1.1"
gem 'rails', '~> 7.1.3', '>= 7.1.3.4'
gem 'redis', '>= 4.0.1'
gem 'tzinfo-data', platforms: %i[ windows jruby ]
gem 'webpacker', '~> 5.4'

group :development, :test do
  gem 'debug', platforms: %i[ mri windows ]
  gem 'rubocop', '~> 1.64', require: false
  gem 'rubocop-performance', '1.21.1', require: false
  gem 'rubocop-rails', '~> 2.25', require: false
  gem 'rubocop-rspec', '~> 3.0', require: false
end

group :development do
  gem 'web-console'
end

group :test do
  gem 'capybara'
  gem 'selenium-webdriver'
end
