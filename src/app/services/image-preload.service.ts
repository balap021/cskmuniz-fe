import { Injectable } from '@angular/core';

interface PreloadTask {
  url: string;
  priority: number;
  loaded: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ImagePreloadService {
  private preloadQueue: PreloadTask[] = [];
  private maxConcurrent = 3; // Max images loading at once
  private currentlyLoading = 0;
  private loadedImages = new Set<string>();

  constructor() {}

  /**
   * Preload an image with priority
   * @param url Image URL to preload
   * @param priority Higher priority loads first (default: 0)
   */
  preload(url: string, priority: number = 0): Promise<void> {
    return new Promise((resolve, reject) => {
      // Skip if already loaded
      if (this.loadedImages.has(url)) {
        resolve();
        return;
      }

      const task: PreloadTask = {
        url,
        priority,
        loaded: false
      };

      this.preloadQueue.push(task);
      this.preloadQueue.sort((a, b) => b.priority - a.priority);

      // Start processing queue
      this.processQueue().then(() => {
        if (task.loaded) {
          resolve();
        } else {
          reject(new Error(`Failed to preload image: ${url}`));
        }
      });
    });
  }

  /**
   * Preload multiple images
   * @param urls Array of image URLs
   * @param priority Priority for all images
   */
  preloadBatch(urls: string[], priority: number = 0): Promise<void[]> {
    return Promise.all(urls.map(url => this.preload(url, priority).catch(() => {})));
  }

  /**
   * Check if an image is already loaded/cached
   */
  isLoaded(url: string): boolean {
    return this.loadedImages.has(url);
  }

  /**
   * Clear the preload queue
   */
  clearQueue(): void {
    this.preloadQueue = [];
  }

  private async processQueue(): Promise<void> {
    while (this.preloadQueue.length > 0 && this.currentlyLoading < this.maxConcurrent) {
      const task = this.preloadQueue.shift();
      if (!task || task.loaded) continue;

      this.currentlyLoading++;
      this.loadImage(task.url)
        .then(() => {
          task.loaded = true;
          this.loadedImages.add(task.url);
        })
        .catch(() => {
          // Image failed to load, but mark as processed
          task.loaded = true;
        })
        .finally(() => {
          this.currentlyLoading--;
          // Continue processing queue
          if (this.preloadQueue.length > 0) {
            this.processQueue();
          }
        });
    }
  }

  private loadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }
}

