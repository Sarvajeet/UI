import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, TrendingUp, Zap } from 'lucide-react';

export default function DynamicLandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class WindStream {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.length = Math.random() * 100 + 50;
        this.speed = Math.random() * 2 + 1;
        this.angle = Math.random() * Math.PI / 4 - Math.PI / 8;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.thickness = Math.random() * 2 + 1;
        this.curve = Math.random() * 0.02 - 0.01;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.angle += this.curve;

        if (this.x > canvas.width + 100) {
          this.x = -100;
          this.y = Math.random() * canvas.height;
        }
        if (this.y > canvas.height + 100) {
          this.y = -100;
        }
        if (this.y < -100) {
          this.y = canvas.height + 100;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        
        const segments = 20;
        for (let i = 0; i < segments; i++) {
          const progress = i / segments;
          const x = this.x + Math.cos(this.angle) * this.length * progress;
          const y = this.y + Math.sin(this.angle + progress * Math.PI * 0.3) * this.length * progress;
          ctx.lineTo(x, y);
        }

        const gradient = ctx.createLinearGradient(
          this.x, this.y,
          this.x + Math.cos(this.angle) * this.length,
          this.y + Math.sin(this.angle) * this.length
        );
        
        gradient.addColorStop(0, `rgba(139, 92, 246, 0)`);
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(168, 85, 247, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }

    const streams = Array.from({ length: 80 }, () => new WindStream());

    let animationFrame;

    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      streams.forEach(stream => {
        stream.update();
        stream.draw();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden relative">
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'white' }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-5xl w-full text-center space-y-8 animate-fade-in">
          {/* Floating badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 animate-bounce-slow">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Discover Something Amazing</span>
          </div>

          {/* Main heading */}
          <h1 className="text-6xl md:text-8xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
              Transform Your
            </span>
            <br />
            <span className="text-gray-900">Digital Experience</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Explore limitless possibilities with our cutting-edge platform. 
            Search, discover, and create like never before.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto mt-12">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
              <div className="relative flex items-center bg-white rounded-2xl border-2 border-purple-200 shadow-xl overflow-hidden group-hover:border-purple-400 transition-all duration-300">
                <Search className="w-6 h-6 ml-6 text-gray-400 group-hover:text-purple-600 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                  placeholder="What are you looking for today?"
                  className="flex-1 px-6 py-5 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-lg"
                />
                <button
                  onClick={handleSearch}
                  className="m-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Instant results at your fingertips' },
              { icon: TrendingUp, title: 'Trending Topics', desc: 'Stay ahead of the curve' },
              { icon: Sparkles, title: 'AI Powered', desc: 'Smart recommendations just for you' }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-purple-100 hover:border-purple-300 transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-purple-200/50"
              >
                <feature.icon className="w-10 h-10 mb-4 text-purple-600 group-hover:text-purple-700 transition-colors transform group-hover:rotate-12 duration-300" />
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce 3s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}