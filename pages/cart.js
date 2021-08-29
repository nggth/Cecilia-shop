import Head from 'next/head'
import { useContext, useState, useEffect } from "react"
import { DataContext } from "../store/GlobalState"
import CartItem from '../components/CartItem'
import Link from 'next/link'
import { getData, postData } from '../utils/fetchData'
import { useRouter } from 'next/router'
import BackBtn from '../components/BackBtn'

const Cart = () => {
  const [state, dispatch] = useContext(DataContext)
  const { cart, auth, orders } = state
  const [total, setTotal] = useState(0)
  const [address, setAddress] = useState('')
  const [mobile, setMobile] = useState('')

  const [callback, setCallback] = useState(false)
  const router = useRouter()

  // total product value
  useEffect(() => {
    const getTotal = () => {
      const res = cart.reduce((prev, item) => {
        return prev + (item.price * item.quantity)
      }, 0)
      setTotal(res)
    }
    getTotal()
  }, [cart])

  // update cart
  useEffect(() => {
    const cartLocal = JSON.parse(localStorage.getItem('__next__cart01__claire'))
    if(cartLocal && cartLocal.length > 0) {
      let newArr = []
      const updatedCart = async () => {
        for(const item of cartLocal) {
          const res = await getData(`product/${item._id}`)
          const { _id, title, images, price, inStock, sold } = res.product
          if (inStock > 0) {
            newArr.push({ 
              _id, title, images, price, inStock, sold,
              quantity: item.quantity > inStock ? 1 : item.quantity
            })
          }
        }
        dispatch({ type: 'ADD_CART', payload: newArr})
      }

      updatedCart()
    }
  }, [callback])

  const handlePayment = async () => {
    if (!address || !mobile)
    return dispatch({ type: 'NOTIFY', payload: {error: 'Please add your address and mobile.'}})
    // setPayment(true)
    let newCart = []
    for(const item of cart) {
      const res = await getData(`product/${item._id}`)
      if (res.product.inStock - item.quantity >= 0) {
        newCart.push(item)
      }
    }
    if (newCart.length < cart.length) {
      setCallback(!callback)
      return dispatch({ type: 'NOTIFY', payload: {error: 'the product is out of stock.'}})
    }

    dispatch({ type: 'NOTIFY', payload: {loading: true} })

    postData('order', { address, mobile, cart, total }, auth.token)
    .then(res => {
      if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
      
      dispatch({ type: 'ADD_CART', payload: [] })

      const newOrder = {
        ...res.newOrder, //newOrder from index.js
        user: auth.user,
      }
      dispatch({ type: 'ADD_ORDERS', payload: [...orders, newOrder] }) 
      dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
      return router.push(`order/${res.newOrder._id}`)

    })
  }

  // no products in cart
  if (cart.length === 0)
  return (
    <div className="banner">
      <img className="img-responsive w-100" src="/empty_cart.jpg" alt="not empty"/>
      <div className="text-block">
        <h5>No products in cart</h5>
        <Link href="/">
            <a className="btn btn-light" href="#">Return home</a>
        </Link>
      </div>
    </div>
  )
  
    return(
      <div className="row mx-auto">
        <Head>
          <title>Cart Page</title>
        </Head>

        <div className="col-md-1 mt-3">
               <BackBtn />
        </div>

        <div className="col-md-7 text-secondary table-responsive my-3">
          <h2 className="text-uppercase">Shopping Cart</h2>
          <table className="table my-3">
            <tbody>
              {
                cart.map(item => (
                  <CartItem key={item._id} item={item} dispatch={dispatch} cart={cart} />
                ))
              }
            </tbody>
          </table>
        </div>

        <div className="col-md-4 my-3 text-right text-uppercase">
            <form>
              <h3>Shipping</h3>

              <label htmlFor="address">Address</label>
              <input type="text" name="address" id="address" className="form-control mb-2"
                value={address} onChange={e => setAddress(e.target.value)}/>

              <label htmlFor="mobile">Mobile</label>
              <input type="text" name="mobile" id="mobile" className="form-control mb-2"
                value={mobile} onChange={e => setMobile(e.target.value)}/>
            </form>
            
            <h3>Total: <span className="text-danger">${total}</span></h3>

            <Link href={auth.user ? '#!' : '/signin'}>
              <a className="btn btn-dark my-2" onClick={handlePayment}>Proceed with payment</a>
            </Link>
            
        </div>
      </div>
    )
  }
  
  export default Cart