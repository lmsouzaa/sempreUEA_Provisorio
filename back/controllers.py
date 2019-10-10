#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import re
import jwt
import datetime
import hashlib
from flask_cors import CORS
from werkzeug.utils import secure_filename
from flask import Flask, jsonify, request, make_response, send_file, session
from functools import wraps
from flask_sqlalchemy import SQLAlchemy #comunicacao com o banco

from models import *
from app import app, db
from functools import wraps

##decorators##
#API KEY
def require_appkey(view_function):
    @wraps(view_function)
    # the new, post-decoration function. Note *args and **kwargs here.
    def decorated_function(*args, **kwargs):
        with open('api.key', 'r') as apikey:
            key=apikey.read().replace('\n', '')
        #if request.args.get('key') and request.args.get('key') == key:
        if request.headers.get('x-api-key') and request.headers.get('x-api-key') == key:
            return view_function(*args, **kwargs)
        else:
            response = make_response(jsonify({'message': 'Não autorizado'}), 401)
            return response
    return decorated_function

#USER TOKEN
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            response = make_response(jsonify({'message': 'Token is missing!'}), 401)
            response.headers['Access-Control-Allow-Origin'] = '*'
            return response

        try:
            data = jwt.decode(token, 'sempreuea')
            current_user = Aluno.query.filter_by(aluno_id=data['aluno_id']).first()
        except:
            response = make_response(jsonify({'message': 'Token is missing!'}), 401)
            response.headers['Access-Control-Allow-Origin'] = '*'
            return response

        return f(current_user, *args, **kwargs)

    return decorated

