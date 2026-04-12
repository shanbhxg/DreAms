# somnAI - an dream analyser journal 

This code is for a website that analyses your dreams and predicts what they could mean for your real life. The analysis is done on some parameters and output is given on these:
* Symbolism
* Life context
* Emotions
* Theories of famos psychologists: Freud, Jung
* What could be your 16Personalities type?
* Steps to get better

Live URL: https://somnai.vercel.app/

There is a *nice* mode and a *mean* mode. In the nice mode, the LLM responds as a really nice friend who genuinely cares about you. 
But in the mean mode, you can get a sarcastic, but realistic response from the LLM, similar to what a best friend might give you 🙃.  

## Tech Stack for frontend 
* Vite for creating app
* Material Design for icons
* ReactJS (mainly two pages, Home.jsx and Login.jsx)
* ReactRouter for navigation
* React Markdown (react-markdown) for rendering LLM output

### Details of frontend

#### login.jsx
Renders form for signup/login, and sends POST requests to /login or /signup
On success, it will redirect to the homepage using useNavigate and passes user data via route state.

#### home.jsx
This is the main page where you can see user's dream history, create a new dream analysis, change modes etc.
* Fetch user data (/get_user_data)
* Display dream history in sidebar
* Add new dream (/generate_llm_response)
* Delete dream (/delete_dream)
* Render the LLM response using react-markdown
* Loading overlay for async operations

## Tech stack for backend

What all is used?

* Coding is all in **Python**
* AI used to generate the response is **Gemini**
* Database used is **Firebase**

### Details of backend

#### api.py

The API calls are managed by **BaseHTTPRequestHandler**.

The APIs defined are: 
* /generate_llm_response - hits the Gemini API and gets the response based on predefined prompt + user input
* /get_user_data - gets all the user's data from the Firebase backend
* /login - lets the user login after fetching the correct credentials and verifying with backend
* /signup - lets the user sign up a new profile and saves the user data to the Firebase backend
* /delete_dream - lets the user delete a dream from the history and delete it from Firebase backend

#### Firebase creds

Firebase usually downloads its secrets as a certificate but that cannot be used when deploying to vercel. 
So to fix that all Firebase secrets are stored as env vars as a dictionary and then parsed one by one.

In Firebase, the type of db used is **Realtime Database**.

#### LLM used

Gemini is the LLM used. 
Model used is: **gemini-1.5-flash**

#### Deployment

Deployed via Vercel (serverless) 

Rest of the code is pretty self-explanatory. Efforts have been put to capture all exception scenarios and give accurate output wherever possible.
