import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Footer from "views/ComponentsSempreUEA/Footer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import Navbar from "../ComponentsSempreUEA/Navbar.jsx";
import camera from 'assets/img/faces/profile_default.png';

import "./ProfilePage.css";

import Global from 'global';
import profilePageStyle from "views/ProfilePage/profilePageStyle.jsx";

class ProfilePage extends React.Component {

  constructor(props){
    super(props);    
    this.state = {
      entryYear:'',
      exitYear: '',
      situation: '',
      disc_institutuion : '',
      disc_situation: '',
      disc_function:'',
      name: '',
      email:'',
      linkedin:'',
      unity: '',
      course: '',
      cpf: '',
      password: '',
      facebook: '',
      imageURL: '',      
      lattes: '',
      whatsapp: '',
      id: this.props.match.params.aluno
    }
  }

  componentDidMount() {
    
      var id = ''+this.props.match.params.aluno
      if(id!=='undefined'){
        fetch(Global.API_URL + '/alunos/'+id, {
          headers : new Headers({
            'x-api-key' : 'eiWee8ep9due4deeshoa8Peichai8Eih',            
          })
        }).then((response) => {
          if(response.status !== 200){
            alert('Houve um erro ao listar perfil, tente novamente mais tarde');
            this.props.history.push('/home');
            return;
          }    
          response.json().then((data) => {
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
              situation: ''+data.situacao,
              discInstitution: data.discInstitution,
              discFunction: data.discFunction,
              discSituation: ''+data.discSituation, 
              egresInstitution: data.egresInstitution,
              egresSituation: data.egresSituation,
              egresFunction: ''+data.egresFunction,
              lattes: data.lattes,
              whatsapp: data.whatsapp,
              imageURL: Global.API_URL + '/imgs/uploads/' + data.cpf + '.jpeg?v=' + Date.now()
            })
          }).catch((e) => {
            alert('Houve um erro ao listar perfil, tente novamente mais tarde');
            this.props.history.push('/list');
          });;
        }).catch((e) => {
          sessionStorage.setItem('jwtToken', '');
          alert('Houve um erro ao listar perfil, tente novamente mais tarde');
          this.props.history.push('/login');
        });   
        return;
      }

      fetch(Global.API_URL + '/alunos', {
        headers : new Headers({
            'x-api-key' : 'eiWee8ep9due4deeshoa8Peichai8Eih', 
            'x-access-token' : sessionStorage.getItem('jwtToken')
        })
      }).then((response) => {    
        if(response.status !== 200){
          alert('Houve um erro ao listar perfil, tente novamente mais tarde');
          this.props.history.push('/home');
          return;
        }   
        response.json().then((data) => {
          sessionStorage.setItem('id', data.id);
          sessionStorage.setItem('name', data.nome);
          this.setState({
            name: data.nome,
            email: data.email,
            linkedin: data.linkedin,
            unity: data.unidade_nome,
            course: data.curso_nome,
            id: data.id,
            facebook: data.facebook,
            entryYear: data.ano_ingresso,
            exitYear: data.ano_conclusao,
            situation: ''+data.situacao,
            discInstitution: data.discInstitution,
            discFunction: data.discFunction,
            discSituation: ''+data.discSituation, 
            egresInstitution: data.egresInstitution,
            egresSituation: data.egresSituation,
            egresFunction: ''+data.egresFunction,                
            lattes: data.lattes,
            whatsapp: data.whatsapp,
            imageURL: Global.API_URL + '/imgs/uploads/' + data.id + '.jpeg?v=' + Date.now(),
          })
        });
      }).catch((e) => {
        sessionStorage.setItem('jwtToken', '');
        alert('Houve um erro ao listar perfil, tente novamente mais tarde');
        this.props.history.push('/login');
      });  
      
      
  }

  handleError(e){
    e.target.src = camera;
  }

  openLink(link){
    if(link==='' || link===null){
      alert('Nenhuma pagina adicionada')
    } else{ 
      window.open(link);
    }
  }
  
  static contextTypes = {
    router: () => true, // replace with PropTypes.object if you use them
  }

  render() {
    const { classes } = this.props;
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );
    var edit = null;
    if(sessionStorage.getItem("id") === this.state.id){
      edit = <Button onClick={() => this.props.history.push('/register-page')} color="primary" className={classes.buttonEditar}>Editar</Button>
    }
    
    return (
      <div>
        <Navbar />
        <Parallax small filter image={require("assets/img/bgs/perfil.jpg")} />
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6}>
                  <div className={classes.profile}>
                    <div>
                      
 <img id = "imageRotate" onError={this.handleError} src={Global.API_URL + '/imgs/uploads/' + this.state.id + '.jpeg?v=' + Date.now()} alt="..." className={classes.imageProfile} />
                    </div>
                    <div className={classes.name}>
                      <h3 className={classes.title}>{(this.state.name == null? '-':this.state.name)}</h3>
                    <br/>
                    </div>
                  </div>
                </GridItem>
              </GridContainer>
              <div className={classes.description}>   
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={12} md={12}>
                            <p id='unity' placeholder='Unidade' type='unity'><strong>Unidade: </strong>{(this.state.unity == null? '-':this.state.unity)}</p>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12}>
                            <p id='course' placeholder='Curso' type='course'><strong>Curso: </strong>{(this.state.course == null? '-':this.state.course)}</p>
                          </GridItem>

                          <GridItem xs={12} sm={12} md={12}>
                            <p type='entryYear'><strong>Ano de Ingresso: </strong>{(this.state.entryYear == null? '-':this.state.entryYear)}</p>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12}>
                            <p type='exitYear'><strong>Ano de Egresso: </strong>{(this.state.exitYear == null? '-':this.state.exitYear)}</p>
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={12} md={12}>
                            <p type='email' ><strong>Email: </strong>{(this.state.email == null? '-':this.state.email)}</p>   
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12}>
                            <p type='Lattes' ><strong>Lattes: </strong><a href={this.state.lattes} target={"_blank"}>{(this.state.lattes == null? '-':this.state.lattes)}</a></p>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12}>
                            <p type='LinkedIn' ><strong>Linkedin: </strong><a href={this.state.linkedin} target={"_blank"}>{(this.state.linkedin == null? '-':this.state.linkedin)}</a></p>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12}>
                            <p type='WhatsApp' ><strong>Whatsapp: </strong><a href={"https://api.whatsapp.com/send?phone=" + this.state.whatsapp} target={"_blank"}>{(this.state.whatsapp == null? '-':this.state.whatsapp)}</a></p>
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                    </GridContainer>
                    {/* <p id="cpf"> cpf: {this.state.cpf}</p> */}

                    <br/>
                    <div className={classes.centerContainer}>
                      {/* <Button onClick={() => this.props.history.push('/')} className={classes.buttonVoltar}>Voltar</Button> */}
                      <Button onClick={this.context.router.history.goBack} className={classes.buttonVoltar}>Voltar</Button>

                      {edit}
                    </div>
              </div>
                {/* <p>
                  Formada em Sistema de Informação na Escola Superior de Tecnologia (EST)
                  em 2020, hoje atuo na área de banco de dados, segurança da informação e
                  data science. Ocupo o cargo de DBA na empresa TechPee desde 2022. Moro
                  em Toronto, Canadá desde 2021.
                  <br/><br/><br/><br/><br/><br/>
                  {" "}
                  
                </p> */}
          
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(profilePageStyle)(ProfilePage);
