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
CORS(app, supports_credentials=True)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def clean_markdown(text):
    return re.sub(r'(\*\*|\*)', '', text)

# Role-specific skill requirements
ROLE_SKILLS = {
    'Frontend Developer': [
        'HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'Angular', 'TypeScript', 
        'Sass', 'Bootstrap', 'Tailwind CSS', 'jQuery', 'Webpack', 'Responsive Design',
        'Git', 'REST API', 'JSON', 'AJAX', 'DOM Manipulation', 'ES6+', 'NPM'
    ],
    'Backend Developer': [
        'Node.js', 'Python', 'Java', 'Express.js', 'Django', 'Flask', 'Spring Boot',
        'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'REST API', 'GraphQL', 'Git',
        'Docker', 'AWS', 'Authentication', 'Security', 'Testing', 'Microservices'
    ],
    'Full Stack Developer': [
        'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB',
        'SQL', 'PostgreSQL', 'Git', 'REST API', 'Authentication', 'Deployment',
        'Docker', 'AWS', 'TypeScript', 'Testing', 'CI/CD', 'Responsive Design'
    ],
    'Data Scientist': [
        'Python', 'R', 'SQL', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-learn',
        'TensorFlow', 'PyTorch', 'Jupyter', 'Statistics', 'Machine Learning', 'Deep Learning',
        'Data Visualization', 'Big Data', 'Hadoop', 'Spark', 'Tableau', 'Power BI'
    ],
    'Mobile Developer': [
        'React Native', 'Flutter', 'Swift', 'Kotlin', 'Java', 'Dart', 'iOS Development',
        'Android Development', 'Mobile UI/UX', 'API Integration', 'SQLite', 'Firebase',
        'App Store Deployment', 'Google Play Store', 'Mobile Testing'
    ],
    'DevOps Engineer': [
        'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Jenkins', 'Git', 'Linux',
        'Bash/Shell Scripting', 'Terraform', 'Ansible', 'CI/CD', 'Monitoring',
        'Nginx', 'Apache', 'Database Administration', 'Security', 'Networking'
    ],
    'UI/UX Designer': [
        'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'User Research',
        'Wireframing', 'Prototyping', 'User Testing', 'Information Architecture',
        'Interaction Design', 'Visual Design', 'Design Systems', 'Accessibility'
    ]
}

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
    session['skills'] = parsed_data['skills']
    print("Extracted skills:", parsed_data['skills'])
    return jsonify(parsed_data), 200

@app.route('/analyze', methods=['POST'])
def analyze_skills():
    print("🎯 /analyze route hit")
    data = request.get_json()
    target_role = data.get('target_role')
    current_skills = session.get('skills', [])
    
    # Get required skills for the target role
    required_skills = ROLE_SKILLS.get(target_role, ROLE_SKILLS['Frontend Developer'])
    
    # Find matching skills (case-insensitive)
    skill_match = []
    for required_skill in required_skills:
        for current_skill in current_skills:
            if required_skill.lower() == current_skill.lower():
                skill_match.append(required_skill)
                break
    
    # Find missing skills
    missing_skills = [skill for skill in required_skills if skill not in skill_match]
    
    # Generate AI-powered insights
    prompt = f"""
You are a career coach AI.

A user has the following skills: {', '.join(current_skills)}.
Their target job role is: {target_role}.
They are missing these skills: {', '.join(missing_skills[:10])}.  # Limit to avoid token overflow

💡 Please respond with the following sections clearly labeled:
1. [Motivation] A personalized, encouraging message about their career journey (1-2 sentences).
2. [Priority_Skills] List the top 5 most critical missing skills they should focus on first.
3. [Learning_Path] A 3-step strategic learning approach.
4. [Timeline] Estimated timeframe to become job-ready.
"""

    model = genai.GenerativeModel('gemini-1.5-flash')
    try:
        response = model.generate_content(prompt)
        ai_text = response.text
    except Exception as e:
        print(f"AI Generation error: {e}")
        ai_text = "Focus on building your core skills step by step."

    def extract_section(section):
        match = re.search(rf"\[{section}\](.*?)(\[\w+_?\w*\]|$)", ai_text, re.DOTALL)
        return clean_markdown(match.group(1).strip()) if match else ""

    motivation = extract_section("Motivation")
    priority_skills_text = extract_section("Priority_Skills")
    
    # Parse priority skills from AI response
    priority_skills = [s.strip() for s in re.split(r'[,\n\-•]', priority_skills_text) if s.strip()]
    priority_skills = [skill for skill in priority_skills if any(req.lower() in skill.lower() for req in required_skills)][:5]
    
    # If AI parsing fails, use our missing skills
    if not priority_skills:
        priority_skills = missing_skills[:5]

    # Categorize skills based on role
    skill_categories = categorize_skills_by_role(target_role, required_skills, skill_match)

    return jsonify({
        'required_skills': required_skills,
        'current_skills': current_skills,
        'missing_skills': missing_skills,
        'skill_match': skill_match,
        'skill_categories': skill_categories,
        'motivation': motivation or f"Great choice pursuing {target_role}! Focus on building your missing skills systematically.",
        'desired_role': target_role,
        'priority_skills': priority_skills
    }), 200

