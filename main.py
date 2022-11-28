from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import requests
headers = {'User-Agent': 'nick cs zgxc@protonmail.com'}

app = FastAPI()

@app.get("/cf/{cik}")
async def post_cf(cik):
    url = f'https://data.sec.gov/api/xbrl/companyfacts/CIK{cik.zfill(10)}.json'
    response = requests.get(url, headers=headers)
    return response.json()

app.mount("/", StaticFiles(directory="dist",html = True), name="static")