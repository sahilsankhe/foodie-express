import React from 'react';

const Navbar = ({ cartCount }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container">
                <a className="navbar-brand fw-bold text-warning fs-3" href="#">
                    FoodieExpress
                </a>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto me-3">
                        <li className="nav-item"><a className="nav-link active" href="#home">Home</a></li>
                        <li className="nav-item"><a className="nav-link" href="#menu">Menu</a></li>
                    </ul>
                    <button className="btn btn-warning position-relative">
                        Cart
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {cartCount}
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;