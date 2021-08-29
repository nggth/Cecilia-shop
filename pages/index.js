import Head from 'next/head'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import { getData } from '../utils/fetchData'
import { useRouter } from 'next/router'
import filterSearch from '../utils/filterSearch'
import ProductItem from '../components/product/ProductItem'
import Filter from '../components/Filter'
import Carousel from '../components/Carousel'

const Home = (props) => {
  const [ products, setProducts ] = useState(props.products)
  const router = useRouter()

  const [ isChecked, setIsChecked ] = useState(false)

  const [ page, setPage ] = useState(1)
  
  const [ state ] = useContext(DataContext)
  const { auth } = state

  useEffect(() => {
    setProducts(props.products)
  }, [props.products])

  useEffect(() => {
    if (Object.keys(router.query).length === 0) setPage(1) 
  }, [router.query])

  const handleCheck = (id) => {
    products.forEach(product => {
      if (product._id === id) product.checked = !product.checked
    })
    setProducts([...products])
  }

  const handleCheckAll = () => {
    products.forEach(product => product.checked = !isChecked )
    setProducts([...products])
    setIsChecked(!isChecked)
  }

  const handleDeleteAll = () => {
    let deleteArray = []
    products.forEach(product => {
      if (product.checked) {
        deleteArray.push({
          data: '', id: product._id,
          title: 'Delete all selected products?', type: 'DELETE_PRODUCT'
        })
      }
    })
    dispatch({ type: 'ADD_MODAL', payload: deleteArray })
  }

  const handleLoadMore = () => {
    setPage(page + 1)
    filterSearch({router, page: page + 1})
  }

  return(
    <div>
      <Head>
        <title>Home Page</title>
      </Head>

      <Carousel/>

      <Filter state={state} />

      {
        auth.user && auth.user.role === 'admin' &&
        <div className="delete_all btn btn-danger mt-2" style={{ marginBottom: '-10px'}}>
          <input type="checkbox" checked={isChecked} onChange={handleCheckAll}
            style={{width: '25px', height: '15px', transform: 'translateY(8px)'}} />
          <button className="btn btn-danger ml-2 btn-sm"
          data-toggle="modal" data-target="#exampleModal"
          onClick={handleDeleteAll}>Delete all</button>
        </div>
      }
      
      <div className="products">
        {
          products.length === 0
          ? <h2>No products</h2>
          : products.map(product => (
            <ProductItem key={product._id} product={product} handleCheck={handleCheck} />
          ))
        }

      </div>

      {
        props.result < page * 6 ? ""
        : <button className="btn btn-out-line d-block mx-auto mb-4"
        onClick={handleLoadMore}>
          Load more
        </button>
      }
    </div>
  )
}

// pre-render this page on each request using the data returned by getServerSideProps.
export async function getServerSideProps({query}) {
  const page = query.page || 1
  const category = query.category || 'all'
  const sort = query.sort || ''
  const search = query.search || 'all'

  const res = await getData(
    `product?limit=${page * 6}&category=${category}&sort=${sort}&title=${search}`
  )
  // server side rendering
  return {
    props: {
      products: res.products,
      result: res.result
    }, // will be passed to the page component as props
  }
}

export default Home