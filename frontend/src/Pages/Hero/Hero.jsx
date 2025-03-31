import { useState, useEffect } from "react"
import "./Hero.css"

const HeroPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Determine active section for nav highlighting
      const sections = ["home", "features", "pricing", "testimonials", "contact"]
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Initialize stat counters
  useEffect(() => {
    const animateValue = (element, start, end, duration) => {
      let startTimestamp = null
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp
        const progress = Math.min((timestamp - startTimestamp) / duration, 1)
        const value = Math.floor(progress * (end - start) + start)
        element.textContent = value.toLocaleString()
        if (progress < 1) {
          window.requestAnimationFrame(step)
        }
      }
      window.requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target
            const target = Number.parseInt(element.getAttribute("data-target"), 10)
            animateValue(element, 0, target, 2000)
            observer.unobserve(element)
          }
        })
      },
      { threshold: 0.5 },
    )

    document.querySelectorAll(".stat-number").forEach((el) => {
      observer.observe(el)
    })

    return () => {
      document.querySelectorAll(".stat-number").forEach((el) => {
        observer.unobserve(el)
      })
    }
  }, [])

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      })
    }
    setMobileMenuOpen(false)
  }

  // Handle button clicks
  const handleButtonClick = (e, action) => {
    e.preventDefault()
    console.log(`Button clicked: ${action}`)
    // Add your button action logic here
  }

  return (
    <div className="hero-page-wrapper">
      <div className="hero-page">
        {/* Navbar */}
        <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
          <div className="navbar-container">
            <div className="logo">
              <div className="logo-icon">TM</div>
              <span className="logo-text">TaskMaster</span>
            </div>

            <ul className={`nav-menu ${mobileMenuOpen ? "active" : ""}`}>
              <li className={`nav-item ${activeSection === "home" ? "active" : ""}`}>
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection("home")
                  }}
                >
                  Home
                </a>
              </li>
              <li className={`nav-item ${activeSection === "features" ? "active" : ""}`}>
                <a
                  href="#features"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection("features")
                  }}
                >
                  Features
                </a>
              </li>
              <li className={`nav-item ${activeSection === "pricing" ? "active" : ""}`}>
                <a
                  href="#pricing"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection("pricing")
                  }}
                >
                  Pricing
                </a>
              </li>
              <li className={`nav-item ${activeSection === "testimonials" ? "active" : ""}`}>
                <a
                  href="#testimonials"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection("testimonials")
                  }}
                >
                  Testimonials
                </a>
              </li>
              <li className={`nav-item ${activeSection === "contact" ? "active" : ""}`}>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection("contact")
                  }}
                >
                  Contact
                </a>
              </li>
            </ul>

            <div className="nav-buttons">
              <button className="btn btn-secondary" onClick={(e) => handleButtonClick(e, "sign-in")}>
                Sign In
              </button>
              <button className="btn btn-primary" onClick={(e) => handleButtonClick(e, "get-started")}>
                Get Started
              </button>
            </div>

            <div
              className={`mobile-menu-toggle ${mobileMenuOpen ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero-section" id="home">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="text-gradient">Collaborate.</span>
              <span className="text-gradient">Organize.</span>
              <span className="text-gradient">Succeed.</span>
            </h1>
            <p className="hero-subtitle">
              The ultimate task management platform designed for teams to collaborate seamlessly, organize efficiently,
              and achieve success together.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary btn-large" onClick={(e) => handleButtonClick(e, "start-free")}>
                Start for Free
                <div className="btn-shine"></div>
              </button>
              <button className="btn btn-outline btn-large" onClick={(e) => handleButtonClick(e, "watch-demo")}>
                <span className="btn-icon play-icon"></span>
                Watch Demo
                <div className="btn-ripple"></div>
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number" data-target="10000">
                  0
                </span>
                <span className="stat-label">Teams</span>
              </div>
              <div className="stat-item">
                <span className="stat-number" data-target="1000000">
                  0
                </span>
                <span className="stat-label">Tasks Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number" data-target="98">
                  0
                </span>
                <span className="stat-label">Satisfaction</span>
              </div>
            </div>
          </div>

          <div className="task-card-container">
            <div className="task-card">
              <div className="task-card-header">
                <h3>Project Alpha</h3>
                <div className="task-card-avatars">
                  <div className="avatar" style={{ backgroundColor: "#7c5dfa" }}></div>
                  <div className="avatar" style={{ backgroundColor: "#33d69f" }}></div>
                  <div className="avatar" style={{ backgroundColor: "#ff8f00" }}></div>
                </div>
              </div>
              <div className="task-list">
                <div className="task-item">
                  <div className="task-icon design-icon"></div>
                  <span>Design Homepage</span>
                </div>
                <div className="task-item high-priority">
                  <span className="priority-label">High</span>
                  <div className="task-icon priority-icon"></div>
                  <span className="task-title">Finalize Design System</span>
                  <div className="task-meta">
                    <div className="task-assignee">
                      <div className="assignee-avatar"></div>
                      <span>Sarah K.</span>
                    </div>
                    <div className="task-due">Tomorrow</div>
                  </div>
                </div>
                <div className="task-item">
                  <div className="task-icon code-icon"></div>
                  <span>API Integration</span>
                </div>
                <div className="task-item">
                  <div className="task-icon test-icon"></div>
                  <span>User Testing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Simplified particles */}
          <div className="particles">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`particle particle-${i}`}></div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="content-section" id="features">
          <div className="section-container">
            <div className="section-header">
              <span className="section-tag">Features</span>
              <h2>Everything you need to manage tasks</h2>
              <p className="section-description">
                Our platform provides all the tools you need to organize, track, and complete your projects efficiently.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon task-management-icon"></div>
                <h3>Task Management</h3>
                <p>
                  Create, assign, and track tasks with ease. Set priorities and deadlines to keep your team on track.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon collaboration-icon"></div>
                <h3>Team Collaboration</h3>
                <p>
                  Work together seamlessly with real-time updates, comments, and notifications for your entire team.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon analytics-icon"></div>
                <h3>Progress Analytics</h3>
                <p>Monitor project progress with visual dashboards and detailed reports to optimize your workflow.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon calendar-icon"></div>
                <h3>Calendar View</h3>
                <p>Visualize your project timeline with an interactive calendar that shows all upcoming deadlines.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon mobile-icon"></div>
                <h3>Mobile Access</h3>
                <p>Access your tasks from anywhere with our mobile app, available for iOS and Android devices.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon integration-icon"></div>
                <h3>Integrations</h3>
                <p>Connect with your favorite tools like Slack, Google Drive, and GitHub for a seamless workflow.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="pricing-section" id="pricing">
          <div className="section-container">
            <div className="section-header">
              <span className="section-tag">Pricing</span>
              <h2>Choose the perfect plan for your team</h2>
              <p className="section-description">
                Flexible pricing options to fit teams of all sizes. All plans include a 14-day free trial.
              </p>
            </div>

            <div className="pricing-cards">
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>Starter</h3>
                  <div className="pricing-amount">
                    <span className="currency">$</span>
                    <span className="amount">9</span>
                    <span className="period">/month</span>
                  </div>
                  <p>Perfect for individuals and small teams</p>
                </div>
                <ul className="pricing-features">
                  <li>
                    <span className="check-icon"></span> Up to 5 team members
                  </li>
                  <li>
                    <span className="check-icon"></span> 10 projects
                  </li>
                  <li>
                    <span className="check-icon"></span> Basic task management
                  </li>
                  <li>
                    <span className="check-icon"></span> 5GB storage
                  </li>
                  <li>
                    <span className="check-icon"></span> Email support
                  </li>
                </ul>
                <button className="btn btn-outline btn-full" onClick={(e) => handleButtonClick(e, "starter-plan")}>
                  Get Started
                </button>
              </div>

              <div className="pricing-card popular">
                <div className="popular-tag">Most Popular</div>
                <div className="pricing-header">
                  <h3>Professional</h3>
                  <div className="pricing-amount">
                    <span className="currency">$</span>
                    <span className="amount">19</span>
                    <span className="period">/month</span>
                  </div>
                  <p>Ideal for growing teams and businesses</p>
                </div>
                <ul className="pricing-features">
                  <li>
                    <span className="check-icon"></span> Up to 20 team members
                  </li>
                  <li>
                    <span className="check-icon"></span> Unlimited projects
                  </li>
                  <li>
                    <span className="check-icon"></span> Advanced task management
                  </li>
                  <li>
                    <span className="check-icon"></span> 50GB storage
                  </li>
                  <li>
                    <span className="check-icon"></span> Priority support
                  </li>
                  <li>
                    <span className="check-icon"></span> Analytics dashboard
                  </li>
                </ul>
                <button className="btn btn-primary btn-full" onClick={(e) => handleButtonClick(e, "professional-plan")}>
                  Get Started
                </button>
              </div>

              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>Enterprise</h3>
                  <div className="pricing-amount">
                    <span className="currency">$</span>
                    <span className="amount">49</span>
                    <span className="period">/month</span>
                  </div>
                  <p>For large organizations with complex needs</p>
                </div>
                <ul className="pricing-features">
                  <li>
                    <span className="check-icon"></span> Unlimited team members
                  </li>
                  <li>
                    <span className="check-icon"></span> Unlimited projects
                  </li>
                  <li>
                    <span className="check-icon"></span> Custom workflows
                  </li>
                  <li>
                    <span className="check-icon"></span> 500GB storage
                  </li>
                  <li>
                    <span className="check-icon"></span> 24/7 dedicated support
                  </li>
                  <li>
                    <span className="check-icon"></span> Advanced security features
                  </li>
                  <li>
                    <span className="check-icon"></span> Custom integrations
                  </li>
                </ul>
                <button className="btn btn-outline btn-full" onClick={(e) => handleButtonClick(e, "enterprise-plan")}>
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section" id="testimonials">
          <div className="section-container">
            <div className="section-header">
              <span className="section-tag">Testimonials</span>
              <h2>What our customers say</h2>
              <p className="section-description">
                Don't just take our word for it. Here's what teams are saying about TaskMaster.
              </p>
            </div>

            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="quote-icon"></div>
                <p className="testimonial-text">
                  "TaskMaster has completely transformed how our team collaborates. We've increased productivity by 35%
                  since implementing it."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar"></div>
                  <div className="author-info">
                    <h4>Sarah Johnson</h4>
                    <p>Product Manager, TechCorp</p>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="quote-icon"></div>
                <p className="testimonial-text">
                  "The intuitive interface and powerful features make TaskMaster the perfect solution for our remote
                  team. It's been a game-changer."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar"></div>
                  <div className="author-info">
                    <h4>Michael Chen</h4>
                    <p>CTO, StartupX</p>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="quote-icon"></div>
                <p className="testimonial-text">
                  "We evaluated over 10 project management tools and TaskMaster was the clear winner. The analytics
                  alone have saved us countless hours."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar"></div>
                  <div className="author-info">
                    <h4>Emily Rodriguez</h4>
                    <p>Operations Director, GrowthCo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section" id="contact">
          <div className="section-container">
            <div className="section-header">
              <span className="section-tag">Contact Us</span>
              <h2>Ready to get started?</h2>
              <p className="section-description">
                Have questions or need help? Our team is here to assist you every step of the way.
              </p>
            </div>

            <div className="contact-container">
              <div className="contact-form-container">
                <form
                  className="contact-form"
                  onSubmit={(e) => {
                    e.preventDefault()
                    console.log("Form submitted")
                  }}
                >
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Your email" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" rows="5" placeholder="How can we help?"></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary btn-full">
                    Send Message
                  </button>
                </form>
              </div>

              <div className="contact-info">
                <div className="info-item">
                  <div className="info-icon email-icon"></div>
                  <div className="info-content">
                    <h4>Email Us</h4>
                    <p>support@taskmaster.com</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon phone-icon"></div>
                  <div className="info-content">
                    <h4>Call Us</h4>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon location-icon"></div>
                  <div className="info-content">
                    <h4>Visit Us</h4>
                    <p>
                      123 Innovation Street
                      <br />
                      San Francisco, CA 94103
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-top">
              <div className="footer-brand">
                <div className="logo">
                  <div className="logo-icon">TM</div>
                  <span className="logo-text">TaskMaster</span>
                </div>
                <p className="brand-description">The ultimate task management platform for teams of all sizes.</p>
                <div className="social-links">
                  <a
                    href="#"
                    className="social-link twitter-icon"
                    aria-label="Twitter"
                    onClick={(e) => {
                      e.preventDefault()
                      console.log("Twitter clicked")
                    }}
                  ></a>
                  <a
                    href="#"
                    className="social-link facebook-icon"
                    aria-label="Facebook"
                    onClick={(e) => {
                      e.preventDefault()
                      console.log("Facebook clicked")
                    }}
                  ></a>
                  <a
                    href="#"
                    className="social-link linkedin-icon"
                    aria-label="LinkedIn"
                    onClick={(e) => {
                      e.preventDefault()
                      console.log("LinkedIn clicked")
                    }}
                  ></a>
                  <a
                    href="#"
                    className="social-link instagram-icon"
                    aria-label="Instagram"
                    onClick={(e) => {
                      e.preventDefault()
                      console.log("Instagram clicked")
                    }}
                  ></a>
                  <a
                    href="#"
                    className="social-link github-icon"
                    aria-label="GitHub"
                    onClick={(e) => {
                      e.preventDefault()
                      console.log("GitHub clicked")
                    }}
                  ></a>
                </div>
              </div>

              <div className="footer-links">
                <div className="footer-links-column">
                  <h4>Product</h4>
                  <ul>
                    <li>
                      <a
                        href="#features"
                        onClick={(e) => {
                          e.preventDefault()
                          scrollToSection("features")
                        }}
                      >
                        Features
                      </a>
                    </li>
                    <li>
                      <a
                        href="#pricing"
                        onClick={(e) => {
                          e.preventDefault()
                          scrollToSection("pricing")
                        }}
                      >
                        Pricing
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log("Integrations clicked")
                        }}
                      >
                        Integrations
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log("Changelog clicked")
                        }}
                      >
                        Changelog
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log("Roadmap clicked")
                        }}
                      >
                        Roadmap
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="footer-links-column">
                  <h4>Resources</h4>
                  <ul>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log("Documentation clicked")
                        }}
                      >
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log("Guides clicked")
                        }}
                      >
                        Guides
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log("API Reference clicked")
                        }}
                      >
                        API Reference
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log("Community clicked")
                        }}
                      >
                        Community
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log("Blog clicked")
                        }}
                      >
                        Blog
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="footer-links-column">
                  <h4>Company</h4>
                  <ul>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log("About Us clicked")
                        }}
                      >
                        About Us
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log("Careers clicked")
                        }}
                      >
                        Careers
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log("Press clicked")
                        }}
                      >
                        Press
                      </a>
                    </li>
                    <li>
                      <a
                        href="#contact"
                        onClick={(e) => {
                          e.preventDefault()
                          scrollToSection("contact")
                        }}
                      >
                        Contact
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log("Partners clicked")
                        }}
                      >
                        Partners
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="footer-links-column">
                  <h4>Legal</h4>
                  <ul>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log("Privacy Policy clicked")
                        }}
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log("Terms of Service clicked")
                        }}
                      >
                        Terms of Service
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log("Cookie Policy clicked")
                        }}
                      >
                        Cookie Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log("GDPR clicked")
                        }}
                      >
                        GDPR
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log("Security clicked")
                        }}
                      >
                        Security
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <p className="copyright">© {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
              <div className="footer-bottom-links">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    console.log("Privacy clicked")
                  }}
                >
                  Privacy
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    console.log("Terms clicked")
                  }}
                >
                  Terms
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    console.log("Cookies clicked")
                  }}
                >
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default HeroPage

