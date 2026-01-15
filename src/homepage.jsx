import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function KrestHRHomepage() {
  const canvasRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

    // Brighter particle system with gold colors
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 25;
      posArray[i + 1] = (Math.random() - 0.5) * 25;
      posArray[i + 2] = (Math.random() - 0.5) * 25;

      // Bright gold colors
      const t = Math.random();
      colorArray[i] = 0.9 + t * 0.1; // R - very bright
      colorArray[i + 1] = 0.7 + t * 0.3; // G - golden
      colorArray[i + 2] = 0.2; // B - minimal blue
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create glowing geometric shapes
    const geometries = [];
    const materials = [];
    const meshes = [];

    const createFloatingShape = (x, y, z, scale = 1) => {
      const geometry = new THREE.BoxGeometry(0.4 * scale, 0.4 * scale, 0.4 * scale);
      const edges = new THREE.EdgesGeometry(geometry);
      const material = new THREE.LineBasicMaterial({
        color: 0xFFD700,
        transparent: true,
        opacity: 0.8,
        linewidth: 2
      });
      const mesh = new THREE.LineSegments(edges, material);
      mesh.position.set(x, y, z);
      return { geometry, edges, material, mesh };
    };

    for (let i = 0; i < 20; i++) {
      const shape = createFloatingShape(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        0.5 + Math.random()
      );
      geometries.push(shape.geometry);
      geometries.push(shape.edges);
      materials.push(shape.material);
      meshes.push(shape.mesh);
      scene.add(shape.mesh);
    }

    // Add ambient light for better visibility
    const ambientLight = new THREE.AmbientLight(0xFFD700, 0.5);
    scene.add(ambientLight);

    // Add point lights
    const pointLight1 = new THREE.PointLight(0xFFD700, 1, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xFFA500, 1, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Connection lines
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0xFFD700,
      transparent: true,
      opacity: 0.3
    });

    const clock = new THREE.Clock();
    let frame = 0;
    const connections = [];

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      frame++;

      // Animate particles with enhanced wave
      const positions = particlesGeometry.attributes.position.array;
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        
        positions[i3 + 2] = Math.sin(elapsedTime * 0.5 + x * 0.2) * 1.5 + 
                           Math.cos(elapsedTime * 0.3 + y * 0.2) * 1.5;
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      // Rotate particle system
      particlesMesh.rotation.y = elapsedTime * 0.05;
      particlesMesh.rotation.x = Math.sin(elapsedTime * 0.1) * 0.2;

      // Animate floating shapes with more movement
      meshes.forEach((mesh, index) => {
        mesh.rotation.x += 0.008 + index * 0.001;
        mesh.rotation.y += 0.008 + index * 0.001;
        mesh.rotation.z += 0.005;
        mesh.position.y += Math.sin(elapsedTime * 0.5 + index) * 0.003;
        mesh.position.x += Math.cos(elapsedTime * 0.3 + index) * 0.003;
      });

      // Animate lights
      pointLight1.position.x = Math.sin(elapsedTime * 0.5) * 5;
      pointLight1.position.y = Math.cos(elapsedTime * 0.5) * 5;
      pointLight2.position.x = Math.cos(elapsedTime * 0.7) * 5;
      pointLight2.position.y = Math.sin(elapsedTime * 0.7) * 5;

      // Update connections less frequently
      if (frame % 15 === 0) {
        // Remove old connections
        connections.forEach(line => {
          scene.remove(line);
          if (line.geometry) line.geometry.dispose();
        });
        connections.length = 0;

        // Create new connections
        for (let i = 0; i < 40; i++) {
          const i1 = Math.floor(Math.random() * particlesCount) * 3;
          const i2 = Math.floor(Math.random() * particlesCount) * 3;
          
          const point1 = new THREE.Vector3(positions[i1], positions[i1 + 1], positions[i1 + 2]);
          const point2 = new THREE.Vector3(positions[i2], positions[i2 + 1], positions[i2 + 2]);
          
          const distance = point1.distanceTo(point2);
          if (distance < 3) {
            const points = [point1, point2];
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(lineGeometry, linesMaterial);
            scene.add(line);
            connections.push(line);
          }
        }
      }

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
      linesMaterial.dispose();
      connections.forEach(line => {
        if (line.geometry) line.geometry.dispose();
      });
      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      scene.clear();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      
      {/* Overlay gradient for better text readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" style={{ zIndex: 1 }}></div>
      
      {/* Content wrapper */}
      <div className="relative" style={{ zIndex: 2 }}>
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-lg border-b border-amber-500/20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400  rounded-lg"><img src='./src/assets/krstlogo.png' /></div>
              <div className="text-2xl font-bold">
                <span className="text-amber-400">Krest</span>
                <span className="text-white">Works</span>
              </div>
            </div>
            <div className="hidden md:flex gap-8 text-sm font-medium">
              <a href="#products" className="hover:text-amber-400 transition">Products</a>
              <a href="#solutions" className="hover:text-amber-400 transition">Solutions</a>
              <a href="#pricing" className="hover:text-amber-400 transition">Pricing</a>
              <a href="/contact" className="hover:text-amber-400 transition">Contact</a>
            </div>
            <button className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 px-6 py-2 rounded-lg text-sm font-bold transition transform hover:scale-105 shadow-lg shadow-amber-500/30">
              <a href='/requestdemo'>Request Demo</a>
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-6">
          <div className="max-w-6xl mx-auto text-center space-y-8" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
            <div className="inline-block px-6 py-2 bg-amber-500/10 border border-amber-400/30 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
              ✨ Empowering Digital Futures
            </div>
            <h1 className="text-6xl md:text-8xl font-bold leading-tight">
              Simplified
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600">
                Workforce Management
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Cloud-based HR solutions that streamline operations, ensure compliance, and empower smarter workforce decisions across East Africa
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
              <button className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 px-10 py-5 rounded-xl text-lg font-bold transition transform hover:scale-105 shadow-2xl shadow-amber-500/40">
                Get Started Now
              </button>
              <button className="border-2 border-amber-400/40 hover:border-amber-400 hover:bg-amber-500/10 px-10 py-5 rounded-xl text-lg font-medium transition transform hover:scale-105 backdrop-blur-sm">
                Watch Demo →
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20 pt-12 border-t border-amber-500/20">
              <div>
                <div className="text-4xl font-bold text-amber-400">5+</div>
                <div className="text-gray-400 mt-2">Countries</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-400">100%</div>
                <div className="text-gray-400 mt-2">Compliant</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-400">24/7</div>
                <div className="text-gray-400 mt-2">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="relative py-32 px-6 bg-black/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">Our Core Values</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-yellow-600 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Innovation with Purpose",
                  desc: "Smart, scalable technology that solves real business challenges, driven by impact, not complexity",
                  icon: "⚡",
                  gradient: "from-amber-500/20 to-yellow-500/20"
                },
                {
                  title: "Integrity & Trust",
                  desc: "Built with security, transparency and compliance at the core, earning trust through reliability",
                  icon: "🔒",
                  gradient: "from-yellow-500/20 to-amber-600/20"
                },
                {
                  title: "People-Centric",
                  desc: "Intuitive, human-first solutions that empower organizations to work smarter, not harder",
                  icon: "👥",
                  gradient: "from-amber-600/20 to-yellow-400/20"
                }
              ].map((value, i) => (
                <div key={i} className={`bg-gradient-to-br ${value.gradient} backdrop-blur-sm border border-amber-400/30 rounded-3xl p-10 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 group`}>
                  <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-300">{value.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 text-amber-300">{value.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="relative py-32 px-6 bg-black/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">Our Products</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">Complete HR solutions for modern organizations</p>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-yellow-600 mx-auto mt-6"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "HR & Administration",
                  icon: "📋",
                  features: ["Time & Attendance", "Leave Management", "Employee Records", "Asset Tracking", "Shift Planning", "Case Management"]
                },
                {
                  title: "Recruitment & Onboarding",
                  icon: "🎯",
                  features: ["Recruitment Management", "Onboarding Workflows", "Career Portal", "Document Generator"]
                },
                {
                  title: "Payroll Management",
                  icon: "💰",
                  features: ["Automated Payroll", "PAYE Processing", "NSSF & SHIF", "Digital Payslips", "Statutory Compliance"]
                },
                {
                  title: "People & Performance",
                  icon: "📈",
                  features: ["Employee Surveys", "Performance Reviews", "Org Charts", "Engagement Tools", "HR Ticketing"]
                },
                {
                  title: "Expense Requisitions",
                  icon: "💳",
                  features: ["Travel & Per Diem", "Approval Workflows", "Receipt Tracking", "Policy Enforcement", "Real-time Status"]
                },
                {
                  title: "Compliance & Security",
                  icon: "🛡️",
                  features: ["Labour Law Compliance", "Data Security", "Cloud-based", "Audit Support", "Multi-country"]
                }
              ].map((product, i) => (
                <div key={i} className="bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border border-amber-400/20 rounded-3xl p-8 hover:border-amber-400/60 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 group backdrop-blur-sm">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{product.icon}</div>
                  <h3 className="text-2xl font-bold mb-6 text-amber-300 group-hover:text-amber-200">{product.title}</h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3 text-gray-300 group-hover:text-white transition">
                        <span className="text-amber-400 mt-1 text-lg">▸</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries & Solutions */}
        <section id="solutions" className="relative py-32 px-6 bg-black/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">Who We Serve</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-yellow-600 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 backdrop-blur-sm border border-amber-400/30 rounded-3xl p-10 hover:border-amber-400/60 hover:shadow-2xl hover:shadow-amber-500/20 transition-all">
                <h3 className="text-3xl font-bold mb-8 text-amber-300">Industries</h3>
                <div className="grid grid-cols-2 gap-6">
                  {["SMEs", "Corporates", "Schools", "Healthcare", "Hospitality", "NGOs", "Social Enterprises", "Manufacturing"].map((industry, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-200 hover:text-amber-300 transition group">
                      <div className="w-3 h-3 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full group-hover:scale-125 transition"></div>
                      <span className="font-medium">{industry}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500/10 to-amber-600/10 backdrop-blur-sm border border-amber-400/30 rounded-3xl p-10 hover:border-amber-400/60 hover:shadow-2xl hover:shadow-amber-500/20 transition-all">
                <h3 className="text-3xl font-bold mb-8 text-amber-300">Countries</h3>
                <div className="grid grid-cols-2 gap-6">
                  {["🇰🇪 Kenya", "🇺🇬 Uganda", "🇹🇿 Tanzania", "🇷🇼 Rwanda", "🇸🇸 South Sudan"].map((country, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-200 hover:text-amber-300 transition text-lg group">
                      <span className="group-hover:scale-125 transition">{country.split(' ')[0]}</span>
                      <span className="font-medium">{country.split(' ')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="relative py-32 px-6 bg-black/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">Flexible Pricing</h2>
              <p className="text-xl text-gray-400">Choose the package that fits your organization</p>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-yellow-600 mx-auto mt-6"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { name: "Starter", desc: "Ideal for SMEs and small teams", price: "Contact us", highlight: false },
                { name: "Professional", desc: "For growing organizations", price: "Contact us", highlight: true },
                { name: "Enterprise", desc: "Large and complex workforces", price: "Contact us", highlight: false }
              ].map((pkg, i) => (
                <div key={i} className={`rounded-3xl p-10 transition-all duration-300 ${
                  pkg.highlight 
                    ? 'bg-gradient-to-br from-amber-500 to-yellow-600 transform scale-105 shadow-2xl shadow-amber-500/40' 
                    : 'bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-400/30 hover:border-amber-400/60 hover:shadow-xl hover:shadow-amber-500/20'
                }`}>
                  <h3 className={`text-3xl font-bold mb-3 ${pkg.highlight ? 'text-black' : 'text-amber-300'}`}>{pkg.name}</h3>
                  <p className={`mb-8 ${pkg.highlight ? 'text-black/80' : 'text-gray-300'}`}>{pkg.desc}</p>
                  <div className={`text-4xl font-bold mb-8 ${pkg.highlight ? 'text-black' : 'text-amber-400'}`}>{pkg.price}</div>
                  <button className={`w-full py-4 rounded-xl font-bold transition transform hover:scale-105 ${
                    pkg.highlight 
                      ? 'bg-black text-amber-400 hover:bg-gray-900' 
                      : 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 shadow-lg shadow-amber-500/30'
                  }`}>
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32 px-6 bg-black/30 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto text-center bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-400/30 rounded-3xl p-16 backdrop-blur-sm">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">Ready for Smarter HR?</h2>
            <p className="text-2xl text-gray-300 mb-12 leading-relaxed">See how KrestHR can simplify HR administration, improve compliance and elevate employee experience</p>
            <button className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 px-12 py-6 rounded-xl text-xl font-bold transition transform hover:scale-105 shadow-2xl shadow-amber-500/40">
              Request a Demo Today
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="relative border-t border-amber-500/20 py-16 px-6 bg-black/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-lg"></div>
                  <div className="text-3xl font-bold">
                    <span className="text-amber-400">Krest</span>
                    <span className="text-white">Works</span>
                  </div>
                </div>
                <p className="text-gray-400 text-lg mb-6">Empowering Digital Futures</p>
                <p className="text-gray-500">Cloud-based HR solutions for modern African organizations</p>
              </div>
              <div>
                <h4 className="font-bold text-amber-300 mb-6 text-lg">Quick Links</h4>
                <div className="space-y-3">
                  <a href="#products" className="block text-gray-400 hover:text-amber-400 transition">Products</a>
                  <a href="#solutions" className="block text-gray-400 hover:text-amber-400 transition">Solutions</a>
                  <a href="#pricing" className="block text-gray-400 hover:text-amber-400 transition">Pricing</a>
                  <a href="#contact" className="block text-gray-400 hover:text-amber-400 transition">Contact</a>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-amber-300 mb-6 text-lg">Contact Us</h4>
                <div className="space-y-3 text-gray-400">
                  <p>📍 Nairobi, Kenya</p>
                  <p>📧 info@krestworks.com</p>
                  <p>📞 +254 700 000 000</p>
                  <p>🌐 www.krestworks.com</p>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-amber-500/20 text-center text-gray-500">
              <p>© 2026 Krest Works. All rights reserved. Built with excellence in Nairobi.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}