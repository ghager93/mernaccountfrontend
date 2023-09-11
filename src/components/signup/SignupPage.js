import { Button, TextField, Grid, Checkbox, FormControlLabel, Dialog } from '@mui/material';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginValidation = object().shape({
  username: string().required("Required."),
  password: string().required("Required."),
  confirmPassword: string().required("Required.")
})

const SignupPage = () => {
  const [msg, setMsg] = useState("");
  const [twofa, setTwofa] = useState(false);
  const [emailVerification, setEmailVerification] = useState(false);
  const [qrcode, setQrcode] = useState("");
  const [secret, setSecret] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema: LoginValidation,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  })

  const handleSubmit = (values) => {
    if(values.password !== values.confirmPassword) {
      setMsg("Passwords don't match.")
    }
    else {
      const bodyjson = {
        username: values.username,
        password: values.password,
        emailVerification: emailVerification
      }
      if (emailVerification) {
        bodyjson.email = values.email
      }
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyjson),
      };
      console.log(requestOptions)
      fetch("api/creds", requestOptions)
      .then((response) => response.json())
      .then((out) => {
        console.log(out)
        setMsg([...Object.values(out)])
      });
      
      console.log(twofa)
      if(twofa) {
        const qrRequestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify({
            username: values.username
          })
        } 
        fetch("api/2fa/generate-2fa", qrRequestOptions)
        .then((response) => response.json())
        .then((out) => {
          setQrcode(out.img)
          setSecret(out.secret)
          setOpenDialog(true)
        })
      }
    }
  }

  const TwofaSwitch = () => {  
    return (
      <FormControlLabel control={<Checkbox checked={twofa} onChange={e => setTwofa(e.target.checked)} />} label="Enable Two-Factor Authentication" />
    )
  }

  const EmailVerificationSwitch = () => {  
    return (
      <FormControlLabel control={<Checkbox checked={emailVerification} onChange={e => setEmailVerification(e.target.checked)} />} label="Enable Email Verification" />
    )
  }
  
  const onCloseDialog = () => {
    setOpenDialog(false)
    navigate("/")
  }

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Grid container direction={"column"} spacing={1} margin={0}>
          <Grid item padding={1}>
            <TextField
              fullWidth
              id="username"
              name="username"
              label="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item padding={1}>
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              value={formik.values.url}
              onChange={formik.handleChange}
              type="password"
            />
          </Grid>
          <Grid item padding={1}>
            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              value={formik.values.url}
              onChange={formik.handleChange}
              type="password"
            />
          </Grid>
          <Grid item padding={1}>
            <TwofaSwitch />
            <EmailVerificationSwitch />
          </Grid>
          <Grid item padding={1}>
            <Button color="primary" variant="contained" type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      <p>Return: {msg}</p>
      <Dialog open={openDialog} onClose={onCloseDialog}>
        <img src={qrcode} alt="A QR Code"/>
        {secret}
        <Button color="primary" variant="contained" fullWidth onClick={onCloseDialog}>
          Done
        </Button>
      </Dialog>
    </div>
  )
}

export default SignupPage;