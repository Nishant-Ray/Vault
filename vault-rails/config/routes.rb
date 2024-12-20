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

  resources :monthly_spendings, only: [] do
    collection do
      get "get/:month", to: "monthly_spendings#get"
      patch "add/:month/:amount", to: "monthly_spendings#add_to_total", constraints: { amount: /[.\d]+/ }
      patch "subtract/:month/:amount", to: "monthly_spendings#subtract_from_total", constraints: { amount: /[.\d]+/ }
    end
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
