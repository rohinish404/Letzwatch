import requests

url = "https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1"

headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZDg3ODljNzU1YzM1YzNmMWRhZDcwMGU2ZDk0MmNkNSIsIm5iZiI6MTczMjk0NjQ1Ni4xNDgsInN1YiI6IjY3NGFhYTE4MWU2MWU5MjdkZTE4YzQ0YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.E5ZEr567DUBtfeLL5xDXdZD918JJwSyiNUD7166THNw"
}

params = {
    "query": "Jack Reacher"
}

response = requests.get(url, headers=headers, params=params)

print(response.text)

