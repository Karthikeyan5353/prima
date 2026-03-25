import React from "react";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, ArrowRight } from "lucide-react";

const Footer = () => {
    return (
        <footer className="footer animate-fade-in">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div className="footer-col brand-col">
                        <h3 className="footer-logo">Prima Boutique</h3>
                        <p className="footer-desc">
                            Curating timeless elegance for the modern woman. Discover our exclusive collection of bridal jewellery, fashion accessories, and more.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link"><Instagram size={20} /></a>
                            <a href="#" className="social-link"><Facebook size={20} /></a>
                            <a href="#" className="social-link"><Twitter size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-col">
                        <h4>Explore</h4>
                        <ul className="footer-links">
                            <li><a href="/products">New Arrivals</a></li>
                            <li><a href="/products?category=Bridal">Bridal Collection</a></li>
                            <li><a href="/products?category=Imitation">Imitation Jewellery</a></li>
                            <li><a href="/customer/live-try-on">Live Try-On</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-col">
                        <h4>Contact Us</h4>
                        <ul className="contact-list">
                            <li>
                                <MapPin size={16} />
                                <span>123 Luxury Lane, Fashion District, Mumbai - 400001</span>
                            </li>
                            <li>
                                <Phone size={16} />
                                <span>+91 98765 43210</span>
                            </li>
                            <li>
                                <Mail size={16} />
                                <span>support@primaboutique.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="footer-col newsletter-col">
                        <h4>Stay Updated</h4>
                        <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Enter your email" />
                            <button type="submit" className="flex-center">
                                <ArrowRight size={18} />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom flex-between">
                    <p>&copy; {new Date().getFullYear()} Prima Boutique. All rights reserved.</p>
                    <div className="footer-legal">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .footer {
          background-color: var(--dark);
          color: #fff;
          padding: 80px 0 30px;
          margin-top: 60px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: 40px;
          margin-bottom: 60px;
        }

        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }

        .footer-logo {
          font-family: var(--font-heading);
          font-size: 2rem;
          margin-bottom: 20px;
          color: var(--primary);
        }

        .footer-desc {
          color: #ccc;
          line-height: 1.6;
          margin-bottom: 25px;
          max-width: 300px;
        }

        .social-links {
          display: flex;
          gap: 15px;
        }

        .social-link {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          transition: var(--transition);
        }

        .social-link:hover {
          background-color: var(--primary);
          border-color: var(--primary);
          transform: translateY(-3px);
        }

        h4 {
          font-size: 1.1rem;
          margin-bottom: 25px;
          position: relative;
          display: inline-block;
        }

        h4::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -8px;
          width: 30px;
          height: 2px;
          background-color: var(--primary);
        }

        .footer-links {
          list-style: none;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: #ccc;
          text-decoration: none;
          transition: var(--transition);
        }

        .footer-links a:hover {
          color: var(--primary);
          padding-left: 5px;
        }

        .contact-list {
          list-style: none;
          padding: 0;
        }

        .contact-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 15px;
          color: #ccc;
        }

        .newsletter-col p {
          color: #ccc;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .newsletter-form {
          display: flex;
        }

        .newsletter-form input {
          flex: 1;
          padding: 12px 15px;
          border: none;
          border-radius: var(--radius-sm) 0 0 var(--radius-sm);
          outline: none;
          font-family: var(--font-body);
        }

        .newsletter-form button {
          background-color: var(--primary);
          border: none;
          color: white;
          width: 50px;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          cursor: pointer;
          transition: var(--transition);
        }

        .newsletter-form button:hover {
          background-color: #a05a65;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 30px;
          color: #888;
          font-size: 0.9rem;
        }

        .footer-legal {
          display: flex;
          gap: 20px;
        }

        .footer-legal a {
          color: #888;
          text-decoration: none;
        }

        .footer-legal a:hover {
          color: var(--primary);
        }

        @media (max-width: 600px) {
          .footer-bottom {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
        }
      `}</style>
        </footer>
    );
};

export default Footer;
