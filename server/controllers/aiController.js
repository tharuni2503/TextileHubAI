import { spawn } from "child_process";

export const predictPrice = async (req, res) => {
  try {
    const {
      fabricType,
      material,
      gsm,
      quality,
      demand,
      season,
    } = req.body;

    const python = spawn("python", [
      "./python/predict.py",
      fabricType,
      material,
      gsm,
      quality,
      demand,
      season,
    ]);

    let result = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.log(data.toString());
    });

    python.on("close", () => {
      res.json({
        success: true,
        predictedPrice: result.trim(),
      });
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};