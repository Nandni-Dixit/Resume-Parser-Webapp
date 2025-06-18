import os
from .text_extractors import extract_text_from_pdf, extract_text_from_docx
from .data_extractors import extract_name, extract_email, extract_contact_number, extract_skills, extract_education#, extract_work_experience
from .drive_integration import fetch_files_from_drive

def extract_text(file_path):
    """Determine the file type and extract text accordingly."""
    if file_path.endswith('.docx'):
        return extract_text_from_docx(file_path)
    elif file_path.endswith('.pdf'):
        return extract_text_from_pdf(file_path)
    else:
        raise ValueError("Unsupported file type")

def process_local_resume(file_path):
    """Process a local resume file and return parsed data."""
    resume_text = extract_text(file_path)
    return {
        'name': extract_name(resume_text),
        'email': extract_email(resume_text),
        'contact': extract_contact_number(resume_text),
        'skills': extract_skills(resume_text),
        'education': extract_education(resume_text),
        # 'experience': extract_work_experience(resume_text)
    }

def process_uploaded_resumes(file_path, include_drive=False, drive_folder_id=None):

    """
    Process a single uploaded resume (either local or from Google Drive).
    :param file_path: The path to the file being processed.
    :param include_drive: Boolean to indicate whether to include Google Drive files.
    :param drive_folder_id: The ID of the Google Drive folder to fetch files from (optional).
    :return: A dictionary containing parsed resume data.
    """
    parsed_data_list = []
    
    # Process the locally uploaded file
    if file_path.endswith(('.pdf', '.docx')):
        parsed_data = process_local_resume(file_path)
        parsed_data['resume_link'] = os.path.basename(file_path)  # Use filename as the resume link
        parsed_data_list.append(parsed_data)
    
    # Optionally process files from Google Drive
    if include_drive and drive_folder_id:
        drive_files = fetch_files_from_drive(drive_folder_id)
        for drive_file in drive_files:
            drive_file_path = drive_file['path']
            parsed_data = process_local_resume(drive_file_path)
            parsed_data['resume_link'] = drive_file['name']  # Use Google Drive file name as the link
            parsed_data_list.append(parsed_data)
    
    return parsed_data_list
