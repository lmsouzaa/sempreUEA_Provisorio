import React from "react";
import { withRouter } from 'react-router';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Popover from "@material-ui/core/Popover";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";
import Global from 'global';
import md5 from 'js-md5'

class LoginPage extends React.Component {
  validInputs = {};

  constructor(props) {
    super(props);
    this.initValidInptus();
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      cpf: '',
      password : '',
      openBottom:false,
      messageErro: '',
      titleErro:'',
    };
  
  }
  initValidInptus(){
    this.validInputs = {
      cpf: true,
      password: true
    }

  }


  handleChange(evt) {
    if(evt.target.id === 'cpf'){
        this.setState({
            cpf : evt.target.value
        });
    }else{
        this.setState({
            password : evt.target.value
        });
    }
  }
  
  inputsValidation(){
    if(this.state.cpf.length < 12){
      this.validInputs.cpf = false;
      this.setState({cpf:this.state.cpf});
    }

    if(this.state.password.length < 6){
      this.validInputs.password = false;
      this.setState({password:this.state.password});
    }

    if(this.validInputs.cpf
      && this.validInputs.password){
      return true;
    }
    else{
      this.setState({
        openBottom:true,
        titleErro:'Preencha todos os campos corretamente',
        messageErro:'Para logar no site é necessário preencher todos os campos corretamente'
      });
      return false;
    }
  }

  handleChangeCPF(evt) {
    if(evt.target.value.length < 14){
      this.validInputs.cpf = false;
    }else{
      this.validInputs.cpf = true;
    }
    
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
  }

  handleChangePassword(evt) {
    if(evt.target.value.length < 6){
      this.validInputs.password = false;
    }else{
      this.validInputs.password = true;
    }
    if(evt.target.id === 'password'){
        this.setState({
            password : evt.target.value.substring(0,20)
        });
    }
  }

  handleClosePopover(state) {
    this.setState({
      [state]: false
    });
  }

  handleSubmit(evt) {

    const str = this.state.cpf;
    let cpf = '';
    var i;
    for (i = 0; i < str.length; i++) { 
      cpf += (str[i]!=='.' && str[i]!=='-' ? str[i]:'');
    }

    if(!this.inputsValidation()){
      this.setState({
        openBottom:true,
        titleErro:'Preencha todos os campos corretamente',
        messageErro:'Para logar no site é necessário preencher todos os campos corretamente'
      });
    } else {
        fetch(Global.API_URL + '/login', { //local
            headers : new Headers({
                'x-api-key' : 'eiWee8ep9due4deeshoa8Peichai8Eih',
                'Authorization': 'Basic '+btoa(cpf+':'+md5(this.state.password)),
            })
        })
        .then(function(response){
          if(response.status == 200){
            return response.json();
          }else{
            this.setState({
              openBottom:true,
              titleErro:'Erro no Sistema',
              messageErro:'O sistema pode estar temporariamente fora do ar, tente novamente mais tarde'
            });
          }
        })
        .then(data => {            
            if(data.canLogin){
                    sessionStorage.setItem('jwtToken', data.token);
                    this.props.history.push('/profile-page');
                    
                } else{
                  this.setState({
                    openBottom:true,
                    titleErro:'Dados Incorretos',
                    messageErro:'Verifique as CPF e Senha e tente novamente'
                  });
                }
            })  
        .catch((e) => {
                
                this.setState({
                  openBottom:true,
                  titleErro:'Erro no Sistema',
                  messageErro:'O sistema pode estar temporariamente fora do ar, tente novamente mais tarde'
                });
        });
    }     
    evt.preventDefault();
  }
  isANumber(str){
    let a = str[str.length-1];
    if(a == '0' || a == '1' ||a == '2' ||a == '3' ||a == '4' ||a == '5' ||a == '6' ||a == '7' ||a == '8' ||a == '9') return true;
    else return false;
  }

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }

  goToRegister(){
    this.props.history.push('/register-page')
  }

  goToProfile(){
    this.props.history.push('/profile-page')
  }

  render() {
    const { classes } = this.props;
    return (
          <div>
            <GridContainer justify="center">
              <GridItem xs={0} sm={0} md={4}></GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <Card className={classes[this.state.cardAnimaton, classes.cardLogin]}>
                  <form className={classes.form}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>Login</h4>
                      
                    </CardHeader>
                    <CardBody>
                      
                      <CustomInput
                        labelText="CPF..."
                        id="cpf"
                        error = {!this.validInputs.cpf}
                        value={this.state.cpf}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: ((event) => this.handleChangeCPF(event)),
                          type: "text",
                          endAdornment: (
                            <InputAdornment position="end">
                              <Email className={classes.inputIconsColor} />
                            </InputAdornment>
                          )
                        }}
                      />
                      <CustomInput
                        labelText="Senha"
                        id="password"
                        error = {!this.validInputs.password}
                        value={this.state.password}
                        formControlProps={{
                          fullWidth: true
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
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={12} className={classes.buttonsContainer}>
                          <Button
                            onClick={this.handleSubmit.bind(this)}
                            color="primary" size="md"
                            buttonRef={node => {
                              this.anchorElBottom = node;
                            }}>
                            ENTRAR
                          </Button>
                            <Popover
                              classes={{
                                paper: classes.popover
                              }}
                              open={this.state.openBottom}
                              anchorEl={this.anchorElBottom}
                              anchorReference={"anchorEl"}
                              onClose={() => this.handleClosePopover("openBottom")}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center"
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "center"
                              }}
                            >
                              <h3 className={classes.popoverHeader}>{this.state.titleErro}</h3>
                              <div className={classes.popoverBody}>
                                {this.state.messageErro}
                              </div>
                            </Popover>
                        </GridItem>
                        <p className={classes.divider}>Ou</p>
                        <GridItem xs={12} sm={12} md={12} className={classes.buttonsContainer}>
                          <Button onClick={this.goToRegister.bind(this)} simple color="secondary" size="md">
                            FAZER CADASTRO
                          </Button>
                        </GridItem>
                      </GridContainer>
                    </CardFooter>
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
      </div>
    );
  }
}

export default withRouter(withStyles(loginPageStyle)(LoginPage));
