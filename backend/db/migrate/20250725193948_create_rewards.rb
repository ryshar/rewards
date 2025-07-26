class CreateRewards < ActiveRecord::Migration[8.0]
  def change
    create_table :rewards do |t|
      t.string :name
      t.text :description
      t.integer :cost

      t.timestamps
    end

    add_index :rewards, :cost
  end
end
