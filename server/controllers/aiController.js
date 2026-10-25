import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const predictorPath = path.resolve(currentDir, "../python/predict.py");

export const predictPrice = async (req, res) => {
  const { fabricType, material, gsm, quality, demand, season } = req.body || {};
  const parsedGsm = Number(gsm);
  const allowedMaterials = ["Cotton", "Linen", "Silk", "Denim", "Polyester", "Wool", "Viscose", "Nylon"];
  const allowedQualities = ["Standard", "Premium", "Luxury"];
  const allowedDemands = ["Low", "Medium", "High"];
  const allowedSeasons = ["Summer", "Winter", "Rainy", "All Season"];

  if (typeof fabricType !== "string" || !fabricType.trim() || fabricType.trim().length > 100 ||
      !allowedMaterials.includes(material) || !Number.isInteger(parsedGsm) || parsedGsm < 50 || parsedGsm > 1000 ||
      !allowedQualities.includes(quality) || !allowedDemands.includes(demand) || !allowedSeasons.includes(season)) {
    return res.status(400).json({ success: false, message: "Enter valid fabric details (GSM must be between 50 and 1000)" });
  }

  const executable = process.env.PYTHON_BIN || (process.platform === "win32" ? "python" : "python3");
  const child = spawn(executable, [predictorPath, fabricType.trim(), material, String(parsedGsm), quality, demand, season], {
    cwd: path.dirname(predictorPath),
    stdio: ["ignore", "pipe", "pipe"],
  });

  let output = "";
  let stderr = "";
  let responded = false;
  const timeout = setTimeout(() => {
    child.kill("SIGTERM");
    if (!responded) {
      responded = true;
      res.status(504).json({ success: false, message: "Price estimate timed out. Please try again." });
    }
  }, 8000);

  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk) => { output += chunk; });
  child.stderr.on("data", (chunk) => { stderr += chunk; });

  child.on("error", () => {
    clearTimeout(timeout);
    if (responded) return;
    responded = true;
    return res.status(503).json({ success: false, message: "Price estimator is unavailable on this server" });
  });

  child.on("close", (code) => {
    clearTimeout(timeout);
    if (responded) return;
    responded = true;
    const predictedPrice = Number(output.trim());
    if (code !== 0 || !Number.isFinite(predictedPrice) || predictedPrice <= 0) {
      if (stderr) console.error("Price estimator failed:", stderr.slice(0, 500));
      return res.status(500).json({ success: false, message: "Could not estimate this fabric price" });
    }
    return res.json({
      success: true,
      predictedPrice,
      unit: "meter",
      method: "rule-based estimate",
      disclaimer: "This is an indicative estimate, not a live market quote or a trained machine-learning prediction.",
    });
  });
};
