import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Contact() {
  const canvasRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true, 
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    camera.position.z = 5;

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 20;
      posArray[i + 1] = (Math.random() - 0.5) * 20;
      posArray[i + 2] = (Math.random() - 0.5) * 20;

      const t = Math.random();
      colorArray[i] = 0.9 + t * 0.1;
      colorArray[i + 1] = 0.7 + t * 0.3;
      colorArray[i + 2] = 0.2;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      const positions = particlesGeometry.attributes.position.array;
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        
        positions[i3 + 2] = Math.sin(elapsedTime * 0.3 + x * 0.15) * 1.2 + 
                           Math.cos(elapsedTime * 0.2 + y * 0.15) * 1.2;
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      particlesMesh.rotation.y = elapsedTime * 0.03;
      particlesMesh.rotation.x = Math.sin(elapsedTime * 0.08) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      scene.clear();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Contact Form:', formData);
      setSubmitStatus('success');
      setIsSubmitting(false);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setSubmitStatus(null);
      }, 3000);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: '📍',
      title: 'Visit Us',
      details: ['Nairobi, Kenya', 'East Africa Hub'],
      link: null
    },
    {
      icon: '📧',
      title: 'Email Us',
      details: ['info@krestworks.com', 'support@krestworks.com'],
      link: 'mailto:info@krestworks.com'
    },
    {
      icon: '📞',
      title: 'Call Us',
      details: ['+254 700 000 000', 'Mon-Fri: 8AM - 6PM EAT'],
      link: 'tel:+254700000000'
    },
    {
      icon: '🌐',
      title: 'Follow Us',
      details: ['LinkedIn', 'Twitter'],
      link: null
    }
  ];

  const faqs = [
    {
      question: 'What is KrestHR?',
      answer: 'KrestHR is a comprehensive cloud-based HR management solution designed specifically for organizations across East Africa.'
    },
    {
      question: 'Which countries do you serve?',
      answer: 'We serve Kenya, Uganda, Tanzania, Rwanda, and South Sudan with full compliance support for each country.'
    },
    {
      question: 'How quickly can we get started?',
      answer: 'Implementation typically takes 1-2 weeks depending on your organization size and requirements.'
    },
    {
      question: 'Do you offer customer support?',
      answer: 'Yes! We provide 24/7 customer support via email, phone, and our help center.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      
      <div className="fixed inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" style={{ zIndex: 1 }}></div>
      
      <div className="relative" style={{ zIndex: 2 }}>
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-lg border-b border-amber-500/20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400  rounded-lg"><img src='./src/assets/krstlogo.png' /></div>
              <div className="text-2xl font-bold">
                <span className="text-amber-400">Krest</span>
                <span className="text-white">Works</span>
              </div>
            </a>
            <div className="hidden md:flex gap-8 text-sm font-medium">
              <a href="/" className="hover:text-amber-400 transition">Home</a>
              <a href="/" className="hover:text-amber-400 transition">Products</a>
              <a href="/" className="hover:text-amber-400 transition">Solutions</a>
              <a href="/requestdemo" className="hover:text-amber-400 transition">Request Demo</a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-block px-6 py-2 bg-amber-500/10 border border-amber-400/30 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                💬 We're Here to Help
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Get in
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600">
                  Touch
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Have a question or need assistance? We'd love to hear from you. Our team is ready to help you succeed.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border border-amber-400/20 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
                  {submitStatus === 'success' ? (
                    <div className="text-center py-20">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl">
                        ✓
                      </div>
                      <h3 className="text-3xl font-bold mb-4 text-amber-300">Message Sent!</h3>
                      <p className="text-xl text-gray-300 mb-8">
                        Thank you for reaching out. We'll get back to you as soon as possible.
                      </p>
                      <a href="/" className="inline-block bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 px-8 py-3 rounded-xl font-bold transition transform hover:scale-105">
                        Return Home
                      </a>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Your Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full bg-black/40 border border-amber-400/30 rounded-xl px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">Email Address *</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-black/40 border border-amber-400/30 rounded-xl px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
                            placeholder="john@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-amber-400/30 rounded-xl px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
                            placeholder="+254 700 000 000"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Subject *</label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full bg-black/40 border border-amber-400/30 rounded-xl px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
                          placeholder="How can we help you?"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Message *</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows="6"
                          className="w-full bg-black/40 border border-amber-400/30 rounded-xl px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition resize-none"
                          placeholder="Tell us more about your inquiry..."
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 px-8 py-4 rounded-xl text-lg font-bold transition transform hover:scale-105 shadow-2xl shadow-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-3">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          'Send Message'
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                {contactMethods.map((method, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border border-amber-400/20 rounded-2xl p-6 backdrop-blur-sm hover:border-amber-400/40 transition group"
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{method.icon}</div>
                    <h3 className="text-xl font-bold mb-3 text-amber-300">{method.title}</h3>
                    {method.link ? (
                      <a href={method.link} className="space-y-1 block hover:text-amber-400 transition">
                        {method.details.map((detail, j) => (
                          <p key={j} className="text-gray-300">{detail}</p>
                        ))}
                      </a>
                    ) : (
                      <div className="space-y-1">
                        {method.details.map((detail, j) => (
                          <p key={j} className="text-gray-300">{detail}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Office Hours & FAQ */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Office Hours */}
              <div className="bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border border-amber-400/20 rounded-3xl p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6 text-amber-300">Office Hours</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-amber-400/20">
                    <span className="text-gray-300">Monday - Friday</span>
                    <span className="font-medium text-amber-400">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-amber-400/20">
                    <span className="text-gray-300">Saturday</span>
                    <span className="font-medium text-amber-400">9:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Sunday</span>
                    <span className="font-medium text-gray-500">Closed</span>
                  </div>
                  <div className="mt-6 pt-6 border-t border-amber-400/20">
                    <p className="text-sm text-gray-400">
                      All times are in East Africa Time (EAT). For urgent matters outside office hours, please email us and we'll respond as soon as possible.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border border-amber-400/20 rounded-3xl p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6 text-amber-300">Quick Answers</h3>
                <div className="space-y-4">
                  {faqs.map((faq, i) => (
                    <details key={i} className="group">
                      <summary className="cursor-pointer list-none flex items-center justify-between py-3 border-b border-amber-400/20 hover:text-amber-400 transition">
                        <span className="font-medium">{faq.question}</span>
                        <span className="text-amber-400 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="text-gray-400 text-sm mt-3 leading-relaxed">{faq.answer}</p>
                    </details>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-amber-400/20">
                  <a href="/request-demo" className="text-amber-400 hover:text-amber-300 transition font-medium">
                    More questions? Request a demo →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative border-t border-amber-500/20 py-12 px-6 bg-black/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-lg"></div>
              <div className="text-2xl font-bold">
                <span className="text-amber-400">Krest</span>
                <span className="text-white">Works</span>
              </div>
            </div>
            <p className="text-gray-500">© 2026 Krest Works. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}