// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Imports
import { Typography } from '@mui/material'

const Home = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={3} md={3}>
        <Typography variant='h6'>Dashboard Page</Typography>
      </Grid>
    </Grid>
  )
}

Home.acl = {
  action: 'read',
  subject: 'home'
}

export default Home
