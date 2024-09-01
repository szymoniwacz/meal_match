import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "auth.login": "Login",
      "auth.register": "Register",
      "auth.password": "Password",
      "auth.email": "Email",
      "auth.rememberMe": "Remember me",
      "auth.loggedInAs": "Logged in as",
      "auth.logout": "Logout",
      "auth.welcome": "Welcome!",
      "auth.placeholder.email": "Type your email",
      "auth.placeholder.password": "Type your password",
      "recipes.loadingIngredients": "Loading ingredients...",
      "recipes.errorLoadingIngredients": "Error loading ingredients",
      "recipes.search": "Search",
      "recipes.finderTitle": "Recipes Finder",
      "ingredientInput.label": "Start typing an ingredient:",
      "ingredientInput.placeholder": "Type at least 3 letters...",
      "selectedIngredients.title": "Selected Ingredients:"
    }
  },
  fr: {
    translation: {
      "auth.login": "Connexion",
      "auth.register": "S'inscrire",
      "auth.password": "Mot de passe",
      "auth.email": "E-mail",
      "auth.rememberMe": "Souviens-toi de moi",
      "auth.loggedInAs": "Connecté en tant que",
      "auth.logout": "Se déconnecter",
      "auth.welcome": "Bienvenue!",
      "auth.placeholder.email": "Tapez votre e-mail",
      "auth.placeholder.password": "Tapez votre mot de passe",
      "recipes.loadingIngredients": "Chargement des ingrédients...",
      "recipes.errorLoadingIngredients": "Erreur lors du chargement des ingrédients",
      "recipes.search": "Rechercher",
      "recipes.finderTitle": "Chercheur de recettes",
      "ingredientInput.label": "Commencez à taper un ingrédient:",
      "ingredientInput.placeholder": "Tapez au moins 3 lettres...",
      "selectedIngredients.title": "Ingrédients sélectionnés:"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
