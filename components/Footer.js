const Footer = () => {
    return (
        <footer className="page-footer font-small special-color-dark pt-5">
            <hr className="mb-3" style={{margin: '0 10%'}}></hr>

            <div className="container p-1 pb-0">
                <section className="mb-2 text-center">
                    <a className="btn btn-outline-dark btn-floating m-1" href="#!" role="button">
                        <i className="fab fa-facebook-f" aria-hidden="true"></i></a>

                    <a className="btn btn-outline-dark btn-floating m-1" href="#!" role="button">
                        <i className="fab fa-twitter" aria-hidden="true"></i></a>

                    <a className="btn btn-outline-dark btn-floating m-1" href="#!" role="button">
                        <i className="fab fa-google" aria-hidden="true"></i></a>

                    <a className="btn btn-outline-dark btn-floating m-1" href="#!" role="button">
                        <i className="fab fa-instagram" aria-hidden="true"></i></a>

                    <a className="btn btn-outline-dark btn-floating m-1" href="#!" role="button">
                        <i className="fab fa-linkedin-in" aria-hidden="true"></i></a>

                    <a className="btn btn-outline-dark btn-floating m-1" href="#!" role="button">
                        <i className="fab fa-github" aria-hidden="true"></i></a>
                </section>
            </div>
            
            <div className="footer-copyright text-center py-2">© 2021 Copyright:
                <a className="px-2" href="https://github.com/nggth">github.com/nggth</a>
            </div>

        </footer>
    )
}

export default Footer