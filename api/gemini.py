import os

import google.generativeai as genai
from dotenv import load_dotenv

from prompts import mean_predefined_prompt, nice_predefined_prompt
from utility import Utility

load_dotenv()


class LLMResponse:
    def __init__(self):
        self.model = genai.GenerativeModel("gemini-1.5-flash")

        GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", None)

        genai.configure(api_key=GOOGLE_API_KEY)

    def prompt(self, user_input, gender, age, devil_flag):

        if devil_flag:
            full_prompt = mean_predefined_prompt.format(user_input, gender, age)
        else:
            full_prompt = nice_predefined_prompt.format(user_input, gender, age)

        response = self.model.generate_content(full_prompt)
        print(response.text)
        print("response from gemini.py", type(response.text))

        utility_obj = Utility()
        response_arr = utility_obj.split_string(response.text)

        response_dict = {"output": response_arr}

        return response_dict
