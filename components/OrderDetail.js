import Link from 'next/link'
import PaypalBtn from './paypalBtn'
import { patchData } from '../utils/fetchData'
import {updateItem} from '../store/Actions'

const OrderDetail = ({orderDetail, state, dispatch}) => {
    const { auth, orders } = state

    const handleDelivered = (order) => {
        dispatch({ type: 'NOTIFY', payload: {loading: true}})
        patchData(`order/delivered/${order._id}`, null, auth.token)
        .then(res => {
            if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })

            console.log(res)

            const { dateOfPayment, method, delivered } = res.result

            dispatch(updateItem(orders, order._id, {
                ...order, dateOfPayment, method, delivered
            }, 'ADD_ORDERS'))
            return dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
        })
    }

    if(!auth.user) return null
    return (
        <>
        {
        orderDetail.map(order => (
            <div key={order._id} style={{margin: '20px auto'}} className="row justify-content-around">
                <div className="text-uppercase my-3" style={{maxWidth: '600px'}}>
                    <h2 className="text-break">Order {order._id}</h2>
                    <div className="mt-4 text-secondary">
                        <h4>Shipping</h4>
                        <p>Name: {order.user.name}</p>
                        <p>Email: {order.user.email}</p>
                        <p>Address: {order.address}</p>
                        <p>Mobile: {order.mobile}</p>
                    </div>

                    <div className={`alert ${order.delivered ? 'alert-success' : 'alert-danger'}
                        d-flex justify-content-between align-items-center`} role="alert" >
                        {
                            order.delivered ? `Delivered on: ${new Date(order.createdAt).toLocaleDateString()} 
                                ${new Date(order.createdAt).toLocaleTimeString()}` : `Not delivered`
                        }
                        {
                            auth.user.role === 'admin' && !order.delivered &&
                            <button className="btn btn-dark text-uppercase"
                                onClick={() => handleDelivered(order)}>
                                Mark as delivered
                            </button>
                        }
                    </div>

                    <h3>Payment</h3>
                    {
                        order.method && <h6>Method: {order.method}</h6>
                    }
                    {
                        order.paymentId && <h6>PaymentId: {order.paymentId}</h6>
                    }
                    
                    <div className={`alert ${order.paid ? 'alert-success' : 'alert-danger'}
                        d-flex justify-content-between align-items-center`} role="alert" >
                        {
                            order.paid ? `Paid on: ${new Date(order.dateOfPayment).toLocaleDateString()} 
                                ${new Date(order.dateOfPayment).toLocaleTimeString()}` : `Not paid`
                        }
                    </div>
                    
                    <div>
                        <h4>Order Items</h4>
                        {
                            order.cart.map(item => (
                                <div className="row border-bottom mx-0 p-2 justify-content-between
                                align-items-middle" key={item._id} style={{maxWidth: '580px'}}>
                                    <img src={item.images[0].url} alt={item.images[0].url}
                                    style={{width: '50px', height: '45px', objectFit: 'cover'}} />
                                    <h6 className="flex-fill text-secondary px-3 m-0">
                                        <Link href={`/product/${item._id}`}>
                                            <a>{item.title}</a>
                                        </Link>
                                    </h6>
                                    <span className="text-info m-0">
                                        {item.quantity} x ${item.price}
                                    </span>
                                </div>
                            ))
                        }
                    </div>

                </div>

                {
                    !order.paid && auth.user.role !== 'admin' &&
                    <div className="p-4">
                        <h2 className="mb-4 text-uppercase">Total: ${order.total}</h2>
                        <PaypalBtn order={order}/>
                    </div>
                }
                
            </div>
            ))
        }
        </>
    )
}
export default OrderDetail