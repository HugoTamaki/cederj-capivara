Rails.application.routes.draw do

  root 'home#index'

  namespace :api, as: nil, defaults: {format: :json} do
    namespace :v1, as: nil do
      devise_for :users,
      controllers: {
        registrations: 'users/registrations',
        sessions: 'users/sessions'
      }

      resources :users, only: [:index, :show]

      resources :room_entry_requests, only: [:index, :create] do
        get :sent_requests, on: :collection
        put :accept, on: :member
      end

      resources :rooms do
        get :search, on: :collection
        get :participating_rooms, on: :collection
        resources :topics do
          resources :messages
        end
      end
      resources :courses
    end
  end

  get '*path' => "home#index"

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
