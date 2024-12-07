const PaymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    amount: { type: Number, required: true },
    payee: {type : String, required: true},
    paymentDate: { type: Date, default: Date.now },
    paymentStatus: { type: String, enum: ["pending", "completed", "failed"], required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("Payment", PaymentSchema);
  