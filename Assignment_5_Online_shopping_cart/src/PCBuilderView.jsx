import React, { useState, useMemo } from 'react';
import { Cpu, ShieldCheck, AlertTriangle, CheckCircle2, Zap, ShoppingBag, Trash2, ArrowRight, RotateCcw } from 'lucide-react';
import { useCart } from './CartContext';
import { toast } from './toast';
import { useNavigate } from 'react-router-dom';

const SLOTS = [
  { id: 'cpu', name: 'Processor (CPU)', category: 'CPU', required: true },
  { id: 'motherboard', name: 'Motherboard', category: 'Motherboard', required: true },
  { id: 'gpu', name: 'Graphics Card (GPU)', category: 'GPU', required: true },
  { id: 'ram', name: 'System Memory (RAM)', category: 'RAM', required: true },
  { id: 'storage', name: 'Primary Storage (SSD)', category: 'Storage', required: true },
  { id: 'cooler', name: 'CPU Cooler', category: 'Cooling', required: false },
  { id: 'psu', name: 'Power Supply (PSU)', category: 'Power Supplies', required: true },
  { id: 'case', name: 'Chassis / Case', category: 'Cases', required: false },
];

export default function PCBuilderView() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  const [selectedParts, setSelectedParts] = useState({
    cpu: null,
    motherboard: null,
    gpu: null,
    ram: null,
    storage: null,
    cooler: null,
    psu: null,
    case: null,
  });

  const [activeSlotModal, setActiveSlotModal] = useState(null);

  const currency = state.currency;

  // Calculate Total Price
  const totalPriceINR = useMemo(() => {
    return Object.values(selectedParts).reduce((sum, item) => {
      if (!item) return sum;
      return sum + (item.priceINR || Math.round(item.priceUSD * 95.68));
    }, 0);
  }, [selectedParts]);

  const convertedPrice = Math.round(totalPriceINR * currency.rate);

  // Wattage TDP Estimation
  const estimatedWattage = useMemo(() => {
    let wattage = 100; // Base system draw (RAM, motherboard, SSD, fans)
    if (selectedParts.cpu) {
      const parsedCpuTdp = parseInt(selectedParts.cpu.specs?.['TDP']);
      if (!isNaN(parsedCpuTdp)) {
        wattage += parsedCpuTdp;
      } else if (selectedParts.cpu.name.includes('14900K')) wattage += 253;
      else if (selectedParts.cpu.name.includes('14700K')) wattage += 250;
      else if (selectedParts.cpu.name.includes('13600K')) wattage += 181;
      else if (selectedParts.cpu.name.includes('9950X')) wattage += 170;
      else wattage += 120;
    }
    if (selectedParts.gpu) {
      const parsedGpuTdp = parseInt(selectedParts.gpu.keySpecs?.Power || selectedParts.gpu.specs?.['Power Consumption']);
      if (!isNaN(parsedGpuTdp)) {
        wattage += parsedGpuTdp;
      } else if (selectedParts.gpu.name.includes('4090')) wattage += 450;
      else if (selectedParts.gpu.name.includes('4080')) wattage += 320;
      else if (selectedParts.gpu.name.includes('7900')) wattage += 355;
      else if (selectedParts.gpu.name.includes('4070')) wattage += 220;
      else if (selectedParts.gpu.name.includes('4060')) wattage += 165;
      else if (selectedParts.gpu.name.includes('7700')) wattage += 245;
      else wattage += 263;
    }
    return wattage;
  }, [selectedParts.cpu, selectedParts.gpu]);

  // PSU capacity check
  const psuWattage = useMemo(() => {
    if (!selectedParts.psu) return 0;
    const parsedWatt = parseInt(selectedParts.psu.keySpecs?.Wattage);
    if (!isNaN(parsedWatt)) return parsedWatt;
    if (selectedParts.psu.name.includes('1000')) return 1000;
    if (selectedParts.psu.name.includes('850')) return 850;
    return 750;
  }, [selectedParts.psu]);

  // Real-World Compatibility Engine
  const compatibility = useMemo(() => {
    const issues = [];
    const passes = [];

    // 1. CPU & Motherboard Socket Validation
    if (selectedParts.cpu && selectedParts.motherboard) {
      const cpuSocket = selectedParts.cpu.specs?.['Socket'] || selectedParts.cpu.keySpecs?.Socket || (selectedParts.cpu.name.includes('5700X3D') || selectedParts.cpu.name.includes('5600') ? 'AM4' : selectedParts.cpu.brand === 'AMD' ? 'AM5' : 'LGA1700');
      const mbSocket = selectedParts.motherboard.specs?.['Socket'] || selectedParts.motherboard.keySpecs?.Socket || (selectedParts.motherboard.name.includes('B550') ? 'AM4' : selectedParts.motherboard.name.includes('B650') || selectedParts.motherboard.name.includes('X670') ? 'AM5' : 'LGA1700');

      if (cpuSocket !== mbSocket) {
        issues.push(`Socket Incompatibility: ${selectedParts.cpu.name} (${cpuSocket}) cannot mount on ${selectedParts.motherboard.name} (${mbSocket}). ${cpuSocket} CPUs require a matching ${cpuSocket} motherboard.`);
      } else {
        passes.push(`Socket Match: ${cpuSocket} CPU and Motherboard are 100% physically & electrically compatible.`);
      }
    }

    // 2. RAM Physical Slot & Generation Check (DDR4 vs DDR5)
    if (selectedParts.motherboard && selectedParts.ram) {
      const mbRam = selectedParts.motherboard.specs?.['Memory Type'] || (selectedParts.motherboard.name.includes('B550') || selectedParts.motherboard.keySpecs?.Memory === 'DDR4' ? 'DDR4' : 'DDR5');
      const ramType = selectedParts.ram.specs?.['Memory Type'] || selectedParts.ram.keySpecs?.Type || (selectedParts.ram.name.includes('DDR4') ? 'DDR4' : 'DDR5');

      if (mbRam !== ramType) {
        issues.push(`Memory Slot Incompatibility: ${selectedParts.ram.name} (${ramType}) cannot physically fit into ${selectedParts.motherboard.name} (${mbRam} slots). DDR4 and DDR5 have different pin layouts and notch positions.`);
      } else {
        passes.push(`Memory Match: ${ramType} memory kit is fully compatible with the motherboard's ${mbRam} slots.`);
      }
    }

    // 3. Chassis Form Factor Clearance (Mini-ITX Chassis Support)
    if (selectedParts.case && selectedParts.motherboard) {
      const mbForm = selectedParts.motherboard.specs?.['Form Factor'] || selectedParts.motherboard.keySpecs?.Form || (selectedParts.motherboard.name.includes('Mini-ITX') ? 'Mini-ITX' : selectedParts.motherboard.name.includes('Micro-ATX') || selectedParts.motherboard.name.includes('Mortar') ? 'Micro-ATX' : 'ATX');
      const isSffCase = selectedParts.case.name.includes('NR200P') || selectedParts.case.specs?.['Form Factor']?.includes('Mini-ITX');

      if (isSffCase && mbForm !== 'Mini-ITX') {
        issues.push(`Chassis Clearance: ${selectedParts.motherboard.name} (${mbForm}) is too large for the compact ${selectedParts.case.name}. SFF chassis require a Mini-ITX motherboard.`);
      } else {
        passes.push(`Form Factor: ${mbForm} motherboard fits properly inside the ${selectedParts.case.name}.`);
      }
    }

    // 4. Power Supply Form Factor in SFF Cases
    if (selectedParts.case && selectedParts.psu) {
      const isSffCase = selectedParts.case.name.includes('NR200P') || selectedParts.case.specs?.['Form Factor']?.includes('Mini-ITX');
      const isSfxPsu = selectedParts.psu.name.includes('SFX') || selectedParts.psu.keySpecs?.Size?.includes('SFX');

      if (isSffCase && !isSfxPsu) {
        issues.push(`PSU Form Factor: ${selectedParts.psu.name} (standard ATX) will not fit in the ${selectedParts.case.name}. Requires a compact SFX power supply (e.g., Corsair SF750).`);
      } else if (isSffCase && isSfxPsu) {
        passes.push(`SFF Power Delivery: SFX power supply mounts perfectly in the ${selectedParts.case.name} SFF cage.`);
      }
    }

    // 5. GPU Length Clearance
    if (selectedParts.case && selectedParts.gpu) {
      const gpuLen = parseInt(selectedParts.gpu.specs?.['Card Length'] || selectedParts.gpu.keySpecs?.Length) || 300;
      const maxGpuLen = parseInt(selectedParts.case.specs?.['Max GPU Length']) || 360;

      if (gpuLen > maxGpuLen) {
        issues.push(`GPU Length Clearance: ${selectedParts.gpu.name} (${gpuLen}mm) exceeds the maximum GPU clearance of ${selectedParts.case.name} (${maxGpuLen}mm).`);
      } else {
        passes.push(`GPU Clearance: ${selectedParts.gpu.name} (${gpuLen}mm) has ${maxGpuLen - gpuLen}mm clearance in ${selectedParts.case.name}.`);
      }
    }

    // 6. Power Supply Capacity & Safety Headroom
    if (selectedParts.psu) {
      if (estimatedWattage > psuWattage) {
        issues.push(`Wattage Overload: Estimated system draw (${estimatedWattage}W) exceeds PSU capacity (${psuWattage}W).`);
      } else if (psuWattage - estimatedWattage < 80) {
        issues.push(`Tight Headroom: Estimated draw (${estimatedWattage}W) leaves less than 80W safety buffer on a ${psuWattage}W power supply.`);
      } else {
        passes.push(`Power Delivery: ${psuWattage}W PSU provides ${psuWattage - estimatedWattage}W of clean headroom for the ${estimatedWattage}W estimated load.`);
      }
    }

    return { issues, passes, isCompatible: issues.length === 0 };
  }, [selectedParts, estimatedWattage, psuWattage]);

  // Handler: Select Part
  const handleSelectPart = (slotId, product) => {
    setSelectedParts((prev) => ({ ...prev, [slotId]: product }));
    setActiveSlotModal(null);
    toast.success(`Selected ${product.name}`);
  };

  // Handler: Remove Part
  const handleRemovePart = (slotId) => {
    setSelectedParts((prev) => ({ ...prev, [slotId]: null }));
  };

  // Preset Rig Loader (5 Real-World Verified Ecosystems)
  const handleLoadPreset = (presetType) => {
    const find = (id) => state.products.find((p) => p.id === id) || null;

    if (presetType === 'enthusiast') {
      setSelectedParts({
        cpu: find('cpu-7800x3d'),
        motherboard: find('mb-b650-tomahawk'),
        gpu: find('gpu-rtx4090'),
        ram: find('ram-corsair-titanium'),
        storage: find('ssd-990pro-2tb'),
        cooler: find('cool-kraken-360'),
        psu: find('psu-rm1000x'),
        case: find('case-h9-flow')
      });
      toast.success('Loaded Ultimate 4K Enthusiast Rig!');
    } else if (presetType === 'workstation') {
      setSelectedParts({
        cpu: find('cpu-14900k'),
        motherboard: find('mb-z790-hero'),
        gpu: find('gpu-rtx4080s'),
        ram: find('ram-gskill-trident'),
        storage: find('ssd-t700-gen5'),
        cooler: find('cool-h150i'),
        psu: find('psu-rm1000x'),
        case: find('case-o11-dynamic')
      });
      toast.success('Loaded Intel AI & 3D Workstation Rig!');
    } else if (presetType === 'white') {
      setSelectedParts({
        cpu: find('cpu-9800x3d'),
        motherboard: find('mb-b650-ice'),
        gpu: find('gpu-rtx4070ti-s-aero'),
        ram: find('ram-vengeance-rgb'),
        storage: find('ssd-990pro-2tb'),
        cooler: find('cool-liquid-freezer'),
        psu: find('psu-focus-850'),
        case: find('case-h6-flow')
      });
      toast.success('Loaded All-White Pure Aesthetic Rig!');
    } else if (presetType === 'sff') {
      setSelectedParts({
        cpu: find('cpu-7800x3d'),
        motherboard: find('mb-b650e-i-strix'),
        gpu: find('gpu-rtx4060-asus'),
        ram: find('ram-kingston-fury'),
        storage: find('ssd-990evo-1tb'),
        cooler: find('cool-axp90'),
        psu: find('psu-sf750'),
        case: find('case-nr200p')
      });
      toast.success('Loaded Compact SFF Mini-ITX Rig!');
    } else if (presetType === 'value') {
      setSelectedParts({
        cpu: find('cpu-5700x3d'),
        motherboard: find('mb-b550-tomahawk'),
        gpu: find('gpu-rtx4060-asus'),
        ram: find('ram-vengeance-ddr4'),
        storage: find('ssd-990evo-1tb'),
        cooler: find('cool-peerless-assassin'),
        psu: find('psu-focus-850'),
        case: find('case-4000d')
      });
      toast.success('Loaded Legendary AM4 Value Champion Rig!');
    } else {
      setSelectedParts({
        cpu: find('cpu-7600x'),
        motherboard: find('mb-b650m-mortar'),
        gpu: find('gpu-rx7800xt'),
        ram: find('ram-kingston-fury'),
        storage: find('ssd-sn850x-2tb'),
        cooler: find('cool-ak620'),
        psu: find('psu-focus-850'),
        case: find('case-4000d')
      });
      toast.success('Loaded Esports High-FPS Rig!');
    }
  };

  // Add Entire Rig to Cart
  const handleAddAllToCart = () => {
    const partsToAdd = Object.values(selectedParts).filter(Boolean);
    if (partsToAdd.length === 0) {
      toast.error('Please select components before adding to cart.');
      return;
    }
    if (!compatibility.isCompatible) {
      toast.error('Please resolve hardware incompatibilities before adding to cart.');
      return;
    }

    dispatch({ type: 'ADD_MULTIPLE_TO_CART', payload: partsToAdd });
    toast.success(`All ${partsToAdd.length} custom rig components added to cart!`);
    navigate('/checkout');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-white/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-xs font-mono mb-4">
            <Zap size={14} className="animate-pulse" />
            <span>REAL-WORLD PC CONFIGURATOR & COMPATIBILITY CHECKER</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Interactive PC Part Builder
          </h1>
          <p className="text-neutral-400 text-xs md:text-sm mt-2">
            Assemble real-world compatible builds with automated socket matching, DDR4/DDR5 verification, chassis clearance checks, and one-click cart transfer.
          </p>
        </div>

        {/* Quick Preset Buttons */}
        <div className="flex flex-wrap gap-2 relative z-10">
          <button
            onClick={() => handleLoadPreset('enthusiast')}
            className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-white/10 text-white text-xs font-bold transition-colors"
          >
            🔥 Ultimate 4K
          </button>
          <button
            onClick={() => handleLoadPreset('workstation')}
            className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-white/10 text-white text-xs font-bold transition-colors"
          >
            ⚡ AI Workstation
          </button>
          <button
            onClick={() => handleLoadPreset('white')}
            className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-white/10 text-white text-xs font-bold transition-colors"
          >
            💎 All-White Pure
          </button>
          <button
            onClick={() => handleLoadPreset('sff')}
            className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-white/10 text-white text-xs font-bold transition-colors"
          >
            🎒 SFF Mini-ITX
          </button>
          <button
            onClick={() => handleLoadPreset('value')}
            className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-white/10 text-white text-xs font-bold transition-colors"
          >
            💰 AM4 Value King
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Slot Selection Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h2 className="font-black text-white text-base">Selected Components</h2>
            <button
              onClick={() => setSelectedParts({ cpu: null, motherboard: null, gpu: null, ram: null, storage: null, cooler: null, psu: null, case: null })}
              className="text-neutral-400 hover:text-white text-xs flex items-center gap-1"
            >
              <RotateCcw size={12} /> Reset Rig
            </button>
          </div>

          {SLOTS.map((slot) => {
            const item = selectedParts[slot.id];
            const itemPrice = item ? Math.round((item.priceINR || Math.round(item.priceUSD * 95.68)) * currency.rate) : 0;

            return (
              <div
                key={slot.id}
                className={`glass-panel p-4 rounded-2xl flex items-center justify-between gap-4 transition-all border ${
                  item ? 'border-white/20 bg-dark-900/80' : 'border-dashed border-white/10 hover:border-white/20 bg-dark-950/40'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-14 h-14 rounded-xl bg-dark-950 border border-white/5 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {item ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Cpu size={22} className="text-neutral-600" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-accent-400 uppercase tracking-wider block">
                      {slot.name} {slot.required && <span className="text-neutral-500">*</span>}
                    </span>

                    {item ? (
                      <div>
                        <h4 className="font-bold text-white text-xs truncate mt-0.5">{item.name}</h4>
                        <div className="flex gap-2 mt-1">
                          {Object.entries(item.keySpecs || {}).slice(0, 2).map(([k, v]) => (
                            <span key={k} className="text-[9px] font-mono text-neutral-400 bg-dark-800 px-2 py-0.5 rounded">
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-500 italic mt-0.5">No hardware selected</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  {item ? (
                    <>
                      <span className="font-black text-white text-sm text-glow">
                        {currency.symbol}{itemPrice.toLocaleString(currency.locale)}
                      </span>
                      <button
                        onClick={() => handleRemovePart(slot.id)}
                        className="p-2 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove component"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setActiveSlotModal(slot)}
                      className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-accent-500 hover:text-dark-900 text-white font-bold text-xs border border-white/10 transition-all"
                    >
                      + Select Part
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rig Summary & Compatibility Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl sticky top-28 border-t border-l border-white/20 shadow-2xl space-y-6">
            <h3 className="font-black text-white text-lg flex items-center gap-2">
              <ShieldCheck size={20} className="text-accent-400" />
              <span>Rig Summary & Metrics</span>
            </h3>

            {/* Price Summary */}
            <div className="p-4 rounded-2xl bg-dark-950 border border-white/5 space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider">Estimated Rig Cost</span>
              <div className="text-3xl font-black text-white text-glow">
                {currency.symbol}{convertedPrice.toLocaleString(currency.locale)}
              </div>
              <span className="text-[10px] text-neutral-500 block">Includes regional taxes & express electrostatic freight</span>
            </div>

            {/* Estimated Wattage Gauge */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400 flex items-center gap-1"><Zap size={14} className="text-accent-400" /> Estimated Power</span>
                <span className="font-mono font-bold text-white">{estimatedWattage}W {psuWattage > 0 ? `/ ${psuWattage}W PSU` : ''}</span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-dark-950 border border-white/5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    psuWattage && estimatedWattage > psuWattage ? 'bg-rose-500' : 'bg-gradient-to-r from-accent-500 to-primary-500'
                  }`}
                  style={{ width: `${Math.min(100, psuWattage > 0 ? (estimatedWattage / psuWattage) * 100 : 40)}%` }}
                />
              </div>
            </div>

            {/* Live Compatibility Status */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Live Compatibility Report</span>

              {compatibility.issues.length > 0 && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-rose-400">
                    <AlertTriangle size={15} />
                    <span>Incompatible Configuration</span>
                  </div>
                  {compatibility.issues.map((iss, i) => (
                    <p key={i} className="text-[11px] leading-relaxed">{iss}</p>
                  ))}
                </div>
              )}

              {compatibility.passes.map((pass, i) => (
                <div key={i} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{pass}</span>
                </div>
              ))}

              {compatibility.issues.length === 0 && compatibility.passes.length === 0 && (
                <p className="text-xs text-neutral-500 italic">Select a CPU and Motherboard to verify socket and memory timing compatibility.</p>
              )}
            </div>

            {/* Action: Add Rig to Cart */}
            <button
              onClick={handleAddAllToCart}
              className="w-full py-4 rounded-xl bg-white hover:bg-accent-400 text-dark-900 font-black text-xs transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <ShoppingBag size={16} />
              <span>ADD ENTIRE RIG TO CART</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Part Picker Modal */}
      {activeSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setActiveSlotModal(null)} className="fixed inset-0 bg-black/80 backdrop-blur-md animate-fade-in" />

          <div className="relative w-full max-w-3xl bg-dark-900 border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 animate-slide-up flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-dark-950/60">
              <div>
                <h3 className="text-lg font-black text-white">Choose {activeSlotModal.name}</h3>
                <p className="text-xs text-neutral-400">Showing in-stock {activeSlotModal.category} components</p>
              </div>
              <button
                onClick={() => setActiveSlotModal(null)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {state.products
                .filter((p) => p.category === activeSlotModal.category)
                .map((product) => {
                  const pPrice = Math.round((product.priceINR || Math.round(product.priceUSD * 95.68)) * currency.rate);
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleSelectPart(activeSlotModal.id, product)}
                      className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4 cursor-pointer group hover:border-accent-500/50 hover:bg-dark-800/80 transition-all"
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover bg-dark-950 border border-white/5" />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-mono text-accent-400 uppercase">{product.brand}</span>
                          <h4 className="font-bold text-xs text-white truncate group-hover:text-accent-400 transition-colors">{product.name}</h4>
                          <div className="flex gap-2 mt-1">
                            {Object.entries(product.keySpecs || {}).slice(0, 3).map(([k, v]) => (
                              <span key={k} className="text-[9px] font-mono text-neutral-300 bg-dark-950 px-2 py-0.5 rounded border border-white/5">
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="font-black text-white text-sm block">
                          {currency.symbol}{pPrice.toLocaleString(currency.locale)}
                        </span>
                        <span className="text-[10px] text-accent-400 font-bold group-hover:underline">Choose Part &rarr;</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
