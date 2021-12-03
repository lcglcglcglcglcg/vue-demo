// 天地转高德 (地球坐标系(WGS-84)转火星坐标系(GCJ))
export function transWGSToGCJ2(wgLat, wgLon) {
  var pi = 3.14159265358979324;
  var a = 6378245.0;
  var ee = 0.00669342162296594323;

  function transform(wgLat, wgLon) {
    var mars_point = { lon: 0, lat: 0 };
    if (outOfChina(wgLon, wgLat)) {
      mars_point.lat = wgLat;
      mars_point.lon = wgLon;
      return;
    }

    var dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
    var dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
    var radLat = (wgLat / 180.0) * pi;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * pi);
    dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * pi);
    mars_point.lat = wgLat + dLat;
    mars_point.lon = wgLon + dLon;
    return mars_point;
  }
  /*判断是否在国内，不在国内则不做偏移*/
  function outOfChina(lon, lat) {
    if ((lon < 72.004 || lon > 137.8347) && (lat < 0.8293 || lat > 55.8271)) {
      return true;
    } else {
      return false;
    }
  }
  function transformLat(x, y) {
    var ret =
      -100.0 +
      2.0 * x +
      3.0 * y +
      0.2 * y * y +
      0.1 * x * y +
      0.2 * Math.sqrt(Math.abs(x));
    ret +=
      ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(y * pi) + 40.0 * Math.sin((y / 3.0) * pi)) * 2.0) / 3.0;
    ret +=
      ((160.0 * Math.sin((y / 12.0) * pi) + 320 * Math.sin((y * pi) / 30.0)) *
        2.0) /
      3.0;
    return ret;
  }
  function transformLon(x, y) {
    var ret =
      300.0 +
      x +
      2.0 * y +
      0.1 * x * x +
      0.1 * x * y +
      0.1 * Math.sqrt(Math.abs(x));
    ret +=
      ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(x * pi) + 40.0 * Math.sin((x / 3.0) * pi)) * 2.0) / 3.0;
    ret +=
      ((150.0 * Math.sin((x / 12.0) * pi) + 300.0 * Math.sin((x / 30.0) * pi)) *
        2.0) /
      3.0;
    return ret;
  }
  if (typeof wgLat == "string" || typeof wgLon == "string") {
    return transform(+wgLat, +wgLon);
  } else {
    return transform(wgLat, wgLon);
  }
}

// 高德转天地（火星坐标系GCJ02转地球坐标系WGS84）
export function transGCJ2ToWGS(gcjLat, gcjLon) {
  var PI = 3.14159265358979324;
  function transformGCJ2WGS(gcjLat, gcjLon) {
    let d = delta(gcjLat, gcjLon);
    return {
      lat: gcjLat - d.lat,
      lon: gcjLon - d.lon,
    };
  }

  function delta(lat, lon) {
    let a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
    let ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
    let dLat = transformLat(lon - 105.0, lat - 35.0);
    let dLon = transformLon(lon - 105.0, lat - 35.0);
    let radLat = (lat / 180.0) * PI;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    let sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * PI);
    dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * PI);
    return {
      lat: dLat,
      lon: dLon,
    };
  }
  function transformLat(x, y) {
    let ret =
      -100.0 +
      2.0 * x +
      3.0 * y +
      0.2 * y * y +
      0.1 * x * y +
      0.2 * Math.sqrt(Math.abs(x));
    ret +=
      ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) / 3.0;
    ret +=
      ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) *
        2.0) /
      3.0;
    return ret;
  }
  function transformLon(x, y) {
    let ret =
      300.0 +
      x +
      2.0 * y +
      0.1 * x * x +
      0.1 * x * y +
      0.1 * Math.sqrt(Math.abs(x));
    ret +=
      ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) / 3.0;
    ret +=
      ((150.0 * Math.sin((x / 12.0) * PI) + 300.0 * Math.sin((x / 30.0) * PI)) *
        2.0) /
      3.0;
    return ret;
  }
  if (typeof gcjLat == "string" || typeof gcjLon == "string") {
    return transformGCJ2WGS(+gcjLat, +gcjLon);
  } else {
    return transformGCJ2WGS(gcjLat, gcjLon);
  }
}
