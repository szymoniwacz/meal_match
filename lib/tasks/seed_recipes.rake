# frozen_string_literal: true

namespace :db do
  desc 'Seed recipes and ingredients from JSON files'
  task seed_recipes: :environment do
    file_paths = {
      'en' => 'recipes-en.json',
      'fr' => 'recipes-fr.json',
    }
    total_limit = ENV['LIMIT'].to_i
    limit_per_language = total_limit.positive? ? (total_limit / 2.0).ceil : Float::INFINITY

    file_paths.each do |language, file_path|
      unless File.exist?(file_path)
        puts "File not found: #{file_path}"
        next
      end

      bar = ProgressBar.create(title: "Seeding Recipes (#{language})", total: limit_per_language)

      # Process the recipes with appropriate method based on the language
      if language == 'en'
        process_array_recipes(file_path, bar, limit_per_language, language)
      else
        process_line_recipes(file_path, bar, limit_per_language, language)
      end
    end
  end

  def process_array_recipes(file_path, bar, limit_recipes, language)
    recipe_count = 0
    recipes = JSON.parse(File.read(file_path))

    recipes.each do |recipe_data|
      break if recipe_count >= limit_recipes

      recipe_title = recipe_data['title'] || recipe_data['name']

      existing_recipe = Recipe.find_by(title: recipe_title, language:)

      if existing_recipe
        puts "Recipe '#{recipe_title}' (#{language}) already exists. Skipping..."
      else
        create_recipe(recipe_data, language)
        bar.increment
        recipe_count += 1
      end
    end

    puts "Seeding completed. #{recipe_count} recipes were seeded for language #{language}."
  end

  def process_line_recipes(file_path, bar, limit_recipes, language)
    recipe_count = 0

    File.foreach(file_path) do |line|
      break if recipe_count >= limit_recipes

      recipe_data = JSON.parse(line.strip)

      recipe_title = recipe_data['title'] || recipe_data['name']

      existing_recipe = Recipe.find_by(title: recipe_title, language:)

      if existing_recipe
        puts "Recipe '#{recipe_title}' (#{language}) already exists. Skipping..."
      else
        create_recipe(recipe_data, language)
        bar.increment
        recipe_count += 1
      end
    end

    puts "Seeding completed. #{recipe_count} recipes were seeded for language #{language}."
  end

  def create_recipe(recipe_data, language)
    recipe_attributes = {
      title: recipe_data['title'] || recipe_data['name'],
      cook_time: parse_time(recipe_data['cook_time']),
      prep_time: parse_time(recipe_data['prep_time']),
      ratings: recipe_data['rate']&.to_f || recipe_data['ratings'],
      cuisine: recipe_data['cuisine'] || '',
      category: recipe_data['category'] || recipe_data['tags']&.join(', '),
      author: recipe_data['author'],
      image: recipe_data['image'],
      language:,
    }

    recipe = Recipe.create!(recipe_attributes)

    recipe_data['ingredients'].each do |ingredient_name|
      ingredient = Ingredient.find_or_create_by(name: ingredient_name.downcase.strip, language:)
      RecipeIngredient.create!(recipe:, ingredient:)
    end
  end

  def parse_time(time_str)
    return time_str if time_str.is_a?(Integer)
    return nil if time_str.nil?

    # Convert time strings like "15 min" or "1 h" to minutes
    hours = time_str.scan(/(\d+)\s*h/i).flatten.first.to_i * 60
    minutes = time_str.scan(/(\d+)\s*min/i).flatten.first.to_i
    hours + minutes
  end
end
