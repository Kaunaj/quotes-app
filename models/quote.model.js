const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuoteSchema = new Schema({
  author: { type: String, default: "Anonymous" },
  text: { type: String, required: true },
  chars: { type: String, required: true, unique: true },
  meta: { type: Schema.Types.Mixed },
  done: { type: Boolean, default: false },
  timestamp: { type: Number, default: Date.now() },
});

QuoteSchema.pre("save", (next) => {
  now = Date.now;
  if (!this.created_at) {
    this.created_at = now;
  }
  if (!this.modified_at) {
    this.modified_at = now;
  }
  next();
});

QuoteSchema.post("save", function (doc) {
  console.log("%s has been saved", doc._id);
});

const Quote = mongoose.model("quote", QuoteSchema);

QuoteSchema.index({ chars: 1, timestamp: 1 });

module.exports = Quote;
