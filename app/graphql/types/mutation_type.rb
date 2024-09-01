# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :login_user, mutation: Mutations::LoginUser
    field :register_user, mutation: Mutations::RegisterUser
    field :find_recipes, mutation: Mutations::FindRecipes
    field :switch_language, mutation: Mutations::SwitchLanguage
  end
end
