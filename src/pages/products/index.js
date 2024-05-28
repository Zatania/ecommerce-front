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
import DialogAddProduct from 'src/views/pages/product/DialogAddProduct'
import DialogEditProduct from 'src/views/pages/product/DialogEditProduct'
import DialogDeleteProduct from 'src/views/pages/product/DialogDeleteProduct'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

function CustomToolbar(props) {
  const { setProductRows } = props

  const auth = useAuth()

  // Refresh list of products
  const fetchProducts = async () => {
    const response = await fetch('http://localhost:8000/api/super_admin/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.user.token}`
      }
    })

    const data = await response.json()
    setProductRows(data)
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <GridToolbarContainer style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <DialogAddProduct refreshData={fetchProducts} />
        <GridToolbarFilterButton style={{ marginRight: '8px', marginBottom: '8px' }} />
      </div>
      <div>
        <Button
          size='small'
          variant='outlined'
          style={{ marginLeft: '8px', marginRight: '8px', marginBottom: '8px' }}
          onClick={() => fetchProducts()}
        >
          Refresh
        </Button>
        <GridToolbarQuickFilter style={{ marginBottom: '8px' }} />
      </div>
    </GridToolbarContainer>
  )
}

const ProductPage = () => {
  // ** States
  const [productPaginationModel, setProductPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [productRows, setProductRows] = useState([])

  const auth = useAuth()

  // Refresh list of products
  const fetchProducts = async () => {
    const response = await fetch('http://localhost:8000/api/super_admin/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.user.token}`
      }
    })

    const data = await response.json()
    setProductRows(data)
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const productColumn = [
    {
      flex: 0.1,
      minWidth: 200,
      field: 'product_name',
      headerName: 'Full Name',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.name}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'price',
      headerName: 'Price',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {'Php' + ' ' + params.row.price}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'stock',
      headerName: 'Stock',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.stock}
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
            <DialogEditProduct product={params.row} refreshData={fetchProducts} />
            <DialogDeleteProduct product_id={params.row.ProductID} refreshData={fetchProducts} />
          </>
        )
      }
    }
  ]

  return (
    <Grid container spacing={8}>
      <Grid item sm={12} xs={12} sx={{ width: '100%' }}>
        <Card>
          <CardHeader title='Products' />
          <DataGrid
            autoHeight
            columns={productColumn}
            rows={productRows}
            getRowId={row => row.ProductID}
            pageSizeOptions={[10, 25, 50, 100]}
            paginationModel={productPaginationModel}
            slots={{ toolbar: CustomToolbar }}
            onPaginationModelChange={setProductPaginationModel}
            slotProps={{
              baseButton: {
                variant: 'outlined'
              },
              toolbar: {
                setProductRows
              }
            }}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

ProductPage.acl = {
  action: 'read',
  subject: 'product-page'
}

export default ProductPage