def categorize_skills_by_role(role, required_skills, matching_skills):
    """Categorize skills based on the target role"""
    
    categories_map = {
        'Frontend Developer': {
            'Core Languages': ['HTML', 'CSS', 'JavaScript', 'TypeScript'],
            'Frameworks & Libraries': ['React', 'Vue.js', 'Angular', 'jQuery'],
            'Styling & Design': ['Sass', 'Bootstrap', 'Tailwind CSS', 'Responsive Design'],
            'Tools & Build': ['Git', 'Webpack', 'NPM', 'REST API', 'AJAX']
        },
        'Backend Developer': {
            'Programming Languages': ['Node.js', 'Python', 'Java', 'PHP'],
            'Frameworks': ['Express.js', 'Django', 'Flask', 'Spring Boot'],
            'Databases': ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL'],
            'DevOps & Deployment': ['Docker', 'AWS', 'Git', 'CI/CD', 'Testing']
        },
        'Full Stack Developer': {
            'Frontend': ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript'],
            'Backend': ['Node.js', 'Express.js', 'Python', 'REST API'],
            'Database': ['MongoDB', 'SQL', 'PostgreSQL'],
            'DevOps': ['Git', 'Docker', 'AWS', 'Deployment', 'Testing']
        },
        'Data Scientist': {
            'Programming': ['Python', 'R', 'SQL'],
            'Data Analysis': ['Pandas', 'NumPy', 'Statistics'],
            'Visualization': ['Matplotlib', 'Seaborn', 'Tableau', 'Power BI'],
            'Machine Learning': ['Scikit-learn', 'TensorFlow', 'PyTorch', 'Deep Learning']
        },
        'Mobile Developer': {
            'Cross-Platform': ['React Native', 'Flutter'],
            'Native iOS': ['Swift', 'iOS Development'],
            'Native Android': ['Kotlin', 'Java', 'Android Development'],
            'Backend Integration': ['API Integration', 'Firebase', 'SQLite']
        },
        'DevOps Engineer': {
            'Containerization': ['Docker', 'Kubernetes'],
            'Cloud Platforms': ['AWS', 'Azure', 'GCP'],
            'CI/CD': ['Jenkins', 'Git', 'Automation'],
            'Infrastructure': ['Linux', 'Terraform', 'Ansible', 'Monitoring']
        },
        'UI/UX Designer': {
            'Design Tools': ['Figma', 'Adobe XD', 'Sketch', 'Photoshop'],
            'Research & Testing': ['User Research', 'User Testing', 'A/B Testing'],
            'Design Process': ['Wireframing', 'Prototyping', 'Information Architecture'],
            'Accessibility': ['Design Systems', 'Accessibility', 'Interaction Design']
        }
    }
    
    default_categories = {
        'Technical Skills': required_skills[:len(required_skills)//2],
        'Additional Skills': required_skills[len(required_skills)//2:]
    }
    
    role_categories = categories_map.get(role, default_categories)
    
    result = []
    colors = ['blue', 'green', 'purple', 'orange', 'red', 'indigo']
    
    for i, (category_name, category_skills) in enumerate(role_categories.items()):
        # Find skills that belong to this category and are in required_skills
        relevant_skills = [skill for skill in category_skills if skill in required_skills]
        
        if relevant_skills:  # Only add category if it has relevant skills
            result.append({
                'name': category_name,
                'color': colors[i % len(colors)],
                'skills': relevant_skills
            })
    
    return result

def get_color(category):
    return {
        'frontend': 'blue',
        'backend': 'green',
        'devops': 'brown',
        'database': 'purple',
        'other': 'gray'
    }.get(category.lower(), 'gray')

# Add route to get available roles
@app.route('/roles', methods=['GET'])
def get_available_roles():
    """Return list of available roles for the frontend"""
    return jsonify({
        'roles': list(ROLE_SKILLS.keys()),
        'total': len(ROLE_SKILLS)
    }), 200

# Add route to get skills for a specific role
@app.route('/role-skills/<role>', methods=['GET'])
def get_role_skills(role):
    """Get required skills for a specific role"""
    if role not in ROLE_SKILLS:
        return jsonify({'error': 'Role not found'}), 404
    
    return jsonify({
        'role': role,
        'required_skills': ROLE_SKILLS[role],
        'total_skills': len(ROLE_SKILLS[role])
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5001)