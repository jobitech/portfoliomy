import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  // Initialize EmailJS
  useEffect(() => {
    emailjs.init('NEgD3IDvT2fa9ootC');
  }, []);
  
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const templateParams = {
      to_email: 'jobinbabu161@gmail.com',
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
    };

    emailjs.send('service_we3byq7', 'template_0fpk4j8', templateParams)
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
        alert('Message sent successfully! I will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
      }, (error) => {
        console.log('Failed to send email.', error);
        alert('Failed to send message. Please try again.');
      });
  };

  return (
    <section id="contact" className="py-16 md:py-24 px-4 sm:px-8 md:px-12 relative z-10 bg-gradient-to-b from-zinc-950 to-black border-t border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50 -z-10"></div>
      <div className="max-w-6xl mx-auto relative">
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4">Let's Work <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Together</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex gap-4 sm:gap-6">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/20 border border-purple-500/40 flex items-center justify-center flex-shrink-0">
                <Mail className="text-purple-300 w-5 sm:w-6 h-5 sm:h-6" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-sm sm:text-base">Email</h3>
                <p className="text-gray-300 text-sm sm:text-base">jobinbabu161@gmail.com</p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                <Phone className="text-blue-300 w-5 sm:w-6 h-5 sm:h-6" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-sm sm:text-base">Phone</h3>
                <p className="text-gray-300 text-sm sm:text-base">+91 9953661792</p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-gradient-to-br from-purple-500/30 to-cyan-500/20 border border-purple-500/40 flex items-center justify-center flex-shrink-0">
                <MapPin className="text-purple-300 w-5 sm:w-6 h-5 sm:h-6" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-sm sm:text-base">Location</h3>
                <p className="text-gray-300 text-sm sm:text-base">Badarpur, New Delhi-44</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-white/15 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 focus:bg-white/25 transition-all text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-white/15 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:bg-white/25 transition-all text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows="5"
                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-white/15 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 focus:bg-white/25 transition-all resize-none text-sm sm:text-base"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Send size={16} className="sm:w-5 sm:h-5" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
