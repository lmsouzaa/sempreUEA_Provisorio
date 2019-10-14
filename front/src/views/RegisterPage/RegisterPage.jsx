import React from "react";
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// @material-ui/icons
import Email from "@material-ui/icons/Email";
import PersonOutline from "@material-ui/icons/PersonOutline";
import People from "@material-ui/icons/People";
import DateRange from "@material-ui/icons/DateRange";
import Description from "@material-ui/icons/Description";
import Close from "@material-ui/icons/Close";
import AccountBalance from "@material-ui/icons/AccountBalance";
import TextField from '@material-ui/core/TextField';

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Footer from "views/ComponentsSempreUEA/Footer.jsx";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import Tooltip from '@material-ui/core/Tooltip';
import Navbar from "../ComponentsSempreUEA/Navbar.jsx";

import loginPageStyle from "views/RegisterPage/registerPageStyle.jsx";

import md5 from 'js-md5'
import Global from 'global';
import image from "assets/img/bgs/cadastro.jpg";
import facebook from "assets/img/facebook-icon-input.png";
import employee from "assets/img/employee.png";
import linkedin from "assets/img/linkedin.png";
import whatsapp from "assets/img/whatsapp.png";

import profile from "assets/img/faces/profile_default.png";
import { number } from "prop-types";

