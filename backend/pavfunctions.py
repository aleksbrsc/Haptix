import requests
from time import sleep

url = "https://api.pavlok.com/api/v5/stimulus/send"

headers = {
    "accept": "application/json",
    "content-type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlBhcnRpbmcgT3JjaGlkIEJsYXN0b2lzZSIsImlkIjoyMDI0ODEsImVtYWlsIjoiZ2lvaWFiZWxsYUBtZS5jb20iLCJpc19hcHBsaWNhdGlvbiI6ZmFsc2UsImV4cCI6MTgwMDIyOTE4Mywic3ViIjoiYWNjZXNzIn0.162j0_fqFQG8I5XBdHmoEui-Vi2pRu79bchbGVtY4W4"
}

def sendRequest(mode, value):
    payload = { "stimulus": {
        "stimulusType": mode,
        "stimulusValue": value
    } }
    requests.post(url, json=payload, headers=headers)
    

def stimulate(mode, value, repeats, interval):
    for i in range(repeats):
        sendRequest(mode, value)
        sleep(interval)
