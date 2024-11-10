import gsap from 'gsap';
import { galleryItems } from '../data.js';
// src/lib/gallery.js
import { animationManager } from './animation';

export class GalleryManager {
  constructor() {
    this.activeItemIndex = 0;
    this.isAnimating = false;

    // Add null check and logging
    this.gallery = document.querySelector(".gallery");
    if (!this.gallery) {
      console.error("Gallery element not found. Make sure the .gallery class exists in your HTML.");
    }

    this.blurryPrev = document.querySelector(".blurry-prev");
    this.projectPreview = document.querySelector(".project-preview");
  }

  init() {
    // Add a check before initializing
    if (!this.gallery) {
      console.warn("Cannot initialize gallery: gallery element not found");
      return;
    }

    this.initializeGallery();
    this.initializeInitialText();
  }

  initializeGallery() {
    // Ensure galleryItems is imported and defined
    if (!galleryItems || galleryItems.length === 0) {
      console.warn("No gallery items found");
      return;
    }

    galleryItems.forEach((_, i) => {
      const itemDiv = this.createGalleryItem(i);
      this.gallery.appendChild(itemDiv);
    });
  }

  createGalleryItem(index) {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");
    if (index === 0) itemDiv.classList.add("active");

    const img = document.createElement("img");
    img.src = `/assets/img${index + 1}.jpg`;
    img.alt = galleryItems[index].title;

    itemDiv.appendChild(img);
    itemDiv.dataset.index = index;
    itemDiv.addEventListener("click", () => this.handleItemClick(index));

    return itemDiv;
  }

  createProjectDetails(activeItem, index) {
    const detailsContainer = document.createElement("div");
    detailsContainer.className = "project-details";

    const structure = [
      { className: "title", tag: "h1", content: activeItem.title },
      { className: "info", tag: "p", content: activeItem.copy },
      { className: "credits", tag: "p", content: "Credits" },
      { className: "director", tag: "p", content: `Director: ${activeItem.director}` },
      { className: "cinematographer", tag: "p", content: `Cinematographer: ${activeItem.cinematographer}` }
    ];

    for (const { className, tag, content } of structure) {
      const wrapper = document.createElement("div");
      wrapper.className = className;
      const element = document.createElement(tag);
      element.textContent = content;
      wrapper.appendChild(element);
      detailsContainer.appendChild(wrapper);
    }

    const imgContainer = document.createElement("div");
    imgContainer.className = "project-img";
    const img = document.createElement("img");
    img.src = `/assets/img${index + 1}.jpg`;
    img.alt = activeItem.title;
    imgContainer.appendChild(img);

    return {
      details: detailsContainer,
      imageContainer: imgContainer,
      infoText: detailsContainer.querySelector(".info p")
    };
  }

  async handleItemClick(index) {
    if (index === this.activeItemIndex || this.isAnimating) return;
    this.isAnimating = true;

    const activeItem = galleryItems[index];
    this.updateActiveItem(index);

    await this.animateTransition(activeItem, index);
    this.isAnimating = false;
  }

  async animateTransition(activeItem, index) {
    const currentElements = document.querySelectorAll(
      ".title h1, .info p .line span, .credits p, .director p, .cinematographer p"
    );

    const currentProjectImg = document.querySelector(".project-img");
    const currentProjectImgElem = currentProjectImg.querySelector("img");

    // ブラー背景のトランジション
    const newBlurryImg = this.createBlurryImage(index, activeItem);
    await animationManager.createBlurryTransition(newBlurryImg, this.blurryPrev);

    // 現在の要素のアニメーションアウト
    await Promise.all([
      animationManager.animateOut(currentElements),
      this.animateProjectImageOut(currentProjectImg, currentProjectImgElem)
    ]);

    // 新しい要素の作成とアニメーションイン
    const { details, imageContainer, infoText } = this.createProjectDetails(activeItem, index);
    this.projectPreview.appendChild(details);
    this.projectPreview.appendChild(imageContainer);

    animationManager.createSplitText(infoText);
    const newElements = details.querySelectorAll(
      ".title h1, .info p .line span, .credits p, .director p, .cinematographer p"
    );

    await Promise.all([
      animationManager.animateIn(newElements),
      this.animateProjectImageIn(imageContainer)
    ]);
  }

  createBlurryImage(index, activeItem) {
    const img = document.createElement("img");
    img.src = `/assets/img${index + 1}.jpg`;
    img.alt = activeItem.title;
    this.blurryPrev.insertBefore(img, this.blurryPrev.firstChild);
    return img;
  }

  updateActiveItem(index) {
    this.gallery.children[this.activeItemIndex].classList.remove("active");
    this.gallery.children[index].classList.add("active");
    this.activeItemIndex = index;
  }

  async animateProjectImageOut(projectImg, imgElement) {
    await Promise.all([
      animationManager.animateImage(imgElement),
      gsap.to(projectImg, {
        scale: 0,
        bottom: "10em",
        duration: 1,
        ease: "power4.in"
      })
    ]);
    projectImg.remove();
    document.querySelector(".project-details")?.remove();
  }

  async animateProjectImageIn(projectImg) {
    const img = projectImg.querySelector("img");
    await Promise.all([
      gsap.fromTo(
        projectImg,
        { scale: 0, bottom: "-10em" },
        {
          scale: 1,
          bottom: "1em",
          duration: 1,
          ease: "power4.out"
        }
      ),
      animationManager.animateImage(img, {
        scale: 1,
        ease: "power4.out"
      })
    ]);
  }

  initializeInitialText() {
    const initialInfoText = document.querySelector(".info p");
    if (initialInfoText) {
      animationManager.createSplitText(initialInfoText);

      // Optional: Set initial animation state
      const initialElements = document.querySelectorAll(
        ".title h1, .info p .line span, .credits p, .director p, .cinematographer p"
      );
      gsap.set(initialElements, { y: 0 });
    }
  }
}
