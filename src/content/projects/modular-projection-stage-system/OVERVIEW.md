---
title: "Modular Stage Design System"
slug: modular-projection-stage-system
abstract: A modular, 3D-printed stage design system for projection mapping — pre-map rotationally symmetrical tiles in software, then assemble them on-site for quick, flexible, cohesive projection-mapped stages.
tags:
  - 3d-printing
  - projection-mapping
  - modular-design
  - stage-design
  - creative-coding
projectType: 3d
status: active
startDate: 2026-03-29
---

## Overview
 
The Sense Amylia Modular Stage System is a custom-designed platform for live projection mapping, built from the ground up around 3D-printed geometric tiles. Rather than projecting onto flat screens or generic surfaces, the system uses physical geometry — raised and recessed patterns printed in matte white PLA — as the canvas. Light lands differently on every facet. Shadows shift with the music. The surface itself becomes part of the visual.
 
The system was designed with one core operational goal: arrive at a venue, assemble the stage, and be projection-ready in minutes — not hours.
 
---
 
## Where It Started
 
The first iteration wasn't a system at all. It was a single art piece: a portrait relief sculpture mapped with generative visuals. The geometry was fixed, the mapping was custom, and the whole thing existed as a one-of-a-kind installation.
 
That piece proved the concept. Physical depth under projection creates something fundamentally different from flat-screen visuals — a dimensionality that responds to light in ways no purely digital medium can replicate. But it also exposed the limitation: a fixed sculpture doesn't scale. Every new show, every new stage meant starting from scratch.
 
That constraint became the design brief for everything that followed.
 
---
 
## The Modular Approach
 
The shift from a fixed art piece to a modular system required rethinking the geometry from the ground up.
 
Each tile in the system is a 256 × 256mm printed panel — maxing out the build plate of a Bambu Lab A1 printer — with a surface pattern precision-designed for two things: visual coherence when tiled together, and pre-baked projection mapping compatibility. A single mapping file, calibrated once per tile design, works for every tile of that type regardless of where it sits in the overall layout.
 
The key to making this work is **rotational symmetry**. Every tile pattern is designed so that rotating it 90°, 180°, or 270° produces the same result at the tile boundary. This means tiles can be placed in any orientation without breaking the visual composition — and it means the mapping stays valid no matter how the stage is configured.
 
The first tile design to come out of this system is called **WEAVE** — an interlocking chevron geometry that creates strong directional shadows, reads cleanly at scale, and generates emergent patterns across the full tile arrangement that aren't visible in any single tile alone.
 
---
 
## The Fabrication Pipeline
 
Designs originate in **Adobe Illustrator**, where the geometric patterns are drafted as vector art with mathematical precision. Those SVG files are imported into **Blender**, where the 2D pattern is projected onto a 3D baseplate and extruded into a physical relief — grooves, ridges, and angled faces that will catch and redirect light. The resulting model is sliced in **Bambu Studio** and printed on the **Bambu Lab A1** in matte white PLA.
 
Material choice matters more than it might seem. Matte PLA diffuses projected light evenly across the surface — it acts as a neutral canvas, letting the projection dominate. Glossy or silk-finish filaments introduce specular hotspots and reflective interference that compete with the content. Matte white is the production standard.
 
Print times run long by design. Slower print speeds produce cleaner surface geometry, which matters when angled faces are catching projected light at close range. A full 256 × 256mm tile takes roughly ten hours.
 
---
 
## Projection Mapping in Practice
 
The mapping layer runs in **Resolume**, where each tile has its own saved mapping preset. At a show, the tiles are assembled into whatever configuration the stage calls for, the presets are loaded, and the mapping snaps into place.
 
The vision — currently in active development — is a complete tile library: multiple pattern designs, each with a calibrated Resolume preset, ready to be combined in any arrangement. Small stage, large stage, DJ booth back panel, main stage installation — the same tiles, different configurations, no remapping required.
 
---
 
## What's Next
 
The immediate focus is building out the tile library beyond the WEAVE design, validating the per-tile mapping preset workflow at show scale, and developing a physical alignment system so tiles register precisely on-site without manual measurement.
 
Longer term, the tile designs themselves represent a form of creative IP that extends beyond live performance — the same geometry that works as a projection surface is a strong candidate for the designer toy and collectible art space.
 
The system is a living infrastructure project. Every show adds another data point. Every new tile design expands what's possible on stage.
