Rails.application.routes.draw do
  devise_for :users, path: "", path_names: {
    sign_in: "login",
    sign_out: "logout",
    registration: "signup" # these 3 strings are the auth endpoints
  },
  controllers: {
    sessions: "users/sessions",
    registrations: "users/registrations"
  }
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  get "/current_user", to: "user#index"
  get "/get_current_user_name", to: "user#get_current_user_name"

  resources :monthly_spendings, only: [] do
    collection do
      get "get/:month", to: "monthly_spendings#get"
      get "get_by_year/:year", to: "monthly_spendings#get_by_year"
      patch "add/:month/:amount", to: "monthly_spendings#add_to_total", constraints: { amount: /[.\d]+/ }
      patch "subtract/:month/:amount", to: "monthly_spendings#subtract_from_total", constraints: { amount: /[.\d]+/ }
    end
  end

  resources :accounts, only: [] do
    collection do
      get :get_all
      post "add/:last_digits/:is_credit_card/:nickname", to: "accounts#add", constraints: { nickname: /[^\/]+/ }
      delete "remove/:id", to: "accounts#remove"
    end
  end

  resources :transactions, only: [] do
    collection do
      get "get_recent", to: "transactions#get_recent"
      get "get_by_month/:month", to: "transactions#get_by_month"
      post "add/:account_id/:date/:amount/:category/:description", to: "transactions#add", constraints: { amount: /[.\d]+/, description: /[^\/]+/ }
      delete "remove/:id", to: "transactions#remove"
    end
  end

  resources :bills, only: [] do
    collection do
      get :get_all
      get :get_upcoming
      post "add/:due_date/:amount/:shared/:category/:name", to: "bills#add", constraints: { amount: /[.\d]+/, name: /[^\/]+/ }
      delete "remove/:id", to: "transactions#remove"
    end
  end

  resources :residences, only: [] do
    collection do
      get :get_info
      post "create/:name", constraints: { name: /[^\/]+/ }
      delete "delete"
      post "invite_resident/:email"
      patch "remove_resident/:id"
      patch "change_name/:name", constraints: { name: /[^\/]+/ }
    end
  end

  resources :residence_messages, only: [] do
    collection do
      get :get_recent
      get :get_all
      post "create/:time/:is_update/:content", constraints: { content: /[^\/]+/ }
    end
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
