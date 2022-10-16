from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import requests
headers = {'User-Agent': 'nick cs zgxc@protonmail.com'}

app = FastAPI()

@app.get("/cf/{cik}")
async def post_cf(cik):
    url = f'https://data.sec.gov/api/xbrl/companyfacts/{cik}.json'
    response2 = requests.get(url, headers=headers)
    #print()
    return response2.json()

app.mount("/", StaticFiles(directory="dist",html = True), name="static")



"""
    import requests
    headers = {'User-Agent': 'bigco jim sander vxxj@protonmail.com'}
    url = 'https://data.sec.gov/api/xbrl/companyfacts/CIK0000320193.json'
    response2 = requests.get(url, headers=headers)
"""

"""
    POST: to create data.
    GET: to read data.
    PUT: to update data.
    DELETE: to delete data.
"""