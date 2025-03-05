const ort = require("onnxruntime-node");
const path = require("path");

let session;

// Load ONNX model once at startup
(async () => {
    const modelPath = path.join(__dirname, "../models/nodetrained.onnx");
    session = await ort.InferenceSession.create(modelPath);
    console.log("✅ ONNX Model Loaded Successfully!");
})();

// Function to handle prediction
exports.predict = async (req, res) => {
    try {
        const { answers } = req.body;
            console.log(answers);
            console.log(answers.length);
        if (!answers || answers.length !== 22) {
            return res.status(400).json({ error: "Invalid input. Expecting 22 values." });
        }

        // Convert input to tensor
        const inputTensor = new ort.Tensor("float32", Float32Array.from(answers), [1, 22]);

        // Run inference
        const results = await session.run({ [session.inputNames[0]]: inputTensor });
        const output = results[session.outputNames[0]].data;

        // Apply softmax
        const expArr = output.map(x => Math.exp(x - Math.max(...output)));
        const softmaxOutput = expArr.map(x => x / expArr.reduce((a, b) => a + b, 0));

        const predictedClass = softmaxOutput.indexOf(Math.max(...softmaxOutput));

        res.json({ prediction: predictedClass, probabilities: softmaxOutput });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