//import YearPicker from "react-year-picker";
import { green } from "@material-ui/core/colors";
import { networkInterfaces } from "os";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class RegisterPage extends React.Component {
  unidades = [];
  cursos = [];
  file;
  validInputs = {};
  cpfCanChange = true;
  constructor(props) {
    var moment = require('moment');
    moment.locale('pt-br');
    
    super(props);
    this.initValidInptus();
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      step: 0,
      toggleSituationState:"desempregado",
      textButton:"Próximo",
      cpf:"",
      password:"",
      passwordConfirmation:"",
      name:"",
      facebook:"",
      imageURL:"",
      entryYear:"",
      exitYear:"",
      situation:0,
      discInstitution:"",
      discSituation:"",
      discFunction:"",
      egresInstitution:"",
      egresSituation:"",
      egresFunction:"",
      email:"",
      linkedin:"",
      unity:"",
      unityId:0,
      course:"",
      unityOptions: [],
      courseOptions: [],
      situationDiscOption: [],
      lattes: "",
      whatsapp: "",
      cargo:"",
      institution:"",
      classicModal: false,
      feedbackMensage:'',
      feedbackTitle:'',
      ok: false,
      // goPerfil: this.props.
    };
  }
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears

    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
    const token = sessionStorage.getItem('jwtToken');
    
    fetch(Global.API_URL + '/unidades', {
      headers : new Headers({
          'x-api-key' : 'eiWee8ep9due4deeshoa8Peichai8Eih', 
      })})
    .then(function(response){
      if(response.status !== 200){
        alert('Houve um erro ao listar unidades, tente novamente mais tarde');
        this.props.history.push('/home');
        return;
      }
      return response.json();
    })
    .then(data => {
      
      data.forEach(unidade => {
        this.unidades.push(unidade);
      });
      
      this.setState({unityOptions:this.unidades});
    })
    .catch((e) => {
      alert('Houve um erro ao pegar unidades, tente novamente mais tarde');
    });

    if(!token){
      // this.props.history.push('/login');
      return 
    } else {
      fetch(Global.API_URL + '/alunos', {
        headers : new Headers({
          'x-api-key' : 'eiWee8ep9due4deeshoa8Peichai8Eih', 
          'x-access-token': token
        })
      }).then((response) => {
        if(response.status !== 200){
          alert('Houve um erro ao listar perfil, tente novamente mais tarde');
          this.props.history.push('/home');
          return;
        }
        response.json().then((data) => {
          if(data.id) this.cpfCanChange = false;
          this.setState({
            name: data.nome,
            email: data.email,
            linkedin: data.linkedin,
            unity: data.unidade,
            course: data.curso,
            cpf: data.cpf,
            facebook: data.facebook,
            entryYear: data.ano_ingresso,
            exitYear: data.ano_conclusao,            
            cargo: data.situacao===0 ? data.discFunction:data.egresFunction,
            institution: data.situacao===0 ? data.discInstitution:data.egresInstitution,
            situation: ''+data.situacao,
            discInstitution: data.discInstitution,
            //discFunction: data.discFunction,
            discSituation: ''+data.discSituation, 
            egresInstitution: data.egresInstitution,
            egresSituation: data.egresSituation,
            //egresFunction: ''+data.egresFunction,           
            imageURL: Global.API_URL + '/imgs/uploads/' + data.id + '.jpeg?v=' + Date.now(),
            lattes: data.lattes,
            whatsapp: data.whatsapp
          })
          this.getCourses(this.state.unity);
        });
      }).catch((e) => {
        sessionStorage.setItem('jwtToken', '');
        alert('Houve um erro ao listar perfil, tente novamente mais tarde');
        this.props.history.push('/home');
      });
      
    }
  }

  initValidInptus(){
    this.validInputs = {
      cpf: true,
      email: true, //#modifiquei
      password: true,
      passwordConfirmation: true,
      name: true,
      entryYear:true,
      exitYear:true,
      unity:true,
      course:true,
    }

  }

  addAluno(){
    const token = sessionStorage.getItem('jwtToken');
    var request = {};
    var situacao_trabalhista = 0;

    if(this.state.situation === "Discente"){
      if(this.state.discSituation === "Não Trabalha"){
        situacao_trabalhista = 0;
      }else if(this.state.discSituation === "Bolsista"){
        situacao_trabalhista = 1;
      }else if(this.state.discSituation === "Estagiário"){
        situacao_trabalhista = 2;
      }else if(this.state.discSituation === "CLT"){
        situacao_trabalhista = 3;
      }else{
        situacao_trabalhista = 4;
      }
    }else{
      if(this.state.discSituation === "Não Trabalha"){
        situacao_trabalhista = 1;
      }else if(this.state.discSituation === "Bolsista"){
        situacao_trabalhista = 2;
      }else if(this.state.discSituation === "CLT"){
        situacao_trabalhista = 3;
      }else if(this.state.discSituation === "Outros"){
        situacao_trabalhista = 4;
      }
    }
    if(this.state.cargo===null||this.state.cargo===undefined){
      this.setState({cargo:''});
    }
    if(this.state.institution===null||this.state.institution===undefined){
      this.setState({institution:''});
    }
    
    if(this.cpfCanChange){
      const str = this.state.cpf;
      var cpf = '';
      var i;
      for (i = 0; i < str.length; i++) { 
        cpf += (str[i]!=='.' && str[i]!=='-' ? str[i]:'');
      }
    }

    var body = JSON.stringify({
      "name": this.state.name,
      "email": this.state.email,
      "linkedin": this.state.linkedin,
      "cpf": cpf,
      "password": md5(this.state.password),
      "facebook": this.state.facebook,
      "entryYear": parseInt(this.state.entryYear),
      "exitYear": parseInt(this.state.exitYear),
      "situation": (this.state.situation==="null" || this.state.situation==="" ? 0 : (this.state.situation === "Egresso"? 1 : 0) ),
      "discente_institutuion": this.state.situation ? (this.state.institution===undefined? '':this.state.institution) : '',
      "discente_situation": situacao_trabalhista,
      "discente_function": this.state.situation ? (this.state.cargo===undefined? '':this.state.cargo) : '',
      "egresso_institutuion": this.state.situation ? '' : (this.state.institution===undefined? '':this.state.institution),
      "egresso_situation": situacao_trabalhista,
      "egresso_function": this.state.situation ? '' : (this.state.cargo===undefined? '':this.state.cargo),
      "lattes": this.state.lattes,
      "whatsapp": this.state.whatsapp,
      "unity": parseInt(this.state.unity),
      "course": parseInt(this.state.course)
    })
    if(token) {
      request = { 
        method: 'PUT',
        headers : new Headers({
          'Content-Type':'application/json',
          'x-access-token':token,
          'x-api-key' : 'eiWee8ep9due4deeshoa8Peichai8Eih', 
        }),
        body: body
      }
    } else {
      request = {
        method: 'post', 
        headers : new Headers({
          'Content-Type':'application/json',
          'x-api-key' : 'eiWee8ep9due4deeshoa8Peichai8Eih', 
        }),
        body: body
      }
    }

    if((this.state.password === '')||(this.state.name === '' || this.state.entryYear === '' || this.state.cpf === '' || this.state.course === '' || this.state.course === 'escolha' || this.state.unity === '' || this.state.unity === 'escolha')) {
      //AQUI alert('Verifique se a senha e campos obrigatórios estão preenchidos');
      this.setState({feedbackMensage:'Verifique se a senha e campos obrigatórios estão preenchidos'});
      this.setState({feedbackTitle:'Ops'});
      this.handleClickOpen("classicModal");
      this.props.history.push('/register-page')
      return;
    }

    fetch(Global.API_URL + '/alunos', request).then((response) => {
      if(response.ok){
        response.json().then((data) => {
            const form = new FormData();
              form.append('file', this.file);
              form.append('filename', data.id + '.jpeg')
              fetch(Global.API_URL + '/upload', {
                method: 'POST',
                body: form,
              }).then((response) => {
                response.json().then((body) => {
                  //AQUI alert('Cadastro Realizado com Sucesso') ;
                  this.setState({ok: true});
                  this.setState({feedbackTitle:'Pronto'});
                  this.setState({feedbackMensage:'Cadastro Realizado com Sucesso '});
                  this.handleClickOpen("classicModal");
                }).catch((e) => {
                  
                  //AQUI alert('Cadastro Realizado com Sucesso')
                  this.setState({feedbackTitle:'Pronto'});
                  this.setState({feedbackMensage:'Cadastro Realizado, sem foto. Não foi possível enviar sua foto '});
                  this.handleClickOpen("classicModal");
                  this.setState({ok: true});
                });
              });
              this.setState({feedbackTitle:'Pronto'});
              this.setState({feedbackMensage:'Cadastro Realizado, sem foto. Não foi possível enviar sua foto '});
              this.handleClickOpen("classicModal");
              this.setState({ok: true});
        }); 
      } else {
        response.json().then((data) => {
          this.setState({feedbackTitle:'Error'});
          this.setState({feedbackMensage:data.message});
          this.handleClickOpen("classicModal");
        });
      }
      // else {
      //   alert("CPF informado invalido, insira outro");
      // }
    }).catch((e) => {
      //AQUI alert('Houve um erro ao adicionar Aluno, tente novamente mais tarde');
      this.setState({feedbackTitle:'Ops'});
      this.setState({feedbackMensage:'Houve um erro ao adicionar Aluno, tente novamente mais tarde'});
      this.handleClickOpen("classicModal");
    });
  }

  getCourses(id){
    this.cursos = []

    fetch(Global.API_URL + '/cursos/' + id, {
      headers : new Headers({
        'x-api-key' : 'eiWee8ep9due4deeshoa8Peichai8Eih', 
      })
    })
    .then(function(response){
      return response.json();
    })
    .then(data => {
      data.forEach(curso => {
        this.cursos.push(curso);
      });
      // this.setState({
      //   state : this.state
      // });
      
      this.setState({courseOptions:this.cursos});
    })
    .catch((e) => {
      alert('Houve um erro ao listar cursos desta unidade, tente novamente mais tarde');
    });
  }



  handleChangePassword(evt) {

    if(this.state.password.length < 5){
      this.validInputs.password = false;
    }else if(this.isPassOk(evt.target.value)){
      this.validInputs.password = true;
    }

    if(evt.target.id === 'password'){
        this.setState({
            password : evt.target.value.substring(0,20)
        });
    }
  }

  isPassOk(params){
    var lower = 0;
    var upper = 0;
    var digit = 0;
    for(var i=0; i<params.length; i++){
      if(params[i] === '0' || params[i] === '1' || params[i] === '2' || params[i] === '3' || params[i] === '4' || params[i] === '5' || params[i] === '6' || params[i] === '7' || params[i] === '8' || params[i] === '9') digit = 1;
      else if(params[i] === params[i].toLowerCase()) lower = 1;
      else if(params[i] === params[i].toUpperCase()) upper = 1;
    }
    //console.log((lower + upper + digit) );
    return ((lower + upper + digit) === 3);
  }

  handleChangePasswordConfirm(evt) {
    if(this.state.passwordConfirmation.length < 5 || evt.target.value!==this.state.password){
      this.validInputs.passwordConfirmation = false;
    }else{
      this.validInputs.passwordConfirmation = true;
    }
    if(evt.target.id === 'password_confirmation'){
        this.setState({
            passwordConfirmation : evt.target.value.substring(0,20)
        });
    }
  }
  handleChangeEntryYear(evt) {

    if(! (parseInt(this.state.entryYear)>=1960 && parseInt(this.state.entryYear)<2600)){ //#modifiquei
      this.validInputs.entryYear = false;
    } else this.validInputs.entryYear = true;
    
    if(evt.target.id === 'entry_year'){
      if(this.isANumber(evt.target.value) || this.state.entryYear.length > evt.target.value.length){
        this.setState({
            entryYear : evt.target.value.substring(0,4)
        });
      }
    }
  }
  handleChangeExitYear(evt) {

    if(this.state.entryYear>this.state.exitYear){
      this.validInputs.exitYear = false;
    }else this.validInputs.exitYear = true;

    if(evt.target.id === 'exit_year'){
      if(this.isANumber(evt.target.value) || this.state.exitYear.length > evt.target.value.length){
        this.setState({
            exitYear : evt.target.value.substring(0,4)
        });
      }
    }
  }

  handleChangeSituation = situation => event => {
    
    this.setState({ [situation]: event.target.value });
  };

  handleChangeDiscSituation = discSituation => event => {
    if(this.state.situation === 0){
      this.setState({ [discSituation]: event.target.value });
      this.setState({ egresSituation: "" });
    }else{
      this.setState({ [discSituation]: "" });
      this.setState({ egresSituation: event.target.value });
    }
    
    
  };

  handleClickOpen(modal) {
    var x = [];
    x[modal] = true;
    this.setState(x);
  }
  handleClose(modal) {
    var x = [];
    x[modal] = false;
    this.setState(x);
    if(this.state.ok){
      if(sessionStorage.getItem('jwtToken')){
        this.props.history.push('/profile-page')
      }else{
        this.props.history.push('/home')
      }
    }
  }

  handleChangeCourse = course => event => {
    if(event.target.value === ''){
      this.validInputs.course = false;
    }else{
      this.validInputs.course = true;
    }
    this.setState({ [course]: event.target.value });
  };

  handleChangeUnity = unity => event => {
    if(event.target.value === ''){
      this.validInputs.unity = false;
    }else{
      this.validInputs.unity = true;
    }

    this.setState({ [unity]: event.target.value });

    this.getCourses(event.target.value)
  };

  handleChangeTrabalho = name => event => {
    this.setState({ toggleSituationState: (this.state.toggleSituationState === "desempregado"? "trabalhando":"desempregado") });
  };

  handleChangeDiscInstitution(evt) {
    if(evt.target.id === 'instituition'){
        this.setState({
            institution : evt.target.value.substring(0,20)
        });
    }
  }
  handleChangeDiscFunction(evt) {
    this.setState({cargo:evt.target.value});
  }

  handleChangeName(evt) {
    if(this.state.name.length < 2){
      this.validInputs.name = false;
    }else{
      this.validInputs.name = true;
    }
    if(evt.target.id === 'name' && !this.isANumber(evt.target.value)){
        this.setState({
            name : evt.target.value.substring(0,100)
        });
    }
  }

  handleChangeCPF(evt) {
    if(this.cpfCanChange){
      if(evt.target.id === 'cpf'){
        let toAppend = '';
        if(this.state.cpf.length < evt.target.value.length){
          if(evt.target.value.length == 3 || evt.target.value.length == 7) toAppend = '.';
          if(evt.target.value.length == 11) toAppend = '-';
        }
        if(this.isANumber(evt.target.value) || this.state.cpf.length > evt.target.value.length){
          this.setState({
              cpf : (evt.target.value + toAppend).substring(0,14)
          });
        }
    }
      if(evt.target.value.length < 14){
        this.validInputs.cpf = false;
        
      }else{
        if(this.isCPF(this.state.cpf)){
            this.validInputs.cpf = true;
        }
      }      
    }
  }
  isCPF(cpf){
    if (cpf == "000.000.000-0" || cpf == "000.000.000-00") return false;
    let re = /^(([0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2})|([0-9]{11}))$/;
    return re.test(cpf);
  }
  cpfOk(strCPF){
    console.log(strCPF);
    var Soma = 0;
    var Resto = 0;
    var cont = 10;
    Soma = 0;
    var i;
      if (strCPF === "000.000.000-0" || strCPF === "000.000.000-00") return false;

      for (i=1; i<=11; i++){
        if(i!==4 && i!==8) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (cont--);
      }
      Resto = (Soma * 10) % 11;
      console.log((strCPF));
        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(strCPF.substring(12, 13)) ) return false;
        //console.log(strCPF.substring(13, 14));
      
      Soma = 0;
      cont = 11;
      for (i=1; i<=13; i++){
        if(i!==4 && i!==8 && i!==12) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (cont--);
      }
        Resto = (Soma * 10) % 11;

        if ((Resto === 10) || (Resto === 11))  Resto = 0;
        if (Resto !== parseInt(strCPF.substring(12, 13) ) ) return false;
        return true;
    }

  isANumber(str){
    let a = str[str.length-1];
    if(a === '0' || a === '1' ||a === '2' ||a === '3' ||a === '4' ||a === '5' ||a === '6' ||a === '7' ||a === '8' ||a === '9') return true;
    else return false;
  }

  isAChar(str){
    let a = str[str.length-1];
    if((a >= 'a' && a<='z') || (a >= 'A' && a<='Z')) return true;
    else return false;
  }

  handleChangeEmail(evt) {
    //#modifiquei (
    console.log(this.isEmail(evt.target.value));
    if(this.isEmail(evt.target.value)){
      this.validInputs.email = true;
    } else{
      this.validInputs.email = false;
    }
    // )
    if(evt.target.id === 'email'){
        this.setState({
            email : evt.target.value.substring(0,100)
        });
    }
    
  }

  /*
    isEmail
    Verifica a integridade do email, procura de trás para frente se tem ao menos um ponto até encontrar
    o caracter '@'.
 */
  //#modifiquei(
  isEmail(email){
    var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    return re.test((email));
  }
  //#modifiquei)
  handleChangeLinkedin(evt) {
    if(evt.target.id === 'linkedin'){
        this.setState({
            linkedin : evt.target.value.substring(0,200)
        });
    }
  }

  handleChangeLattes(evt) {
    if(evt.target.id === 'lattes'){
        this.setState({
            lattes : evt.target.value.substring(0,200)
        });
    }
  }

  handleChangeFacebook(evt) {
    if(evt.target.id === 'facebook'){
        this.setState({
            facebook : evt.target.value.substring(0,200)
        });
    }
  }
  handleChangeImageURL(evt) {
    if(evt.target.id === 'image_url'){
        this.setState({
            cpf : evt.target.value
        });
    }
  }
  handleChangeWhatsapp(evt) {
    if(evt.target.id === 'whatsapp' && this.isANumber(evt.target.value)){
        this.setState({
            whatsapp: evt.target.value.substring(0,15)
        });
    }
  }
  fileChangedHandler = (evt) => {    
    this.file = evt.target.files[0];
    let readerFile = new FileReader();


    var fileReader = new FileReader();
    /* ESSE BLOCO NÃO FUNCIONA */
    fileReader.onloadend = function(e) {
      var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
      var header = "";
      for(var i = 0; i < arr.length; i++) {
         header += arr[i].toString(16);
      }
      console.log(header);
      if (header === "89504e47" || header === "47494638" || header === "ffd8ffe0" || header === "ffd8ffe1" || 
          header === "ffd8ffe2" || header === "ffd8ffe3" || header === "ffd8ffe8") {
            var file = this.file;
            if(file){
              readerFile.readAsDataURL(file);
            }
      } else {
        this.file = null;
        alert("Tipo de arquivo invalido. Somente imagens .jpg/.png permitidas");
        return;
      }    
    };

    /* FIM DO BLOCO */

    fileReader.readAsArrayBuffer(this.file);

    readerFile.onload = (e) => {
      console.log("imageURL ", e.target.result)
      this.setState({
        imageURL: e.target.result,
      });
    };
    readerFile.readAsDataURL(this.file);
  }  
  step0Validation(){
    if(this.cpfCanChange){
      if(this.state.cpf.length < 12){
        this.validInputs.cpf = false;
        this.setState({cpf:this.state.cpf});
      }
    }

    if(this.state.password.length < 6){
      this.validInputs.password = false;
      this.setState({password:this.state.password});
    }

    if(this.state.passwordConfirmation.length < 6 || this.state.passwordConfirmation !== this.state.password){
      this.validInputs.passwordConfirmation = false;
      this.setState({passwordConfirmation:this.state.passwordConfirmation});
    }

    if(this.state.name.length < 2){
      this.validInputs.name = false;
      this.setState({name:this.state.name});
    }

    if(this.validInputs.cpf
      && this.validInputs.password
      && this.validInputs.passwordConfirmation
      && this.validInputs.name 
      && this.validInputs.email //#modifiquei
      ){
      return true;
    }
    else{
      this.setState({feedbackMensage:'Para continuar é necessário preencher todos os campos obrigatórios corretamente. Campos obrigatórios estão marcados com *'});
      this.setState({feedbackTitle:'Ops'});
      this.handleClickOpen("classicModal");
      return false;
    }
  }

  step1Validation(){
    if(! (parseInt(this.state.entryYear)>=1960 && parseInt(this.state.entryYear)<2600)){ //#modifiquei
      this.validInputs.entryYear = false;
      this.setState({entryYear:this.state.entryYear});
    }
    if(this.state.unity === ''){
      this.validInputs.unity = false;
      this.setState({unity:this.state.unity});
    }
    if(this.state.course === ''){
      this.validInputs.course = false;
      this.setState({course:this.state.course});
    }

    //modifiquei
    if(this.state.entryYear>this.state.exitYear){
      this.validInputs.exitYear = false;
      this.setState({exitYear:this.state.exitYear});
    }
    if(this.validInputs.entryYear
      && this.validInputs.exitYear //modifiquei
      && this.validInputs.unity
      && this.validInputs.course){
        return true;
      }else{
        this.setState({feedbackMensage:'Para continuar é necessário preencher todos os campos obrigatórios corretamente. Campos obrigatórios estão marcados com *'});
        this.setState({feedbackTitle:'Ops'});
        this.handleClickOpen("classicModal");
        return false;
      }

  }

  step2Validation(){
    return true;
  }
  
  nextStep(evt){
      evt.preventDefault();

      if(this.state.step !== 2){
        if(this.state.step === 1){//(2) se o usuário estiver na segunda etapa
          if(this.step1Validation()){
            this.setState({textButton: "Enviar"})
            this.setState({step: (this.state.step + 1)%3 });
          }
        }else{
          if(this.step0Validation()){
            this.setState({textButton: "Próximo"})//(1) se o usuário estiver na primeira etapa
            this.setState({step: (this.state.step + 1)%3 });
          }
        }
        //(3) se o usuário estiver na terceira etapa
      }else{
        if(this.step2Validation()){
          this.addAluno()
        }
      }
  }


  backStep(evt){
    evt.preventDefault();
    this.setState({step: this.state.step - 1});
    this.setState({textButton: "Próximo"})
  }

  toggleSituation(evt){
    evt.preventDefault();
    if(this.state.toggleSituationState === "desempregado" && evt.target.id !== "btnDesempregado"){
      
      this.setState({
        toggleSituationState:"trabalhando",
        situation: "trabalhando"
      });
    }
    else if(evt.target.id !== "btnTrabalhando"){
      
      this.setState({
        toggleSituationState:"desempregado",
        situation: "desempregado"
      });
    }
  }

  getOptions(options){
    const list =  options.map((option) =>
      <option value={option.id}>{option.nome}</option>
    )
    return list;
  }

  handleError(e){
    e.target.src = profile;
  }

  render() {
  const { classes } = this.props;
  const cardTitles = ["Dados de Autenticação", "Dados Pessoais", "Dados Profissionais"];
  
  const optionsDisc = [
    {id:"nao_trabalha", nome:"Não Trabalha"},
    {id:"bolsista",nome: "Bolsista"},
    {id:"estagiario", nome:"Estagiário"},
    {id:"clt", nome:"CLT"},
    {id:"outros", nome:"Outros"},
  ];

  const optionsEgres = [
    {id:"nao_trabalha", nome:"Não Trabalha"},
    {id:"bolsista", nome:"Bolsista"},
    {id:"clt", nome:"CLT"},
    {id:"outros", nome:"Outros"},
  ];

  const themeSwitch = createMuiTheme({
    palette: {
      primary: { main: "#199900" }
    },
  });

  const theme = createMuiTheme({
    palette: {
      primary: { main: "#09FF00" }
    },
    select: {
      '&:before': {
          borderColor: { main: "#199900" },
      },
      '&:after': {
          borderColor: { main: "#199900" },
      }
  },
  });


  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );
let authData = <CardBody className = {classes.cardBody}>
                        {this.cpfCanChange ?
                        <CustomInput
                            labelText="CPF *"
                            id="cpf"
                            error = {!this.validInputs.cpf}
                            value={this.state.cpf}
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              onChange: ((event) => this.handleChangeCPF(event)),
                              type: "text",
                              autoFocus: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <PersonOutline className={classes.inputIconsColor} />
                                </InputAdornment>
                              )
                            }}
                          /> : ''}
                          
                          <CustomInput
                           helperText="Some important text"
                            labelText="Senha *"
                            id="password"
                            error = {!this.validInputs.password}
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              onChange: ((event) => this.handleChangePassword(event)),
                              type: "password",
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Icon className={classes.inputIconsColor}>
                                    lock_outline
                                  </Icon>
                                </InputAdornment>
                              )
                            }}
                          />
                          <p className = {classes.inputInfo}>Pelo menos 6 caracteres, uma letra maiúscula, uma letra minúscula e um dígito.</p>
                          
                          <CustomInput
                            labelText="Confirmar senha *"
                            id="password_confirmation"
                            error = {!this.validInputs.passwordConfirmation}
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              onChange: ((event) => this.handleChangePasswordConfirm(event)),
                              type: "password",
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Icon className={classes.inputIconsColor}>
                                    lock_outline
                                  </Icon>
                                </InputAdornment>
                              )
                            }}
                          />

                          <CustomInput
                            labelText="Nome Completo *"
                            id="name"
                            error = {!this.validInputs.name}
                            value={this.state.name}
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              onChange: ((event) => this.handleChangeName(event)),
                              type: "text",
                              endAdornment: (
                                <InputAdornment position="end">
                                  <People className={classes.inputIconsColor} />
                                </InputAdornment>
                              )
                            }}
                          />
                          <CustomInput
                            labelText="Email"
                            id="email"
                            error = {!this.validInputs.email} //#modifiquei
                            value={this.state.email}
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              onChange: ((event) => this.handleChangeEmail(event)),
                              type: "email",
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Email className={classes.inputIconsColor} />
                                </InputAdornment>
                              )
                            }}
                          />
                        
                      </CardBody>



