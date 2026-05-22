"use client"

import "@/app/App.css"
import Header from "@/components/header"
import Image from "next/image"
import Slideshow from '@/components/slideShow'
import Aboutslide from '@/components/about-slidShow'
import { 
  FaRegClock,
  FaPhoneAlt,
  FaEnvelope,
  FaRegEye,
} from 'react-icons/fa'
import {
  FaLocationDot,
  FaBookBible,
  FaCalendarDay,
  FaMapLocationDot,
} from 'react-icons/fa6'
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import ministriesImg from '@/assets/grex10.jpg'
import grex8 from '@/assets/Grex 8.0.jpeg'
import { useRouter } from "next/navigation"


export default function Home() {

  const form = useRef<HTMLFormElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleClick = () => {
    window.open('https://web.facebook.com/', '_blank', 'noopener,noreferrer');
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    if (!form.current) return;

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        form.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      .then(
        () => {
          setSuccess("Message sent successfully!");
          setLoading(false);
          form.current?.reset();
        },
        (error) => {
          console.error("EmailJS error:", error);
          setSuccess("Something went wrong. Please try again later.");
          setLoading(false);
        }
      );
  }


  return (
    <>
      <Header />
      <section className="hero-container" id="home">
        <Slideshow /> 

        <div className="hero-invite">
          <h3>Osogbo - 26 June 2026</h3>
        </div>

        <div className='hero-text'>
          <h1>GRACE EXPLOSION <span style={{ color: 'orange', }}>GREX</span> 8.0: <br/>THE RAIN</h1>
          <h2>A night of worship <br />& thanksgiving</h2>
          <p>Join us for an evening of powerful praise, prophetic worship, and the presence of God.</p>
        </div>

        <div className="hero-button">
          <button className="hero-button1" onClick={() => router.push('/support')}>Support this concert</button>

          <button className="hero-button2" onClick={handleClick}>Watch Online</button>
        </div>
      </section>

      <section className="about-container" id="about">
        <div className="about-img">
          <Aboutslide/>
        </div>

        <div className="about-items">
          <div className="about-text">
            <h1>About GREX</h1>
            <p>Grace Explosion is more than music, we are everything that God lays in our heart 
              towards the advancement of Christ`s Kingdom and a true manliness.
              Over the years, Seven editions of Grace Explosion has been held already, with 
              an average of 1000 audience each year. <br/>The first three editions held at Olagunsoye 
              Oyinlola Auditorium, Osun State University, Osogbo Osogbo and our joy are the testimonies that follow.
              We are not an entertainment body, we are driven by our passion for the lost souls and the desire 
              to help the saved access the deep things of God through music. An altar call made at GREX 3.0 
              had over 200 respondents who are giving and rededicating their lives to Christ and such is what 
              we desire. We have also partnered with the UJCF and other student bodies to organize revival programs 
              on campus and have triggered the passion for such programs to be organized on campus being the first of such.
            </p>
          </div>
          
          <div className="about-grid">
            <div className="grid">
              <FaRegEye size={30} style={{marginBottom: 10}}/>
              <h4>Our Vission</h4>
              <p>To raise a generation of kingdom minded youths who access the deep things of God through music.<br/>
                To bring the various denominations to a common ground where we worship God in spirit and truth, 
                setting aside all denominational differences. 
                <br/>To create a platform where the supernatural is manifested and harnessed for the purpose of soul winning.
              </p>
            </div>
            <div className="grid">
              <FaBookBible size={30} style={{marginBottom: 10}}/>

              <h4> Our Mission</h4>
              <p>To organize gospel music concerts on Campuses and at places of easy access to youth. 
                <br/>To use music as a means to reach the lost and create a re-connection between such persons and God. 
                <br/>To engage the Christian youth and create a better activity of engagement and excitement which will 
                do away with ungodly engagements.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ministries-container" id="ministries">
        <div className="text-center">
          <h1>GREX 8.0 Guest Ministers</h1>
          <p>Meet the anointed Men and Women Of God Prepaird to Lead Us into Heavenly atmosphere and cause the Rain of heaven to fall.</p>
        </div>

        <div className="ministries-content">
          <div className="ministries-items">
            <Image src={ministriesImg} alt="Ministries" />
            <div className="ministers-bio">
              <h1>Minister Muyiwa Nafiu</h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur fuga nulla, consectetur animi accusantium 
                beatae quia est deleniti ut nobis, quasi vero! Magnam illum ipsam inventore, voluptatem minima ab veritatis ut 
                iure ipsa dolores repellat dolorum officia voluptas, ipsum non cumque nesciunt voluptate fugiat cum temporibus maiores 
                officiis eaque quisquam. Numquam est perferendis beatae, quam amet voluptate quasi, impedit deleniti repudiandae possimus 
                ea consectetur harum ipsam ex tempora sint! Veniam dicta ex totam blanditiis illum, magnam debitis similique aliquid eveniet, 
                inventore distinctio! Impedit numquam, laborum sed amet a cumque officia itaque. Corrupti ea provident dignissimos. Aliquid 
                provident excepturi dolores quos!</p>
            </div>
          </div>
          <div className="ministries-items">
            <Image src={ministriesImg} alt="Children's Ministry" />
            <div className="ministers-bio">
              <h1>Minister Fola Eden</h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur fuga nulla, consectetur animi accusantium 
                beatae quia est deleniti ut nobis, quasi vero! Magnam illum ipsam inventore, voluptatem minima ab veritatis ut 
                iure ipsa dolores repellat dolorum officia voluptas, ipsum non cumque nesciunt voluptate fugiat cum temporibus maiores 
                officiis eaque quisquam. Numquam est perferendis beatae, quam amet voluptate quasi, impedit deleniti repudiandae possimus 
                ea consectetur harum ipsam ex tempora sint! Veniam dicta ex totam blanditiis illum, magnam debitis similique aliquid eveniet, 
                inventore distinctio! Impedit numquam, laborum sed amet a cumque officia itaque. Corrupti ea provident dignissimos. Aliquid 
                provident excepturi dolores quos!</p>
            </div>
          </div>
          <div className="ministries-items">
            <Image src={ministriesImg} alt="Youth Ministry" />
            <div className="ministers-bio">
              <h1>Minister Elvis</h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur fuga nulla, consectetur animi accusantium 
                beatae quia est deleniti ut nobis, quasi vero! Magnam illum ipsam inventore, voluptatem minima ab veritatis ut 
                iure ipsa dolores repellat dolorum officia voluptas, ipsum non cumque nesciunt voluptate fugiat cum temporibus maiores 
                officiis eaque quisquam. Numquam est perferendis beatae, quam amet voluptate quasi, impedit deleniti repudiandae possimus 
                ea consectetur harum ipsam ex tempora sint! Veniam dicta ex totam blanditiis illum, magnam debitis similique aliquid eveniet, 
                inventore distinctio! Impedit numquam, laborum sed amet a cumque officia itaque. Corrupti ea provident dignissimos. Aliquid 
                provident excepturi dolores quos!</p>
            </div>
          </div>
          
        </div>

        <div className="other-mini">
          <h1>Additional Ministers</h1>

          <div className="addmini-content">
            <div className="addmini-item">
              <h3>Other Ministring:</h3>
              <ol>
                <li>Minister Gbolahan Oni</li>
                <li>The Christ Oasis Crew</li>
                <li>Minister Havilah</li>
              </ol>
            </div>
            <div className="addmini-item">
              <h3>Campus Fellowships:</h3>
              <ol>
                <li>ANBC</li>
                <li>RCF</li>
                <li>VLCF</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="events-container" id="events">
        <div className="text-center">
          <h1 className="section-title">Upcoming Events</h1>
          <p>Stay connected with Our Programme coming up Next</p>
        </div>

        <div className="events-content">
          <div className="events-items">
            <div className="event-img">
              <Image src={grex8} alt="Ministries" style={{width: "100%", height: "100%", objectFit: 'cover'}} />
            </div>
            <button style={{
              padding: 8, color: '#04e662', backgroundColor: '#03ff6c63', 
              border: 'none', borderRadius: '8px', marginTop: 10, marginBottom: 10,
              fontWeight: 600, }}>GREX 8.0</button>
            <h3>Theme: THE RAIN</h3>
            <p>Join us for a special Easter service celebrating the resurrection of Jesus Christ</p>
            <ul>
              <li><FaCalendarDay/> June 26 2026</li>
              <li><FaRegClock/> 7:00 PM & 5:00 AM</li>
              <li><FaLocationDot/> Holufort Event Center, Oke Baale, Osogbo, Osun State</li>
            </ul>
            <a href=""><button className='item-btn'>Learn More</button></a>
          </div>

          {/* <div className="events-items">
            <div className="event-img">
              <Image src={ministriesImg} alt="Ministries" style={{width: "100%", height: "100%", objectFit: 'cover'}} />
            </div>
            <button style={{
              padding: 8, color: '#710692', backgroundColor: '#02c55485#a109cf57', 
              border: 'none', borderRadius: '8px', marginTop: 10, marginBottom: 10,
              fontWeight: 600, }}>GREX 9.0</button>
            <h3>Theme: Not yet</h3>
            <p>Join us for a special Easter service celebrating the resurrection of Jesus Christ</p>
            <ul>
              <li><FaCalendarDay/> Sometimes in June 2027</li>
              <li><FaRegClock/> 7:00 PM & 5:00 AM</li>
              <li><FaLocationDot/> Somewhere in Uniosun</li>
            </ul>
            <a href=""><button className='item-btn'>Learn More</button></a>
          </div> */}
        </div>
      </section>

      <section className="contacts-container" id="contacts">
        <div className="text-center">
          <h1 className="section-title">Get In Touch</h1>
          <p>We`d love to hear from you. Reach out with any questions or send us your Testimonies</p>
        </div>

        <div className="contact-contents">
          <div className="contact-items">
            <h3>Contact Information</h3>

            <div className="contact-info">
              <div className="info-grid">
                <FaPhoneAlt size={23} style={{ marginLeft: 10, marginTop: 20}}/>
                <div className="info">
                  <h4>Phone</h4>
                  <h5>08123456789</h5>
                  <p>Call us anytime</p>
                </div>
              </div>
              <div className="info-grid">
                <FaEnvelope size={23} style={{ marginLeft: 10, marginTop: 20}} />
                <div className="info">
                  <h4>Email</h4>
                  <h5>info@GREX.org</h5>
                  <p>Send us a message</p>
                </div>
              </div>
              {/* <div className="info-grid">
                <FaLocationDot size={23} style={{ marginLeft: 10, marginTop: 20}} />
                <div className="info">
                  <h4>Address</h4>
                  <h5>Osogbo</h5>
                  <p>Come visit us</p>
                </div>
              </div>
              <div className="info-grid">
                <FaClock size={23} style={{ marginLeft: 10, marginTop: 20}} />
                <div className="info">
                  <h4>Office Hours </h4>
                  <h5>Mon-Fri: 9:00 AM - 5:00 PM</h5>
                  <p>Saturday & Sunday: Closed</p>
                </div>
              </div> */}
            </div>

            <div className="map">
              <div>
                <div className="map-icon">
                  <FaMapLocationDot size={50} />
                </div>
                
                <p>Interactive Map Coming Soon</p>
              </div>
            </div>

          </div>

          <div className="contact-form">
            <h3>Send us Your Testimony</h3>

            <form ref={form} onSubmit={sendEmail} className="form-content">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="user_name"
                  placeholder="Your first and last Name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="user_email"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone (Optional)</label>
                <input
                  type="tel"
                  name="user_phone"
                  placeholder="+234 812 345 6789"
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  placeholder="Share your testimony..."
                  rows={6}
                  required
                ></textarea>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>

              {success && (
                <p className="form-status" style={{ color: success.includes("wrong") ? "red" : "green" }}>
                  {success}
                </p>
                )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
