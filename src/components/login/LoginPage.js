import { Button, TextField, Grid } from '@mui/material';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { useState } from 'react';

const LoginValidation = object().shape({
  username: string().required("Required."),
  password: string().required("Required.")
})

const LoginPage = () => {
  const [msg, setMsg] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      password: ""
    },
    validationSchema: LoginValidation,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  })

  const handleSubmit = (values) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: values.username,
        password: values.password
      }),
    };
    fetch("api/login", requestOptions)
      .then((response) => response.json())
      .then((out) => {
        console.log(out)
        setMsg([...Object.values(out)])
      });
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
            <Button color="primary" variant="contained" fullWidth type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      <p>Return: {msg}</p>
    </div>
  )
}

export default LoginPage;