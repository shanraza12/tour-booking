import React from "react";
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import "./Tourcard.css";
import calculateAvgRating from "../utils/avgRating";
import { useEffect } from "react";

const TourCard = ({ tour }) => {
  const { _id, title, city, photo, price, reviews } = tour;

  const { totalRating, avgRating } = calculateAvgRating(reviews);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  return (
    <div className="tour__card">
      <Card>
        <div className="tour__img">
        <Link to={`/tours/${_id}`}>
              <div onClick={handleScrollToTop}>
              <img src={photo} alt="tour" />
              </div>
            </Link>
          <span>Featured</span>
        </div>
        <CardBody>
          <div className="card__top d-flex align-items-center justify-content-between">
            <span className="tour__location d-flex align-items-center gap-1">
              <i className="ri-map-pin-line">{city}</i>
            </span>
            <span className="tour__rating d-flex align-items-center gap-1">
              <i className="ri-star-fill"></i>
              {avgRating === 0 ? null : avgRating}
              {totalRating === 0 ? (
                <span>Not Rated</span>
              ) : (
                <span>({reviews.length})</span>
              )}
            </span>
          </div>

          <h5 className="tour__title">
            <Link to={`/tours/${_id}`} onClick={handleScrollToTop}>
              {title}
            </Link>
          </h5>
          <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
            <div>
              <span className="text-muted d-block" style={{ fontSize: '0.8rem', fontWeight: '500' }}>Starting from</span>
              <h5 className="mb-0 mt-1">
                {price} pkr
                <span>/Per Person</span>
              </h5>
            </div>
            <Link to={`/tours/${_id}`} className="btn booking__btn" onClick={handleScrollToTop} tabIndex={0} aria-label={`Book tour ${title}`}>
              Book Now
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TourCard;
