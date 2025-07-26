class CreateRedemptions < ActiveRecord::Migration[8.0]
  def change
    create_table :redemptions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :reward, null: false, foreign_key: true
      t.integer :amount, null: false

      t.timestamps
    end

    add_index :redemptions, :created_at
  end
end
