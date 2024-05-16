from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost/Utenti'
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'
    Id = db.Column(db.Integer, primary_key=True)
    Nome = db.Column(db.String(50))
    Cognome = db.Column(db.String(50))
    Mail = db.Column(db.String(100), unique=True)
    Password = db.Column(db.String(100))
    Ruolo = db.Column(db.String(50))

    def __init__(self, nome, cognome, email, password, ruolo):
        self.nome = nome
        self.cognome = cognome
        self.email = email
        self.password = password
        self.ruolo = ruolo

@app.route('/dialog-user-window', methods=['POST'])
def signup():
    data = request.json
    new_user = User(nome=data['nome'], cognome=data['cognome'], email=data['email'], password=data['password'], ruolo=data['ruolo'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User signed up successfully'}), 201

if __name__ == '__main__':
    app.run(debug=True)
