import Head from 'next/head'
import { useContext, useState, useEffect } from 'react'
import { DataContext } from '../../store/GlobalState'
import { imageUpload } from '../../utils/imageUpload'
import { postData, getData, putData } from '../../utils/fetchData'
import { useRouter } from 'next/router'
// import BackBtn from '../../components/BackBtn'

const ProductManager = () => {
    const initialState = {
        title: '', price: 0, inStock: 0,
        description: '', content: '', category: ''
    }

    const [ product, setProduct ] = useState(initialState)
    const { title, price, inStock, description, content, category } = product

    const [ images, setImages ] = useState([])

    const [ state, dispatch ] = useContext(DataContext)
    const { categories, auth } = state

    const router = useRouter()
    const { id } = router.query
    const [ onEdit, setOnEdit ] = useState(false)

    useEffect(() => {
        if (id) {
            setOnEdit(true)
            getData(`product/${id}`).then(res => {
                setProduct(res.product)
                setImages(res.product.images)
            })
        } else {
            setOnEdit(false)
            setProduct(initialState)
            setImages([])
        }
    }, [id])

    const handleChangeInput = e => {
        const { name, value } = e.target
        setProduct({...product, [name]: value})
        dispatch({ type: 'NOTIFY', payload: {} })
    }

    const handleUploadInput = e => {
        dispatch({ type: 'NOTIFY', payload: {}})
        let newImages = [], num = 0, err = ''
        const files = [...e.target.files]

        if (files.length === 0) return dispatch({ type: 'NOTIFY', payload: {error: 'Files does not exist.'} })
        files.forEach(file => {
            if(file.size > 1024 * 1024)
            return err = 'The largest image size is 1mb'

            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
            return err = 'Image format is incorrect.'

            num += 1;
            if(num <= 5) newImages.push(file)
            return newImages
        })

        if (err) dispatch({ type: 'NOTIFY', payload: {error: err} })

        const imgCount = images.length
        if (imgCount + newImages.length > 5) 
        return dispatch({ type: 'NOTIFY', payload: {error: 'Select up to 5 images.'} })
        setImages([...images, ...newImages])
    }

    const deleteImage = index => {
        const newArr = [...images]
        newArr.splice(index, 1)
        setImages(newArr)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (auth.user.role !== 'admin')
        return dispatch ({ type: 'NOTIFY', payload: {error: 'Authentication is not valid.'} })

        if (!title || !price || !inStock || !description || !content ||
            category === 'All' || images.length === 0)
        return dispatch ({ type: 'NOTIFY', payload: {error: 'Please add all the fields.'} })

        dispatch ({ type: 'NOTIFY', payload: {loading: true} })
        
        let media = []
        const imgNewURL = images.filter(img => !img.url)
        const imgOldURL = images.filter(img => img.url)

        if (imgNewURL.length > 0) media = await imageUpload(imgNewURL)

        let res
        if (onEdit) {
            res = await putData(`product/${id}`, {...product, images: [...imgOldURL, ...media] }, auth.token)
            if (res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
        } else {
            res = await postData('product', {...product, images: [...imgOldURL, ...media] }, auth.token)
            if (res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
        }

        return dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
    }

    return (
        <div className="products_manager">
            <Head>
                <title>Product Manager</title>
            </Head>

            <form className="row" onSubmit={handleSubmit}>
                <div className="col-md-6">
                    <input type="text" name="title" value={title}
                        placeholder="Title" className="d-block my-4 w-100 p-3"
                        onChange={handleChangeInput} />

                    <div className="row">
                        <div className="col-sm-6">
                            <label htmlFor="price">Price</label>
                            <input type="number" name="price" value={price}
                            placeholder="Price" className="d-block w-100 p-2"
                            min='0' onChange={handleChangeInput} />
                        </div>

                        <div className="col-sm-6">
                            <label htmlFor="price">In Stock</label>
                            <input type="number" name="inStock" value={inStock}
                            placeholder="inStock" className="d-block w-100 p-2"
                            min='0' onChange={handleChangeInput} />
                        </div>
                    </div>
                    
                    <textarea name="description" id="description" cols="30" row="4"
                        placeholder="Description" onChange={handleChangeInput} value={description}
                        className="d-block my-4 w-100 p-3" />
                    
                    <textarea name="content" id="content" cols="30" row="6"
                        placeholder="Content" onChange={handleChangeInput} value={content}
                        className="d-block my-4 w-100 p-3" />

                    <div className="input-group-prepend px-0 my-2">
                        <select name="category" id="category" value={category}
                        className="custom-select text-capitalize w-50" onChange={handleChangeInput}>
                            <option value="all">All products</option>
                            {
                                categories.map(item => (
                                    <option key={item._id} value={item._id}>
                                        {item.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <button type="submit" className="btn btn-info px-4 mt-4">
                        {onEdit ? 'Update' : 'Create'}
                    </button>
                </div>

                <div className="col-md-6 my-4">
                    <div className="custom-file mb-3">
                        <input type="file" className="custom-file-input" name="filename"
                            onChange={handleUploadInput} multiple accept="image/*" />
                        <label className="custom-file-label">Choose file</label>
                    </div>

                    <div className="row img-up mx-0">
                        {
                            images.map((img, index) => (
                                <div key={index} className="file-img my-1">
                                    <img src={img.url ? img.url : URL.createObjectURL(img)}
                                    alt="" className="img-thumbnail rounded" />
                                    <span onClick={() => deleteImage(index)}>x</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ProductManager