# frozen_string_literal: true

namespace :db do
  desc 'Seed recipes and ingredients from JSON files'
  task seed_recipes: :environment do
    file_paths = {
      'en' => 'recipes-en.json',
      'fr' => 'recipes-fr.json',
    }
    total_limit = ENV['LIMIT'].to_i
    limit_per_language = total_limit.positive? ? (total_limit / 2.0).ceil : nil

    file_paths.each do |language, file_path|
      unless File.exist?(file_path)
        puts "File not found: #{file_path}"
        next
      end

      puts "Preparing recipes to seed for language: #{language}"

      recipe_count = if language == 'en'
                       JSON.parse(File.read(file_path)).size
                     else
                       File.foreach(file_path).count
                     end

      if recipe_count.zero?
        puts "No recipes found for language: #{language}"
        next
      end

      # Calculate the total number of batches needed, considering the limit per language
      estimated_batches = if limit_per_language
                            [(recipe_count / 100.0).ceil, (limit_per_language / 100.0).ceil].min
                          else
                            (recipe_count / 100.0).ceil
                          end

      bar = ProgressBar.create(title: "Seeding Recipes (#{language})", total: estimated_batches)

      # Process the recipes with appropriate method based on the language
      if language == 'en'
        process_array_recipes(file_path, bar, limit_per_language || recipe_count, language)
      else
        process_line_recipes(file_path, bar, limit_per_language || recipe_count, language)
      end
    end
  end

  def process_array_recipes(file_path, bar, limit_recipes, language)
    recipe_count = 0
    recipes = JSON.parse(File.read(file_path))

    recipe_data_to_create = []
    ingredient_names = Set.new

    recipes.each do |recipe_data|
      break if recipe_count >= limit_recipes

      recipe_title = recipe_data['title'] || recipe_data['name']
      existing_recipe = Recipe.find_by(title: recipe_title, language:)

      unless existing_recipe
        recipe_data_to_create << build_recipe_attributes(recipe_data, language)
        recipe_data['ingredients'].each do |ingredient_name|
          ingredient_names.add(ingredient_name.downcase.strip)
        end
        recipe_count += 1
      end

      # Batch insert every 100 records
      next unless recipe_data_to_create.size >= 100

      bulk_insert_recipes_and_ingredients(recipe_data_to_create, ingredient_names, language)
      recipe_data_to_create.clear
      ingredient_names.clear

      # Increment the progress bar after each batch is stored
      bar.increment
    end

    # Insert remaining records
    return unless recipe_data_to_create.any?

    bulk_insert_recipes_and_ingredients(recipe_data_to_create, ingredient_names, language)
    bar.increment
  end

  def process_line_recipes(file_path, bar, limit_recipes, language)
    recipe_count = 0

    recipe_data_to_create = []
    ingredient_names = Set.new

    File.foreach(file_path) do |line|
      break if recipe_count >= limit_recipes

      recipe_data = JSON.parse(line.strip)

      recipe_title = recipe_data['title'] || recipe_data['name']
      existing_recipe = Recipe.find_by(title: recipe_title, language:)

      unless existing_recipe
        recipe_data_to_create << build_recipe_attributes(recipe_data, language)
        recipe_data['ingredients'].each do |ingredient_name|
          ingredient_names.add(ingredient_name.downcase.strip)
        end
        recipe_count += 1
      end

      # Batch insert every 100 records
      if recipe_data_to_create.size >= 100
        bulk_insert_recipes_and_ingredients(recipe_data_to_create, ingredient_names, language)
        recipe_data_to_create.clear
        ingredient_names.clear

        # Increment the progress bar after each batch is stored
        bar.increment
      end
    end

    # Insert remaining records
    return unless recipe_data_to_create.any?

    bulk_insert_recipes_and_ingredients(recipe_data_to_create, ingredient_names, language)
    bar.increment
  end

  def build_recipe_attributes(recipe_data, language)
    {
      title: recipe_data['title'] || recipe_data['name'],
      cook_time: parse_time(recipe_data['cook_time']),
      prep_time: parse_time(recipe_data['prep_time']),
      ratings: recipe_data['rate']&.to_f || recipe_data['ratings'],
      cuisine: recipe_data['cuisine'] || '',
      category: recipe_data['category'] || recipe_data['tags']&.join(', '),
      author: recipe_data['author'],
      image: recipe_data['image'],
      language:,
      ingredients: recipe_data['ingredients'],
    }
  end

  def bulk_insert_recipes_and_ingredients(recipe_data_to_create, ingredient_names, language)
    # Bulk insert ingredients
    existing_ingredients = Ingredient.where(name: ingredient_names.to_a, language:).pluck(:name)
    new_ingredients = ingredient_names.to_a - existing_ingredients
    if new_ingredients.any?
      Ingredient.insert_all(new_ingredients.map do |name|
                              { name:, language:, created_at: Time.zone.now, updated_at: Time.zone.now }
                            end)
    end

    # Map ingredients to their IDs
    all_ingredients = Ingredient.where(name: ingredient_names.to_a, language:).pluck(:name, :id).to_h

    recipes_to_insert = recipe_data_to_create.map do |recipe_attributes|
      recipe_ingredients = recipe_attributes.delete(:ingredients).map do |ingredient|
        all_ingredients[ingredient.downcase.strip]
      end
      recipe = Recipe.new(recipe_attributes)
      { recipe: recipe.attributes.except('id', 'created_at', 'updated_at'), ingredient_ids: recipe_ingredients }
    end

    # Insert recipes in smaller batches to avoid overwhelming the database
    recipes_to_insert.each_slice(50) do |slice|
      Recipe.transaction do
        # Insert recipes
        Recipe.insert_all(slice.map do |data|
                            data[:recipe].merge(created_at: Time.zone.now, updated_at: Time.zone.now)
                          end)

        # Insert recipe-ingredient associations
        recipes_with_ids = Recipe.where(title: slice.map do |data|
                                                 data[:recipe]['title']
                                               end, language:).pluck(:title, :id).to_h
        recipe_ingredients_to_insert = slice.flat_map do |data|
          recipe_id = recipes_with_ids[data[:recipe]['title']]
          data[:ingredient_ids].map do |ingredient_id|
            { recipe_id:, ingredient_id:, created_at: Time.zone.now, updated_at: Time.zone.now }
          end
        end

        RecipeIngredient.insert_all(recipe_ingredients_to_insert) if recipe_ingredients_to_insert.any?
      end
    end
  rescue ActiveRecord::ConnectionFailed, PG::ConnectionBad
    sleep(5) # Adding a small delay before retrying might help in some cases
    retry
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