##routes##
#LOGIN
@app.route('/login')
@require_appkey
def login():
    auth = request.authorization
    erro = None

    if ((not auth) or (not auth.username) or (not auth.password)):
        erro = 'Login required.'

    aluno = Aluno.query.filter_by(aluno_cpf = auth.username).first()
    
    if (not aluno):
        erro = 'CPF não cadastrado no sistema.'
    
    elif (not (aluno.aluno_senha == auth.password)):
        erro = 'Senha Incorreta'

    if (erro is None):

        token = jwt.encode({'aluno_id': aluno.aluno_id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, 'sempreuea')
        response = make_response(jsonify({'token': token.decode('UTF-8'), 'canLogin':True}))
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response
    
    response = make_response(jsonify({'erro':erro}), 401)
    response.headers['WWW-Authenticate'] = 'Basic realm={}'.format(erro)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

#CADASTRO
@app.route('/alunos', methods=['POST'])
@require_appkey
def create_aluno():
    
    data = request.get_json()
    if(db.session.query(Aluno.aluno_id).filter_by(aluno_id=data['cpf']).scalar() is not None):
        response = make_response(jsonify({'message': 'CPF ja cadastrado!'}), 401)
        return response

    data = request.get_json()
    if(db.session.query(Aluno.aluno_cpf).filter_by(aluno_cpf=data['cpf']).scalar() is not None):
        response = make_response(jsonify({'message': 'CPF ja cadastrado!'}), 401)
        return response

    regexName = re.compile(r'^([A-ZÁ-ÚÂ-Ûã-ũa-zá-úâ-ûã-ũ]*\s)+([A-ZÁ-ÚÂ-Ûã-ũa-zá-úâ-ûã-ũ]*)$')
    if regexName.match(data['name']) is not None:
        Nome = data['name']
    else:
        response = make_response(jsonify({'message': 'Nome inválido'}), 500)
        return response

    regexPassword = re.compile(r'^^([0-9A-Za-z]{6,})$')
    if regexPassword.match(data['password']) is not None:
        password = data['password']
    else:
        response = make_response(jsonify({'message': 'Nome inválido'}), 500)
        return response
    
    regexCpf = re.compile(r'^[0-9]{11}$')
    if regexCpf.match(data['cpf']) is not None:
        cpf = data['cpf']
    else:
        response = make_response(jsonify({'message': 'CPF inválido'}), 500)
        return response

    regexFacebook = re.compile(r'^[^@<>{}]*$')
    if regexFacebook.match(data['facebook']) is not None:
        facebook = data['facebook']
    else:
        response = make_response(jsonify({'message': 'Link inválido'}), 500)
        return response

    regexLinkedin = re.compile(r'^[^@<>{}]*$')
    if regexLinkedin.match(data['linkedin']) is not None:
        linkedin = data['linkedin']
    else:
        response = make_response(jsonify({'message': 'Link inválido'}), 500)
        return response

    
    regexLattes = re.compile(r'^[^@<>{}]*$')
    if regexLattes.match(data['lattes']) is not None:
        lattes = data['lattes']
    else:
        response = make_response(jsonify({'message': 'Link inválido'}), 500)
        return response

    regexEmail = re.compile(r'^[a-zA-Z0-9][^@<>={}()]*@[^@]*\.[^@]*$')
    if regexEmail.match(data['email']) is not None:
        email = data['email']
    else:
        response = make_response(jsonify({'message': 'Link email'}), 500)
        return response

    regexTelefone = re.compile(r'^[0-9]*$')
    if regexTelefone.match(data['whatsapp']) is not None:
        telefone = data['whatsapp']
    else:
        response = make_response(jsonify({'message': 'Link telefone'}), 500)
        return response

    novo_aluno = Aluno(aluno_id = hashlib.md5((cpf+datetime.datetime.utcnow().isoformat(' ')).encode('utf-8')).hexdigest(), 
    aluno_nome=Nome,aluno_cpf=cpf,aluno_facebook=facebook, aluno_linkedin=linkedin,aluno_email=email,
    aluno_uea_unidade=data['unity'],aluno_uea_curso=data['course'],aluno_senha=password, aluno_ano_ingresso=data['entryYear'], 
    aluno_ano_conclusao=data['exitYear'],aluno_situacao=data['situation'],aluno_discente_situacao=data['discente_situation'], 
    aluno_matricula='123',aluno_discente_funcao=data['discente_function'],aluno_discente_instituicao=data['discente_institutuion'],
    aluno_status=1, aluno_egresso_situacao=data['egresso_situation'],aluno_egresso_instituicao=data['egresso_institutuion'], 
    aluno_egresso_funcao=data['egresso_function'], aluno_data_cadastro=datetime.datetime.utcnow(), aluno_lattes=lattes,
    aluno_whatsapp=telefone)

    db.session.add(novo_aluno)
    db.session.commit()
    response = make_response(jsonify({'message': 'Aluno Cadastrado!', 'id':novo_aluno.aluno_id}))
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

#EDITAR CADASTRO
@app.route('/alunos', methods=['PUT'])
@token_required
@require_appkey
def update_aluno(current_user):
    data = request.get_json()
    aluno = Aluno.query.filter_by(aluno_id=current_user.aluno_id).first()

    
    regexName = re.compile(r'^([A-ZÁ-ÚÂ-Ûã-ũa-zá-úâ-ûã-ũ]*\s)+([A-ZÁ-ÚÂ-Ûã-ũa-zá-úâ-ûã-ũ]*)$')
    if regexName.match(data['name']) is not None:
        Nome = data['name']
    else:
        response = make_response(jsonify({'message': 'Nome inválido'}), 500)
        return response

    regexPassword = re.compile(r'^^([0-9A-Za-z]{6,})$')
    if regexPassword.match(data['password']) is not None:
        password = data['password']
    else:
        # password = aluno.aluno_senha
        response = make_response(jsonify({'message': 'Nome inválido'}), 500)
        return response

    regexFacebook = re.compile(r'^[^@<>{}]*$')
    if regexFacebook.match(data['facebook']) is not None:
        facebook = data['facebook']
    else:
        response = make_response(jsonify({'message': 'Link de facebook inválido'}), 500)
        return response

    regexLinkedin = re.compile(r'^[^@<>{}]*$')
    if regexLinkedin.match(data['linkedin']) is not None:
        linkedin = data['linkedin']
    else:
        response = make_response(jsonify({'message': 'Link de linkedin inválido'}), 500)
        return response

    
    regexLattes = re.compile(r'^[^@<>{}]*$')
    if regexLattes.match(data['lattes']) is not None:
        lattes = data['lattes']
    else:
        response = make_response(jsonify({'message': 'Link de lattes inválido'}), 500)
        return response

    regexEmail = re.compile(r'^[a-zA-Z0-9][^@<>={}()]*@[^@]*\.[^@]*$')
    if regexEmail.match(data['email']) is not None:
        email = data['email']
    else:
        response = make_response(jsonify({'message': 'Link de email inválido'}), 500)
        return response

    regexTelefone = re.compile(r'^[0-9]*$')
    if regexTelefone.match(data['whatsapp']) is not None:
        telefone = data['whatsapp']
    else:
        response = make_response(jsonify({'message': 'Numero de telefone'}), 500)
        return response

    aluno.aluno_nome=Nome
    aluno.aluno_facebook=facebook
    aluno.aluno_linkedin=linkedin
    aluno.aluno_email=email
    aluno.aluno_uea_unidade=data['unity']
    aluno.aluno_uea_curso=data['course']
    aluno.aluno_senha=password
    aluno.aluno_ano_ingresso=data['entryYear']
    aluno.aluno_ano_conclusao=data['exitYear']
    aluno.aluno_situacao=data['situation']
    aluno.aluno_matricula='123'
    aluno.aluno_discente_situacao=data['discente_situation']
    aluno.aluno_discente_funcao=data['discente_function']
    aluno.aluno_discente_instituicao=data['discente_institutuion']
    aluno.aluno_egresso_situacao=data['egresso_situation']
    aluno.aluno_egresso_funcao=data['egresso_function']
    aluno.aluno_egresso_instituicao=data['egresso_institutuion']
    aluno.aluno_lattes=lattes
    aluno.aluno_whatsapp=telefone
    aluno_status=1

    db.session.add(aluno)
    db.session.commit()

    response = make_response(jsonify({'message': 'Aluno Cadastrado!', 'id':aluno.aluno_id}))
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

#OBTER PERFIL PUBLICO
@app.route('/alunos/<string:aluno_id>', methods=['GET'])
@require_appkey
def aluno(aluno_id):
    aluno = Aluno.query.filter_by(aluno_id = (aluno_id)).first()
    if(aluno == None):
        return 'Usuário não encontrado!'
        
    output = {
        'nome': aluno.aluno_nome, 
        'email': aluno.aluno_email, 
        'facebook': aluno.aluno_facebook, 
        'linkedin': aluno.aluno_linkedin, 
        'cpf': aluno.aluno_id, 
        'curso': aluno.curso.curso_nome, 
        'unidade': aluno.unidade.unidade_nome, 
        'lattes': aluno.aluno_lattes,
        'whatsapp': aluno.aluno_whatsapp,
        'ano_ingresso' : aluno.aluno_ano_ingresso, 
        'ano_conclusao' : aluno.aluno_ano_conclusao, 
        'discente_inst' : aluno.aluno_discente_instituicao,
        'discente_situacao' : aluno.aluno_discente_situacao, 
        'discente_funcao' : aluno.aluno_discente_funcao, 
        'egresso_inst' : aluno.aluno_egresso_instituicao,
        'egresso_situacao' : aluno.aluno_egresso_situacao, 
        'egresso_funcao' : aluno.aluno_egresso_funcao , 
        'situacao' : aluno.aluno_situacao}

    return jsonify(output)

#PERFIL COM LOGIN
@app.route('/alunos', methods=['GET'])
@token_required
@require_appkey
def perfilaluno(current_user):
        
    output = {
        'nome': current_user.aluno_nome, 
        'email': current_user.aluno_email, 
        'facebook': current_user.aluno_facebook, 
        'linkedin': current_user.aluno_linkedin, 
        'id': current_user.aluno_id, 
        'curso': current_user.curso.curso_id, 
        'unidade': current_user.unidade.unidade_id, 
        'curso_nome': current_user.curso.curso_nome, 
        'unidade_nome': current_user.unidade.unidade_nome, 
        'lattes': current_user.aluno_lattes,
        'whatsapp': current_user.aluno_whatsapp,
        'ano_ingresso' : current_user.aluno_ano_ingresso, 
        'ano_conclusao' : current_user.aluno_ano_conclusao, 
        'situacao' : current_user.aluno_situacao,
        'discente_inst' : current_user.aluno_discente_instituicao,
        'discente_situacao' : current_user.aluno_discente_situacao, 
        'discente_funcao' : current_user.aluno_discente_funcao, 
        'egresso_inst' : current_user.aluno_egresso_instituicao,
        'egresso_situacao' : current_user.aluno_egresso_situacao, 
        'egresso_funcao' : current_user.aluno_egresso_funcao 
    }

    response = make_response(jsonify(output))
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

#LISTA DE ALUNOS
@app.route('/alunos/<int:qtd>', methods=['GET'])
@require_appkey
def all_alunos(qtd):
    alunos= Aluno.query.order_by(Aluno.aluno_data_cadastro.desc()).all()
    if (qtd > 0):
        alunos= Aluno.query.order_by(Aluno.aluno_data_cadastro.desc()).limit(qtd).all()

    output = []
    for aluno in alunos:
        a_data = {'nome': aluno.aluno_nome, 'id': aluno.aluno_id, 'curso': Curso.query.filter_by(curso_id=aluno.aluno_uea_curso).first().curso_nome,
                  'lattes': aluno.aluno_lattes, 'linkedin': aluno.aluno_linkedin, 'facebook': aluno.aluno_facebook }

        output.append(a_data)
        
    response = make_response(jsonify({'alunos': output}))
    return response

#LISTAR UNIDADES
@app.route('/unidades', methods=['GET'])
@require_appkey
def all_unidades():
    unidades = Unidade.query.all()

    output = []
    for unidade in unidades:
        uni = {
            'nome': unidade.unidade_nome,
            'id': unidade.unidade_id,
            'sigla': unidade.unidade_sigla
        }

        output.append(uni)
    
    return jsonify(output)

#PEGAR UNIDADE
@app.route('/unidades/<int:unidade_id>', methods=['GET'])
@require_appkey
def unidade(unidade_id):
    unidade = Unidade.query.filter_by(unidade_id = (unidade_id)).first()
    if(unidade == None):
        return 'Unidade não encontrada!'
        
    return 'Nome: %s' % unidade.unidade_nome

#LISTAR CURSOS
@app.route('/cursos', methods=['GET'])
@require_appkey
def all_cursos():
    cursos = Curso.query.all()
    output = []
    for curso in cursos:
        c_data = {
                    'nome': curso.curso_nome,
                    'sigla': curso.curso_sigla,
                    'id': curso.curso_id
                 }

        output.append(c_data)
    
    return jsonify(output)

#PEGAR CURSOS DE UMA UNIDADE
@app.route('/cursos/<int:unidade_id>', methods=['GET'])
@require_appkey
def curso(unidade_id):
    cursos = Curso.query.filter_by(curso_unidade_id = str(unidade_id)).all()
    output = []
    for curso in cursos:
        c_data = {
                    'nome': curso.curso_nome,
                    'sigla': curso.curso_sigla,
                    'id': curso.curso_id
                 }

        output.append(c_data)
    
    return jsonify(output)

#PEGAR ALUNOS DO ABOUT
@app.route('/about')
@require_appkey
def about_alunos():
    cpfs=[ '01156421292', '03409258256', '01614260265', '00565820214', '02653197227', '03481907273', '70230445233', '00829309256', '01651847282']
    alunos= Aluno.query.order_by(Aluno.aluno_data_cadastro.desc()).all()
    
    output = []
    for aluno in alunos:
        if aluno.aluno_cpf in cpfs:
            a_data = {'nome': aluno.aluno_nome, 'id': aluno.aluno_id, 'curso': Curso.query.filter_by(curso_id=aluno.aluno_uea_curso).first().curso_nome,
                    'whatsapp': aluno.aluno_whatsapp, 'linkedin': aluno.aluno_linkedin, 'facebook': aluno.aluno_facebook}
            output.append(a_data)
        else:
            pass
        
    response = make_response(jsonify({'alunos': output}))
    return response

#SUBIR FOTO
@app.route('/upload', methods=['POST'])
def upload():
    target=os.path.join('imgs/uploads')
    if not os.path.isdir(target):
        os.mkdir(target)
    file = request.files['file']

    filename = request.form['filename']
    print(file.content_type)
    destination="/".join([target, filename])
    if os.path.isfile(destination):
        os.remove(destination)
    file.save(destination)
    session['uploadFilePath']=destination
    response = make_response(jsonify({'message': destination}))
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'static')

#PEGAR FOTO SALVO
@app.route('/imgs/uploads/<path>', methods=['GET'])
def serve_file_in_dir(path):
    if(os.path.isfile('imgs/uploads/' + path)):
        return send_file('imgs/uploads/' + path)
    else:
        response = make_response(jsonify({'message': 'File not found!'}), 404)
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response

    
