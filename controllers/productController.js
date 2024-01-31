const cloudinary = require('cloudinary').v2;
const Product = require('../models/Product');

cloudinary.config({
  cloud_name: 'djj6r7rmj',
  api_key: '278451539131862',
  api_secret: 'unPyS7q4azu-f8saffwixCa3Hpo'
});

exports.createProduct = async (req, res) => {
  const { title, description, prices, extraOptions, images } = req.body;
  try {

    // Create a new product with the uploaded image URLs
    const product = new Product({
      title,
      description,
      prices,
      extraOptions,
      images,
    });

    console.log(product, " this is product");

    await product.save();

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Failed to create product:', error);
    res.status(500).json({ message: 'Failed to create product', error });
  }
};

exports.getProductss = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default to first page
    const limit = parseInt(req.query.limit) || 10; // default to 10 items per page

    // Calculate skip value based on page and limit
    const skip = (page - 1) * limit;

    // Fetch total number of products
    const totalProducts = await Product.countDocuments();

    // Fetch products for current page
    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: "desc" });

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching products" });
  }

};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProductById = async (req, res) => {
  try {
    const { title, prices, extras, category } = req.body;

    // Find the product by ID
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Upload new images to Cloudinary if provided
    if (req.files) {
      const images = [];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        images.push(result.secure_url);
      }

      product.images = images;
    }

    // Update the product
    product.title = title;
    product.prices = prices;
    product.extras = extras;
    product.category = category;

    await product.save();

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if the product with the given ID exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Remove the product from the database
    await Product.findByIdAndDelete(productId);

    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Function to search for products with pagination
exports.getProducts = async (req, res) => {
  try {
    // Extract query parameters from the request
    const { category, sortBy, sortOrder, page = 1, pageSize = 10, searchTerm } = req.query;

    // Construct the MongoDB query based on the provided parameters
    const query = {};
    if (category) {
      query.category = category;
    }

    // Add search term to query if provided
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    // Add sorting options if provided
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * pageSize;

    // Fetch products with pagination from the database
    const products = await Product.find(query).sort(sortOptions).skip(skip).limit(Number(pageSize));

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.uploadImages = async (req, res) => {
  try {
    const imageUrls = []; // Array to store image URLs

    // Loop through uploaded files and upload them to Cloudinary
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path); // Upload file to Cloudinary
      imageUrls.push(result.secure_url); // Push image URL to array
    }

    // Return image URLs in the response
    res.status(200).json({ success: true, imageUrls });
  } catch (error) {
    console.error('Failed to upload images:', error);
    res.status(500).json({ success: false, error: 'Failed to upload images' });
  }
};

exports.getProductsCount = async (req, res) => {
  try {
    // Get the total number of products
    const totalProductsCount = await Product.countDocuments();

    res.json({ totalProductsCount });
  } catch (error) {
    console.error('Error getting products count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};