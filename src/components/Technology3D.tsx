import React, { useState } from 'react';
import { 
  Sliders, 
  Shield, 
  Compass, 
  Eye, 
  Clock, 
  Cpu, 
  Layers, 
  Maximize2,
  Box
} from 'lucide-react';
import { EXPLODED_LAYERS } from '../data/chronovaData';
import type { ExplodedLayer } from '../data/chronovaData';
import { ThreeWatchStudio } from './ThreeWatchStudio';
import { audioEngine } from '../utils/audioEngine';

export const Technology3D: React.FC = () => {
  const [separation, setSeparation] = useState(65); // 0 (assembled) to 100 (fully exploded)
  const [selectedLayer, setSelectedLayer] = useState<ExplodedLayer>(EXPLODED_LAYERS[4]); // default automatic movement
  const [viewMode, setViewMode] = useState<'exploded' | '3d-canvas'>('exploded');

  const getLayerIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <Shield className="w-4 h-4" />;
      case 'Compass': return <Compass className="w-4 h-4" />;
      case 'Eye': return <Eye className="w-4 h-4" />;
      case 'Clock': return <Clock className="w-4 h-4" />;
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'Layers': return <Layers className="w-4 h-4" />;
      default: return <Maximize2 className="w-4 h-4" />;
    }
  };

  return (
    <section id="technology" className="relative w-full py-24 px-6 sm:px-10 bg-[#05070a] select-none">
      
      {/* Ambient Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-chronova-gold/[0.03] blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-chronova-gold font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>CALIBRE ENGINEERING & CAD ARCHITECTURE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
            PRECISION IN EVERY LAYER
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-light max-w-xl mx-auto leading-relaxed">
            Deconstructed architectural view of our medical-grade 316L monocoque case, 
            calibre CN-8800 column-wheel chronograph, and hand-chamfered sapphire crystal.
          </p>

          {/* Mode Switcher: Exploded View vs 3D Canvas */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => {
                audioEngine.playHapticClick();
                setViewMode('exploded');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all flex items-center gap-2 ${
                viewMode === 'exploded'
                  ? 'bg-chronova-gold text-slate-950 shadow-gold-glow'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Exploded Layer View</span>
            </button>

            <button
              onClick={() => {
                audioEngine.playHapticClick();
                setViewMode('3d-canvas');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all flex items-center gap-2 ${
                viewMode === '3d-canvas'
                  ? 'bg-chronova-gold text-slate-950 shadow-gold-glow'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Interactive 3D Studio</span>
            </button>
          </div>
        </div>

        {/* Dynamic Display Area */}
        {viewMode === '3d-canvas' ? (
          <ThreeWatchStudio />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left/Center Column: Interactive Exploded 3D Layer Stack */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center relative p-6 sm:p-10 rounded-3xl bg-chronova-card border border-white/[0.08] shadow-luxury-card min-h-[550px]">
              
              {/* Top Slider Control */}
              <div className="w-full flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300">
                  <Sliders className="w-4 h-4 text-chronova-gold" />
                  <span>Layer Separation</span>
                </div>
                <div className="flex items-center gap-3 w-48">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={separation}
                    onChange={(e) => {
                      audioEngine.playSingleTick();
                      setSeparation(Number(e.target.value));
                    }}
                    className="w-full accent-chronova-gold cursor-pointer"
                  />
                  <span className="text-xs font-mono text-chronova-gold font-bold">{separation}%</span>
                </div>
              </div>

              {/* Exploded Visual Stack */}
              <div className="relative w-full max-w-md h-[400px] flex items-center justify-center perspective-container">
                {EXPLODED_LAYERS.map((layer, index) => {
                  const total = EXPLODED_LAYERS.length;
                  const offsetMultiplier = (index - (total - 1) / 2);
                  const offsetY = offsetMultiplier * (separation * 0.75);
                  const isSelected = selectedLayer.id === layer.id;

                  return (
                    <div
                      key={layer.id}
                      onClick={() => {
                        audioEngine.playHapticClick();
                        setSelectedLayer(layer);
                      }}
                      style={{
                        transform: `translateY(${offsetY}px) rotateX(48deg) rotateZ(-25deg) scale(${isSelected ? 1.08 : 1})`,
                        zIndex: 20 - index,
                      }}
                      className={`absolute w-64 sm:w-72 h-32 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between px-6 backdrop-blur-md ${
                        isSelected
                          ? 'bg-chronova-gold/20 border-chronova-gold shadow-gold-glow scale-105'
                          : 'bg-black/60 border-white/10 hover:border-white/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-chronova-gold text-slate-950' : 'bg-white/5 text-chronova-gold'}`}>
                          {getLayerIcon(layer.iconName)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white uppercase tracking-wider">
                            {layer.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {layer.role}
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-chronova-gold font-mono uppercase">
                        L0{index + 1}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Exploded Hint */}
              <div className="w-full flex items-center justify-between text-[11px] text-slate-400 font-mono pt-4 border-t border-white/[0.06] mt-4">
                <span>Total 288 Micro Components</span>
                <span className="text-chronova-gold">Click any tier to inspect specs</span>
              </div>

            </div>

            {/* Right Column: Detailed Layer Inspector Card */}
            <div className="lg:col-span-5 p-8 rounded-3xl bg-gradient-to-br from-[#0c121e] to-[#06090e] border border-chronova-border shadow-luxury-card space-y-6">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-chronova-gold/15 text-chronova-gold">
                    {getLayerIcon(selectedLayer.iconName)}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-chronova-gold">
                      COMPONENT DOSSIER
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white mt-0.5">
                      {selectedLayer.name}
                    </h3>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] text-slate-300 font-mono">
                  {selectedLayer.role}
                </div>
              </div>

              <p className="text-sm text-slate-300 font-light leading-relaxed">
                {selectedLayer.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Material Composition</div>
                  <div className="text-xs font-semibold text-white mt-1">{selectedLayer.material}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Engineering Tolerance</div>
                  <div className="text-xs font-semibold text-chronova-gold mt-1">{selectedLayer.tolerance}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                <span>ISO 1413 Shock Resistant</span>
                <span className="text-emerald-400 font-mono">Chronometer Passed ✓</span>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
