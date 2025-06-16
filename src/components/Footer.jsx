import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="mb-0 text-center bg-light py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <h5 className="mb-3">About ShowStoppers</h5>
              <p className="mb-3 text-muted">
                ShowStoppers is a bold and creative brand committed to delivering unforgettable
                experiences. Whether through innovative designs, standout products, or impactful
                services, we aim to redefine what it means to truly make a statement. 
                At ShowStoppers, we don’t just follow trends, we create them!
              </p>
              <p className="text-muted small">
                © {new Date().getFullYear()} ShowStoppers. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
