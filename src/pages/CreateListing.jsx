import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!files || files.length < 1 || files.length > 5) {
      toast.error("You must upload between 1 and 5 images.");
      return;
    }

    setIsUploading(true);
    const uploadedUrls = [];
    const validFiles = Array.from(files).filter((file) => file instanceof File);

    const uploadPromises = validFiles.map(async (file) => {
      const formDataObj = new FormData();
      formDataObj.append("image", file);

      try {
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMAGEBB_API_KEY
          }`,
          {
            method: "POST",
            body: formDataObj,
          }
        );

        const data = await response.json();
        if (data.success) {
          uploadedUrls.push(data.data.url);
        } else {
          throw new Error(data.error.message);
        }
      } catch (err) {
        toast.error("Error uploading some images.");
      }
    });

    await Promise.all(uploadPromises);

    if (uploadedUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        imageUrls: uploadedUrls,
      }));
      toast.success("Images uploaded successfully!");
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset input field
      }
      setFiles([]); // Clear selected files
    }

    setIsUploading(false);
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    // For radio buttons (listing type)
    if (e.target.name === "type") {
      setFormData({
        ...formData,
        type: e.target.value,
      });
      return;
    }

    // For checkboxes
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
      return;
    }

    // For other inputs
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageUrls.length < 1) {
      setError("You must upload at least one image");
      return;
    }
    if (+formData.regularPrice < +formData.discountPrice) {
      setError("Discount price must be lower than regular price");
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      toast.success("Listing created successfully!");
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="bg-white shadow-md rounded-lg p-8 max-w-4xl mx-auto mt-10">
      <h1 className="font-bold text-7xl sm:text-xl text-center drop-shadow-md flex justify-center p-5">
        <p className="text-slate-500 text-5xl">Create</p>
        <p className="text-slate-700 text-5xl">Listing</p>
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Left Section - Details */}
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Name"
                maxLength="62"
                minLength="10"
                required
                onChange={handleChange}
                value={formData.name}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                placeholder="Description"
                required
                onChange={handleChange}
                value={formData.description}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium mb-1"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                placeholder="Address"
                required
                onChange={handleChange}
                value={formData.address}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Listing Type Radio */}
            <div>
              <p className="block text-sm font-medium mb-1">Listing Type</p>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="sale"
                    onChange={handleChange}
                    checked={formData.type === "sale"}
                    className="mr-2"
                  />
                  Sell
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="rent"
                    onChange={handleChange}
                    checked={formData.type === "rent"}
                    className="mr-2"
                  />
                  Rent
                </label>
              </div>
            </div>
            {/* Options */}
            <div>
              <p className="block text-sm font-medium mb-1">Options</p>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id="parking"
                    onChange={handleChange}
                    checked={formData.parking}
                    className="mr-2"
                  />
                  Parking Spot
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id="furnished"
                    onChange={handleChange}
                    checked={formData.furnished}
                    className="mr-2"
                  />
                  Furnished
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id="offer"
                    onChange={handleChange}
                    checked={formData.offer}
                    className="mr-2"
                  />
                  Offer
                </label>
              </div>
            </div>
            {/* Pricing and Rooms */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="bedrooms"
                  className="block text-sm font-medium mb-1"
                >
                  Beds
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="10"
                  required
                  onChange={handleChange}
                  value={formData.bedrooms}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="bathrooms"
                  className="block text-sm font-medium mb-1"
                >
                  Baths
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="10"
                  required
                  onChange={handleChange}
                  value={formData.bathrooms}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="regularPrice"
                  className="block text-sm font-medium mb-1"
                >
                  Regular Price ($ / month)
                </label>
                <input
                  type="number"
                  id="regularPrice"
                  min="50"
                  max="10000000"
                  required
                  onChange={handleChange}
                  value={formData.regularPrice}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {formData.offer && (
                <div>
                  <label
                    htmlFor="discountPrice"
                    className="block text-sm font-medium mb-1"
                  >
                    Discounted Price ($ / month)
                  </label>
                  <input
                    type="number"
                    id="discountPrice"
                    min="0"
                    max="10000000"
                    required
                    onChange={handleChange}
                    value={formData.discountPrice}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Images */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-2">
                Images{" "}
                <span className="text-gray-500 text-xs">
                  (The first image will be the cover - max 5 images)
                </span>
              </p>
              <div className="flex gap-4">
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  ref={fileInputRef}
                  onClick={handleImageSubmit}
                  disabled={isUploading}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 disabled:opacity-70"
                >
                  {isUploading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </div>
            {formData.imageUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className="relative group p-2 border rounded-md shadow-sm bg-gray-50"
                  >
                    <img
                      src={url}
                      alt="Listing"
                      className="w-full h-32 object-cover rounded-md transition-transform transform group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow-md transition-opacity opacity-0 group-hover:opacity-100 hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              disabled={loading}
              type="submit"
              className="w-full px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-500 transition-colors disabled:opacity-70"
            >
              {loading ? "Creating..." : "Create Listing"}
            </button>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>
        </div>
      </form>
    </main>
  );
}
