import { useRouter } from 'next/router'

const BackBtn = () => {
    const router = useRouter()
    return (
        <button className="btn btn-dark" onClick={() => router.back()}>
            <i className="fas fa-long-arrow-alt-left" aria-hidden="true"></i>
        </button>
    )
}

export default BackBtn