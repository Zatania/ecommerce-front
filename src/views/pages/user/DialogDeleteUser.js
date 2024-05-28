// ** React Imports
import { Ref, useEffect, useState, forwardRef, ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DialogDeleteUser = ({ user_id, refreshData }) => {
  const [show, setShow] = useState(false)

  const auth = useAuth()

  const handleClose = () => {
    setShow(false)
    refreshData()
  }

  const handleDeleteClick = async () => {
    await fetch(`http://localhost:8000/api/super_admin/users/${user_id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${auth.user.token}`
      }
    })
      .then(response => {
        if (response.ok) {
          toast.success('User deleted successfully')
        } else {
          toast.error('Error deleting user')
        }
      })
      .catch(error => {
        console.error('Error deleting user', error)
        toast.error('Error deleting user')
      })
    handleClose()
  }

  return (
    <Card>
      <Button size='small' startIcon={<DeleteIcon />} variant='outlined' onClick={() => setShow(true)}>
        Delete
      </Button>
      <Dialog
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={handleClose}
        TransitionComponent={Transition}
        onBackdropClick={handleClose}
      >
        <DialogContent
          sx={{
            position: 'relative',
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
            <Icon icon='mdi:close' />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h6' gutterBottom>
              Are you sure you want to delete this user?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' color='error' sx={{ mr: 1 }} onClick={handleDeleteClick}>
            Delete
          </Button>
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default DialogDeleteUser
