class Utility:
    def extract_variables(self, data):

        user_input = data.get("user_input", {})
        user_input_prompt = user_input.get("prompt", "Unknown")
        age = user_input.get("age", "Unknown")
        gender = user_input.get("gender", "Undefined")
        devil_flag = user_input.get("isDevilMode", False)

        print(f"Received user input: {user_input}")

        return user_input_prompt, age, gender, devil_flag

    def split_string(self, response):

        lines_arr = response.split("\n")
        return lines_arr
