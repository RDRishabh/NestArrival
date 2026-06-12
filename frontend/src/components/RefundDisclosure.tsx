"use client";

import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function RefundDisclosure() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="text-center max-w-2xl mx-auto border-t border-[#eae1d3] pt-12 text-xs"
    >
      <div className="inline-flex items-center justify-center rounded-full bg-[#eae1d3] border border-[#f4efe6] p-2.5 text-[#cfa052] mb-4 shadow-sm">
        <ShieldCheck className="h-5 w-5" />
      </div>
      <h3 className="font-bold text-[#2c2724] text-base">Automatic Refund Protection</h3>
      <p className="text-[#8a7d6a] mt-2 leading-relaxed">
        A refund is available if none of the verified owners you contacted reply to your messages within your active subscription period. A valid response means the verified owner replies to your message through the NestArrival chat within your active plan period. An automated reply or an out-of-office message does not count as a response. We review your message history and process it within 3 business days.
      </p>
    </motion.div>
  );
}
