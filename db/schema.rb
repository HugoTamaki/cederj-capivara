# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160722005523) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "api_keys", force: :cascade do |t|
    t.string   "secret"
    t.string   "key"
    t.datetime "expires_at"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "courses", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "disciplines", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "course_id"
  end

  add_index "disciplines", ["course_id"], name: "index_disciplines_on_course_id", using: :btree

  create_table "messages", force: :cascade do |t|
    t.text     "content"
    t.integer  "topic_id"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "messages", ["topic_id", "user_id"], name: "index_messages_on_topic_id_and_user_id", using: :btree

  create_table "room_entry_requests", force: :cascade do |t|
    t.integer  "room_id"
    t.integer  "sender_id"
    t.integer  "receiver_id"
    t.string   "token"
    t.boolean  "accepted",    default: false
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
  end

  add_index "room_entry_requests", ["receiver_id"], name: "index_room_entry_requests_on_receiver_id", using: :btree
  add_index "room_entry_requests", ["room_id"], name: "index_room_entry_requests_on_room_id", using: :btree
  add_index "room_entry_requests", ["sender_id"], name: "index_room_entry_requests_on_sender_id", using: :btree

  create_table "room_users", force: :cascade do |t|
    t.integer  "room_id"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "room_users", ["room_id", "user_id"], name: "index_room_users_on_room_id_and_user_id", using: :btree

  create_table "rooms", force: :cascade do |t|
    t.string   "name"
    t.boolean  "public",     default: false
    t.integer  "user_id"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  add_index "rooms", ["user_id"], name: "index_rooms_on_user_id", using: :btree

  create_table "topics", force: :cascade do |t|
    t.string   "name"
    t.text     "content"
    t.integer  "room_id"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "topics", ["room_id", "user_id"], name: "index_topics_on_room_id_and_user_id", using: :btree

  create_table "user_disciplines", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "discipline_id"
    t.string   "status",        default: "incomplete"
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
  end

  add_index "user_disciplines", ["user_id", "discipline_id"], name: "index_user_disciplines_on_user_id_and_discipline_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "first_name",             default: "", null: false
    t.string   "last_name",              default: "", null: false
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "auth_token"
    t.datetime "expire_at"
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.integer  "course_id"
  end

  add_index "users", ["course_id"], name: "index_users_on_course_id", using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
