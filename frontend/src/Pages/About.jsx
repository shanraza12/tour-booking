import React from "react";
import { Container, Row, Col } from "reactstrap";
import Subtitle from "../Shared/Subtitle";
import '../styles/About.css';
import worldImg from "../assets/images/world.png"
import logo1 from "../assets/images/logo1.png"
import Newsletter from "../Shared/Newsletter";
import Contact from "./Contact";

const About = () => {
  return (
    <><section className="about">
      <Container>
        <Row>
          <Col lg="6">
            <div className="hero__content">
              <div className="hero__subtitle d-flex align-items-center">
                <Subtitle subtitle={"About SkyLiners"} />
                <img src={worldImg} alt="" />
              </div>
              <h1>
                Pakistan's Most Trusted{" "}
                <span className="highlight">Travel Partner</span>
              </h1>
              <p>
                Welcome to SkyLiners Tours & Adventures — Pakistan's leading travel company founded in 2009. 
                We are passionate about showcasing the magnificent beauty of Pakistan to the world. 
                Our experienced team of local travel experts specializes in crafting personalised journeys 
                across the Northern Areas, Punjab, Sindh, Balochistan, and Azad Kashmir. Whether you dream of 
                conquering the Karakoram Highway, exploring Mohenjo-daro, sailing on Attabad Lake, or 
                witnessing the magical sunsets over Gwadar — SkyLiners makes it happen with care, 
                safety, and an authentic Pakistani experience. Our commitment to excellence has earned 
                the trust of over 12,000 happy travellers across Pakistan and beyond.
              </p>
            </div>
          </Col>
          <div className="about__image d-flex align-items-center">
            <img src={logo1} height={250} width={250} alt="" />
          </div>
        </Row>
      </Container>
    </section>
    <Contact/>
    <Newsletter /></>
  );
};

export default About;
