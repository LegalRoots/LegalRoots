const Sequence = require("../../models/sequences/Sequences");

const getNextIdValue = async (sequenceName) => {
  const sequenceDoc = await Sequence.findOneAndUpdate(
    { sequenceName: "employeeId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return sequenceDoc.seq;
};

module.exports = getNextIdValue;
