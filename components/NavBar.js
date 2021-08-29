import React, { useContext } from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {DataContext} from '../store/GlobalState'
import Cookie from 'js-cookie'

function NavBar() {
    const router = useRouter()
    const [state, dispatch] = useContext(DataContext) // in clip using {state, dispatch}
    const { auth, cart } = state

    const isActive = (r) => {
        if (r === router.pathname) {
            return " active"
        } else { return ""}
    }

    const handleLogout = () => {
        Cookie.remove('refreshtoken', {path: 'api/auth/accessToken'})
        localStorage.removeItem('firstLogin')
        dispatch({ type: 'AUTH', payload: {}})
        dispatch({ type: 'NOTIFY', payload: {success: 'Logged out.'} })

        return router.push('/')
    }

    const adminRouter = () => {
        return (
            <>
            <Link href="/users">
                <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show">Users</a>
            </Link>
            <Link href="/create">
                <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show">Products</a>
            </Link>
            <Link href="/categories">
                <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show">Categories</a>
            </Link>
            </>
        )
    }

    const loggedRoute = () => {
        return (
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img src={auth.user.avatar} alt={auth.user.avatar}
                        style={{
                            borderRadius: '50px', width: '23px', height: '23px',
                            transform: 'translateY(-3px)', marginRight: '3px'
                        }}
                    /> {auth.user.name}
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <Link href="/profile">
                        <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show">Profile</a>
                    </Link>
                    {
                        auth.user.role === 'admin' && adminRouter()
                    }
                    <div className="dropdown-divider"></div>
                    <Link href="/">
                        <button className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show"
                            onClick={handleLogout} >Logout</button>
                    </Link>
                </div>
            </li>
        )
    }

    return (
        <nav className="navbar navbar-expand-lg fixed-top navbar-inverse navbar-light">
            <div className="container-fluid">
                <Link href="/">
                    <a className="navbar-brand" href="#" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <img src="/logo.jpg" alt="not empty"/>
                    </a>
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-bs-toggle="collapse"
                    data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                    <ul className="navbar-nav p-1">
                        <li className="nav-item">
                            <Link href="/cart">
                                <a className={"nav-link" + isActive('/cart')} data-toggle="collapse" data-target=".navbar-collapse.show">
                                    <i aria-hidden className="fas fa-shopping-cart fa-lg position-relative px-1">
                                        <span className="position-absolute number-cart"> {cart.length} </span>
                                    </i> Cart
                                </a>
                            </Link>
                        </li>

                        {
                        Object.keys(auth).length === 0
                        ?   <li className="nav-item">
                                <Link href="/signin">
                                    <a className={"nav-link" + isActive('/signin')} data-toggle="collapse" data-target=".navbar-collapse.show">
                                        <i aria-hidden className="fas fa-user fa-lg px-1"/> Sign in
                                    </a>
                                </Link>
                            </li>
                        : loggedRoute()
                        }

                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavBar
