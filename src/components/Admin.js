import React, { useState } from "react";
import axios from "axios";

const Admin = () => {
    const [product, setProduct] = useState({
        name: "",
        price: "",
    });
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("price", product.price);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:5000/add-product",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response);
            if (response.status === 201) {
                alert("Product added successfully");
                setProduct({
                    name: "",
                    price: "",
                });
                setImageFile(null);
            } else {
                alert("Failed to add product");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while adding the product");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">
                Admin Panel - Add Product
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Product Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Price
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Image
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default Admin;
