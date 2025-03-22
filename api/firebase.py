import json
import os
from datetime import datetime

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials, db

load_dotenv()


class FirebaseDB:
    def __init__(self):
        if not firebase_admin._apps:
            firebase_creds_str = os.environ.get("FIREBASE_CREDENTIALS")
            firebase_db_url = os.environ.get("FIREBASE_DATABASE_URL")

            if not firebase_creds_str or not firebase_db_url:
                raise ValueError(
                    "Missing Firebase credentials or database URL in environment variables."
                )

            firebase_creds_dict = json.loads(firebase_creds_str)
            cred = credentials.Certificate(firebase_creds_dict)

            firebase_admin.initialize_app(cred, {"databaseURL": firebase_db_url})

        self.ref = db.reference("/users")

    def update_user_data(self, current_data, user_input, llm_response, gender, age):
        current_date = datetime.utcnow().date().isoformat()
        if current_data:
            dreams = current_data.setdefault("Dreams", {})
            if user_input in dreams:
                dreams[user_input].append(
                    {"llm_response": llm_response, "date": current_date}
                )
            else:
                dreams[user_input] = [
                    {"llm_response": llm_response, "date": current_date}
                ]
        else:
            current_data = {
                "Dreams": {
                    user_input: [{"llm_response": llm_response, "date": current_date}]
                },
                "Gender": gender,
                "Age": age,
            }
        return current_data

    def add_data_to_firebase(self, user_name, user_input, gender, age, llm_response):
        user_ref = self.ref.child(user_name)
        # Use transaction for atomic updates
        user_ref.transaction(
            lambda current_data: self.update_user_data(
                current_data, user_input, llm_response, gender, age
            )
        )
        print(f"Data updated for user: {user_name}")

    def get_user_data(self, user_name):
        user_data = self.ref.child(user_name).get()
        if user_data:
            print(f"Data found for user: {user_name}")
            return user_data
        else:
            print(f"No data found for user: {user_name}")
            return {}

    def login(self, user_name, password):
        try:
            user_ref = self.ref.child(user_name).get()

            if not user_ref:
                return {"status": "404 - User Not found"}

            stored_password = user_ref.get("password")
            if stored_password != password:
                return {"status": "404 - Password does not match the username"}

            return {"status": "200 - OK"}

        except Exception as e:
            print(f"Error during login: {str(e)}")
            return {"status": "404 - Error"}

    def signup(self, user_name, password, age=None, gender=None):
        try:
            user_ref = self.ref.child(user_name).get()

            if user_ref:
                return {"status": "404 - User Name already exists"}

            new_user_data = {
                "password": password,
                "age": age if age else "",
                "gender": gender if gender else "",
                "Dreams": [],
            }
            self.ref.child(user_name).set(new_user_data)

            return {"status": "200 - OK"}

        except Exception as e:
            print(f"Error during signup: {str(e)}")
            return {"status": "404 - Error"}

    def delete_dream(self, user_name, dream_text):
        try:
            user_ref = self.ref.child(user_name).child("Dreams")
            dreams = user_ref.get()

            if not dreams:
                return {"status": "404 - No dreams found for user"}

            updated_dreams = [dream for dream in dreams if dream_text not in dream]

            if len(updated_dreams) == len(dreams):  # If no dream was deleted
                return {"status": "404 - Dream not found"}

            user_ref.set(updated_dreams)

            return {"status": "200 - Dream deleted successfully"}

        except Exception as e:
            print(f"Error deleting dream: {str(e)}")
            return {"status": "404 - Error"}
