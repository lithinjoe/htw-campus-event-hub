import azure.functions as func
import logging
import json

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="upload_banner", methods=["POST"])
def upload_banner(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Processing banner image upload request.')

    try:
        req_body = req.get_json()
    except ValueError:
        return func.HttpResponse(
            json.dumps({"error": "Invalid JSON body"}),
            status_code=400,
            mimetype="application/json"
        )
import azure.functions as func
import logging
import os
from azure.storage.blob import BlobServiceClient

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="upload_banner")
def upload_banner(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Processing image upload request.')

    try:
        file = req.files.get('file')
        if not file:
            return func.HttpResponse("No file provided in request", status_code=400)

        connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
        if not connection_string:
            return func.HttpResponse("Storage configuration missing", status_code=500)

        blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        container_name = "banners"
        blob_client = blob_service_client.get_blob_client(container=container_name, blob=file.filename)

        blob_client.upload_blob(file.stream, overwrite=True)

        return func.HttpResponse(
            f'{{"url": "{blob_client.url}"}}',
            mimetype="application/json",
            status_code=200
        )
    except Exception as e:
        return func.HttpResponse(f"Error uploading image: {str(e)}", status_code=500)
    file_name = req_body.get('filename')
    
    if not file_name:
        return func.HttpResponse(
            json.dumps({"error": "Filename is required"}),
            status_code=400,
            mimetype="application/json"
        )

    # Simulating Azure Blob Storage upload and CDN URL generation
    cdn_url = f"https://htweventstore.blob.core.windows.net/banners/{file_name}"

    response_payload = {
        "message": "Image successfully processed and uploaded to Azure Blob Storage",
        "imageUrl": cdn_url,
        "status": "success"
    }

    return func.HttpResponse(
        json.dumps(response_payload),
        status_code=200,
        mimetype="application/json"
    )