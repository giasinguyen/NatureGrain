import { useState, useEffect, useRef } from "react";
import {
  PlusIcon,
  PencilIcon as PencilAltIcon,
  TrashIcon,
  MagnifyingGlassIcon as SearchIcon,
  FunnelIcon as FilterIcon,
  XCircleIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  productService,
  categoryService,
  fileService,
} from "../../services/api";
import { toast } from "react-toastify";
import { getImageUrlWithCacheBuster, getImageUrl, loadImageProgressively } from "../../utils/imageUtils";

// Add CSS for image loading animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes progress {
    0% { width: 0%; }
    50% { width: 70%; }
    90% { width: 90%; }
    100% { width: 100%; }
  }
  .animate-progress {
    animation: progress 2s ease-in-out infinite;
  }
`;
document.head.appendChild(styleSheet);

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  // Form state for adding/editing products
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    categoryId: "",
    imageIds: [],
  });
  // Image upload state
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);
  // Fetch products and categories data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          productService.getProducts(),
          categoryService.getCategories(),
        ]);

        setProducts(productsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle modal open for adding new product
  const handleAddNew = () => {
    setCurrentProduct(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      categoryId: categories.length > 0 ? categories[0].id : "",
      imageIds: [],
    });
    setShowModal(true);
  }; // Handle modal open for editing product
  const handleEdit = (product) => {
    setCurrentProduct(product);
    // Lưu thứ tự hình ảnh để đảm bảo hình đầu tiên luôn là hình ảnh chính
    const imageIds = product.images?.map((img) => img.id) || [];

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      categoryId: product.category?.id,
      imageIds: imageIds,
    });

    setShowModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "quantity" || name === "categoryId"
          ? Number(value)
          : value,
    }));
  };
  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Tiến hành cập nhật sản phẩm dựa trên các thông tin cơ bản trước
      let productId = currentProduct?.id;
      let productUpdated = false;

      // Step 1: Update or create the product without waiting for image processing
      if (currentProduct) {
        // Update existing product
        try {
          await productService.updateProduct(currentProduct.id, {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            quantity: formData.quantity,
            categoryId: formData.categoryId,
          });
          productUpdated = true;
          productId = currentProduct.id;
        } catch (updateError) {
          console.error("Error updating product details:", updateError);
          toast.error("Không thể cập nhật thông tin sản phẩm");
          throw updateError; // Re-throw to prevent further steps
        }
      } else {
        // Create new product
        try {
          const result = await productService.createProduct({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            quantity: formData.quantity,
            categoryId: formData.categoryId,
          });
          if (result.data && result.data.id) {
            productUpdated = true;
            productId = result.data.id;
          }
        } catch (createError) {
          console.error("Error creating new product:", createError);
          toast.error("Không thể tạo sản phẩm mới");
          throw createError; // Re-throw to prevent further steps
        }
      }

      // Step 2: Only update images if the product was successfully created/updated
      if (productUpdated && formData.imageIds.length > 0) {
        try {
          // Show informative message
          toast.info(`Đang cập nhật hình ảnh cho sản phẩm #${productId}...`);
          
          // First get the product details to ensure we have the latest data
          const productDetails = await productService.getProduct(productId);
          const existingProduct = productDetails.data;
          
          // Now set the product images with all the proper product data
          await productService.updateProduct(productId, {
            name: existingProduct.name,
            description: existingProduct.description,
            price: existingProduct.price,
            quantity: existingProduct.quantity,
            categoryId: existingProduct.category?.id || formData.categoryId,
            imageIds: formData.imageIds
          });

          // Only show a success message for the whole operation once everything is done
          if (currentProduct) {
            toast.success("Cập nhật sản phẩm thành công!");
          } else {
            toast.success("Thêm sản phẩm mới thành công!");
          }

          // Refresh products list
          const productsRes = await productService.getProducts();
          setProducts(productsRes.data || []);

          // Close modal only if completely successful
          setShowModal(false);
        } catch (imageError) {
          console.error("Error setting product images:", imageError);
          toast.warning(
            "Sản phẩm đã được lưu nhưng có lỗi khi cập nhật hình ảnh."
          );

          // Still refresh products and close modal since basic product was saved
          const productsRes = await productService.getProducts();
          setProducts(productsRes.data || []);
          setShowModal(false);
        }
      } else if (productUpdated) {
        // If there are no images but product was updated successfully
        if (currentProduct) {
          toast.success("Cập nhật sản phẩm thành công!");
        } else {
          toast.success("Thêm sản phẩm mới thành công!");
        }

        // Refresh products list
        const productsRes = await productService.getProducts();
        setProducts(productsRes.data || []);

        // Close modal
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Không thể lưu sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Handle product deletion
  const handleDelete = async (product) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`)
    ) {
      try {
        setLoading(true);
        await productService.deleteProduct(product.id);

        // Refresh products list
        const productsRes = await productService.getProducts();
        setProducts(productsRes.data || []);

        toast.success("Xóa sản phẩm thành công!");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter products based on search and category filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory
      ? product.category?.id === Number(filterCategory)
      : true;

    return matchesSearch && matchesCategory;
  }); 
  
  // Image handling functions - optimized for better error handling using imageUtils
  const handleFileChange = async (e) => {
    const rawFiles = Array.from(e.target.files);
    if (rawFiles.length === 0) return;

    // Strictly limit number of images uploaded at once to prevent timeouts
    const MAX_IMAGES = 2;
    const MAX_FILE_SIZE_MB = 2; // Maximum 2MB per file before compression
    
    // Check for oversized files and reject them immediately
    const oversizedFiles = rawFiles.filter(file => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => f.name).join(", ");
      toast.error(
        `Các hình ảnh quá lớn (${fileNames}) vượt quá giới hạn ${MAX_FILE_SIZE_MB}MB. Vui lòng nén hình ảnh trước khi tải lên.`
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
      return;
    }
    
    if (rawFiles.length > MAX_IMAGES) {
      toast.warning(
        `Vui lòng chọn tối đa ${MAX_IMAGES} hình ảnh mỗi lần tải lên để tránh lỗi timeout. Chỉ ${MAX_IMAGES} hình ảnh đầu tiên sẽ được xử lý.`
      );
      // Only process the first MAX_IMAGES
      rawFiles.splice(MAX_IMAGES);
    }

    let uploadToast = toast.loading("Đang chuẩn bị hình ảnh...");

    try {
      setImageUploading(true);

      // Import the compressImages function from imageUtils (dynamic import to prevent issues)
      const { compressImages } = await import("../../utils/imageUtils");      // Even more aggressive compression for large images to avoid timeouts
      const compressionOptions = {
        maxSizeMB: 0.4, // Reduced to 0.4 MB max file size
        maxWidthOrHeight: 600, // Reduced to 600px max width/height
        quality: 0.5, // 50% quality - prioritizing upload success over quality
      };
      
      // Special handling for very large images (>800KB)
      for (let i = 0; i < rawFiles.length; i++) {
        if (rawFiles[i].size > 800 * 1024) { // If larger than 800KB
          toast.info(`Hình ảnh "${rawFiles[i].name}" có kích thước lớn (${Math.round(rawFiles[i].size/1024)}KB). Đang áp dụng nén cao.`);
        }
      }

      // Indicate compression is in progress
      toast.update(uploadToast, {
        render: "Đang nén và tối ưu hình ảnh...",
        isLoading: true,
      });

      // Process and compress all files
      const files = await compressImages(rawFiles, compressionOptions);

      // Update toast to show upload progress
      toast.update(uploadToast, {
        render: "Đang tải lên hình ảnh, vui lòng chờ đợi...",
        isLoading: true,
      });

      // Process one image at a time to avoid overwhelming the server
      const uploadedImageIds = [];
      
      for (let i = 0; i < files.length; i++) {
        try {
          // Update progress in the toast
          toast.update(uploadToast, {
            render: `Đang tải lên hình ảnh ${i + 1}/${files.length}...`,
            isLoading: true,
          });
            // Add a delay between uploads to prevent server overload
          if (i > 0) {
            // Wait a bit between uploads to give the server time to process
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
          // Show file size information
          const fileSizeKB = Math.round(files[i].size / 1024);
          toast.update(uploadToast, {
            render: `Đang tải lên hình ảnh ${i + 1}/${files.length} (${fileSizeKB}KB)...`,
            isLoading: true,
          });
          
          // Upload individual file with retry mechanism
          let retries = 0;
          let uploadSuccess = false;
          let response;
          
          while (!uploadSuccess && retries < 3) {
            try {
              response = await fileService.uploadProductImages([files[i]]);
              uploadSuccess = true;
            } catch (uploadError) {
              retries++;
              if (retries >= 3) {
                throw uploadError; // Give up after 3 attempts
              }
              
              // Wait longer between retries
              const retryDelay = retries * 2000;
              toast.update(uploadToast, {
                render: `Đang thử lại lần ${retries}/3 sau ${retryDelay/1000}s...`,
                isLoading: true,
              });
              
              await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
          }
          
          if (response?.data && response.data.imageIds && response.data.imageIds.length > 0) {
            // Add new image ID to our collection
            uploadedImageIds.push(...response.data.imageIds);
            
            // Update progress
            toast.update(uploadToast, {
              render: `Đã tải lên ${i + 1}/${files.length} hình ảnh...`,
              isLoading: true,
            });
            
            // Wait a moment for the server to process before continuing
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (error) {
          console.error(`Error uploading image ${i + 1}:`, error);
          // Continue with next image instead of failing completely
          toast.error(`Không thể tải lên hình ảnh ${i + 1}. Đang thử hình tiếp theo.`);
        }
      }

      if (uploadedImageIds.length > 0) {
        // Add all successfully uploaded image IDs to the form data
        setFormData((prev) => ({
          ...prev,
          imageIds: [...prev.imageIds, ...uploadedImageIds],
        }));

        if (uploadToast) {
          toast.update(uploadToast, {
            render: `${uploadedImageIds.length}/${files.length} hình ảnh được tải lên thành công!`,
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        } else {
          toast.success("Upload hình ảnh thành công!");
        }        // Enhanced preloading to prevent ERR_CONTENT_LENGTH_MISMATCH errors
        // Using progressive loading with different quality settings
        uploadedImageIds.forEach((imageId, index) => {
          // First load tiny thumbnail version to ensure server responds
          setTimeout(() => {
            const tinyImg = new Image();
            tinyImg.onload = () => {
              console.log(`Tiny image ${imageId} preloaded successfully`);
              
              // After tiny image loads successfully, try loading medium quality
              setTimeout(() => {
                const mediumImg = new Image();
                mediumImg.onload = () => {
                  console.log(`Medium image ${imageId} preloaded successfully`);
                  
                  // Finally try loading full quality if medium succeeds
                  setTimeout(() => {
                    const fullImg = new Image();
                    fullImg.onload = () => console.log(`Full image ${imageId} preloaded successfully`);
                    fullImg.onerror = () => console.warn(`Failed to preload full image ${imageId}, but lower quality versions are available`);
                    fullImg.src = getImageUrl({ 
                      id: imageId,
                      options: { quality: 'auto' }
                    });
                  }, 500);
                };
                mediumImg.onerror = () => console.error(`Failed to preload medium image ${imageId}`);
                mediumImg.src = getImageUrl({ 
                  id: imageId,
                  options: { width: 300, quality: 'auto' }
                });
              }, 300);
            };
            tinyImg.onerror = () => console.error(`Failed to preload tiny image ${imageId}`);
            tinyImg.src = getImageUrl({ 
              id: imageId,
              options: { width: 50, quality: 'auto' }
            });
          }, index * 500); // Increased spacing between image sets
        });
      }
    } catch (error) {
      console.error("Error uploading images:", error);

      // More detailed error messages
      if (error.code === "ECONNABORTED") {
        toast.error(
          "Tải lên hình ảnh bị gián đoạn do quá thời gian chờ. Vui lòng thử lại với ít hình ảnh hơn hoặc hình ảnh có kích thước nhỏ hơn."
        );
      } else {
        toast.error("Không thể upload hình ảnh. Vui lòng thử lại sau.");
      }
    } finally {
      setImageUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Quản lý Sản phẩm
        </h1>
        <div className="flex gap-3">
          {/* Hidden diagnostic tool button - only shows in development mode */}
          {import.meta.env.DEV && (
            <button
              onClick={async () => {
                toast.info("Kiểm tra hệ thống hình ảnh...");

                // Get all product image IDs from current products
                const imageIds = products
                  .filter((p) => p.images && p.images.length > 0)
                  .flatMap((p) => p.images.map((img) => img.id))
                  .slice(0, 5); // Test just a few

                if (imageIds.length === 0) {
                  toast.warning("Không tìm thấy hình ảnh để kiểm tra");
                  return;
                }

                try {
                  // Import the image test utilities dynamically
                  const { runImageTests } = await import("../../utils/imageTests");
                  const results = await runImageTests(imageIds);

                  if (results.success) {
                    toast.success(
                      `✅ Hệ thống hình ảnh hoạt động tốt (${results.successful}/${results.total})`
                    );
                  } else {
                    toast.error(
                      `⚠️ Phát hiện vấn đề hình ảnh (${results.failed}/${results.total} bị lỗi)`
                    );
                    console.log("Chi tiết lỗi:", results.details);
                  }
                } catch (error) {
                  console.error("Test error:", error);
                  toast.error("Lỗi khi kiểm tra hình ảnh");
                }
              }}
              className="flex items-center px-3 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              title="Kiểm tra và sửa lỗi hình ảnh"
            >
              🔍 Kiểm tra
            </button>
          )}

          <button
            onClick={handleAddNew}
            className="flex items-center px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            Thêm sản phẩm mới
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col mb-6 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <SearchIcon className="absolute w-5 h-5 text-gray-400 top-2.5 left-3" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-2.5"
            >
              <XCircleIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <div className="relative md:w-1/4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <FilterIcon className="absolute w-5 h-5 text-gray-400 top-2.5 left-3" />
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Sản phẩm
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Danh mục
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Giá
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Số lượng
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase"
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-sm text-center text-gray-500"
                >
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
                    <span className="ml-2">Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-sm text-center text-gray-500"
                >
                  Không tìm thấy sản phẩm nào
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {" "}
                      <div className="flex-shrink-0 w-10 h-10">                        {product.images && product.images.length > 0 ? (
                          <img
                            className="object-cover w-10 h-10 rounded-full"
                            ref={imageRef => {
                              if (imageRef) {
                                loadImageProgressively({
                                  imgElement: imageRef,
                                  src: {
                                    id: product.images[0]?.id,
                                    url: product.images[0]?.url,
                                    options: { 
                                      width: 40, 
                                      quality: 'auto',
                                      crop: 'fill' 
                                    }
                                  },
                                  onError: () => {
                                    console.log(`Failed to load image for ${product.name}, using fallback`);
                                  },
                                  fallbackUrl: '/dummy.png'
                                });
                              }
                            }}
                            alt={product.name}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                            <span className="text-sm text-gray-500">
                              No img
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.description?.length > 50
                            ? `${product.description.substring(0, 50)}...`
                            : product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.category?.name || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.quantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(product)}
                      className="inline-flex items-center px-2 py-1 mr-3 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <PencilAltIcon className="w-4 h-4 mr-1" />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="inline-flex items-center px-2 py-1 text-sm text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative w-full max-w-2xl mx-auto my-6">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h3 className="text-lg font-semibold">
                  {currentProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowModal(false)}
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-6">
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Tên sản phẩm
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Mô tả
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Giá
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        min="0"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Số lượng
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Danh mục
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>{" "}
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Hình ảnh sản phẩm
                    </label>
                    {/* Upload new images */}{" "}
                    <div className="flex items-center mb-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                        id="product-images"
                      />                      <label
                        htmlFor="product-images"
                        className={`flex items-center px-4 py-2 text-sm text-white rounded-md cursor-pointer ${
                          imageUploading
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        <PhotoIcon className="w-5 h-5 mr-2" />
                        {imageUploading
                          ? "Đang tải lên..."
                          : "Tải lên hình ảnh"}
                      </label>
                      <span className="ml-3 text-sm text-gray-500">
                        Chọn một hoặc nhiều hình ảnh (tối đa 2 hình / lần, dưới 1MB mỗi hình)
                      </span>
                    </div>                    {imageUploading && (
                      <div className="mb-3 p-2 bg-yellow-50 border border-yellow-100 rounded text-sm">
                        <p className="text-yellow-700 font-medium">
                          Đang xử lý hình ảnh, vui lòng chờ...
                        </p>
                        <div className="flex items-center justify-between mb-1 text-xs text-yellow-800">
                          <span>Đang nén và tối ưu hình ảnh</span>
                          <span>Có thể mất 10-30 giây</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div
                            className="bg-yellow-500 h-2.5 rounded-full animate-progress"
                            style={{ width: "100%", animationDuration: "1.5s" }}
                          ></div>
                        </div>
                        <p className="mt-2 text-xs text-yellow-600 italic">
                          Lưu ý: Không đóng cửa sổ hoặc tải lên thêm hình ảnh cho đến khi quá trình này hoàn tất.
                          Việc tối ưu hóa hình ảnh giúp ngăn chặn lỗi ERR_CONTENT_LENGTH_MISMATCH.
                        </p>
                      </div>
                    )}
                    {/* Image selection grid - Chỉ hiển thị hình ảnh đã chọn */}
                    <div className="grid grid-cols-4 gap-3 mt-3">
                      {formData.imageIds.map((imageId, index) => (                        
                        <div
                          key={imageId}
                          className={`relative border rounded-md overflow-hidden ${
                            index === 0
                              ? "border-blue-500 ring-2 ring-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          <div className="aspect-square bg-gray-100">                            <img
                              ref={imageRef => {
                                if (imageRef) {
                                  loadImageProgressively({
                                    imgElement: imageRef,
                                    src: {
                                      id: imageId,
                                      options: { 
                                        width: 200, 
                                        quality: 'auto',
                                        crop: 'fill' 
                                      }
                                    },
                                    onSuccess: () => console.log(`Image ${imageId} loaded successfully`),
                                    onError: () => console.log(`Failed to load image ${imageId}, using fallback`),
                                    fallbackUrl: '/dummy.png'
                                  });
                                }
                              }}
                              alt={`Hình ảnh ${index + 1}`}
                              className="object-cover w-full h-full"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>

                          {/* Main image badge */}
                          {index === 0 && (
                            <div className="absolute top-1 left-1 bg-blue-500 rounded-full p-0.5">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-white"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                              </svg>
                            </div>
                          )}

                          {/* Remove image button */}
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-sm hover:bg-red-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Chỉ xóa khỏi danh sách, không gọi API xóa
                              setFormData((prev) => ({
                                ...prev,
                                imageIds: prev.imageIds.filter(
                                  (id) => id !== imageId
                                ),
                              }));
                            }}
                          >
                            <XMarkIcon className="h-4 w-4 text-red-500" />
                          </button>
                          {/* Move up button if not first */}
                          {index !== 0 && (
                            <button
                              type="button"
                              className="absolute bottom-8 right-1 bg-white rounded-full p-0.5 shadow-sm hover:bg-blue-100"
                              onClick={() => {
                                // Di chuyển hình ảnh lên, đặt làm hình ảnh chính
                                const makeMainImageToast = toast.loading(
                                  "Đang đặt làm hình ảnh chính..."
                                );

                                // Update state first for responsive UI
                                setFormData((prev) => {
                                  const newImageIds = [...prev.imageIds];
                                  const idToMove = newImageIds.splice(
                                    index,
                                    1
                                  )[0];
                                  newImageIds.unshift(idToMove);
                                  return { ...prev, imageIds: newImageIds };
                                });

                                // Dismiss loading toast with success message
                                setTimeout(() => {
                                  toast.update(makeMainImageToast, {
                                    render: "Đã đặt làm hình ảnh chính",
                                    type: "success",
                                    isLoading: false,
                                    autoClose: 2000,
                                  });
                                }, 300);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-blue-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}

                      {formData.imageIds.length === 0 && (
                        <div className="col-span-4 p-4 text-center text-gray-500 border border-dashed rounded-md">
                          <p>Chưa có hình ảnh nào. Tải lên hình ảnh mới.</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>
                        Hình ảnh đầu tiên sẽ là hình ảnh chính hiển thị cho sản
                        phẩm
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end p-6 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-4 py-2 mr-3 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? "Đang lưu..." : "Lưu sản phẩm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
