import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { Footer, Navbar } from "../components";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const dispatch = useDispatch();

  const allowedCategories = [
    "womens-dresses",
    "mens-shirts",
    "mens-shoes",
    "womens-shoes",
    "sunglasses",
    "makeup",
    "fragrances",
  ];

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
  const allowedCategories = [
    "womens-dresses",
    "mens-shirts",
    "mens-shoes",
    "womens-shoes",
    "sunglasses",
    "makeup",
    "fragrances",
  ];

  const PRODUCTS_LIMIT_PER_CATEGORY = 3; // limit per category

  const getProduct = async () => {
    setLoading(true);
    setLoading2(true);

    // Fetch product by id from DummyJSON
    const response = await fetch(`https://dummyjson.com/products/${id}`);
    const data = await response.json();

    // Decide category to use
    const category = allowedCategories.includes(data.category)
      ? data.category
      : allowedCategories[0]; // fallback to first allowed category

    // If product category not allowed, fetch a product from allowed category instead
    if (!allowedCategories.includes(data.category)) {
      // Fetch first product from fallback category
      const fallbackResponse = await fetch(
        `https://dummyjson.com/products/category/${category}`
      );
      const fallbackData = await fallbackResponse.json();
      setProduct(fallbackData.products[0]);
    } else {
      setProduct(data);
    }

    setLoading(false);

    // Fetch limited products from each allowed category
    const allSimilarProducts = [];

    await Promise.all(
      allowedCategories.map(async (cat) => {
        const res = await fetch(
          `https://dummyjson.com/products/category/${encodeURIComponent(cat)}?limit=${PRODUCTS_LIMIT_PER_CATEGORY}`
        );
        const catData = await res.json();
        allSimilarProducts.push(...catData.products.slice(0, PRODUCTS_LIMIT_PER_CATEGORY));
      })
    );

    // Remove current product from similarProducts list if present
    const filteredSimilarProducts = allSimilarProducts.filter(
      (item) => item.id !== (data.id || allSimilarProducts[0]?.id)
    );

    setSimilarProducts(filteredSimilarProducts);
    setLoading2(false);
  };

  getProduct();
}, [id]);



  const Loading = () => (
    <div className="container my-5 py-2">
      <div className="row">
        <div className="col-md-6 py-3">
          <Skeleton height={400} width={400} />
        </div>
        <div className="col-md-6 py-5">
          <Skeleton height={30} width={250} />
          <Skeleton height={90} />
          <Skeleton height={40} width={70} />
          <Skeleton height={50} width={110} />
          <Skeleton height={120} />
          <Skeleton height={40} width={110} inline={true} />
          <Skeleton className="mx-3" height={40} width={110} />
        </div>
      </div>
    </div>
  );

  const ShowProduct = () => {
    if (!product) return null;

    return (
      <div className="container my-5 py-2">
        <div className="row">
          <div className="col-md-6 col-sm-12 py-3">
            <img
              className="img-fluid"
              src={product.images?.[0]}
              alt={product.title}
              width="400px"
              height="400px"
            />
          </div>
          <div className="col-md-6 py-5">
            <h4 className="text-uppercase text-muted">{product.category}</h4>
            <h1 className="display-5">{product.title}</h1>
            <p className="lead">
              {product.rating} <i className="fa fa-star"></i>
            </p>
            <h3 className="display-6 my-4">${product.price}</h3>
            <p className="lead">{product.description}</p>
            <button className="btn btn-outline-dark" onClick={() => addProduct(product)}>
              Add to Cart
            </button>
            <Link to="/cart" className="btn btn-dark mx-3">
              Go to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const Loading2 = () => (
    <div className="my-4 py-4">
      <div className="d-flex">
        {[...Array(4)].map((_, index) => (
          <div className="mx-4" key={index}>
            <Skeleton height={400} width={250} />
          </div>
        ))}
      </div>
    </div>
  );

  const ShowSimilarProduct = ({ products }) => (
    <div className="py-4 my-4">
      <div className="d-flex">
        {products.map((item) => (
          <div key={item.id} className="card mx-4 text-center">
            <img
              className="card-img-top p-3"
              src={item.images?.[0]}
              alt={item.title}
              height={300}
              width={300}
            />
            <div className="card-body">
              <h5 className="card-title">{item.title.substring(0, 15)}...</h5>
            </div>
            <div className="card-body">
              <Link to={`/product/${item.id}`} className="btn btn-dark m-1">
                Buy Now
              </Link>
              <button className="btn btn-dark m-1" onClick={() => addProduct(item)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        {similarProducts.length > 0 && (
          <div className="row my-5 py-5">
            <div className="d-none d-md-block">
              <h2>You may also Like</h2>
              <Marquee pauseOnHover pauseOnClick speed={50}>
                {loading2 ? <Loading2 /> : <ShowSimilarProduct products={similarProducts} />}
              </Marquee>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Product;