let personalData = <CardBody className = {classes.cardBody}>
                    <GridContainer justify="center">
                      <GridItem xs={9} sm={9} md={9}>
                        <div className={classes.containerImage}>
                          <img onError={this.handleError}  src={this.state.imageURL !== ""? this.state.imageURL : profile} alt="..." className={classes.imageProfile} />
                        </div>
                      </GridItem>
                    </GridContainer>
                  
                    <div className = {classes.buttonContainerCenter}>
                          <input
                            accept="image/*"
                            className={classes.input}
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            multiple
                            type="file"
                            onChange={evt => this.fileChangedHandler(evt)}
                          />
                          <label htmlFor="raised-button-file">
                            <Button variant="raised" component="span" className={classes.button}>
                              SUBIR IMAGEM
                            </Button>
                          </label>
                    </div>
                <CustomInput
                  labelText="Facebook url..."
                            id="facebook"
                            value={this.state.facebook}
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              onChange: ((event) => this.handleChangeFacebook(event)),
                              type: "text",
                              endAdornment: (
                                <InputAdornment position="end">
                                  <img alt="..."  src={facebook} className={classes.inputIconsColor}></img>
                                  {/* <PersonOutline className={classes.inputIconsColor} /> */}
                                </InputAdornment>
                              )
                            }}
                          /> 

                            <GridContainer>
                              <GridItem xs={6} sm={6} md={6}>
                                <CustomInput
                                  labelText="Ano de entrada *"
                                  id="entry_year"
                                  error = {!this.validInputs.entryYear}
                                  value={this.state.entryYear}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: ((event) => this.handleChangeEntryYear(event)),
                                    type: "text",
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <DateRange className={classes.inputIconsColor} />
                                      </InputAdornment>
                                    )
                                  }}
                                />
                                
                              </GridItem>
                              <GridItem xs={6} sm={6} md={6}>
                            
                              <CustomInput
                                  labelText="Ano de saida *"
                                  value={this.state.exitYear}
                                  id="exit_year"
                                  error = {!this.validInputs.exitYear}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: ((event) => this.handleChangeExitYear(event)),
                                    type: "text",
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <DateRange className={classes.inputIconsColor} />
                                      </InputAdornment>
                                    )
                                  }}
                                />
                                
                              </GridItem>
                          </GridContainer>
                          
                          <GridContainer>
                              <GridItem xs={6} sm={6} md={6}>
                                  <FormControl className={classes.formControl}>
                                    <MuiThemeProvider theme={theme}>
                                    <InputLabel htmlFor="unity-for" className={!this.validInputs.unity? classes.danger:''}>Unidade *</InputLabel>
                                      <Select
                                        native
                                        className={classes.select}
                                        value={this.state.unity}
                                        error = {!this.validInputs.unity}
                                        onChange={this.handleChangeUnity('unity')}
                                        inputProps={{

                                          name: 'unity',
                                          id: 'unity-for',
                                        }}
                                      >
                                        <option value="" />
                                        {this.state.unityOptions.length > 0? this.getOptions(this.state.unityOptions) : ""}
                                        

                                      </Select>
                                    </MuiThemeProvider>
                                  </FormControl>
                              </GridItem>
                              <GridItem xs={6} sm={6} md={6}>
                                <FormControl className={classes.formControl}>
                                  <MuiThemeProvider theme={theme}>
                                    <InputLabel htmlFor="course-for" className={!this.validInputs.course? classes.danger:''}>Curso *</InputLabel>
                                    <Select
                                      native
                                      value={this.state.course}
                                      error = {!this.validInputs.course}
                                      onChange={this.handleChangeCourse('course')}
                                      inputProps={{
                                        name: 'course',
                                        id: 'course-for',
                                      }}
                                    >
                                      <option value="" />
                                      {this.state.courseOptions.length > 0? this.getOptions(this.state.courseOptions) : ""}
                                    
                                    </Select>
                                  </MuiThemeProvider>
                                </FormControl>
                              </GridItem>
                          </GridContainer>
                          <CustomInput
                                labelText="Whatsapp"
                                id="whatsapp"
                                value={this.state.whatsapp}
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  onChange: ((event) => this.handleChangeWhatsapp(event)),
                                  type: "text",
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <img alt='...' src={whatsapp} className={classes.inputIconsColor} />
                                    </InputAdornment>
                                  )
                                }}
                              />
            </CardBody>



