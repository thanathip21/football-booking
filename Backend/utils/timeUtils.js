exports.generateTimeSlots = (
  start = "12:00",
  end = "00:00",
  slotMinutes = 60
) => {
  const slots = [];
  let [h, m] = start.split(":").map(Number);
  let [endH, endM] = end === "00:00" ? [24, 0] : end.split(":").map(Number);

  while (h < endH || (h === endH && m < endM)) {
    const startTime = `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}`;
    let totalMinutes = h * 60 + m + slotMinutes;
    let nextH = Math.floor(totalMinutes / 60);
    let nextM = totalMinutes % 60;

    const endTimeSlot =
      nextH >= 24
        ? "00:00"
        : `${nextH.toString().padStart(2, "0")}:${nextM
            .toString()
            .padStart(2, "0")}`;

    slots.push({ start_time: startTime, end_time: endTimeSlot });
    h = nextH;
    m = nextM;

    if (h === 24 && m === 0) break;
  }

  return slots;
};

// แปลงเวลา HH:MM เป็นนาที
exports.timeToMinutes = (t) => {
  // แก้จาก === "00:00" เป็น .startsWith("00:00")
  // เพื่อให้รองรับทั้ง "00:00" และ "00:00:00"
  if (t.startsWith("00:00")) return 24 * 60; // 1440

  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
