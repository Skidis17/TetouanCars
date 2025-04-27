from flask import Blueprint

# Le nom de la variable DOIT correspondre à ce que vous importez
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    return "Auth endpoint"