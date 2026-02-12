
import React from 'react';

const ServiceSection = ({ title, description, icon, features }: { title: string, description: string, icon: string, features: string[] }) => (
  <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
    <div className="w-16 h-16 bg-royalGreen text-royalGold rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
      <i className={`fa-solid ${icon} text-3xl`}></i>
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-4 uppercase tracking-tighter">{title}</h3>
    <p className="text-slate-600 mb-6 leading-relaxed">{description}</p>
    <ul className="space-y-3">
      {features.map((f, i) => (
        <li key={i} className="flex items-start text-sm text-slate-500">
          <i className="fa-solid fa-check-circle text-royalGreen mt-1 mr-2"></i>
          {f}
        </li>
      ))}
    </ul>
  </div>
);

const Services = () => {
  return (
    <div className="py-24 space-y-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-royalGreen uppercase tracking-tighter mb-6">Our Expertise</h1>
        <p className="text-slate-500 max-w-3xl mx-auto text-xl font-light">
          From the first sketch to the final brick, we provide comprehensive solutions for Dhaka's most prestigious real estate developments.
        </p>
      </section>

      {/* Main Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceSection 
            title="Architectural Design"
            description="Our award-winning architects create spaces that balance functional efficiency with breathtaking modern aesthetics."
            icon="fa-pencil-ruler"
            features={["3D Architectural Visualization", "Space Planning & Optimization", "Sustainable Green Design", "Interior Designing"]}
          />
          <ServiceSection 
            title="Modern Construction"
            description="We employ high-precision engineering and premium materials to ensure structural integrity and longevity."
            icon="fa-hard-hat"
            features={["RCC Frame Structures", "Quality Assurance & Control", "Fast-track Project Delivery", "On-site Supervision"]}
          />
          <ServiceSection 
            title="Land Development"
            description="Transforming raw land into planned, high-value residential and commercial hubs in strategic locations."
            icon="fa-map-location-dot"
            features={["Purbachal Plot Development", "Strategic Area Zoning", "Utility Infrastructure Setup", "Legal Land Consultation"]}
          />
          <ServiceSection 
            title="Structural Engineering"
            description="Robust engineering solutions designed to withstand environmental challenges while supporting unique designs."
            icon="fa-building-shield"
            features={["Soil Analysis & Testing", "Structural Integrity Audits", "Load Calculation & Analysis", "Foundation Engineering"]}
          />
          <ServiceSection 
            title="Project Management"
            description="End-to-end oversight ensuring your dream home is delivered on time, within budget, and to the highest standards."
            icon="fa-tasks"
            features={["Budget Management", "Vendor Coordination", "Timeline Monitoring", "Risk Mitigation Strategy"]}
          />
          <ServiceSection 
            title="Legal Consultancy"
            description="Navigating the complex legal landscape of Dhaka real estate with transparency and expertise."
            icon="fa-file-signature"
            features={["Deed Verification", "Registration Assistance", "RAJUK/DOHS Approvals", "Ownership Documentation"]}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-royalGreen py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-8 tracking-tight uppercase">Ready to Build Your Legacy?</h2>
          <p className="text-white/70 text-lg mb-12 max-w-2xl mx-auto">
            Schedule a free consultation with our head of projects to discuss your vision for a modern lifestyle in Dhaka.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="tel:+8801708364030" className="bg-royalGold text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-amber-600 transition-all shadow-xl">
              Call Engineering Team
            </a>
            <button className="bg-white/10 text-white border border-white/20 backdrop-blur-md px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all">
              Request Brochure
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
