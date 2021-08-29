import Head from 'next/head'
import { useContext, useState } from 'react'
import { getData } from '../../utils/fetchData'
import { DataContext } from '../../store/GlobalState'
import { addToCart } from '../../store/Actions'
import BackBtn from '../../components/BackBtn'

const DetailProduct = (props) => {
  const [product] = useState(props.product)
  const [tab, setTab] = useState(0)
  

  const [state, dispatch] = useContext(DataContext)
  const { cart } = state

  const isActive = (index) => {
    if(tab === index) return " active"
    return ""
  }

    return (
        <div className="row detail_page">
            <Head>
                <title>Detail Product</title>
            </Head>
            <div className="col-md-1 mt-4">
               <BackBtn />
            </div>

            <div className="col-md-6">
              <img src={ product.images[tab].url } alt={ product.images[tab].url }
              className="d-block img-thumbnail rounded mt-4 w-100" style={{height: '400px'}} />

              <div className="row mx-0" style={{cursor: 'pointer'}}>
                {product.images.map((img, index) => (
                  <img key={index} src={img.url} alt={img.url}
                  className={`img-thumbnail rounded ${isActive(index)}`}
                  style={{height: '80px', width: '20%'}}
                  onClick={() => setTab(index)} />
                ))}
              </div>
            </div>

            <div className="col-md-5 mt-4">
                <h4>{product.title}</h4>
                <p style={{fontSize: '20px'}}><em>Price: ${product.price}</em></p>

                <div className="row mx-0 d-flex justify-content-between mt-5">
                  {
                    product.inStock > 0
                    ? <h6 className="text-dark">In Stock: {product.inStock}</h6>
                    : <h6 className="text-danger">Out Stock</h6>
                  }

                  <h6 className="text-danger">Sold: {product.sold}</h6>
                </div>

                <div className="my-2">{product.description}</div>
                <div className="my-2">{product.content}</div>

                {
                    product.inStock > 0
                    ? <button type="button" className="btn btn-success d-block my-3 px-5"
                      onClick={() => dispatch(addToCart(product, cart))}> Buy </button>
                    : <button className="btn btn-danger d-block my-3 px-5" disabled>Out Stock</button>
                }
                
            </div>
        </div>
    )
}

export async function getServerSideProps({params: {id}}) {
    const res = await getData(`product/${id}`)
    console.log(res)
    // server side rendering
    return {
      props: { product: res.product } // will be passed to the page component as props
    }
  }

export default DetailProduct