// ** React Imports
import { useState, useEffect, forwardRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

const Transition = forwardRef((props, ref) => <Fade ref={ref} {...props} />)

const DialogEditProduct = ({ product, refreshData }) => {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const auth = useAuth()

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    mode: 'onBlur'
  })

  useEffect(() => {
    if (product) {
      setValue('name', product.name)
      setValue('description', product.description)
      setValue('price', product.price)
      setValue('stock', product.stock)
      setValue('product_image', null)
    }
  }, [product, setValue])

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
      formData.append('_method', 'PUT')
      if (selectedFile) {
        formData.append('product_image', selectedFile)
      }

      const response = await fetch(`http://localhost:8000/api/super_admin/products/${product.ProductID}`, {
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

      toast.success('Product Information Edited Successfully')
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
      <Button size='small' startIcon={<EditIcon />} onClick={() => setShow(true)} variant='outlined'>
        Edit
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
          <DialogContent sx={{ position: 'relative', p: theme => theme.spacing(8, 5, 5) }}>
            <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: 16, top: 16 }}>
              <CloseIcon />
            </IconButton>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 3 }}>
                Edit Product
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
          <DialogActions sx={{ justifyContent: 'center', p: theme => theme.spacing(5) }}>
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

export default DialogEditProduct
