import React from "react";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 mt-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} VedSeva. All rights reserved.</p>
          <div className="text-slate-400 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <span className="mx-3">•</span>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <span className="mx-3">•</span>
            <a href="#" className="hover:text-white transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}