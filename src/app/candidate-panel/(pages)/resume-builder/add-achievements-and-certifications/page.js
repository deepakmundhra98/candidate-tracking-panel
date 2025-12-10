"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsTrash } from "react-icons/bs";
import { useRouter } from "next/navigation";

export default function AchievementsStep() {
  const router = useRouter();

  const [items, setItems] = useState([
    { id: Date.now(), type: "achievement", title: "", year: "", issuer: "", link: "" },
  ]);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("rb_achievements");
    if (raw) {
      try { setItems(JSON.parse(raw)); } catch {}
    }
  }, []);

  const handleChange = (id, field, value) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
    setErrors(prev => ({ ...prev, [`${id}-${field}`]: "" }));
  };

  const addItem = () => setItems(prev => [...prev, { id: Date.now(), type: "achievement", title: "", year: "", issuer: "", link: "" }]);

  const removeItem = (id) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const validate = () => {
    const temp = {};
    items.forEach(i => {
      if (!i.title.trim()) temp[`${i.id}-title`] = "Title required.";
      if (!i.year.trim()) temp[`${i.id}-year`] = "Year required.";
    });
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleNext = () => {
    if (!validate()) { setShake(true); setTimeout(()=>setShake(false),400); return; }
    localStorage.setItem("rb_achievements", JSON.stringify(items));
    router.push("/candidate-panel/resume-builder/add-professional-summary"); // or next step if different
  };

  const handleBack = () => {
    localStorage.setItem("rb_achievements", JSON.stringify(items));
    router.push("/candidate-panel/resume-builder/add-projects");
  };

  return (
    <div className="p-6 relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0f1124] via-[#15172e] to-[#090c1b]" />
      <div className="absolute top-20 left-20 w-80 h-80 bg-indigo-600/25 blur-[150px] rounded-full" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/25 blur-[170px] rounded-full" />

      <motion.div initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} transition={{duration:0.6}}
        className={`min-w-[900px] backdrop-blur-3xl bg-white/10 border border-white/20 shadow-xl rounded-3xl p-10 neon-card ${shake ? "animate-shake" : ""}`}>

        <h1 className="text-3xl font-semibold text-white text-center">Step 6: Achievements & Certifications</h1>
        <p className="text-gray-300 text-sm text-center mt-2 mb-8">Add awards, certifications or notable recognitions.</p>

        <div className="space-y-6">
          <AnimatePresence>
            {items.map(i => (
              <motion.div key={i.id} initial={{opacity:0,scale:0.95,y:12}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.9}}
                className="p-5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl relative">
                {items.length > 1 && (
                  <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.95}} onClick={()=>removeItem(i.id)}
                    className="absolute top-3 right-3 p-2 bg-red-500/20 border border-red-400/30 rounded-full text-red-300"><BsTrash /></motion.button>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-300 text-sm">Type</label>
                    <select value={i.type} onChange={(e)=>handleChange(i.id,"type",e.target.value)} className="w-full mt-2 px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-gray-100">
                      <option value="achievement">Achievement</option>
                      <option value="certification">Certification</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-gray-300 text-sm">Title</label>
                    <input value={i.title} onChange={(e)=>handleChange(i.id,"title",e.target.value)} className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100 ${errors[`${i.id}-title`] ? "border-red-400" : "border-white/20"}`} placeholder="Certified Kubernetes Administrator" />
                    {errors[`${i.id}-title`] && <p className="text-red-400 text-sm mt-1">{errors[`${i.id}-title`]}</p>}
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm">Year</label>
                    <input value={i.year} onChange={(e)=>handleChange(i.id,"year",e.target.value)} className={`w-full mt-2 px-4 py-3 bg-white/10 border rounded-xl text-gray-100 ${errors[`${i.id}-year`] ? "border-red-400" : "border-white/20"}`} placeholder="2024" />
                    {errors[`${i.id}-year`] && <p className="text-red-400 text-sm mt-1">{errors[`${i.id}-year`]}</p>}
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm">Issuer (optional)</label>
                    <input value={i.issuer} onChange={(e)=>handleChange(i.id,"issuer",e.target.value)} className="w-full mt-2 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-gray-100" placeholder="Coursera / Company" />
                  </div>

                  <div className="col-span-2">
                    <label className="text-gray-300 text-sm">Link (optional)</label>
                    <input value={i.link} onChange={(e)=>handleChange(i.id,"link",e.target.value)} className="w-full mt-2 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-gray-100" placeholder="https://..." />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex gap-4 justify-center">
          <button onClick={addItem} className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white">+ Add</button>
        </div>

        <div className="mt-8 flex justify-between">
          <button onClick={handleBack} className="px-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white">Back</button>
          <button onClick={handleNext} className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl">Next →</button>
        </div>

      </motion.div>

      <style>{`
        .neon-card { box-shadow: 0 0 40px rgba(139,92,246,0.25), inset 0 0 20px rgba(255,255,255,0.05); }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        @keyframes shake { 0%{transform:translateX(0)}25%{transform:translateX(-6px)}50%{transform:translateX(6px)}75%{transform:translateX(-4px)}100%{transform:translateX(0)} }
      `}</style>
    </div>
  );
}
