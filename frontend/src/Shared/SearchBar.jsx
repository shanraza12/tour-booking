import React, { useRef } from "react";
import "./searchbar.css";
import { Col, Form, FormGroup } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const SearchBar = () => {
  const locationRef = useRef("");
  const maxGroupSizeRef = useRef(0);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const searchHandler = async () => {
    const location = locationRef.current.value;
    const maxGroupSize = maxGroupSizeRef.current.value;

    const searchParams = new URLSearchParams();
    if (location) searchParams.append("city", location);
    if (maxGroupSize) searchParams.append("maxGroupSize", maxGroupSize);

    try {
      const response = await axios.get(
        `${"http://localhost:4000/api/v1"}/search?${searchParams}`,{
           headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        }
      );

      navigate(`/search?${searchParams}`, {
        state: { searchResult: response.data.data },
      });
    } catch (error) {
      alert("Failed to fetch search results: " + error.message);
    }
  };

  return (
    <Col lg="12">
      <div className="search__bar">
        <Form className="d-flex align-items-center gap-4">
          <FormGroup className="d-flex gap-3 form__group form__group-fast">
            <span><i className="ri-map-pin-line" /></span>
            <div>
              <h6>Location</h6>
              <input
                type="text"
                placeholder="Where are you going?"
                ref={locationRef}
              />
            </div>
          </FormGroup>
          <FormGroup className="d-flex gap-3 form__group form__group-fast">
            <span><i className="ri-group-line" /></span>
            <div>
              <h6>Max People</h6>
              <input type="number" placeholder="0" ref={maxGroupSizeRef} />
            </div>
          </FormGroup>

          <span className="search__icon" type="submit" onClick={searchHandler}>
            <i className="ri-search-line" />
          </span>
        </Form>
      </div>
    </Col>
  );
};

export default SearchBar;
