import { container } from "assets/jss/material-kit-react.jsx";
import imagesStyle from "assets/jss/material-kit-react/imagesStyles.jsx";
import modalStyle from "assets/jss/material-kit-react/modalStyle.jsx";
import {
  primaryColor,
} from "assets/jss/material-kit-react.jsx";
import { dangerColor } from "../../assets/jss/material-kit-react";
const registerPageStyle = {
  ...modalStyle,
  container: {
    ...container,
    zIndex: "2",
    position: "relative",
    paddingTop: "20vh",
    color: "#FFFFFF"
  },
  containerImage:{
    justifyContent: "center",
    textAlign: "center",
  },
  imageProfile:{
    width: "160px",
    height: "160px",
    objectFit: "cover",
    borderRadius: "50%",
    marginLeft: "0 !important",
    paddingLeft: "0 !important",
    marginRight: "0 !important",
    paddingRight: "0 !important"
  },
  danger:{
    color: "red !important",
  },
  ...imagesStyle,
  cardHidden: {
    opacity: "0",
    transform: "translate3d(0, -60px, 0)"
  },
  cardDisabled: {
    background: "#E0E0E0 !important"
  },
  
  buttonsContainer:{
    textAlign: "center"
  },
  date:{
    margin: "0 0 17px 0",
    paddingTop: "27px"
  },
  toggleSituation:{
    paddingTop:"27px !important",
    // marginTop:"27px !important",
    width: "100% !important"
  },
  inactive:{
    width: "100% !important",
    paddingTop: "20px",
    paddingBottom: "20px"
  },
  active:{
    width: "100% !important"
  },
  pageHeader: {
    minHeight: "100vh",
    height: "auto",
    display: "inherit",
    position: "relative",
    margin: "0",
    padding: "0",
    border: "0",
    alignItems: "center",
    "&:before": {
      background: "rgba(0, 0, 0, 0.5)"
    },
    "&:before,&:after": {
      position: "absolute",
      zIndex: "1",
      width: "100%",
      height: "100%",
      display: "block",
      left: "0",
      top: "0",
      content: '""'
    },
    "& footer li a,& footer li a:hover,& footer li a:active": {
      color: "#FFFFFF"
    },
    "& footer": {
      position: "absolute",
      bottom: "0",
      width: "100%",
    }
  },
  // cardBody:{
  //   minWidth:"445px !important"
  // },
  select: {
    "&:before": {
        borderColor: { main: "#199900" },
    },
    "&:after": {
        borderColor: { main: "#199900" },
    },
  },
  form: {
    margin: "0"
  },
  cardHeader: {
    width: "auto",
    textAlign: "center",
    marginLeft: "20px",
    marginRight: "20px",
    marginTop: "-40px",
    padding: "20px 0",
    marginBottom: "15px"
  },
  socialIcons: {
    maxWidth: "24px",
    marginTop: "0",
    width: "100%",
    transform: "none",
    left: "0",
    top: "0",
    height: "100%",
    lineHeight: "41px",
    fontSize: "20px"
  },
  divider: {
    marginTop: "30px",
    width: "100%",
    textAlign: "center"
  },
  dividerAuth:{
    marginTop:"30px",
    backgroundColor: "#cecece",
    width: "100%",
    height: "1px"
  },
  
  cardFooter: {
    paddingTop: "0rem",
    border: "0",
    borderRadius: "6px",
    justifyContent: "center !important",
  },
  buttonContainerCenter:{
    textAlign: "center",
  },
  registerAuthenticatio:{
    paddingBottom: "20px"
  },
  formControl:{
    fullWidth: true,
    display: 'flex',
    wrap: 'nowrap',
    color: primaryColor,
    underlineStyle: primaryColor,
    marginTop: "10px"
    
  },
  socialLine: {
    marginTop: "1rem",
    textAlign: "center",
    padding: "0"
  },
  inputIconsColor: {
    color: "#495057"
  },
  buttonNext:{
    marginLeft:"10px"
  },
  buttonBack:{
    marginLeft:"10px"
  },
  inputInfo:{
    marginTop: "-15px !important",
    color: "#878787"
  }
};

export default registerPageStyle;
