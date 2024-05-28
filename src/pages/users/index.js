// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import axios from 'axios'
import { GridToolbarContainer, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'

// ** Views
import DialogAddUser from 'src/views/pages/user/DialogAddUser'
import DialogEditUser from 'src/views/pages/user/DialogEditUser'
import DialogDeleteUser from 'src/views/pages/user/DialogDeleteUser'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

function CustomToolbar(props) {
  const { setUserRows } = props

  const auth = useAuth()

  // Refresh list of users
  const fetchUsers = async () => {
    const response = await fetch('http://localhost:8000/api/super_admin/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.user.token}`
      }
    })

    const data = await response.json()
    setUserRows(data)
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <GridToolbarContainer style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <DialogAddUser refreshData={fetchUsers} />
        <GridToolbarFilterButton style={{ marginRight: '8px', marginBottom: '8px' }} />
      </div>
      <div>
        <Button
          size='small'
          variant='outlined'
          style={{ marginLeft: '8px', marginRight: '8px', marginBottom: '8px' }}
          onClick={() => fetchUsers()}
        >
          Refresh
        </Button>
        <GridToolbarQuickFilter style={{ marginBottom: '8px' }} />
      </div>
    </GridToolbarContainer>
  )
}

const UserPage = () => {
  // ** States
  const [userPaginationModel, setUserPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [userRows, setUserRows] = useState([])

  const auth = useAuth()

  // Refresh list of users
  const fetchUsers = async () => {
    const response = await fetch('http://localhost:8000/api/super_admin/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.user.token}`
      }
    })

    const data = await response.json()
    setUserRows(data)
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const userColumn = [
    {
      flex: 0.1,
      minWidth: 200,
      field: 'fullName',
      headerName: 'Full Name',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.first_name + ' ' + params.row.last_name}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'email',
      headerName: 'Email Address',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.email}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'username',
      headerName: 'Username',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.username}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'action',
      headerName: 'Actions',
      renderCell: params => {
        return (
          <>
            <DialogEditUser user={params.row} refreshData={fetchUsers} />
            <DialogDeleteUser user_id={params.row.UserID} refreshData={fetchUsers} />
          </>
        )
      }
    }
  ]

  return (
    <Grid container spacing={8}>
      <Grid item sm={12} xs={12} sx={{ width: '100%' }}>
        <Card>
          <CardHeader title='Users' />
          <DataGrid
            autoHeight
            columns={userColumn}
            rows={userRows}
            getRowId={row => row.UserID}
            pageSizeOptions={[10, 25, 50, 100]}
            paginationModel={userPaginationModel}
            slots={{ toolbar: CustomToolbar }}
            onPaginationModelChange={setUserPaginationModel}
            slotProps={{
              baseButton: {
                variant: 'outlined'
              },
              toolbar: {
                setUserRows
              }
            }}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

UserPage.acl = {
  action: 'read',
  subject: 'user-page'
}

export default UserPage
