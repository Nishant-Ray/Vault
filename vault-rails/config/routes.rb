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
  get "/get_current_user_id", to: "user#get_current_user_id"

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
      post "add/:is_credit_card/:nickname", to: "accounts#add", constraints: { nickname: /[^\/]+/ }
      delete "remove/:id", to: "accounts#remove"
      patch "change_nickname/:id/:nickname", to: "accounts#change_nickname", constraints: { nickname: /[^\/]+/ }
    end
  end

  resources :transactions, only: [] do
    collection do
      get "get_recent", to: "transactions#get_recent"
      get "get_by_month/:month", to: "transactions#get_by_month"
      post "add/:account_id/:date/:amount/:category/:description", to: "transactions#add", constraints: { amount: /-?[.\d]+/, description: /[^\/]+/ }
      patch "edit/:id/:account_id/:date/:amount/:category/:description", to: "transactions#edit", constraints: { amount: /-?[.\d]+/, description: /[^\/]+/ }
      delete "remove/:id", to: "transactions#remove"
    end
  end

  resources :bills, only: [] do
    collection do
      get :get_all
      get :get_upcoming
      post "add/:due_date/:total/:category/:name", to: "bills#add", constraints: { total: /[.\d]+/, name: /[^\/]+/ }
      patch "edit/:id/:due_date/:total/:category/:name", to: "bills#edit", constraints: { total: /[.\d]+/, name: /[^\/]+/ }
      delete "remove/:id", to: "bills#remove"
    end
  end

  resources :residences, only: [] do
    collection do
      get :get_info
      post "create/:name/:monthly_payment", to: "residences#create", constraints: { name: /[^\/]+/ }
      patch "edit/:name/:monthly_payment", to: "residences#edit", constraints: { name: /[^\/]+/ }
      delete :leave
      delete :delete
      patch "invite_resident/:email", to: "residences#invite_resident", constraints: { email: /[^\/]+/ }
      patch "remove_resident/:id", to: "residences#remove_resident"
    end
  end

  resources :residence_bills, only: [] do
    collection do
      get :get_all
      get :get_upcoming
      get "get_by_month/:month", to: "residence_bills#get_by_month"
      get "get_payments/:id", to: "residence_bills#get_payments"
      post "add/:total/:category/:due_date", to: "residence_bills#add", constraints: { total: /[.\d]+/ }
      patch "edit/:id/:total/:category/:due_date", to: "residence_bills#edit", constraints: { total: /[.\d]+/ }
      delete "remove/:id", to: "residence_bills#remove"
    end
  end

  resources :residence_payments, only: [] do
    collection do
      post "add/:residence_bill_id/:payee_id/:amount", to: "residence_payments#add", constraints: { amount: /[.\d]+/ }
      patch "pay/:id", to: "residence_payments#pay"
    end
  end

  resources :residence_messages, only: [] do
    collection do
      get :get_recent
      get :get_all
      post "create/:is_update/:content", to: "residence_messages#create", constraints: { content: /[^\/]+/ }
    end
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
