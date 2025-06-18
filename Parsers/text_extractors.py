import docx2txt
from pdfminer.high_level import extract_text

#Extracting text from DOCX
def extract_text_from_docx(file_path):
    txt = docx2txt.process(file_path)
    if txt:
        text = txt.replace('\t', ' ')
        return text
    return None


# Extracting text from PDF
def extract_text_from_pdf(file_path):
    text = extract_text(file_path)
    return text

