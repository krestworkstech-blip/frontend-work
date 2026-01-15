import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function RequestDemo() {
  const canvasRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    employeeCount: '',
    country: '',
    interestedProducts: [],
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
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        interestedProducts: checked 
          ? [...prev.interestedProducts, value]
          : prev.interestedProducts.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Demo Request:', formData);
      setSubmitStatus('success');
      setIsSubmitting(false);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          company: '',
          industry: '',
          employeeCount: '',
          country: '',
          interestedProducts: [],
          message: ''
        });
        setSubmitStatus(null);
      }, 3000);
    }, 2000);
  };

  const products = [
    'HR & Administration',
    'Recruitment & Onboarding',
    'Payroll Management',
    'People & Performance',
    'Expense Requisitions',
    'Compliance & Security'
  ];

  const industries = [
    'SMEs',
    'Corporates',
    'Schools',
    'Healthcare',
    'Hospitality',
    'NGOs',
    'Social Enterprises',
    'Manufacturing',
    'Other'
  ];

  const countries = [
    'Kenya',
    'Uganda',
    'Tanzania',
    'Rwanda',
    'South Sudan',
    'Other'
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
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-lg"></div>
              <div className="text-2xl font-bold">
                <span className="text-amber-400">Krest</span>
                <span className="text-white">Works</span>
              </div>
            </a>
            <div className="hidden md:flex gap-8 text-sm font-medium">
              <a href="/" className="hover:text-amber-400 transition">Home</a>
              <a href="/#products" className="hover:text-amber-400 transition">Products</a>
              <a href="/#solutions" className="hover:text-amber-400 transition">Solutions</a>
              <a href="/contact" className="hover:text-amber-400 transition">Contact</a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-block px-6 py-2 bg-amber-500/10 border border-amber-400/30 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                ✨ Experience the Future of HR
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Request a
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600">
                  Live Demo
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                See how KrestHR can transform your workforce management. Our team will give you a personalized walkthrough of our solutions.
              </p>
            </div>

            {/* Form */}
            <div className="bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border border-amber-400/20 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
              {submitStatus === 'success' ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl">
                    ✓
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-amber-300">Request Received!</h3>
                  <p className="text-xl text-gray-300 mb-8">
                    Thank you for your interest. Our team will contact you within 24 hours to schedule your personalized demo.
                  </p>
                  <a href="/" className="inline-block bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 px-8 py-3 rounded-xl font-bold transition transform hover:scale-105">
                    Return Home
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-amber-300">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Full Name *</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="w-full bg-black/40 border border-amber-400/30 rounded-xl px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full bg-black/40 border border-amber-400/30 rounded-xl px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
                          placeholder="john@company.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full bg-black/40 border border-amber-400/30 rounded-xl px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
                          placeholder="+254 700 000 000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Company Name *</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          required
                          className="w-full bg-black/40 border border-amber-400/30 rounded-xl px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
                          placeholder="Your Company Ltd"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-amber-300">Company Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Industry *</label>
                        <select
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                          required
                          className="w-full bg-black/40 border border-amber-400/30 rounded-xl px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
                        >
                          <option value="">Select Industry</option>
                          {industries.map(ind => (
                            <option key={ind} value={ind}>{ind}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Number of Employees *</label>
                        <select
                          name="employeeCount"
                          value={formData.employeeCount}
                          onChange={handleChange}
                          required
                          className="w-full bg-black/40 border border-amber-400/30 rounded-xl px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
                        >
                          <option value="">Select Range</option>
                          <option value="1-50">1-50</option>
                          <option value="51-200">51-200</option>
                          <option value="201-500">201-500</option>
                          <option value="501-1000">501-1,000</option>
                          <option value="1000+">1,000+</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Country *</label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          className="w-full bg-black/40 border border-amber-400/30 rounded-xl px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
                        >
                          <option value="">Select Country</option>
                          {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Products Interest */}
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-amber-300">Products of Interest</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {products.map(product => (
                        <label key={product} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            name="interestedProducts"
                            value={product}
                            checked={formData.interestedProducts.includes(product)}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-amber-400/30 bg-black/40 text-amber-500 focus:ring-2 focus:ring-amber-500/20"
                          />
                          <span className="text-gray-300 group-hover:text-amber-300 transition">{product}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Additional Message */}
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-amber-300">Additional Information</h3>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Tell us about your needs</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full bg-black/40 border border-amber-400/30 rounded-xl px-4 py-3 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition resize-none"
                      placeholder="What challenges are you facing? What are you looking for in an HR solution?"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 px-8 py-5 rounded-xl text-lg font-bold transition transform hover:scale-105 shadow-2xl shadow-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-3">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        'Request Demo'
                      )}
                    </button>
                    <p className="text-center text-sm text-gray-400 mt-4">
                      Our team will reach out within 24 hours to schedule your personalized demo
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* Benefits */}
            <div className="mt-20 grid md:grid-cols-3 gap-6">
              {[
                { icon: '⚡', title: 'Quick Setup', desc: 'Get started in minutes with our intuitive platform' },
                { icon: '🔒', title: 'Secure & Compliant', desc: 'Your data is protected with enterprise-grade security' },
                { icon: '🎯', title: 'Personalized Demo', desc: 'See features that matter most to your business' }
              ].map((benefit, i) => (
                <div key={i} className="bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border border-amber-400/20 rounded-2xl p-6 text-center backdrop-blur-sm hover:border-amber-400/40 transition">
                  <div className="text-4xl mb-3">{benefit.icon}</div>
                  <h4 className="text-lg font-bold mb-2 text-amber-300">{benefit.title}</h4>
                  <p className="text-gray-400 text-sm">{benefit.desc}</p>
                </div>
              ))}
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