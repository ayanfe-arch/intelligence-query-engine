const Profile = require('../models/Profile');


// ==========================
// Helper: Clean Response
// ==========================
const formatProfile = (doc) => {
  return {
    id: doc.id,
    name: doc.name,
    gender: doc.gender,
    gender_probability: doc.gender_probability,
    age: doc.age,
    age_group: doc.age_group,
    country_id: doc.country_id,
    country_name: doc.country_name,
    country_probability: doc.country_probability,
    created_at: doc.created_at
  };
};


// ==========================
// GET /api/profiles
// ==========================
exports.getProfiles = async (req, res) => {
  try {
    const {
      gender,
      age_group,
      country_id,
      min_age,
      max_age,
      min_gender_probability,
      min_country_probability,
      sort_by,
      order = "asc",
      page = 1,
      limit = 10
    } = req.query;

    let query = {};

    // ===== Filtering =====
    if (gender) query.gender = gender;
    if (age_group) query.age_group = age_group;
    if (country_id) query.country_id = country_id;

    if (min_age || max_age) {
      query.age = {};
      if (min_age) query.age.$gte = Number(min_age);
      if (max_age) query.age.$lte = Number(max_age);
    }

    if (min_gender_probability) {
      query.gender_probability = { $gte: Number(min_gender_probability) };
    }

    if (min_country_probability) {
      query.country_probability = { $gte: Number(min_country_probability) };
    }

    // ===== Sorting =====
    const allowedSortFields = ["age", "created_at", "gender_probability"];
    let sort = {};

    if (sort_by) {
      if (!allowedSortFields.includes(sort_by)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid query parameters"
        });
      }
      sort[sort_by] = order === "desc" ? -1 : 1;
    }

    // ===== Pagination =====
    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 10, 50);
    const skip = (pageNum - 1) * limitNum;

    // ===== Query DB =====
    const total = await Profile.countDocuments(query);

    const rawData = await Profile.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // ===== Clean Output =====
    const data = rawData.map(formatProfile);

    res.status(200).json({
      status: "success",
      page: pageNum,
      limit: limitNum,
      total,
      data
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};


// ==========================
// GET /api/profiles/search
// ==========================
exports.searchProfiles = async (req, res) => {
  try {
    const q = req.query.q?.toLowerCase();

    if (!q) {
      return res.status(400).json({
        status: "error",
        message: "Unable to interpret query"
      });
    }

    let filters = {};

    // ===== Gender =====
    if (q.includes("male")) filters.gender = "male";
    if (q.includes("female")) filters.gender = "female";

    // ===== Age logic =====
    if (q.includes("young")) {
      filters.age = { $gte: 16, $lte: 24 };
    }

    const aboveMatch = q.match(/above (\d+)/);
    if (aboveMatch) {
      filters.age = { ...(filters.age || {}), $gte: Number(aboveMatch[1]) };
    }

    // ===== Age group =====
    if (q.includes("teenager")) filters.age_group = "teenager";
    if (q.includes("adult")) filters.age_group = "adult";
    if (q.includes("child")) filters.age_group = "child";
    if (q.includes("senior")) filters.age_group = "senior";

    // ===== Country mapping =====
    const countries = {
      nigeria: "NG",
      kenya: "KE",
      angola: "AO",
      ghana: "GH",
      benin: "BJ",
      uganda: "UG"
    };

    for (let country in countries) {
      if (q.includes(country)) {
        filters.country_id = countries[country];
      }
    }

    // ===== Validation =====
    if (Object.keys(filters).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Unable to interpret query"
      });
    }

    // ===== Pagination =====
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const total = await Profile.countDocuments(filters);

    const rawData = await Profile.find(filters)
      .skip(skip)
      .limit(limit);

    const data = rawData.map(formatProfile);

    res.status(200).json({
      status: "success",
      page,
      limit,
      total,
      data
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};