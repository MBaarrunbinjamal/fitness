const axios = require("axios");
const nodemailer = require("nodemailer");
const { ObjectId } = require("mongodb");

const API_KEY = process.env.USDA_API_KEY;

// ===============================
// Search food from USDA
// ===============================
const searchFood = async (foodName) => {

    const response = await axios.get(
        "https://api.nal.usda.gov/fdc/v1/foods/search",
        {
            params: {
                api_key: API_KEY,
                query: foodName,
                pageSize: 1
            }
        }
    );

    if (!response.data.foods || response.data.foods.length === 0) {
        return null;
    }

    return response.data.foods[0];
};

const getFoodDetails = async (fdcId) => {

    const response = await axios.get(
        `https://api.nal.usda.gov/fdc/v1/food/${fdcId}`,
        {
            params: {
                api_key: API_KEY
            }
        }
    );

    return response.data;
};

// ===============================
// Get nutrient value
// ===============================
const getNutrient = (nutrients, nutrientId) => {

    const nutrient = nutrients.find(item =>

        item.nutrient?.id === nutrientId ||
        item.nutrientId === nutrientId ||
        Number(item.nutrientNumber) === nutrientId

    );

    if (!nutrient) return 0;

    return Number(
        nutrient.amount ??
        nutrient.value ??
        0
    );

};

// ===============================
// Create Nutrition Log
// ===============================
async function createNutritionLog(req, res) {
    try {

        const db = req.db;

        const {
            foodName,
            mealType,
            grams
        } = req.body;

        const userId = req.user.id || req.user._id;

        if (
    !foodName ||
    !mealType ||
    !grams ||
    isNaN(grams) ||
    Number(grams) <= 0
) {
    return res.status(400).json({
        success: false,
        message: "Please enter a valid food name, meal type, and grams."
    });
}

        const validMeals = [
            "Breakfast",
            "Lunch",
            "Dinner",
            "Snack"
        ];

        if (!validMeals.includes(mealType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid meal type."
            });
        }

        // Search USDA
        const food = await searchFood(foodName);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food not found in USDA database."
            });
        }

        const foodDetails = await getFoodDetails(food.fdcId);

const nutrients = foodDetails.foodNutrients || [];

      const caloriesPer100 = getNutrient(nutrients, 1008);
const proteinPer100 = getNutrient(nutrients, 1003);
const fatPer100 = getNutrient(nutrients, 1004);
const carbsPer100 = getNutrient(nutrients, 1005);

        const multiplier = Number(grams) / 100;

        const nutrition = {

            userId: new ObjectId(userId),

            fdcId: food.fdcId,

            mealType,

            foodName: food.description,

            grams: Number(grams),

            calories: Number((caloriesPer100 * multiplier).toFixed(2)),

            protein: Number((proteinPer100 * multiplier).toFixed(2)),

            carbs: Number((carbsPer100 * multiplier).toFixed(2)),

            fat: Number((fatPer100 * multiplier).toFixed(2)),

            createdAt: new Date()

        };

        const result = await db
            .collection("nutrition_logs")
            .insertOne(nutrition);

        return res.status(201).json({

            success: true,

            message: "Nutrition log added successfully.",

            data: {
                _id: result.insertedId,
                ...nutrition
            }

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
}

// ===============================
// Get Today's Nutrition
// ===============================
async function getTodayNutrition(req, res) {
    try {

        const db = req.db;
        const userId = req.user.id || req.user._id;

        const start = new Date();
        start.setHours(0,0,0,0);

        const end = new Date();
        end.setHours(23,59,59,999);

        const logs = await db.collection("nutrition_logs")
            .find({
                userId: new ObjectId(userId),
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            })
            .toArray();

        const totals = logs.reduce((acc, item) => {

            acc.calories += item.calories || 0;
            acc.protein += item.protein || 0;
            acc.carbs += item.carbs || 0;
            acc.fat += item.fat || 0;

            return acc;

        }, {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
        });

        return res.json({
            success: true,
            totals,
            logs
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// ===============================
// Get Nutrition By Date
// ===============================
async function getNutritionByDate(req, res) {
    try {

        const db = req.db;
        const userId = req.user.id || req.user._id;
        const { date } = req.params;

        const start = new Date(date);
        start.setHours(0,0,0,0);

        const end = new Date(date);
        end.setHours(23,59,59,999);

        const logs = await db.collection("nutrition_logs")
            .find({
                userId: new ObjectId(userId),
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            })
            .toArray();

        return res.json({
            success: true,
            logs
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// ===============================
// Delete Nutrition Log
// ===============================
async function deleteNutritionLog(req, res) {
    try {

        const db = req.db;
        const userId = req.user.id || req.user._id;
        const { id } = req.params;

        await db.collection("nutrition_logs").deleteOne({
            _id: new ObjectId(id),
            userId: new ObjectId(userId)
        });

        return res.json({
            success: true,
            message: "Nutrition log deleted successfully."
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// ===============================
// Send Daily Nutrition Email
// ===============================
async function sendDailyNutritionEmail(db, user) {

    const start = new Date();
    start.setHours(0,0,0,0);

    const end = new Date();
    end.setHours(23,59,59,999);

    const logs = await db.collection("nutrition_logs")
        .find({
            userId: new ObjectId(user._id),
            createdAt: {
                $gte: start,
                $lte: end
            }
        })
        .toArray();

    if (!logs.length) return;

    const totals = logs.reduce((acc, item) => {

        acc.calories += item.calories || 0;
        acc.protein += item.protein || 0;
        acc.carbs += item.carbs || 0;
        acc.fat += item.fat || 0;

        return acc;

    }, {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    });

    let rows = "";

    logs.forEach(log => {
        rows += `
            <tr>
                <td>${log.mealType}</td>
                <td>${log.foodName}</td>
                <td>${log.grams}g</td>
                <td>${log.calories}</td>
                <td>${log.protein}</td>
                <td>${log.carbs}</td>
                <td>${log.fat}</td>
            </tr>
        `;
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const html = `
        <h2>Daily Nutrition Summary</h2>

        <table border="1" cellpadding="8" cellspacing="0">
            <tr>
                <th>Meal</th>
                <th>Food</th>
                <th>Quantity</th>
                <th>Calories</th>
                <th>Protein</th>
                <th>Carbs</th>
                <th>Fat</th>
            </tr>

            ${rows}
        </table>

        <h3>Totals</h3>

        <ul>
            <li><b>Calories:</b> ${totals.calories.toFixed(2)} kcal</li>
            <li><b>Protein:</b> ${totals.protein.toFixed(2)} g</li>
            <li><b>Carbs:</b> ${totals.carbs.toFixed(2)} g</li>
            <li><b>Fat:</b> ${totals.fat.toFixed(2)} g</li>
        </ul>
    `;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Your Daily Nutrition Report",
        html
    });
}

// ===============================
// Exports
// ===============================
module.exports = {
    createNutritionLog,
    getTodayNutrition,
    getNutritionByDate,
    deleteNutritionLog,
    sendDailyNutritionEmail
};