import json
from http.server import BaseHTTPRequestHandler, HTTPServer

from api.object_creator import firebase_obj, gemini_obj, utility_obj


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers["Content-Length"])
        post_data = self.rfile.read(content_length)
        decoded_data = post_data.decode("utf-8")

        print(f"Raw POST data (decoded): {decoded_data}")

        try:
            data = json.loads(decoded_data)

            if self.path == "/api/generate_llm_response":
                (
                    user_input_prompt,
                    age,
                    gender,
                    devil_flag,
                    user_name,
                ) = utility_obj.extract_variables(data)

                response = gemini_obj.prompt(
                    user_input_prompt, gender, age, devil_flag, user_name
                )

                print("response from api.py", type(response))

                # Send the response
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(response).encode("utf-8"))

            elif self.path == "/delete_dream":
                try:
                    user_name = data.get("user_name")
                    dream_text = data.get("dream_text")

                    if not user_name or not dream_text:
                        self.send_response(400)
                        self.send_header("Content-type", "application/json")
                        self.end_headers()
                        self.wfile.write(
                            json.dumps({"error": "Missing 'user_name' or 'dream_text'"}).encode("utf-8")
                        )
                        return

                    response = firebase_obj.delete_dream(user_name, dream_text)

                    if "404" in response["status"]:
                        self.send_response(404)
                    elif "200" in response["status"]:
                        self.send_response(200)
                    else:
                        self.send_response(500)

                    self.send_header("Content-type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps(response).encode("utf-8"))

                except Exception as e:
                    print(f"Error in delete_dream route: {str(e)}")
                    self.send_response(500)
                    self.send_header("Content-type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "500 - Internal Server Error"}).encode("utf-8"))

            elif self.path == "/api/get_user_data":
                user_name = data.get("user_name")

                if not user_name:
                    self.send_response(400)
                    self.send_header("Content-type", "application/json")
                    self.end_headers()
                    self.wfile.write(
                        json.dumps({"error": "Missing 'user_name' in body"}).encode(
                            "utf-8"
                        )
                    )
                    return

                user_data = firebase_obj.get_user_data(user_name)

                if user_data:
                    self.send_response(200)
                    self.send_header("Content-type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps(user_data).encode("utf-8"))
                else:
                    self.send_response(404)
                    self.send_header("Content-type", "application/json")
                    self.end_headers()
                    self.wfile.write(
                        json.dumps({"error": "User not found"}).encode("utf-8")
                    )

            elif self.path == "/api/login":
                user_name = data.get("user_name")
                password = data.get("password")
                if not user_name or not password:
                    self.send_response(400)
                    self.send_header("Content-type", "application/json")
                    self.end_headers()
                    self.wfile.write(
                        json.dumps({"status": "404 - Error"}).encode("utf-8")
                    )
                    return

                login_response = firebase_obj.login(user_name, password)

                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(login_response).encode("utf-8"))
                return

            elif self.path == "/api/signup":
                user_name = data.get("user_name")
                password = data.get("password")
                age = data.get("age")
                gender = data.get("gender")

                if not user_name or not password:
                    self.send_response(400)
                    self.send_header("Content-type", "application/json")
                    self.end_headers()
                    self.wfile.write(
                        json.dumps({"status": "404 - Error"}).encode("utf-8")
                    )
                    return

                signup_response = firebase_obj.signup(user_name, password, age, gender)

                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(signup_response).encode("utf-8"))
                return

            else:
                self.send_response(404)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                self.wfile.write(b"Not Found")

        except json.JSONDecodeError:
            self.send_response(400)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Invalid JSON data"}).encode("utf-8"))


# local checks
# def run():
#     server_address = ("", 8080)
#     httpd = HTTPServer(server_address, Handler)
#     print("Starting server on http://localhost:8080")
#     httpd.serve_forever()


# if __name__ == "__main__":
#     run()
