import { Box, Stack } from "@mui/material";
import React from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import YouTubeIcon from "@mui/icons-material/YouTube";

const Footer = () => {
  return (
    <div className="footer-main-container">
      <Stack className="container">
        <Stack className="footer">
          <Stack className="benefits-list-container">
            <Stack className="benefit">
              <Box className="img-container">
                <img src="/footerImages/discount.svg" alt="about-us-image" />
              </Box>
              <Stack className="benefit-text">
                <p>Exclusive Discounts</p>
                <span>Enjoy great savings on every order</span>
              </Stack>
            </Stack>
            <Stack className="benefit">
              <Box className="img-container">
                <img src="/footerImages/hours.svg" alt="about-us-image" />
              </Box>
              <Stack className="benefit-text">
                <p>24/7 Service</p>
                <span>We’re here for you, anytime you need</span>
              </Stack>
            </Stack>
            <Stack className="benefit">
              <Box className="img-container">
                <img src="/footerImages/moneyback.svg" alt="about-us-image" />
              </Box>
              <Stack className="benefit-text">
                <p>Money-Back Guarantee</p>
                <span>Shop with confidence, risk-free</span>
              </Stack>
            </Stack>
          </Stack>
          <div className="divider"></div>
          <Stack className="footer-content">
            <Stack className="first-section">
              <Stack className="logo-container">
                <span style={{ color: "red" }}>ANNACHI KADAI</span>
                <span className="brand-motto">
                  Fresh flavors, warm smiles, and authentic taste in every bite.
                </span>
              </Stack>
              <Stack className="address">
                <span className="intro">Our Address</span>
                <Stack className="location-container">
                  <LocationOnIcon />
                  <span className="location">
                    서울특별시 강남구 테헤란로 152 (역삼동, 강남파이낸스센터)
                  </span>
                </Stack>
                <Stack className="call-container">
                  <CallIcon />
                  <span className="phone-number">010 80940023</span>
                </Stack>
                <Stack className="email-container">
                  <EmailIcon />
                  <span className="email">support@annachikadai.com</span>
                </Stack>
              </Stack>
              <Stack className="social-media-container">
                <a
                  href="https://www.instagram.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://www.facebook.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="https://twitter.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <XIcon />
                </a>
                <a
                  href="https://www.youtube.com/@yourchannel"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <YouTubeIcon />
                </a>
              </Stack>
            </Stack>
            <Stack className="second-section">
              <Box className="intro">
                <h1>Get To Know Us</h1>
              </Box>
              <Stack className="second-section-items-container">
                <span>Careers</span>
                <span>About Us</span>
                <span>Inverstor Relations</span>
                <span>Devices</span>
                <span>Customer reviews</span>
                <span>Social Responsibility</span>
                <span>Store Locations</span>
              </Stack>
            </Stack>
            <Stack className="third-section">
              <Box className="intro">
                <h1>Orders & Returns</h1>
              </Box>
              <Stack className="third-section-items-container">
                <span>Your Orders</span>
                <span>Returns & Replacements</span>
                <span>Shipping Rates & Policies</span>
                <span>Refund and Returns Policy</span>
                <span>Privacy Policy</span>
                <span>Terms and Conditions</span>
                <span>Cookie Settings</span>
              </Stack>
            </Stack>
            <Stack className="forth-section">
              <Box className="intro">
                <h1>Legal</h1>
              </Box>
              <Stack className="forth-section-items-container">
                <span>Privacy Policy</span>
                <span>Terms of use</span>
                <span>Legal</span>
                <span>Site Map</span>
                <span>Tracking Order</span>
                <span>Investors</span>
              </Stack>
            </Stack>
            <Stack className="fifth-section">
              <Box className="intro">
                <h1>Resources</h1>
              </Box>
              <Stack className="fifth-section-items-container">
                <span>FAQ</span>
                <span>Testimonials</span>
                <span>Community</span>
                <span>Refer-A-Friend</span>
                <span>Statement</span>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default Footer;
