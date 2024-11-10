// src/lib/animation.js
import gsap from 'gsap';
import SplitType from 'split-type';

export class AnimationManager {
  constructor() {
    this.animations = new Map();
  }

  createSplitText(element) {
    const splitText = new SplitType(element, { types: "lines" });
    element.innerHTML = "";

    for (const line of splitText.lines) {
        const lineDiv = document.createElement("div");
        lineDiv.className = "line";
        const lineSpan = document.createElement("span");
        lineSpan.textContent = line.textContent;
        lineDiv.appendChild(lineSpan);
        element.appendChild(lineDiv);
    }
  }

  animateOut(elements) {
    return gsap.to(elements, {
      y: -60,
      duration: 1,
      ease: "power4.in",
      stagger: 0.05
    });
  }

  animateIn(elements, startY = 40) {
    return gsap.fromTo(
      elements,
      { y: startY },
      {
        y: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.05
      }
    );
  }

  animateImage(img, { scale = 2, duration = 1, ease = "power4.in" } = {}) {
    return gsap.to(img, {
      scale,
      duration,
      ease
    });
  }

  createBlurryTransition(newImage, blurryPrev) {
    gsap.set(newImage, {
      opacity: 0,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover"
    });

    const currentImage = blurryPrev.querySelector("img:nth-child(2)");
    if (currentImage) {
      gsap.to(currentImage, {
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power2.inOut",
        onComplete: () => currentImage.remove()
      });
    }

    return gsap.to(newImage, {
      delay: 0.5,
      opacity: 1,
      duration: 1,
      ease: "power2.inOut"
    });
  }
}

export const animationManager = new AnimationManager();
