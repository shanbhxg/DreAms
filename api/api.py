import json
from http.server import BaseHTTPRequestHandler, HTTPServer

from gemini import LLMResponse
from utility import Utility


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):

        if self.path == "/generate_llm_response":

            content_length = int(self.headers["Content-Length"])
            post_data = self.rfile.read(content_length)
            decoded_data = post_data.decode("utf-8")

            print(f"Raw POST data (decoded): {decoded_data}")

            try:
                data = json.loads(decoded_data)

                utility_obj = Utility()
                (
                    user_input_prompt,
                    age,
                    gender,
                    devil_flag,
                ) = utility_obj.extract_variables(data)

                llm_response_obj = LLMResponse()

                response = llm_response_obj.prompt(
                    user_input_prompt, gender, age, devil_flag
                )

                print("response from api.py", type(response))

                # Send the response
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(response).encode("utf-8"))

            except json.JSONDecodeError:
                self.send_response(400)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(
                    json.dumps({"error": "Invalid JSON data"}).encode("utf-8")
                )
        else:
            self.send_response(404)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            self.wfile.write(b"Not Found")


# local checks
# def run():
#     server_address = ("", 8080)
#     httpd = HTTPServer(server_address, Handler)
#     print("Starting server on http://localhost:8080")
#     httpd.serve_forever()


# if __name__ == "__main__":
#     run()
