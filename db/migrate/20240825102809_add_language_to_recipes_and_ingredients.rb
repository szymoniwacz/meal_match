class AddLanguageToRecipesAndIngredients < ActiveRecord::Migration[7.1]
  def change
    add_column :recipes, :language, :string
    add_column :ingredients, :language, :string
  end
end
