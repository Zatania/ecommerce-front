import { Ref, useState, forwardRef, ReactElement, useEffect, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import AddIcon from '@mui/icons-material/Add'
import OutlinedInput from '@mui/material/OutlinedInput'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DialogAddProduct = ({ refreshData }) => {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const auth = useAuth()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'onBlur'
  })

  const handleClose = () => {
    setShow(false)
    reset()
    refreshData()
  }

  const onSubmit = async data => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('price', data.price)
      formData.append('stock', data.stock)
      if (selectedFile) {
        formData.append('product_image', selectedFile)
      }

      const response = await fetch(`http://localhost:8000/api/super_admin/products/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${auth.user.token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit form')
      }

      toast.success('Product Added Successfully')
      handleClose()
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Failed to submit form')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        size='small'
        onClick={() => setShow(true)}
        startIcon={<AddIcon />}
        variant='outlined'
        style={{ marginLeft: '8px', marginRight: '8px', marginBottom: '8px' }}
      >
        Add Product
      </Button>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={handleClose}
        TransitionComponent={Transition}
        onBackdropClick={handleClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
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
              <Typography variant='h5' sx={{ mb: 3 }}>
                Add Product
              </Typography>
              <Typography variant='body2'>Fill Product Information</Typography>
            </Box>
            <Grid container spacing={6}>
              {['name', 'price', 'stock', 'description'].map(field => (
                <Grid item sm={6} xs={12} key={field}>
                  <Controller
                    name={field}
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field: controllerField }) => (
                      <TextField
                        {...controllerField}
                        fullWidth
                        label={`Product ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                        error={!!errors[field]}
                        helperText={errors[field]?.message}
                        multiline={field === 'description'}
                        minRows={field === 'description' ? 1 : 1}
                      />
                    )}
                  />
                </Grid>
              ))}
              <Grid item sm={12} xs={12}>
                <Typography variant='body1'>Product Image</Typography>
                <FormControl>
                  <input
                    type='file'
                    id='product-image-upload'
                    style={{ display: 'none' }}
                    onChange={({ target }) => {
                      if (target.files && target.files[0]) {
                        setSelectedFile(target.files[0])
                      }
                    }}
                  />
                  <Button
                    variant='outlined'
                    component='label'
                    htmlFor='product-image-upload'
                    className='w-40 aspect-video rounded border-2 border-dashed cursor-pointer'
                  >
                    Select Image
                  </Button>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Button variant='contained' type='submit' disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default DialogAddProduct
