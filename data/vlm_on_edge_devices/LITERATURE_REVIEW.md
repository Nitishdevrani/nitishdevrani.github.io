# Literature Review: Ultra-Low-Bit Quantization for Vision-Language Models on Edge Devices

> **Project**: VLM Edge Deployment — CLIP → Qwen-VL / LLaVA  
> **Last Updated**: 2026-02-28  
> **Focus**: 2-bit and 4-bit weight quantization for deploying VLMs on resource-constrained devices

---

## Table of Contents

1. [Research Context](#research-context)
2. [Tier 1 — Directly Applicable Papers](#tier-1--directly-applicable-papers)
3. [Tier 2 — Foundational Methods](#tier-2--foundational-methods)
4. [Tier 3 — Practical Reference Cases](#tier-3--practical-reference-cases)
5. [Blog References](#blog-references)
6. [Key Takeaways](#key-takeaways)
7. [Recommended Research Path](#recommended-research-path)
8. [Quantization Techniques Overview](#quantization-techniques-overview)

---

## Research Context

**Goal**: Drastically quantize Vision-Language Models (currently CLIP ViT-B/32, later Qwen2-VL, LLaVA) from FP32 down to 2-bit / 4-bit to fit on edge devices (mobile, embedded, IoT).

**Current baseline**: CLIP ViT-B/32, 151.3M parameters, 577 MB FP32, 86.16% zero-shot accuracy on CIFAR-10.

**Challenge**: PyTorch's built-in `quantize_dynamic` only supports INT8. Going to 4-bit or 2-bit requires specialized techniques — either weight packing, GPTQ/AWQ libraries, or quantization-aware training (QAT).

**Critical VLM-specific issue**: Vision-Language Models have a **modality discrepancy** — the vision encoder (ViT) and language model behave very differently under quantization. Papers consistently show that blindly applying LLM quantization methods to VLMs causes severe accuracy drops, especially in the visual component.

---

## Tier 1 — Directly Applicable Papers

### 1. SPEED-Q: Staged Processing with Enhanced Distillation towards Efficient Low-bit On-device VLM Quantization

| Field | Details |
|-------|---------|
| **Link** | https://arxiv.org/abs/2511.08914 |
| **Code** | https://github.com/antgroup/SPEED-Q |
| **Authors** | Tianyu Guo, Shanwei Zhao, Shiai Zhu, Chenguang Ma |
| **Date** | November 2025 |
| **Venue** | arXiv (Ant Group Research) |

**Problem Addressed**: Deploying VLMs on edge devices (smartphones, robots) requires aggressive quantization, but existing methods fail at 2-bit because vision and language components have different quantization sensitivities.

**Method**:
- **Staged sensitivity-adaptive mechanism**: Quantizes the LLM backbone first, freezes it, then quantizes the ViT with distillation from the FP32 teacher model.
- **Distillation-enhanced quantization**: Uses knowledge distillation to stabilize training at low-bit precision, reducing data dependence.
- Targets small-scale VLMs (1–2B parameters): InternVL2-1B, Qwen2-VL-2B.

**Key Results**:
- **6x higher accuracy** than existing quantization methods at 2-bit settings.
- Consistently outperforms prior on-device VLMs at both 2-bit and 4-bit.
- First framework specifically tailored for quantizing entire small-scale billion-parameter VLMs to low bits.

**Relevance**: **Best match for our roadmap.** When moving from CLIP to Qwen-VL or LLaVA, the staged (vision-first vs language-first) approach is the template to follow. Code is available.

---

### 2. D4C: Data-free Quantization for Contrastive Language-Image Pre-training Models

| Field | Details |
|-------|---------|
| **Link** | https://arxiv.org/abs/2511.15411 |
| **Authors** | Wenlun Zhang, Yunshan Zhong, Zihao Ding, Xinyu Li, Kentaro Yoshioka |
| **Date** | November 2025 |
| **Venue** | arXiv |

**Problem Addressed**: Quantizing CLIP models without access to training data (data-free quantization). Existing DFQ methods generate synthetic images with poor semantic content and low diversity, causing severe accuracy drops.

**Method**:
- **Prompt-Guided Semantic Injection**: Uses CLIP's own text prompts to generate semantically meaningful synthetic images for calibration.
- **Structural Contrastive Generation**: Reproduces foreground-background compositional structures of natural images.
- **Perturbation-Aware Enhancement**: Applies controlled perturbations to improve sample diversity and robustness.
- First DFQ framework designed specifically for CLIP.

**Key Results** (W4A8 — 4-bit weights, 8-bit activations):
| Model | Dataset | D4C Improvement |
|-------|---------|----------------|
| CLIP ResNet-50 | CIFAR-10 | +12.4% Top-1 |
| CLIP ViT-B/32 | CIFAR-10 | +18.9% Top-1 |
| CLIP ResNet-50 | CIFAR-100 | +6.8% Top-1 |
| CLIP ViT-B/32 | CIFAR-100 | +19.7% Top-1 |
| CLIP ResNet-50 | ImageNet-1K | +1.4% Top-1 |
| CLIP ViT-B/32 | ImageNet-1K | +5.7% Top-1 |

**Relevance**: **Directly targets our current setup** — CLIP ViT-B/32 on CIFAR-10. Data-free means no calibration dataset needed, ideal for privacy-constrained edge deployment.

---

### 3. VLMQ: Efficient Post-Training Quantization for Large VLMs via Hessian Augmentation

| Field | Details |
|-------|---------|
| **Link** | https://arxiv.org/abs/2508.03351 |
| **Authors** | Yufei Xue, Yushi Huang, Jiawei Shao, Jun Zhang |
| **Date** | August 2025 |
| **Venue** | arXiv |

**Problem Addressed**: Existing Hessian-based LLM PTQ methods (like GPTQ, AWQ) treat all tokens equally during quantization. VLMs have a **modality discrepancy**: limited text tokens vs. excessive redundant vision tokens. Applying LLM methods directly causes severe performance drops.

**Method**:
- **Importance-aware PTQ objective**: Enhances the Hessian matrix with token-level importance factors, giving more quantization budget to critical text tokens.
- **Efficient computation**: Computes importance factors via a single lightweight block-wise backward pass.
- Theoretically grounded via connection to token-level perturbation analysis.
- Tested on VLMs from 0.5B to 32B parameters.

**Key Results**:
- **16.45% improvement on MME-RealWorld** under 2-bit quantization vs. standard GPTQ/AWQ.
- State-of-the-art performance across 8 benchmarks, especially at low-bit settings.

**Relevance**: Essential method for when we move to Qwen-VL or LLaVA. Directly addresses why naive GPTQ/AWQ breaks on VLMs.

---

## Tier 2 — Foundational Methods

### 4. ParetoQ: Improving Scaling Laws in Extremely Low-bit LLM Quantization

| Field | Details |
|-------|---------|
| **Link** | https://arxiv.org/abs/2502.02631 |
| **Models** | https://huggingface.co/collections/facebook/mobilellm-6722be18cb86c20ebe113e95 |
| **Authors** | Zechun Liu et al. (Meta) |
| **Date** | February 2025 |
| **Venue** | **NeurIPS 2025** |

**Problem Addressed**: No unified framework exists for comparing quantization across all bit-widths (1-bit to 4-bit). Previous claims about "optimal bit-width" were made in isolation.

**Method**:
- First unified framework for rigorous comparison across 1-bit, 1.58-bit (ternary), 2-bit, 3-bit, and 4-bit.
- Optimizes training schemes and quantization functions for each bit-width.

**Key Insight — The 2/3-bit Learning Transition**:
> For 3-bits and above, fine-tuned models stay close to their original pre-trained distributions.  
> For 2-bit and below, representations change drastically.

**Key Results**:
- ParetoQ ternary 600M model outperforms previous SOTA ternary 3B model (5x fewer params!).
- **2-bit quantization offers the best Pareto frontier** for memory reduction + speedup.
- Ternary, 2-bit, and 3-bit are roughly comparable; 4-bit and binary are suboptimal on the Pareto curve.

**Relevance**: Validates that **2-bit is the practical sweet spot** to target. Their quantization recipes are reusable.

---

### 5. TesseraQ: Ultra Low-Bit LLM Post-Training Quantization with Block Reconstruction

| Field | Details |
|-------|---------|
| **Link** | https://arxiv.org/abs/2410.19103 |
| **Authors** | Yuhang Li, Priyadarshini Panda |
| **Date** | October 2024 |
| **Venue** | arXiv |

**Problem Addressed**: Pushing PTQ (post-training quantization — no retraining needed) down to 2-bit. Standard PTQ methods like AWQ collapse at 2-bit.

**Method**:
- **Progressive Adaptive Rounding**: Gradually transitions soft rounding variables to hard during block-by-block reconstruction, preventing catastrophic errors.
- **Dequantization scale optimization**: Jointly optimizes scale parameters during reconstruction.
- Integrates on top of AWQ and OmniQuant as an enhancement layer.

**Key Results** (LLaMA-2-7B, 2-bit weight-only):

| Method | Wiki2 PPL | Avg Accuracy |
|--------|-----------|-------------|
| AWQ (baseline) | 14.65 | 50.52% |
| **TesseraQ** | **6.82** | **59.27%** |

Works across W2A16, W3A16, W3A3, W4A4 schemes.

**Relevance**: If using AWQ or GPTQ as base quantizers, TesseraQ is the enhancement that makes 2-bit actually viable. Pure PTQ — no retraining needed.

---

## Tier 3 — Practical Reference Cases

### 6. An Empirical Study of LLaMA3 Quantization: from LLMs to MLLMs

| Field | Details |
|-------|---------|
| **Link** | https://arxiv.org/abs/2404.14047 |
| **Code** | https://github.com/Macaronlin/LLaMA3-Quantization |
| **Models** | https://huggingface.co/Efficient-ML |
| **Authors** | Wei Huang et al. |
| **Date** | April 2024 (updated January 2025) |

**Problem Addressed**: Comprehensive benchmark of how LLaMA3 family models (both LLM and MLLM variants) behave under quantization from 1-bit to 8-bit.

**What They Tested**:
- 10 PTQ methods (GPTQ, AWQ, QuIP#, SqueezeLLM, etc.) + LoRA fine-tuning
- LLaMA3-8B for text, **LLaVA-Next-8B** for multimodal tasks
- 2-bit to 4-bit ultra-low-bit settings on MLLMs

**Key Finding**:
> LLaMA3 MLLMs still suffer non-negligible degradation in both linguistic AND visual contexts at ultra-low bits. This highlights a significant performance gap that needs to be addressed.

**Relevance**: Use as **benchmark reference** when quantizing LLaVA. Pre-quantized models available on HuggingFace for direct comparison.

---

### 7. BlueLM-V-3B: Algorithm and System Co-Design for MLLMs on Mobile Devices

| Field | Details |
|-------|---------|
| **Link** | https://arxiv.org/abs/2411.10640 |
| **Authors** | Xudong Lu et al. (vivo AI Lab) |
| **Date** | November 2024 |

**Problem Addressed**: End-to-end deployment of a multimodal LLM on actual mobile hardware.

**What They Built**:
- 3B parameter MLLM (2.7B language + 400M vision encoder)
- 4-bit LLM weight quantization
- Dynamic resolution ViT with hardware-aware optimizations
- Deployed on MediaTek Dimensity 9300 mobile processor

**Key Results**:
- **24.4 tokens/sec** on a mobile phone
- Score of **66.1** on OpenCompass — #1 among all models ≤4B parameters
- Beats InternVL2-8B (which is 2.7× larger)

**Relevance**: Shows what the **end goal** looks like — a real VLM running on actual edge hardware with 4-bit quantization.

---

## Blog References

### Weight Packing for Sub-8-bit Quantization (Pure PyTorch)

| Field | Details |
|-------|---------|
| **Link** | https://medium.com/@govindarajpriyanthan/mastering-2-bit-and-4-bit-quantization-unlocking-ultra-efficient-model-weights-with-weight-79aa42e11ae6 |
| **Author** | Priyanthan Govindaraj |
| **Date** | September 2024 |

**What It Covers**: Manual bit-packing implementation in pure PyTorch (no external libraries):
- Pack 2× 4-bit values into one `uint8` byte
- Pack 4× 2-bit values into one `uint8` byte
- Unpack at inference time via bit shifts + masks

**Why It's Useful**: Pure PyTorch implementation, no GPU required, no external dependencies. Achieves **real storage savings** (not simulated). Trade-off: slight unpack overhead at inference time.

**Implementation Pattern**:
```
FP32 weight [0.28] → quantize to 2-bit int [2] → pack 4 values into one uint8 byte
At inference: unpack byte → get int [2] → dequantize → [0.28] → use for computation
```

---

## Key Takeaways

### 1. The 2/3-bit Boundary is Critical
ParetoQ (NeurIPS 2025) demonstrates a fundamental **learning transition between 2 and 3 bits**:
- ≥3 bits: Fine-tuned models remain close to pre-trained distributions
- ≤2 bits: Representations change drastically, requiring different optimization strategies

### 2. VLMs Need Special Treatment
Multiple papers (SPEED-Q, VLMQ) independently confirm:
- Vision encoders and language backbones have **different quantization sensitivities**
- Applying LLM quantization uniformly to both causes severe accuracy loss
- **Staged quantization** (handle each modality separately) is essential

### 3. 2-bit is the Sweet Spot for Edge
- ParetoQ: 2-bit achieves the best Pareto frontier for memory vs. accuracy
- SPEED-Q: 2-bit is viable for VLMs with proper staged training
- Below 2-bit (1-bit, ternary): accuracy drops become impractical for most tasks

### 4. PTQ vs QAT Trade-offs
| Approach | Pros | Cons | When to Use |
|----------|------|------|-------------|
| **PTQ** (Post-Training) | No retraining, fast, uses AWQ/GPTQ | Quality drops at ≤2-bit | Quick experiments, ≥4-bit |
| **QAT** (Quantization-Aware Training) | Best quality at low bits | Requires training infra + GPU time | Final production at 2-bit |
| **Data-free PTQ** | No calibration data needed | Slightly lower than data-driven PTQ | Privacy-constrained, CLIP models |

### 5. Available Tools for Implementation

| Library | Bits Supported | GPU Required | Notes |
|---------|---------------|--------------|-------|
| PyTorch `quantize_dynamic` | INT8 only | No | Simplest, built-in |
| Manual weight packing | Any (2, 4, 8) | No | Real savings, pure PyTorch |
| `bitsandbytes` | 4-bit, 8-bit | Yes (CUDA) | NF4, double quantization |
| `auto-gptq` | 2, 3, 4, 8-bit | Yes (CUDA) | Needs calibration data |
| `AutoAWQ` | 4-bit | Yes (CUDA) | Activation-aware |
| `quanto` (HF) | 2, 4, 8-bit | Optional | Easy HF integration |

---

## Recommended Research Path

| Stage | Model | Quantization Approach | Paper to Follow | Status |
|-------|-------|----------------------|-----------------|--------|
| **Now** | CLIP ViT-B/32 | INT8 dynamic PTQ | Built-in PyTorch | ✅ Done |
| **Now** | CLIP ViT-B/32 | 4-bit/2-bit simulated | Weight packing blog | 🔄 In progress |
| **Next** | CLIP ViT-B/32 | 4-bit data-free PTQ | D4C (Paper 2) | ⬜ Planned |
| **Later** | Qwen2-VL-2B / LLaVA | 2-bit & 4-bit staged QAT | SPEED-Q + VLMQ | ⬜ Planned |
| **Deploy** | Final model | Mobile/edge optimization | BlueLM-V-3B | ⬜ Future |

---

## Quantization Techniques Overview

### Simulated vs Real Quantization

```
Simulated (what we currently have for 4-bit & 2-bit):
  FP32 weight → round to N-bit precision → store back as FP32
  ✓ Accuracy impact is real    ✗ No disk/memory savings

Real Quantization (target):
  FP32 weight → quantize to N-bit → pack into uint8 containers
  ✓ Accuracy impact is real    ✓ Real storage savings
  Methods: GPTQ, AWQ, bitsandbytes, manual weight packing
```

### Symmetric Quantization Formula

For a weight tensor $w$ quantized to $n$ bits:

- Scale: $s = \frac{\max(|w|)}{2^{n-1} - 1}$
- Quantize: $w_q = \text{clamp}\left(\text{round}\left(\frac{w}{s}\right), -2^{n-1}, 2^{n-1}-1\right)$
- Dequantize: $\hat{w} = w_q \times s$

| Bits | Distinct values | Range (symmetric) |
|------|----------------|-------------------|
| 32 | ~4 billion | Full float32 |
| 8 | 256 | [-128, 127] |
| 4 | 16 | [-8, 7] |
| 2 | 4 | [-2, 1] |

---

*This document will be updated as new papers or methods are explored.*
