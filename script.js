class TxtType {
  constructor(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  }
  tick() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 150;
    }

    setTimeout(function () {
      that.tick();
    }, delta);
  }
}

// Intersection Observer for section animations
function handleIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Stop observing once visible
    }
  });
}

window.onload = function() {
  // Typewriter effect
  var elements = document.getElementsByClassName('typewrite');
  for (var i=0; i<elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-type');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      }
  }
  
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const topnav = document.querySelector('.topnav');
  const body = document.querySelector('body');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      topnav.classList.toggle('active');
      body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.topnav a').forEach(link => {
      link.addEventListener('click', function() {
        if (menuToggle.classList.contains('active')) {
          menuToggle.classList.remove('active');
          topnav.classList.remove('active');
          body.classList.remove('menu-open');
        }
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!topnav.contains(event.target) && !menuToggle.contains(event.target) && topnav.classList.contains('active')) {
        menuToggle.classList.remove('active');
        topnav.classList.remove('active');
        body.classList.remove('menu-open');
      }
    });
  }
  
  // Add smooth scrolling for navigation links
  document.querySelectorAll('.topnav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if(targetId === '#') return; // Skip for home link
      
      const targetElement = document.querySelector(targetId);
      if(targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100, // Offset for navbar
          behavior: 'smooth'
        });
      }
    });
  });

  // Set up intersection observer for animation
  const observer = new IntersectionObserver(handleIntersection, {
    root: null, // viewport
    threshold: 0.1, // 10% of the item visible
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before visible
  });

  // Observe all section containers
  document.querySelectorAll('.section-container').forEach(section => {
    section.classList.add('animate-section');
    observer.observe(section);
  });

  // Enhanced Navbar Animations
  const navbarLinks = document.querySelectorAll('.topnav a');
  
  // Staggered entrance animation for navbar links
  navbarLinks.forEach((link, index) => {
    link.style.opacity = '0';
    link.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      link.style.transition = 'all 0.3s ease';
      link.style.opacity = '1';
      link.style.transform = 'translateY(0)';
    }, 100 + (index * 80));
  });
  
  // Logo entrance animation
  const logo = document.querySelector('.navbarlogo');
  logo.style.opacity = '0';
  logo.style.transform = 'scale(0.8)';
  setTimeout(() => {
    logo.style.transition = 'all 0.5s ease';
    logo.style.opacity = '1';
    logo.style.transform = 'scale(1)';
  }, 300);

  // Add hover effects for project cards
  document.querySelectorAll('.project-card, .brand-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
      this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    });
  });

  // Project link hover effect
  document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.color = 'white';
      this.style.transform = 'translateX(5px)';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.color = '#fafc93';
      this.style.transform = 'translateX(0)';
    });
  });

  // Scroll to top button functionality
  const scrollTopButton = document.getElementById('scrollTop');
  if (scrollTopButton) {
    // Show/hide scroll-to-top button based on scroll position
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        scrollTopButton.classList.add('visible');
      } else {
        scrollTopButton.classList.remove('visible');
      }
    });
    
    // Scroll to top when button is clicked
    scrollTopButton.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Enhanced Navbar scroll behavior
  const navbar = document.querySelector('.navbar');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.scrollY;
    
    // Add scrolled class when scrolling down
    if (scrollTop > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Subtle parallax effect on navbar
    if (scrollTop < 200) {
      navbar.style.transform = `translateY(0)`;
    }
    
    lastScrollTop = scrollTop;
  });

  // Add active class to navigation based on scroll position
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    // Get all sections
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if(scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove active class from all links
        document.querySelectorAll('.topnav a').forEach(link => {
          link.classList.remove('active');
        });
        
        // Add active class to current section link
        const activeLink = document.querySelector(`.topnav a[href="#${sectionId}"]`);
        if(activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
    
    // Check if we're at the top of the page
    if(scrollPosition < 100) {
      document.querySelectorAll('.topnav a').forEach(link => {
        link.classList.remove('active');
      });
      
      const homeLink = document.querySelector('.topnav a[href="#"]');
      if(homeLink) {
        homeLink.classList.add('active');
      }
    }
  });
};

// function notavl(){
//   alert("The page will be updated sonn with more details");
// }
// var res=document.getElementById("res");
// var con=document.getElementById("con");
// con.addEventListener("click",notavl);
// res.addEventListener("click",notavl);
/* 
function myFunction1() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
} */