let professionalData = <CardBody className = {classes.cardBody}>
                            <GridContainer>
                              <GridItem xm={6} sm={6} md={6}>
                                <FormControl className={classes.formControl}>
                                  <InputLabel htmlFor="situation-for">Situação</InputLabel>
                                  <Select
                                    native
                                    value={this.state.situation}
                                    onChange={this.handleChangeSituation('situation')}
                                    inputProps={{
                                      name: 'situation',
                                      id: 'situation-for',
                                    }}
                                  >
                                    <option value="" />
                                    <option value={0}>Discente</option>
                                    <option value={1}>Egresso</option>
                                  
                                  </Select>
                                </FormControl>
                              </GridItem>
                              <GridItem xm={6} sm={6} md={6}>
                              <div className={classes.toggleSituation}>
                              <FormControlLabel
                                control={
                                  <MuiThemeProvider theme={themeSwitch}>
                                    <Switch
                                      checked={this.state.toggleSituationState === "desempregado"? false:true}
                                      onChange={this.handleChangeTrabalho('trabalho')}
                                      value="trabalho"
                                      color="primary"
                                      classes={{
                                        switchBase: classes.switchBase,
                                        checked: classes.switchChecked,
                                        icon: classes.switchIcon,
                                        iconChecked: classes.switchIconChecked,
                                        bar: classes.switchBar
                                      }}
                                    />
                                  </MuiThemeProvider>
                                  
                                }
                                classes={{
                                  label: classes.label
                                }}
                                label= "Trabalhando"
                              />
                              </div>
                              </GridItem>
                            </GridContainer>
                          
                          <GridContainer>
                            <GridItem xm={6} sm={6} md={6}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="situation-disc-for">Situação Trabalhista</InputLabel>
                                <Select
                                  native
                                  value={this.state.situation === 0? this.state.discSituation:this.state.egresSituation}
                                  onChange={this.handleChangeDiscSituation('discSituation')}
                                  inputProps={{
                                    // disabled: (this.state.toggleSituationState === "trabalhando"?false:true),
                                    name: 'discSituation',
                                    id: 'situation-disc-for',
                                  }}
                                >
                                  <option value=""/>
                                  {this.state.situation === 0? this.getOptions(optionsDisc):this.getOptions(optionsEgres)}

                                </Select>
                            </FormControl>
                            </GridItem>
                            <GridItem xm={6} sm={6} md={6}>
                              <CustomInput
                                  labelText="Cargo"
                                  id="disc_function"
                                  value={this.state.cargo}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: ((event) => this.handleChangeDiscFunction(event)),
                                    type: "text",
                                    // disabled: (this.state.toggleSituationState === "trabalhando"?false:true),
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <img alt='...' src={employee} className={classes.inputIconsColor} />
                                      </InputAdornment>
                                    )
                                  }}
                                />
                            </GridItem>
                          </GridContainer>
                          <CustomInput
                            labelText="Instituição"
                            id="instituition"
                            value={this.state.institution}
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              onChange: ((event) => this.handleChangeDiscInstitution(event)),
                              type: "text",
                              // disabled: (this.state.toggleSituationState === "trabalhando"?false:true),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <AccountBalance className={classes.inputIconsColor} />
                                </InputAdornment>
                              )
                            }}
                          />
                          
                          <CustomInput
                            labelText="Linkedin"
                            id="linkedin"
                            value={this.state.linkedin}
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              onChange: ((event) => this.handleChangeLinkedin(event)),
                              type: "text",
                              // disabled: (this.state.toggleSituationState === "trabalhando"?false:true),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <img alt='...' src={linkedin} className={classes.inputIconsColor} />
                                </InputAdornment>
                              )
                            }}
                          />
                          <CustomInput
                            labelText="Lattes url.."
                            id="lattes"
                            value={this.state.lattes}
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              onChange: ((event) => this.handleChangeLattes(event)),
                              type: "text",
                              // disabled: (this.state.toggleSituationState === "trabalhando"?false:true),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Description className={classes.inputIconsColor} />
                                </InputAdornment>
                              )
                            }}
                          />
                        </CardBody>
                        

    let voltar = null;
    if(this.state.step !== 0){
      voltar = <Button disabled={this.state.step === 0? true:false} onClick={this.backStep.bind(this)} color="secondary" size="md" className={classes.buttonBack}>
        voltar
      </Button>
    }
    return (
      <div>
        <Navbar page={"register"}/>
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: "url(" + image + ")",
            backgroundSize: "cover",
            backgroundPosition: "top center"
          }}
        >
          <div className={classes.container}>
          <GridContainer justify="center">
              
              <GridItem xs={12} sm={12} md={7} lg={5}>
                <Card className={classes[this.state.cardAnimaton]}>
                  
                  <form className={classes.form}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>{cardTitles[this.state.step]}</h4>
                    </CardHeader>
                    {this.state.step === 0? authData : ""}
                    {this.state.step === 1? personalData : ""}
                    {this.state.step === 2? professionalData: ""}

                    <CardFooter className={classes.cardFooter}>
                      {voltar}
                      <Button onClick={this.nextStep.bind(this)} color="primary" size="md" className={classes.buttonNext}>
                        {this.state.textButton}
                      </Button> 
                    </CardFooter>
                  </form>
                </Card>
              </GridItem>
              </GridContainer>
              <Dialog
                    classes={{
                      root: classes.center,
                      paper: classes.modal
                    }}
                    open={this.state.classicModal}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => this.handleClose("classicModal")}
                    aria-labelledby="classic-modal-slide-title"
                    aria-describedby="classic-modal-slide-description"
                  >
                    <DialogTitle
                      id="classic-modal-slide-title"
                      disableTypography
                      className={classes.modalHeader}
                    >
                      <IconButton
                        className={classes.modalCloseButton}
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={() => this.handleClose("classicModal")}
                      >
                        <Close className={classes.modalClose} />
                      </IconButton>
                      <div><h4 className={[classes.modalTitle, (this.state.modalTitle === "Ops"? classes.danger:'')]}>{this.state.feedbackTitle}</h4></div>
                    </DialogTitle>
                    <DialogContent
                      id="classic-modal-slide-description"
                      className={classes.modalBody}
                    >
                      <p>
                        {this.state.feedbackMensage}
                      </p>
                    </DialogContent>
                    <DialogActions className={classes.modalFooter}>
                      <Button
                        onClick={() => this.handleClose("classicModal")}
                        color="primary"
                        simple
                      >
                        OK
                      </Button>
                    </DialogActions>
                  </Dialog>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(RegisterPage);
