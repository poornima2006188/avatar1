import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MessageCircle, Sparkles, Zap, Shield, ArrowRight, Bot, Mic, Palette } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()
  const { enableGuestMode } = useAuth()

  const handleGuestMode = () => {
    enableGuestMode()
    navigate('/chat')
  }

  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: 'AI Avatar Assistant',
      description: 'Interact with a customizable 3D avatar that responds with natural expressions and lip-sync.',
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: 'Voice Enabled',
      description: 'Speak naturally with speech synthesis and recognition for hands-free conversations.',
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'Fully Customizable',
      description: 'Personalize your avatar with different hairstyles, colors, accessories, and expressions.',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Multi-AI Powered',
      description: 'Powered by Claude, OpenAI, and Gemini with intelligent fallback for reliability.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Real-time responses with streaming and optimized performance.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Private',
      description: 'Your conversations are encrypted and your data is never shared.',
    },
  ]

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-gradient" />
        <nav className="nav">
          <div className="logo">
            <div className="logo-icon">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span>NeuraSync</span>
          </div>
          <div className="nav-links">
            <button onClick={() => navigate('/login')} className="nav-link">
              Sign In
            </button>
            <button onClick={() => navigate('/login?tab=register')} className="nav-btn">
              Get Started
            </button>
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Avatar Chatbot</span>
          </div>
          <h1 className="hero-title">
            Meet Your
            <br />
            <span className="gradient-text">AI Avatar Assistant</span>
          </h1>
          <p className="hero-description">
            Experience the future of conversation with Ava, your customizable AI companion.
            Natural dialogue, expressive avatars, and seamless voice interaction.
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/login?tab=register')} className="btn-primary">
              Start Chatting
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/login')} className="btn-secondary">
              Sign In
            </button>
          </div>

          {/* Skip Login */}
          <button onClick={handleGuestMode} className="skip-login-btn">
            Continue as Guest →
          </button>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">3</span>
              <span className="stat-label">AI Models</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">∞</span>
              <span className="stat-label">Conversations</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">100%</span>
              <span className="stat-label">Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">
            Everything you need for an immersive AI conversation experience
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Meet Ava?</h2>
          <p className="cta-description">
            Join thousands of users already experiencing the future of AI conversation.
          </p>
          <button onClick={() => navigate('/login?tab=register')} className="btn-primary btn-large">
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span>NeuraSync</span>
            </div>
            <p className="footer-tagline">Your AI Avatar Assistant</p>
          </div>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Terms</a>
            <a href="#" className="footer-link">Contact</a>
          </div>
        </div>
        <div className="footer-copyright">
          © 2025 NeuraSync. All rights reserved.
        </div>
      </footer>

      <style>{`
        .landing-page {
          min-height: 100vh;
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .hero-gradient {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 50% 120%, rgba(139, 92, 246, 0.1), transparent);
          pointer-events: none;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 48px;
          z-index: 10;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: var(--accent-gradient);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-link {
          padding: 10px 20px;
          color: var(--text-secondary);
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: var(--text-primary);
        }

        .nav-btn {
          padding: 10px 24px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-btn:hover {
          background: var(--accent);
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .hero-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 48px;
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--bg-tertiary);
          border-radius: 99px;
          font-size: 14px;
          font-weight: 500;
          color: var(--accent);
          margin-bottom: 32px;
        }

        .hero-title {
          font-size: 64px;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }

        .gradient-text {
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 18px;
          color: var(--text-secondary);
          max-width: 600px;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .hero-buttons {
          display: flex;
          gap: 16px;
          margin-bottom: 64px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          background: var(--accent-gradient);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
        }

        .btn-secondary {
          padding: 16px 32px;
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border);
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: var(--bg-tertiary);
          border-color: var(--border-strong);
        }

        .skip-login-btn {
          margin-top: 16px;
          padding: 12px 24px;
          background: transparent;
          color: var(--text-muted);
          border: 1px dashed var(--border-strong);
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .skip-login-btn:hover {
          color: var(--accent);
          border-color: var(--accent);
          background: rgba(59, 130, 246, 0.05);
        }

        .btn-large {
          padding: 18px 40px;
          font-size: 18px;
        }

        .hero-stats {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: var(--accent);
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-muted);
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--border);
        }

        .features {
          padding: 120px 48px;
          background: var(--bg-secondary);
        }

        .section-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 64px;
        }

        .section-title {
          font-size: 40px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .section-subtitle {
          font-size: 18px;
          color: var(--text-secondary);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          padding: 32px;
          background: var(--bg-primary);
          border-radius: 20px;
          border: 1px solid var(--border);
          transition: all 0.2s;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          background: var(--accent);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 20px;
        }

        .feature-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .feature-description {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .cta {
          padding: 120px 48px;
          text-align: center;
          background:
            radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59, 130, 246, 0.08), transparent);
        }

        .cta-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: 40px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .cta-description {
          font-size: 18px;
          color: var(--text-secondary);
          margin-bottom: 32px;
        }

        .footer {
          padding: 48px;
          background: var(--bg-primary);
          border-top: 1px solid var(--border);
        }

        .footer-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto 24px;
        }

        .footer-tagline {
          font-size: 14px;
          color: var(--text-muted);
          margin-top: 8px;
        }

        .footer-links {
          display: flex;
          gap: 32px;
        }

        .footer-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }

        .footer-link:hover {
          color: var(--text-primary);
        }

        .footer-copyright {
          text-align: center;
          font-size: 14px;
          color: var(--text-muted);
          padding-top: 24px;
          border-top: 1px solid var(--border);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 40px;
          }

          .hero-buttons {
            flex-direction: column;
          }

          .nav {
            padding: 16px 24px;
          }

          .hero-content {
            padding: 24px;
          }

          .features {
            padding: 60px 24px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .footer-content {
            flex-direction: column;
            gap: 24px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  )
}
