import Link from 'next/link'
import { useContext } from 'react'
import { DataContext } from '../../store/GlobalState'
import { addToCart } from '../../store/Actions'

const ProductItem = ({product, handleCheck}) => {
    const [state, dispatch] = useContext(DataContext)
    const { cart, auth } = state

    const userLink = () => {
        return (
            <>
                <Link href={`/product/${product._id}`}>
                    <a className="btn btn-info" style={{marginRight: '5px', flex: 1}}>View</a>
                </Link>
                {
                    product.inStock > 0
                    ? <button className="btn btn-success" style={{marginLeft: '5px', flex: 1}}
                        onClick={() => dispatch(addToCart(product, cart))}> Buy </button>
                    : <button className="btn btn-danger" disabled>Out Stock</button>
                }
                
            </>
        )
    }

    const adminLink = () => {
        return (
            <>
                <Link href={`/create/${product._id}`}>
                    <a className="btn btn-info" style={{marginRight: '5px', flex: 1}}>Edit</a>
                </Link>
                <button className="btn btn-danger" style={{marginLeft: '5px', flex: 1}} 
                    data-toggle="modal" data-target="#exampleModal"
                    onClick={() => dispatch({
                        type: 'ADD_MODAL',
                        payload: [{ 
                            data: '', id: product._id,
                            title: product.title, type: 'DELETE_PRODUCT'
                        }]
                    })}> Delete
                </button>
                
            </>
        )
    }

    return (
        <div className="card" style={{width: '18rem'}}>
            {
                auth.user && auth.user.role === 'admin' &&
                <input type="checkbox" checked={product.checked}
                    className="position-absolute" style={{width: '20px', height: '20px'}}
                    onChange={() => handleCheck(product._id)} />
            }
            <img className="card-img-top" src={product.images[0].url} alt="Card image cap"/>
            <div className="card-body">
                <h6 className="card-title text-capitalize" title={product.title}>
                    {product.title}
                </h6>

                <div className="row justify-content-between mx-0">
                    <h6>${product.price}</h6>
                </div>
                <p className="card-text" title={product.description}>
                    {product.description}
                </p>
                
                <div className="row justify-content-between mx-0">
                    {!auth.user || auth.user.role !== 'admin' ? userLink() : adminLink()}
                </div>
            </div>
        </div>
    )
}

export default ProductItem