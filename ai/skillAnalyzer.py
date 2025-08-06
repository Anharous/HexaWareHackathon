import os
import re
import fitz  # PyMuPDF
import docx
import google.generativeai as genai
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from skills_db import SKILLS_DB

# Configure Gemini API
genai.configure(api_key="AIzaSyAyRQXzKmWkV1ElA7uajNix_MN85xhXDds")



# Initialize Flask app
app = Flask(__name__)
app.secret_key = 'supersecretkey'
CORS(app, supports_credentials=True)  # Allow frontend access from different origin

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# Removing in op **
def clean_markdown(text):
    return re.sub(r'(\*\*|\*)', '', text)

# ------------------- Resume Parsing -------------------
def parse_resume(file_path):
    text = ""
    if file_path.endswith('.pdf'):
        with fitz.open(file_path) as doc:
            for page in doc:
                text += page.get_text()
    elif file_path.endswith('.docx'):
        doc = docx.Document(file_path)
        for para in doc.paragraphs:
            text += para.text
    elif file_path.endswith('.txt'):
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()

    email = re.search(r'[\w\.-]+@[\w\.-]+', text)
    linkedin = re.search(r'(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+', text)

    skills = []
    for skill in SKILLS_DB:
        if re.search(r'\b' + re.escape(skill) + r'\b', text, re.IGNORECASE):
            skills.append(skill)

    return {
        'email': email.group(0) if email else 'Not found',
        'linkedin': linkedin.group(0) if linkedin else 'Not found',
        'skills': skills
    }


# ------------------- Upload Route -------------------
@app.route('/upload', methods=['POST'])
def upload_resume():
    if 'resume' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    resume = request.files['resume']
    if resume.filename == '':
        return jsonify({'error': 'Empty file name'}), 400

    file_path = os.path.join(UPLOAD_FOLDER, resume.filename)
    resume.save(file_path)

    parsed_data = parse_resume(file_path)
    session['skills'] = parsed_data['skills']  # Store skills in session
    print("Extracted skills:", parsed_data['skills'])
    return jsonify(parsed_data), 200


# ------------------- Analyze Route -------------------
@app.route('/analyze', methods=['POST'])
def analyze_skills():
    print("🎯 /analyze route hit")
    data = request.get_json()
    target_role = data.get('target_role')
    # skills = session.get('skills', [])
    current_skills = session.get('skills', [])
    prompt = f"""
You are a career coach AI.

A user has the following skills: {', '.join(current_skills)}.
Their target job role is: {target_role}.

💡 Please respond with the following sections clearly labeled:
1. [Skill_Gaps] List of skills they are missing in short and crisp manner.
2. [Upskilling_Plan] A 3-step personalized upskilling plan in pointwise and crystal clear.
3. [Motivation] A short motivational tip in a sentence.
4. [Categories] Categorize the required skills into Frontend, Backend, DevOps, Database or other relevant to the target role.
"""

    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt)
    text = response.text

    def extract(section):
        match = re.search(rf"\[{section}\](.*?)(\[\w+_?\w*\]|$)", text, re.DOTALL)
        return match.group(1).strip() if match else ""

   # Extract each section
    skill_gaps_raw = clean_markdown(extract("Skill_Gaps"))
    upskilling_plan = clean_markdown(extract("Upskilling_Plan"))
    motivation = clean_markdown(extract("Motivation"))
    categories_raw = clean_markdown(extract("Categories"))

    # Parse required and missing skills
    missing_skills = [s.strip() for s in re.split(r'[,\n]', skill_gaps_raw) if s.strip()]
    
    skill_categories = []
    required_skills_set = set()

    for line in categories_raw.splitlines():
        if ':' in line:
            category, skills_str = line.split(':', 1)
            skills = [s.strip() for s in skills_str.split(',') if s.strip()]
            required_skills_set.update(skills)
            skill_categories.append({
                'name': category.strip(),
                'color': get_color(category.strip().lower()),
                'skills': skills
            })

    required_skills = list(required_skills_set)
    skill_match = list({
        skill for skill in required_skills
        if skill.lower() in [s.lower() for s in current_skills]
    })

    return jsonify({
        'required_skills': required_skills,
        'current_skills': current_skills,
        'missing_skills': missing_skills,
        'skill_match': skill_match,
        'skill_categories': skill_categories,
        'motivation': motivation,
        'desired_role': target_role
    }), 200


def get_color(category):
    return {
        'frontend': 'blue',
        'backend': 'green',
        'devops': 'brown',
        'database': 'purple',
        'other': 'gray'
    }.get(category.lower(), 'gray')


# ------------------- Main -------------------
if __name__ == '__main__':
    app.run(debug=True, port=5001)
