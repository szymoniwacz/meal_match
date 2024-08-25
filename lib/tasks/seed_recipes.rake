# frozen_string_literal: true

namespace :db do
  desc 'Seed recipes and ingredients from JSON files'
  task seed_recipes: :environment do
    english_recipes = JSON.parse(File.read('path_to_english_file.json'))
    french_recipes = JSON.parse(File.read('path_to_french_file.json'))

    process_recipes(english_recipes, 'english')
    process_recipes(french_recipes, 'french')
  end

  def process_recipes(recipes, language)
    recipes.each do |recipe_data|
      recipe = Recipe.create(
        title: recipe_data['title'] || recipe_data['name'],
        cook_time: recipe_data['cook_time'].to_i,
        prep_time: recipe_data['prep_time'].to_i,
        ratings: recipe_data['ratings'] || recipe_data['rate']&.to_f,
        cuisine: recipe_data['cuisine'] || '',
        category: recipe_data['category'] || recipe_data['tags']&.join(', '),
        author: recipe_data['author'],
        image: recipe_data['image'],
        language:,
      )

      recipe_data['ingredients'].each do |ingredient_name|
        ingredient = Ingredient.find_or_create_by(name: ingredient_name.downcase.strip, language:)
        RecipeIngredient.create(recipe:, ingredient:)
      end
    end
  end
end
