/**
 * Utility functions for image processing, compression, and loading
 */

// Constants for image URLs
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const DEFAULT_FALLBACK_URL = import.meta.env.VITE_IMAGE_FALLBACK_URL || '/dummy.png';
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_BASE_URL = CLOUDINARY_CLOUD_NAME ? `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}` : null;
const IS_CLOUDINARY_ENABLED = Boolean(CLOUDINARY_CLOUD_NAME);

// Local storage key to track failed Cloudinary URLs to avoid repeated failures
const FAILED_CLOUDINARY_URLS_KEY = 'naturegrain_failed_cloudinary_urls';

/**
 * Compresses an image file before upload
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - A promise resolving to a compressed file
 */
export const compressImage = async (file, options = {}) => {
  // Default compression options
  const settings = {
    maxSizeMB: options.maxSizeMB || 1, // Default to 1MB max size
    maxWidthOrHeight: options.maxWidthOrHeight || 1920, // Default to max 1920px width/height
    quality: options.quality || 0.85, // Default quality
    useWebWorker: true
  };
  
  return new Promise((resolve, reject) => {
    try {
      // Create a FileReader to read the file
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        // Create an image element to get dimensions
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          // Create canvas for resizing
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          if (width > height && width > settings.maxWidthOrHeight) {
            height = Math.round((height * settings.maxWidthOrHeight) / width);
            width = settings.maxWidthOrHeight;
          } else if (height > settings.maxWidthOrHeight) {
            width = Math.round((width * settings.maxWidthOrHeight) / height);
            height = settings.maxWidthOrHeight;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw resized image on canvas
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert canvas to blob
          canvas.toBlob(
            (blob) => {
              // Create new file from blob
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              
              resolve(compressedFile);
            },
            file.type,
            settings.quality
          );
        };
        
        img.onerror = (error) => {
          reject(new Error('Failed to load image for compression: ' + error));
        };
      };
      
      reader.onerror = (error) => {
        reject(new Error('Failed to read file for compression: ' + error));
      };
    } catch (error) {
      reject(new Error('Image compression failed: ' + error.message));
    }
  });
};

/**
 * Compresses multiple images before upload
 * @param {Array<File>} files - Array of image files to compress
 * @param {Object} options - Compression options
 * @returns {Promise<Array<File>>} - A promise resolving to an array of compressed files
 */
export const compressImages = async (files, options = {}) => {
  try {
    // Process each file in parallel with Promise.all
    const compressedFiles = await Promise.all(
      Array.from(files).map(file => compressImage(file, options))
    );
    return compressedFiles;
  } catch (error) {
    console.error('Failed to compress multiple images:', error);
    // If compression fails, return original files
    return files;
  }
};

/**
 * Checks if an image is larger than a specified size threshold
 * @param {File} file - The image file to check
 * @param {number} thresholdMB - The size threshold in MB
 * @returns {boolean} - True if the file is larger than the threshold
 */
export const isImageTooLarge = (file, thresholdMB = 2) => {
  const thresholdBytes = thresholdMB * 1024 * 1024;
  return file.size > thresholdBytes;
};

/**
 * Builds a Cloudinary URL with transformation parameters
 * @param {string} publicId - The public ID of the image in Cloudinary
 * @param {Object} options - Transformation options
 * @returns {string} - The transformed Cloudinary URL
 */
export const getCloudinaryUrl = (publicId, options = {}) => {
  if (!publicId) return DEFAULT_FALLBACK_URL;
  
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options;
  
  let transformations = 'f_' + format + ',q_' + quality;
  if (width) transformations += ',w_' + width;
  if (height) transformations += ',h_' + height;
  if (crop) transformations += ',c_' + crop;
  
  return `${CLOUDINARY_BASE_URL}/image/upload/${transformations}/${publicId}`;
};

/**
 * Track failed Cloudinary URLs to avoid repeated failures
 * @param {string} url - The URL that failed to load
 */
