"use client"

import { MeshGradient, PaperTexture } from "@paper-design/shaders-react"

export default function BackgroundPaperShadersDemo() {
  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <MeshGradient
        className="w-full h-full absolute inset-0"
        colors={["#101010", "#2b2b2b", "#5e5e5e", "#1a1a1a"]}
        speed={0.16}
        distortion={0.32}
        swirl={0.08}
      />

      <div className="w-full h-full absolute inset-0 opacity-38">
        <PaperTexture
          className="w-full h-full"
          colorFront="#f1f1f1"
          colorBack="#0a0a0a"
          contrast={0.22}
          roughness={0.18}
          fiber={0.12}
          fiberSize={0.55}
          crumples={0.17}
          crumpleSize={0.42}
          folds={0.11}
          foldCount={5}
          fade={0.45}
          drops={0.02}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_58%_43%,rgba(255,255,255,0.20),rgba(255,255,255,0.03)_34%,transparent_65%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(120deg,rgba(255,255,255,0.06),transparent_38%,rgba(0,0,0,0.24)_74%)]" />
      <div className="absolute inset-0 pointer-events-none" style={{ backdropFilter: "blur(1px)" }} />
      <div className="absolute inset-0 pointer-events-none bg-black/22" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-[35%] h-[280px] bg-white/6 blur-[140px]" />
      </div>
    </div>
  )
}
