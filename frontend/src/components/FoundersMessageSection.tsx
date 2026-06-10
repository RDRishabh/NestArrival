"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function FoundersMessageSection() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7 }} 
          className="text-center"
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c2724] tracking-tight mb-3">For Immigrants, By Immigrants.</h2>
          <p className="text-[#8a7d6a] text-lg font-medium">A Platform Built From Real Relocation Struggles.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7, delay: 0.2 }} 
          className="bg-[#fdfbf7] rounded-3xl border border-[#eae1d3] p-8 sm:p-12 shadow-sm relative"
        >
          <div className="absolute top-8 left-8 text-[#cfa052]/20">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M14.017 21L16.41 14.286H11.532C11.532 12.046 12.87 11.233 14.524 10.952L15.358 10.826V5.414L14.492 5.485C10.024 5.86 7.973 8.358 7.973 12.657V21H14.017ZM24 21L26.393 14.286H21.515C21.515 12.046 22.853 11.233 24.507 10.952L25.341 10.826V5.414L24.475 5.485C20.007 5.86 17.956 8.358 17.956 12.657V21H24Z" transform="translate(-7.973 -5.414)"/></svg>
          </div>
          
          <div className="space-y-6 text-[#5c544d] text-sm sm:text-base leading-relaxed relative z-10 font-serif italic">
            <p>When I first moved abroad, I experienced the reality that many immigrants silently go through. Finding accommodation in a new country was not simple. I faced unanswered messages, uncertainty, fake listings, communication barriers, and the stress of trying to secure a safe place to live while being thousands of miles away from my destination.</p>
            
            <p>Over the next 4–5 years, while moving between provinces, cities, and even countries, I realized this problem was much bigger than just my personal experience. Millions of international students, workers, immigrants, and relocating families face the same struggle every single day. Most rental platforms are not designed for people moving internationally. Newcomers are often ignored simply because they do not yet have local history, references, or connections.</p>
            
            <p>That experience inspired me to build NestArrival. NestArrival was created to make relocation safer, simpler, and more trusted for people starting a new chapter abroad. Our goal is not only to help people find accommodation. Our goal is to help people feel secure during one of the biggest transitions of their lives.</p>
            
            <div className="pl-6 border-l-2 border-[#cfa052] my-6 py-2 not-italic">
              <p className="font-bold text-[#2c2724] mb-3">We want newcomers to feel:</p>
              <ul className="space-y-2 text-sm font-medium">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-[#cfa052]"/> Supported</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-[#cfa052]"/> Understood</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-[#cfa052]"/> Safe</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-[#cfa052]"/> Confident before they arrive</li>
              </ul>
            </div>
            
            <p>This platform is being built with real immigrant experiences at its foundation. Every feature, every connection, and every step of the process is designed around trust, transparency, and creating a better relocation journey.</p>
            
            <p>This is only the beginning. Our long-term vision is to build a globally connected accommodation ecosystem that helps people move across borders with confidence and peace of mind. No matter where someone comes from or where they are moving, finding a home should never feel impossible.</p>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-[#eae1d3] pt-8 gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-[#eae1d3] border-2 border-white shadow-md flex items-center justify-center shrink-0">
                <span className="text-[#cfa052] font-bold text-xl">RS</span>
              </div>
              <div>
                <p className="font-extrabold text-[#2c2724] text-lg">Royal Singh</p>
                <p className="text-[11px] text-[#8a7d6a] font-bold uppercase tracking-wider">Founder &amp; CEO, NestArrival</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[11px] text-[#8a7d6a] font-medium">Connect on LinkedIn</span>
              <a
                href="https://www.linkedin.com/in/royal-singh/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Royal Singh on LinkedIn"
                className="h-10 w-10 rounded-full bg-white border border-[#eae1d3] flex items-center justify-center text-[#8a7d6a] hover:text-[#0a66c2] hover:border-[#0a66c2] transition-colors shadow-sm cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0H5a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V5a5 5 0 0 0-5-5zM8 19H5V8h3v11zM6.5 6.73a1.77 1.77 0 1 1 0-3.54 1.77 1.77 0 0 1 0 3.54zM20 19h-3v-5.6c0-3.37-4-3.12-4 0V19h-3V8h3v1.77C14.4 7.46 20 7.3 20 12.7V19z" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