export const addToFailedCloudinaryUrls = (url) => {
  if (!url || !url.includes('cloudinary.com')) return;
  
  try {
    // Get existing failed URLs from local storage
    const failedUrls = JSON.parse(localStorage.getItem(FAILED_CLOUDINARY_URLS_KEY) || '[]');
    
    // Only add the URL if it's not already in the list
    if (!failedUrls.includes(url)) {
      failedUrls.push(url);
      
      // Limit the number of stored URLs to prevent localStorage overflow
      if (failedUrls.length > 100) {
        failedUrls.shift(); // Remove the oldest entry
      }
      
      localStorage.setItem(FAILED_CLOUDINARY_URLS_KEY, JSON.stringify(failedUrls));
    }
  } catch (error) {
    console.error('Failed to track failed Cloudinary URL:', error);
  }
};

/**
 * Check if a URL has previously failed to load
 * @param {string} url - The URL to check
 * @returns {boolean} - True if the URL has failed before
 */
export const hasUrlFailedBefore = (url) => {
  if (!url) return false;
  
  try {
    const failedUrls = JSON.parse(localStorage.getItem(FAILED_CLOUDINARY_URLS_KEY) || '[]');
    return failedUrls.includes(url);
  } catch (error) {
    console.error('Failed to check failed Cloudinary URLs:', error);
    return false;
  }
};

/**
 * Gets the appropriate image URL based on ID or URL
 * Supports both legacy API and Cloudinary URLs
 * @param {Object} params - Parameters for building the image URL
 * @param {number|string} params.id - Image ID (for API endpoint)
 * @param {string} params.url - Direct image URL (for Cloudinary)
 * @param {Object} params.options - Image transformation options
 * @returns {string} - The final image URL
 */
export const getImageUrl = ({ id, url, options = {} }) => {
  // If direct URL is provided and it's a Cloudinary URL
  if (url && url.includes('cloudinary.com')) {
    // Check if this URL has failed before
    if (hasUrlFailedBefore(url)) {
      console.log('Using fallback for previously failed Cloudinary URL', url);
      return DEFAULT_FALLBACK_URL;
    }
    
    // For existing Cloudinary URLs, add transformations
    if (IS_CLOUDINARY_ENABLED && (options.width || options.height || options.quality)) {
      // Extract the public ID from the URL
      const publicId = extractPublicIdFromUrl(url);
      return getCloudinaryUrl(publicId, options);
    }
    return url;
  }  
  // If ID is provided
  if (id) {
    // Use different endpoints based on Cloudinary availability
    if (IS_CLOUDINARY_ENABLED) {
      // Use the improved redirect endpoint with cache control headers
      const redirectEndpointUrl = `${API_BASE_URL}/cloudinary/redirect/${id}?t=${Date.now()}`;
      
      // Check if this endpoint has failed before
      if (hasUrlFailedBefore(redirectEndpointUrl)) {
        console.log(`Using fallback for previously failed Cloudinary ID: ${id}`);
        return `${API_BASE_URL}/photos/${id}?t=${Date.now()}`;
      }
      
      // Debug tracking for Cloudinary image loading
      if (typeof debugCloudinaryLoading === 'function') {
        debugCloudinaryLoading(id, 'request', 'getImageUrl');
      }
      
      return redirectEndpointUrl;
    } else {
      // Default to local storage if Cloudinary isn't configured
      return `${API_BASE_URL}/photos/${id}`;
    }
  }
  
  // For legacy image names, use the photos endpoint
  if (url && !url.startsWith('http')) {
    return `${API_BASE_URL}/photos/${url}`;
  }
  
  // If URL is a full URL, use it directly
  if (url) return url;
  
  // Fallback to default image
  return DEFAULT_FALLBACK_URL;
};

/**
 * Extract public ID from a Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} - Public ID
 */
