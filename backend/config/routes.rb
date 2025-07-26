Rails.application.routes.draw do
  resources :users, only: [ :index ] do
    collection do
      get :me
      post :login
      delete :logout
    end
  end

  resources :rewards, only: [ :index ]
  resources :redemptions, only: [ :create, :index ]

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  get "up" => "rails/health#show", as: :rails_health_check
end
