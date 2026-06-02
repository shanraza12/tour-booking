import React from 'react'
import "../styles/Home.css"
import {Container, Row, Col} from 'reactstrap'
import heroImg from "../assets/images/hero-img01.jpg"
import heroImg2 from "../assets/images/hero-img02.jpg"
import heroVideo from "../assets/images/hero-video.mp4"
import Subtitle from '../Shared/Subtitle'
import worldImg from "../assets/images/world.png"
import experienceImage from "../assets/images/experience.png"
import SearchBar from '../Shared/SearchBar'
import ServiceList from '../Services/ServiceList'
import FeaturedToursList from '../Components/FeaturedTours/FeaturedToursList'
import MasonryImagesGallery from '../Components/Image-gallery/MasonryImagesGallery'
import Testimonials from '../Components/Testimonials/Testimonials'
import Newsletter from '../Shared/Newsletter'
import Contact from './Contact'
import FeaturedBlogsList from '../Components/FeaturedBlogs.jsx/FeaturedBlogsList'

const Home = () => {
  return (
    <>
    <section>
      <Container>
        <Row>
          <Col lg="6">
            <div className="hero__content">
              <div className="hero__subtitle  d-flex align-items-center">
                <Subtitle subtitle={"Discover Pakistan's Beauty"}/>
                <img src={worldImg} alt="" />
              </div>
              <h1>
                Journey Through Pakistan's Most{" "}
                <span className="highlight">Breathtaking</span> Destinations
              </h1>
              <p>
                From the towering peaks of Hunza and Skardu to the ancient streets of Lahore and the turquoise shores of Gwadar — SkyLiners curates unforgettable adventures across Pakistan's most extraordinary landscapes.
              </p>
            </div>
          </Col>
          <Col lg="2">
            <div className="hero__img-box">
              <img src={heroImg} alt="" />
            </div>
          </Col>
          <Col lg="2">
            <div className="hero__img-box video-box mt-4">
              <video src={heroVideo} alt="" autoPlay loop muted />
            </div>
          </Col>
          <Col lg="2">
            <div className="hero__img-box mt-5">
              <img src={heroImg2} alt="" />
            </div>
          </Col>
          <SearchBar/>
        </Row>
      </Container>
    </section>
    <section>
      <Container>
        <Row>
          <Col lg="12">
            <h5 className="services__subtitle">What We Offer</h5>
            <h2 className="services__title">Pakistan's Best Travel Services</h2>
          </Col>
          </Row>
          <ServiceList/>
      </Container>
    </section>

    <section>
      <Container>
        <Row>
          <Col lg="12" className='mb-5'>
            <Subtitle subtitle={"Explore Pakistan"}/>
            <h2 className="featured__tour-title">Our Featured Tours Across Pakistan</h2>
          </Col>
          <FeaturedToursList/>
        </Row>
      </Container>
    </section>

    <section>
      <Container>
        <Row>
          <Col lg="6">
            <div className="experience__content">
              <Subtitle subtitle={"Our Track Record"}/>
              <h2>Years of Excellence <br /> Serving Pakistan's Travellers</h2>
              <p>
                SkyLiners has been Pakistan's most trusted tour operator since 2009.
                <br />
                We bring you hand-crafted travel experiences that showcase the true spirit of Pakistan.
              </p>
            </div>

            <div className="couter__wrapper d-flex align-items-center gap-5">
              <div className="counter__box">
                <span>12k+</span>
                <h6>Happy Travellers</h6>
              </div>
              <div className="counter__box">
                <span>500+</span>
                <h6>Tours Completed</h6>
              </div>
              <div className="counter__box">
                <span>15+</span>
                <h6>Years Experience</h6>
              </div>
            </div>

          </Col>
          <Col lg="6">
            <div className="experience__img">
              <img src={experienceImage} alt="" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    <section>
      <Container>
        <Row>
          <Col lg="12">
            <Subtitle subtitle={"Our Gallery"}/>
            <h2 className="gallery__title">
              Moments From Across Pakistan
            </h2>
          </Col>
          <Col lg="12">
            <MasonryImagesGallery/>
          </Col>
        </Row>
      </Container>
    </section>
    <section>
      <Container>
        <div className="title">
          <Subtitle subtitle={"Travel Stories"} />
        </div>
        <Row>
      <FeaturedBlogsList lg={4} md={6} sm={6}/>
        </Row>
      </Container>
    </section>
    <section>
      <Container>
        <Row>
          <Col lg="12">
            <Subtitle subtitle={"Testimonials"}/>
            <h2 className="testmonials__title">What Our Travellers Say About SkyLiners</h2>
          </Col>
          <Testimonials/>
        </Row>
      </Container>
    </section>
    <Contact/>
    <Newsletter/>
    </>
  )
}

export default Home