export const extractPublicIdFromUrl = (url) => {
  // Check if URL is valid
  if (!url || typeof url !== "string" || !url.includes("cloudinary.com")) {
    return '';
  }
  
  // Find the upload section in the URL
  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) {
    return '';
  }
    // Get everything after /upload/
  const afterUpload = url.substring(uploadIndex + 8);
  
  // Find the version part (v1, v2, etc.)
  const parts = afterUpload.split("/");
  if (parts.length < 2) {
    return "";
  }
  
  // Combine all parts except the first (version)
  return parts.slice(1).join("/").split(".")[0];
};

/**
 * Adds a cache busting parameter to an image URL
 * @param {string} url - The image URL
 * @returns {string} - URL with cache busting parameter
 */
export const getImageUrlWithCacheBuster = (url) => {
  if (!url) return DEFAULT_FALLBACK_URL;
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
};

/**
 * Optimized function to get product image URLs with fallback support
 * @param {Object} product - The product object
 * @param {Object} options - Options for image transformations
 * @returns {string} - The product image URL
 */
export const getProductImageUrl = (product, options = {}) => {
  // Exit early if no product
  if (!product) return DEFAULT_FALLBACK_URL;
  
  // Case 1: Check for a cloudinary image in the product object
  if (product.cloudinaryImages && product.cloudinaryImages.length > 0) {
    return getImageUrl({
      url: product.cloudinaryImages[0].url,
      options
    });
  }
  
  // Case 2: Check for regular images in the product object
  if (product.images && product.images.length > 0) {
    // If image has URL property, use it directly
    if (product.images[0].url) {
      return getImageUrl({
        url: product.images[0].url,
        options
      });
    }
    
    // Otherwise use the image ID
    return getImageUrl({
      id: product.images[0].id,
      options
    });
  }
  
  // Case 3: Check for a direct imageUrl property
  if (product.imageUrl) {
    return getImageUrl({
      url: product.imageUrl,
      options
    });
  }
  
  // Fallback to default image
  return DEFAULT_FALLBACK_URL;
};

/**
 * Force image reload by creating a new Image object and setting src
 * @param {string} url - The image URL to preload
 * @returns {Promise} - Promise that resolves when image loads or rejects on error
 */
export const preloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => {
      // Track failed Cloudinary URLs
      if (url.includes('cloudinary.com')) {
        addToFailedCloudinaryUrls(url);
      }
      reject(new Error(`Failed to load image: ${url}`));
    }
    img.src = getImageUrlWithCacheBuster(url);
  });
};

/**
 * Creates a retry function for loading images with backoff
 * @param {Function} fn - The function to retry
 * @param {Object} options - Retry options
 * @returns {Function} - A function that will retry on failure
 */
export const withRetry = (fn, options = {}) => {
  const { maxAttempts = 3, delay = 1000 } = options;
  
  return async (...args) => {
    let lastError;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        
        if (attempt < maxAttempts - 1) {
          // Wait with exponential backoff before trying again
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
        }
      }
    }
    
    throw lastError;
  };
};

/**
 * Progressive image loading with multiple quality steps
 * @param {Object} params - Parameters for image loading
 * @param {string|HTMLImageElement} params.imgElement - Image element or selector
 * @param {string|Object} params.src - Source URL or object with URL information
 * @param {Function} params.onSuccess - Success callback
 * @param {Function} params.onError - Error callback
 * @param {string} params.fallbackUrl - Fallback URL if all attempts fail
 */
