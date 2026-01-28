import React from 'react';
import { Heart, BarChart2 } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t mt-auto" style={{ borderColor: 'var(--border-secondary)', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <BarChart2 size={12} className="text-white" />
              </div>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>TradeJournal</span>
            </div>
            <span>•</span>
            <span>© {currentYear}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart size={12} style={{ color: 'var(--accent-danger)' }} className="fill-current" /> by{' '}
              <span className="font-medium" style={{ color: 'var(--accent-primary)' }}>saturnsurfer</span>
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <a href="#" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
              Privacy
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
              Terms
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
