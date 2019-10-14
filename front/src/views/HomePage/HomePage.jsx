import React from "react";
import MediaQuery from 'react-responsive';
// nodejs library that concatenates classes
import classNames from "classnames";
import './HomePage.css';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Footer from "views/ComponentsSempreUEA/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import Navbar from "../ComponentsSempreUEA/Navbar";
import Login from "../ComponentsSempreUEA/Login";
import CardAluno from "../ComponentsSempreUEA/CardAluno";
import CardAlunoSmall from "../ComponentsSempreUEA/CardAlunoSmall";
import Global from 'global';

import camera from 'assets/img/faces/profile_default.png';

import homePageStyle from "views/HomePage/homePageStyle.jsx";

class HomePage extends React.Component {
    constructor(){
        super();
        this.state = {
            alunos: [],
            selected: ''
        } 
    }

    componentDidMount(){
      var request = {
          method: 'get',
          mode: 'cors',
          headers : new Headers({
            'x-api-key' : 'eiWee8ep9due4deeshoa8Peichai8Eih',
          })
      }
      fetch(Global.API_URL + '/alunos/12', request).then((response) => {
        if(response.status == 200){
          response.json().then((data) => {
              this.setState({alunos:data.alunos}) 
          });  
        } else {
          alert('Houve um erro ao listar Alunos, tente novamente mais tarde');
        }
      }).catch((e) => {
          
          alert('Houve um erro ao listar Alunos, tente novamente mais tarde');
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


  render() {
    const { classes } = this.props;
    //const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
    
    let list = <div>
            <div className={classes.container}>
              <div className={classes.description}>
                  <h2 className={classes.titleEgressos}>
                  ALUNOS E EGRESSOS
                  </h2>
              </div>
              <GridContainer justify="center">
              {this.state.alunos.map(c => 
                <CardAluno aluno={c}></CardAluno>
              )}
              </GridContainer>
              <br/>
              <br/>
              <br/>
            </div>
          </div>

          let listSmall = 
          <div className={classes.containerSmall}>
            <div className={classes.egressosSmallContainer}>
              <div className={classes.description}>
                  <h2 className={classes.titleEgressos}>
                  ALUNOS E EGRESSOS
                  </h2>
              </div>
              <GridContainer justify="center">
              {this.state.alunos.map(c => 
                <CardAlunoSmall aluno={c}></CardAlunoSmall>
              )}
              </GridContainer>
              <br/>
              <br/>
              <br/>
            </div>
          </div>
    
    return (
      <div>
        <Navbar page={"home"}/>
        <Parallax filter image={require("assets/img/bgs/home.jpg")}>
        <div className={classes.container}>
            <br/>
            <br/>
            <br/>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <h2 className={classes.title}>Bem Vindo ao Sempre UEA</h2>
                <h4 className={classes.descriptionText}>
                O Sempre UEA é uma plataforma onde os alunos e egressos da UEA podem compartilhar
                suas experiências após a faculdade. Aqui você poderá conhecer alunos e ex-alunos e
                suas trajetórias, e também pode compartilhar sua história com os outros colegas
                </h4>
                <br />
              </GridItem>
              
              {sessionStorage.getItem('jwtToken')? '':
              <GridItem xs={12} sm={12} md={6} className = "hiddenOnSmallScreen">
                <Login/>
              </GridItem>
              }
            </GridContainer>
          </div>
        </Parallax>
        <MediaQuery query="(min-device-width: 600px)">
          <div className={classNames(classes.main, classes.mainRaised)}>
              {list}
          </div>
        </MediaQuery>
        <MediaQuery query="(max-device-width: 600px)">
          {listSmall}
        </MediaQuery>
        <Footer/>
      </div>
    );
  }
}

export default withStyles(homePageStyle)(HomePage);
