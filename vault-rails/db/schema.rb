# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2024_12_23_091629) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "accounts", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "nickname", null: false
    t.boolean "is_credit_card", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "bills", force: :cascade do |t|
    t.integer "user_id"
    t.string "name"
    t.string "category"
    t.integer "due_date"
    t.boolean "shared"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "residence_id"
    t.float "total"
    t.index ["residence_id"], name: "index_bills_on_residence_id"
  end

  create_table "monthly_spendings", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "month", null: false
    t.decimal "total", precision: 10, scale: 2, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "residence_messages", force: :cascade do |t|
    t.string "content"
    t.boolean "is_update"
    t.integer "time"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "residence_id", null: false
    t.bigint "user_id", null: false
    t.index ["residence_id"], name: "index_residence_messages_on_residence_id"
    t.index ["user_id"], name: "index_residence_messages_on_user_id"
  end

  create_table "residences", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "transactions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "account_id", null: false
    t.integer "date", null: false
    t.float "amount", null: false
    t.string "description", null: false
    t.string "category", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.string "jti", null: false
    t.bigint "residence_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["residence_id"], name: "index_users_on_residence_id"
  end

  add_foreign_key "accounts", "users"
  add_foreign_key "bills", "residences"
  add_foreign_key "bills", "users"
  add_foreign_key "monthly_spendings", "users"
  add_foreign_key "residence_messages", "residences"
  add_foreign_key "residence_messages", "users"
  add_foreign_key "transactions", "accounts"
  add_foreign_key "transactions", "users"
  add_foreign_key "users", "residences"
end
