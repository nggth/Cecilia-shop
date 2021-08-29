import Head from 'next/head'
import { useContext, useState, useEffect } from "react"
import { DataContext } from "../store/GlobalState"
import Link from 'next/link'

const Users = () => {
    const [state, dispatch] = useContext(DataContext)
    const {users, auth, modal} = state

    if(!auth.user) return null;
    return (
        <div className="py-4">
            <Head>
                <title>Users</title>
            </Head>

            <div className="table-responsive text-secondary">
                <table className="table-bordered table-hover w-100"
                    style={{ cursor: 'pointer'}}>
                    <thead className="bg-light font-weight-bold">
                        <tr>
                            <td className="p-3"></td>
                            <td className="p-3">ID</td>
                            <td className="p-3">Avatar</td>
                            <td className="p-3">Name</td>
                            <td className="p-3">Email</td>
                            <td className="p-3">Admin</td>
                            <td className="p-3">Action</td>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            users.map((user, index) => (
                                <tr key={user._id} style={{cursor: 'pointer'}}>
                                    <td className="p-3">{index + 1}</td>
                                    <td className="p-3">{user._id}</td>
                                    <td className="p-3 text-center">
                                        <img src={user.avatar} alt={user.avatar}
                                        style={{
                                            borderRadius: '50px', width: '35px', height: '35px',
                                            overflow: 'hidden', objectFit: 'cover'
                                        }} />
                                    </td>
                                    <td className="p-3">{user.name}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">
                                        {
                                            user.role === 'admin'
                                            ? user.root ? <i className="fas fa-check text-success"> Root</i>
                                                        : <i className="fas fa-check text-success"></i>

                                            :<i className="fas fa-times text-danger"></i>
                                        }
                                    </td>
                                    <td className="p-3">
                                        <Link href={
                                            auth.user.root && auth.user.email !== user.email
                                            ? `/edit_user/${user._id}` : '#!'
                                        }>
                                            <a><i className="fas fa-edit text-info mr-2" title="Edit"></i></a>
                                        </Link>

                                        {
                                            auth.user.root && auth.user.email !== user.email
                                            ? <i className="fas fa-trash-alt text-danger ml-2" title="Remove"
                                            data-toggle="modal" data-target="#exampleModal"
                                            onClick={() => dispatch({
                                                type: 'ADD_MODAL',
                                                payload: [{ data: users, id: user._id, title: user.name, type: 'ADD_USERS' }]
                                            })}></i>
                                            
                                            : <i className="fas fa-trash-alt text-danger ml-2" title="Remove"></i>
                                        }

                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Users