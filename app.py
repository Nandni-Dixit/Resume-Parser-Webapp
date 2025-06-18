import shutil
from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
import os
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS
from Parsers.main import process_uploaded_resumes
import uuid
from firebase_admin import auth



app = Flask(__name__)
CORS(app)

# Set up Firestore
cred = credentials.Certificate("./firestore_key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def delete_all_data_from_firestore():
    collection_ref = db.collection('resumes')
    docs = collection_ref.stream()

    for doc in docs:
        doc.reference.delete()  # Delete each document in the collection

# Folder to save uploads
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Allowed Extensions
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/protected-endpoint', methods=['POST'])
def protected_endpoint():
    id_token = request.headers.get('Authorization')
    if not id_token:
        return jsonify({'message': 'Unauthorized'}), 401

    try:
        decoded_token = auth.verify_id_token(id_token)
        user_id = decoded_token['uid']
        # Proceed with your logic for authenticated users
        return jsonify({'message': 'Access granted for user', 'uid': user_id}), 200
    except Exception as e:
        return jsonify({'message': 'Invalid token'}), 401

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'files[]' not in request.files:
        return "No file part", 400

    files = request.files.getlist('files[]')
    parsed_data = []

    # Ensure the upload folder exists
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            # Parsing the specific file instead of the entire folder
            data = process_uploaded_resumes(file_path)

            if isinstance(data, list) and len(data) > 0:
                data = data[0]  # Extract the dictionary from the list

            if 'skills' in data:
                data['skills'] = [skill.lower() for skill in data['skills']]  # Convert each skill to lowercase

            # Adding unique ID and saving data to Firestore
            resume_id = str(uuid.uuid4())
            db.collection('resumes').document(resume_id).set(data)
            parsed_data.append(data)
    return jsonify(parsed_data), 200

@app.route('/clear', methods=['DELETE'])
def delete_all():
    # 1. Delete all files in the upload folder
    try:
        if os.path.exists(UPLOAD_FOLDER):
            shutil.rmtree(UPLOAD_FOLDER)  # This deletes the entire folder and its contents
            os.makedirs(UPLOAD_FOLDER)  # Recreate the folder after deletion
        else:
            return jsonify({"message": "Upload folder does not exist."}), 400
    except Exception as e:
        return jsonify({"message": f"Error deleting files: {str(e)}"}), 500

    # 2. Delete all data from the database (Firestore)
    try:
        delete_all_data_from_firestore()  # Function to delete all data from Firestore
    except Exception as e:
        return jsonify({"message": f"Error deleting data: {str(e)}"}), 500

    return jsonify({"message": "All files and data deleted successfully!"})

@app.route('/search', methods=['GET'])
def search_candidates():
    skill = request.args.get('skill','').lower()
    candidates = []
    # Query Firestore for resumes containing the skill
    resumes_ref = db.collection('resumes')
    query = resumes_ref.where('skills', 'array_contains', skill).stream()
    for resume in query:
        candidate = resume.to_dict()
        candidates.append({
            "name": candidate['name'],
            "email": candidate['email'],
            "contact": candidate['contact'],
            "resume_link": candidate['resume_link']
        })
        
    return jsonify(candidates), 200

if __name__ == '__main__':
    app.run(debug=True)
