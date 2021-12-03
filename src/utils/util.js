// 在线时长格式化 如: 1h2m3s
export function timeFormatter(val) {
  let text;
  if (val < 60) {
    text = `${val}` + $it("s");
  } else if (val >= 60 && val < 3600) {
    text =
      `${parseInt(val / 60)}` + $it("m") + `${parseInt(val % 60)}` + $it("s");
  } else if (val >= 3600) {
    text =
      `${parseInt(val / 3600)}` +
      $it("h") +
      `${parseInt((val % 3600) / 60)}` +
      $it("m") +
      `${parseInt((val % 3600) % 60)}` +
      $it("s");
  }
  return text;
}

// 格式化命令类型
export function decodeMode(v) {
  let str = "";
  switch (v) {
    case 0:
      str = "Auto";
      break;
    case 1:
      str = "Trimble RT27";
      break;
    case 2:
      str = "Novatel";
      break;
    case 3:
      str = "ComNav";
      break;
    case 4:
      str = "UNICORE";
      break;
    case 5:
      str = "TOPCON(Java)";
      break;
    case 6:
      str = "Hemisphere";
      break;
    case 7:
      str = "RTCM 3.X";
      break;
    case 8:
      str = "SOUTH DATA EXCHANGE";
      break;
  }
  return str;
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (!time) {
    return "-";
  }
  if (typeof time === "object") {
    date = time;
  } else {
    if (("" + time).length === 10) time = parseInt(time) * 1000;
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === "a") {
      return ["一", "二", "三", "四", "五", "六", "日"][value - 1];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}
