import React from 'react';

const certifications = [
  {
    id: 1,
    name: 'AWS Solutions Architect',
    issuer: 'Amazon Web Services',
    date: '2023',
    logo: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'TensorFlow Developer',
    issuer: 'Google',
    date: '2022',
    logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Full Stack Development',
    issuer: 'Meta',
    date: '2022',
    logo: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

const Certifications: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {certifications.map((cert) => (
        <div
          key={cert.id}
          className="group perspective"
        >
          <div className="relative transform-style-3d transition-transform duration-500 group-hover:rotate-y-180">
            {/* Front */}
            <div className="backface-hidden">
              <div className="p-6 bg-[var(--color-bg)] border border-[var(--color-text)] rounded-lg shadow-lg">
                <img
                  src={cert.logo}
                  alt={cert.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold mb-2">{cert.name}</h3>
                <p className="text-sm opacity-75">{cert.issuer}</p>
              </div>
            </div>
            
            {/* Back */}
            <div className="absolute inset-0 backface-hidden rotate-y-180">
              <div className="p-6 bg-[var(--color-bg)] border border-[var(--color-text)] rounded-lg shadow-lg h-full flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-4">{cert.name}</h3>
                <p className="text-sm mb-2">Issuer: {cert.issuer}</p>
                <p className="text-sm mb-4">Date: {cert.date}</p>
                <a
                  href="#"
                  className="text-[var(--color-accent)] hover:underline"
                >
                  View Certificate
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Certifications;