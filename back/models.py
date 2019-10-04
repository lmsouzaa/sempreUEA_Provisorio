from app import db


class Aluno(db.Model):
    __tablename__ = 'uea_aluno'
    
    aluno_cpf = db.Column(db.String(12), unique=True)
    aluno_id = db.Column(db.String(32), primary_key=True)
    aluno_nome = db.Column(db.String(100))
    aluno_senha = db.Column(db.Text, nullable=False)
    aluno_email = db.Column(db.String(200))
    aluno_facebook = db.Column(db.String(200))
    aluno_linkedin = db.Column(db.String(200))
    aluno_whatsapp = db.Column(db.String(200))
    aluno_ano_ingresso = db.Column(db.Integer, nullable=False)
    aluno_ano_conclusao = db.Column(db.Integer)
    aluno_situacao = db.Column(db.Integer, nullable=False)
    aluno_discente_situacao = db.Column(db.Integer, nullable=False)
    aluno_discente_funcao = db.Column(db.String(200), nullable=False)
    aluno_discente_instituicao = db.Column(db.String(200), nullable=False)
    aluno_lattes = db.Column(db.String(200))
    aluno_data_cadastro = db.Column(db.DateTime)

    aluno_egresso_situacao = db.Column(db.Integer)
    aluno_egresso_funcao = db.Column(db.String(200))
    aluno_egresso_instituicao = db.Column(db.String(200))

    aluno_status = db.Column(db.Integer,nullable=False)
    aluno_matricula = db.Column(db.String(10), nullable=False)

    aluno_uea_curso = db.Column(db.Integer, db.ForeignKey('uea_curso.curso_id') ,nullable=False)
    aluno_uea_unidade = db.Column(db.Integer,db.ForeignKey('uea_unidade.unidade_id'), nullable=False)

class Unidade(db.Model):
    __tablename__ = 'uea_unidade'

    unidade_id = db.Column(db.Integer, primary_key=True)
    unidade_nome = db.Column(db.String(200), nullable=False)
    unidade_sigla = db.Column(db.String(10), nullable=False)
    unidade_status = db.Column(db.Integer, nullable=False)

    alunos = db.relationship('Aluno', backref='unidade', lazy=True)
    cursos = db.relationship('Curso', backref='unidade', lazy=True)

class Curso(db.Model):
    __tablename__ = 'uea_curso'

    curso_id = db.Column(db.Integer, primary_key=True)
    curso_sigla = db.Column(db.String(10), nullable=False)
    curso_nome = db.Column(db.String(200), nullable=False)
    curso_status = db.Column(db.Integer, nullable=False)

    alunos = db.relationship('Aluno', backref='curso', lazy=True)

    curso_unidade_id = db.Column(db.Integer, db.ForeignKey('uea_unidade.unidade_id'), nullable=False)