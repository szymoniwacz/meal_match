# frozen_string_literal: true

namespace :db do
  desc 'Seed recipes and ingredients from JSON files'
  task seed_recipes: :environment do
    file_path = ENV['FILE_PATH'] || 'recipes-en.json'
    limit_recipes = ENV['LIMIT'].to_i || Float::INFINITY

    unless File.exist?(file_path)
      puts "File not found: #{file_path}"
      exit(1)
    end

    recipes = JSON.parse(File.read(file_path))
    bar = ProgressBar.create(title: 'Seeding Recipes', total: [recipes.size, limit_recipes].min)

    process_recipes(recipes, bar, limit_recipes)
  end

  def process_recipes(recipes, bar, limit_recipes)
    recipe_count = 0

    recipes.each do |recipe_data|
      break if recipe_count >= limit_recipes

      recipe_title = recipe_data['title'] || recipe_data['name']

      existing_recipe = Recipe.find_by(title: recipe_title)

      if existing_recipe
        puts "Recipe '#{recipe_title}' already exists. Skipping..."
      else
        recipe_attributes = {
          title: recipe_title,
          cook_time: recipe_data['cook_time'].to_i,
          prep_time: recipe_data['prep_time'].to_i,
          ratings: recipe_data['ratings'] || recipe_data['rate']&.to_f,
          cuisine: recipe_data['cuisine'] || '',
          category: recipe_data['category'] || recipe_data['tags']&.join(', '),
          author: recipe_data['author'],
          image: recipe_data['image'],
        }

        recipe = Recipe.create!(recipe_attributes)

        recipe_data['ingredients'].each do |ingredient_name|
          ingredient = Ingredient.find_or_create_by(name: ingredient_name.downcase.strip)
          RecipeIngredient.create!(recipe:, ingredient:)
        end

        bar.increment
        recipe_count += 1
      end
    end

    puts "Seeding completed. #{recipe_count} recipes were seeded."
  end
end
