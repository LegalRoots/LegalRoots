const Sequence = require("../../models/sequences/Sequences");

const getNextIdValue = async (sequenceName) => {
  const sequenceDoc = await Sequence.findByIdAndUpdate(
    sequenceName,
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true }
  );

  return sequenceDoc.sequenceValue;
};

module.exports = getNextIdValue;
