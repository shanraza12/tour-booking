import React, { useEffect, useState } from "react";
import CommonSection from "../Shared/CommonSection";
import "../styles/Tour.css";
import Newsletter from "../Shared/Newsletter";
import { Container, Row, Col } from "reactstrap";
import BlogCard from "../Shared/BlogCard";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  // useEffect(()=>{
  //   debugger
  //   console.log(blogs)
  // },[blogs])
  useEffect(() => {
    // Fetch blogs data from the API
    const fetchBlogs = async () => {
      debugger
      try {
        const response = await axios.get(`${"http://localhost:4000/api/v1"}/blogs`,
        );
        debugger
        setBlogs(response.data?.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader" />
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  if (error) {
    return <div className="error__msg">Error loading blog details. Check your network</div>;
  }


  return (
    <div>
      <CommonSection title={"All blogs"} />
      <section className="mt-4">
        <Container>
          <Row>
            {loading ? (
              <div className="loader-container">
                <div className="loader" />
                <div className="loading-text">Loading...</div>
              </div>
            ) : (
             blogs?.length>0? blogs?.map((blog) => (
                <Col lg="4" md="6" sm="6" className="mb-4" key={blog._id}>
                  <BlogCard blog={blog} />
                </Col>
              ))
              :"No Blog found"
            )}
          </Row>
        </Container>
      </section>
      <Newsletter />
    </div>
  );
};

export default Blogs;
