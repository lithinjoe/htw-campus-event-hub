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