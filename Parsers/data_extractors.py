import re
from spacy.matcher import Matcher


#Function to extract Name
def extract_name(text):
    name = None
    # Use regex pattern to find a potential name
    pattern = r"(\b([A-Z][a-z]+(?:[-'\s]?[A-Z][a-z]+)*|[A-Z]+\b(?:[-'\s]?[A-Z]+)*)\b)"
    match = re.search(pattern, text)
    if match:
        name = match.group()
    return name

#Function to extract Contact Number
def extract_contact_number(text):
    contact_number = None
    #using regex pattern to find contact
    pattern = r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b"
    match = re.search(pattern,text)
    if match:
        contact_number = match.group()
    return contact_number

#Function to extract Email Address
def extract_email(text):
    email = None
    # Using regex pattern to find email address
    pattern = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"
    match = re.search(pattern, text)
    if match:
        email = match.group()
    return email

#Function to extract Skills
def extract_skills(text):
    skills_list = [
    "Python", "JavaScript", "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Go", "R", "TypeScript", "Kotlin",
    "HTML", "CSS", "React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Flask", "Bootstrap",
    "MySQL", "PostgreSQL", "SQLite", "MongoDB", "Oracle", "Firebase", "DynamoDB", "Redis",
    "AWS", "Google Cloud", "Azure", "Docker", "Kubernetes", "Terraform", "Jenkins", "CI/CD", "Git", "GitHub",
    "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "Keras", "PyTorch", "Matplotlib", "Seaborn", "Tableau", "Power BI",
    "Android", "iOS", "React Native", "Flutter", "Xamarin",
    "Linux", "Windows", "MacOS", "Photoshop", "Illustrator", "Excel", "Word", "PowerPoint", "VSCode", "Eclipse",
    "Leadership", "Teamwork", "Communication", "Problem Solving", "Time Management", "Critical Thinking", "Adaptability", "Creativity"
]
    skills = []
    for skill in skills_list:
        pattern = r"\b{}\b".format(re.escape(skill))
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            skills.append(skill)
    return skills

#Function to extract Education
def extract_education(text):
    education = []
    # List of education keywords to match against
    education_keywords =  [
    "BSC", "BA", "BBA", "BCom", "BCA", "BTech", "BE", "BS", "LLB","B.E",
    "MSC", "MA", "MBA", "MCom", "MCA", "MTech", "ME", "MS", "LLM",
    "PhD", "Doctorate", "Diploma", "PG Diploma", "Certification", "Associate Degree",
    "MBBS", "MD", "BDS", "MDS", "BPharm", "MPharm", "DPharm", "DVM", "DDS"
]
    for keyword in education_keywords:
        pattern = r"(?i)\b{}\b".format(re.escape(keyword))
        match = re.search(pattern, text)
        if match:
            education.append(match.group())
    return education



# #Function to extract work Experience
# def extract_work_experience(text):
#     # Defining a pattern to match date ranges 
#     date_pattern = r'((?:\bJan|\bFeb|\bMar|\bApr|\bMay|\bJun|\bJul|\bAug|\bSep|\bOct|\bNov|\bDec)\s+\d{4})\s*-\s*((?:\bJan|\bFeb|\bMar|\bApr|\bMay|\bJun|\bJul|\bAug|\bSep|\bOct|\bNov|\bDec)\s+\d{4}|\bPresent\b|\d{4})'
#     # A pattern to capture job titles or positions based on common keywords
#     position_pattern = r'(?:Position|Title|Role|Job):\s*([\w\s]+)'
#     # Extract all matches for dates
#     experience_matches = re.findall(date_pattern, text)
#     # Extract possible job titles or positions
#     positions = re.findall(position_pattern, text)
#     # Combine the extracted date ranges with positions (optional logic based on how data is structured)
#     experience = []
#     for i, match in enumerate(experience_matches):
#         start_date, end_date = match
#         position = positions[i] if i < len(positions) else "Unknown Position"
#         experience.append({
#             "start_date": start_date,
#             "end_date": end_date,
#             "position": position
#         })
#     return experience