export const loadImageProgressively = (params) => {
  const { 
    imgElement, 
    src, 
    onSuccess = () => {}, 
    onError = () => {},
    fallbackUrl = DEFAULT_FALLBACK_URL 
  } = params;
  
  // Get the image element
  const img = typeof imgElement === 'string' ? document.querySelector(imgElement) : imgElement;
  if (!img) {
    console.error('Image element not found');
    return;
  }
  
  // Resolve the source URL
  let sourceUrl = '';
  if (typeof src === 'string') {
    sourceUrl = src;
  } else if (src && typeof src === 'object') {
    sourceUrl = getImageUrl(src);
  } else {
    img.src = fallbackUrl;
    onError('Invalid source');
    return;
  }
  
  // If the URL has failed before, go straight to fallback
  if (hasUrlFailedBefore(sourceUrl)) {
    img.src = fallbackUrl;
    onError('URL has failed before');
    return;
  }
    // Create a chain of progressive loading attempts
  const attempts = [];
  
  // Only use progressive loading with Cloudinary URLs if Cloudinary is configured
  if (IS_CLOUDINARY_ENABLED && sourceUrl.includes('cloudinary.com')) {
    // First try a tiny placeholder (10px width)
    attempts.push(() => {
      const tinyUrl = sourceUrl.replace('/upload/', '/upload/w_10,q_10,e_blur:1000/');
      img.src = getImageUrlWithCacheBuster(tinyUrl);
    });
    
    // Then try low quality (100px width)
    attempts.push(() => {
      const lowUrl = sourceUrl.replace('/upload/', '/upload/w_100,q_30/');
      setTimeout(() => {
        img.src = getImageUrlWithCacheBuster(lowUrl);
      }, 100);
    });
  }
  
  // Always include the full quality as final attempt
  attempts.push(() => {
    setTimeout(() => {
      img.src = getImageUrlWithCacheBuster(sourceUrl);
    }, attempts.length > 0 ? 300 : 0);
  });
  
  let attemptIndex = 0;
  
  // Set up event handlers
  img.onload = () => {
    attemptIndex++;
    if (attemptIndex < attempts.length) {
      attempts[attemptIndex]();
    } else {
      onSuccess('Image loaded at full quality');
    }
  };
  
  img.onerror = () => {
    attemptIndex++;
    if (attemptIndex < attempts.length) {
      // Try next quality level
      attempts[attemptIndex]();
    } else {
      // If all attempts failed, use fallback
      if (sourceUrl.includes('cloudinary.com')) {
        addToFailedCloudinaryUrls(sourceUrl);
      }
      img.onerror = null; // Prevent infinite error loop
      img.src = fallbackUrl;
      onError('All loading attempts failed');
    }
  };
  
  // Start the first attempt
  attempts[0]();
};

/**
 * Debug Cloudinary image loading
 * @param {number} id - The image ID
 * @param {string} status - 'success' or 'error'
 * @param {string} method - The method being used
 */
export const debugCloudinaryLoading = (id, status, method = 'getImageUrl') => {
  if (import.meta.env.DEV) {
    console.log(`[Cloudinary ${method}] ID: ${id}, Status: ${status}, Enabled: ${IS_CLOUDINARY_ENABLED}`);
  }
};

/**
 * Try to load an image directly from Cloudinary using the backend redirect endpoint
 * This function should be used when other methods fail
 * @param {number} imageId - The image ID
 * @returns {Promise<string>} - The final image URL (either Cloudinary or fallback)
 */
export const tryLoadCloudinaryImage = async (imageId) => {
  if (!imageId || !IS_CLOUDINARY_ENABLED) {
    return DEFAULT_FALLBACK_URL;
  }
  
  try {
    // Make a HEAD request to check if the image exists via the redirect endpoint
    const redirectUrl = `${API_BASE_URL}/cloudinary/redirect/${imageId}`;
    const response = await fetch(redirectUrl, { method: 'HEAD' });
    
    if (response.ok) {
      debugCloudinaryLoading(imageId, 'success', 'tryLoadCloudinaryImage');
      return redirectUrl;
    }
    
    // If not found, fall back to the legacy endpoint
    console.warn(`Cloudinary image ID ${imageId} not found, using fallback`);
    debugCloudinaryLoading(imageId, 'error-fallback', 'tryLoadCloudinaryImage');
    return `${API_BASE_URL}/photos/${imageId}`;
  } catch (error) {
    console.error('Error loading Cloudinary image:', error);
    debugCloudinaryLoading(imageId, 'error-exception', 'tryLoadCloudinaryImage');
    return `${API_BASE_URL}/photos/${imageId}`;
  }
};
