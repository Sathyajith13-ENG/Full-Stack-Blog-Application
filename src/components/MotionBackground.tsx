import React from "react";

export default function MotionBackground() {
  return (
    <div className="motion-bg-container" aria-hidden="true">
      {/* Slow floating generative texture & aesthetic ambient image */}
      <div className="motion-bg-layer" />

      {/* Cyber/clean aesthetic subtle grid */}
      <div className="motion-bg-grid" />

      {/* Glowing floating orbs in Lime Green & Soft White hues */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />
      <div className="floating-orb floating-orb-3" />
    </div>
  );
}
