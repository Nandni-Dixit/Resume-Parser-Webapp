import os
import io
import pickle
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.http import MediaIoBaseDownload

# Define the scopes needed
SCOPES = ['https://www.googleapis.com/auth/drive.readonly']

def authenticate_drive():
    """Authenticate the user and create the Drive API client."""
    creds = None

    # Load token.pickle if it exists
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)

    # If there are no credentials, login and generate them
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)

        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('drive', 'v3', credentials=creds)
    return service

def fetch_files_from_drive(folder_id=None):
    """Fetch all files from a Google Drive folder and download them locally."""
    service = authenticate_drive()
    resumes = []

    # Fetch the files from the folder if folder_id is provided, otherwise fetch all files
    query = f"'{folder_id}' in parents" if folder_id else "'root' in parents"
    results = service.files().list(q=query, pageSize=10, fields="files(id, name, mimeType)").execute()
    items = results.get('files', [])

    if not items:
        print("No files found.")
        return resumes

    # Create a directory for the downloaded files
    if not os.path.exists('./downloaded_resumes'):
        os.makedirs('./downloaded_resumes')

    for item in items:
        file_id = item['id']
        file_name = item['name']
        
        # Only download PDF and DOCX files
        if item['mimeType'] in ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']:
            request = service.files().get_media(fileId=file_id)
            file_path = f"./downloaded_resumes/{file_name}"

            with io.FileIO(file_path, 'wb') as fh:
                downloader = MediaIoBaseDownload(fh, request)
                done = False
                while not done:
                    status, done = downloader.next_chunk()
                    print(f"Downloaded {file_name} ({int(status.progress() * 100)}%).")

            resumes.append({
                'name': file_name,
                'path': file_path
            })

    return resumes
