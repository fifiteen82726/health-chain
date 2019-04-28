class AddTransactionHashToRequest < ActiveRecord::Migration[5.1]
  def change
    add_column :requests, :tx, :string
  end
end
