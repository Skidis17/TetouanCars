from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from .. import mongo 
import bcrypt

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        
        print(f"Tentative de connexion avec email: {email}")  # Debug
        
        admin = mongo.db.admins.find_one({'email': email})
        
        if admin:
            print(f"Admin trouvé: {admin['_id']}")  # Debug
            try:
                stored_hash = admin['mdp'].encode('utf-8')
                if bcrypt.checkpw(password.encode('utf-8'), stored_hash):
                    session.clear()
                    session['user_id'] = str(admin['_id'])
                    session['email'] = admin['email']
                    print("Connexion réussie! Redirection vers /dashboard")  # Debug
                    return redirect(url_for('main.dashboard'))  # Correction ici
                else:
                    print("Mot de passe incorrect")  # Debug
            except Exception as e:
                print(f"Erreur auth: {str(e)}")  # Debug
        else:
            print("Admin non trouvé")  # Debug
        
        flash('Identifiants incorrects', 'danger')
        return redirect(url_for('main.login'))
    
    return render_template('login.html')

@main.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        flash('Veuillez vous connecter')
        return redirect(url_for('main.login'))
    return render_template('admin/admin_dashboard.html')

@main.route('/logout')
def logout():
    session.clear()
    flash('Vous avez été déconnecté')
    return redirect(url_for('main.login'))