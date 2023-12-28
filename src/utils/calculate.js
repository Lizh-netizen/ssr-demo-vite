export function calculateCommonAngle(coordinates) {
  const a = coordinates.find((cor) => cor.label == 'ANS')
  const b = coordinates.find((cor) => cor.label == 'PNS')
  const c = coordinates.find((cor) => cor.label == 'P')
  const d = coordinates.find((cor) => cor.label == 'Or')
  // 计算UN向量
  const vectorUN = { x: b.x - a.x, y: b.y - a.y }

  // 计算MP向量
  const vectorMP = { x: d.x - c.x, y: d.y - c.y }

  // 计算UN和MP向量的点积
  const dotProduct = vectorUN.x * vectorMP.x + vectorUN.y * vectorMP.y

  // 计算UN和MP向量的模长
  const magnitudeUN = Math.sqrt(vectorUN.x ** 2 + vectorUN.y ** 2)
  const magnitudeMP = Math.sqrt(vectorMP.x ** 2 + vectorMP.y ** 2)

  // 计算夹角（弧度）
  const angleRad = Math.acos(dotProduct / (magnitudeUN * magnitudeMP))

  // 将弧度转换为角度
  const angleDeg = angleRad * (180 / Math.PI)

  return angleDeg
}
// 计算ODI
export function calculateODI(coordinates) {
  const angle1 = calculateFourPointsAngle('ODI', coordinates)
  const angle2 = calculateCommonAngle(coordinates)
  return angle1 + (180 - angle2)
}
export function calculateAPDI(coordinates) {
  const angle1 = calculateFourPointsAngle('APDIAngle1', coordinates)
  const angle2 = calculateFourPointsAngle('APDIAngle2', coordinates)
  const angle3 = calculateCommonAngle(coordinates)
  return angle1 + angle2 + angle3
}
// 计算三个点的角度（以度为单位）
export function calculateThreePointsAngle(str, coordinates) {
  let arr
  if (str.includes('-')) {
    arr = str.split('-').filter((a) => a !== '-')
  } else {
    arr = str.split('')
  }
  const a = coordinates.find((cor) => {
    if (arr[0] === 'Na') {
      return cor.label == 'N'
    } else {
      return cor.label == arr[0]
    }
  })
  const b = coordinates.find((cor) => cor.label == arr[1])
  const c = coordinates.find((cor) => cor.label == arr[2])

  // 计算向量ab和向量bc的坐标差
  const vectorAB = { x: b.x - a.x, y: b.y - a.y }
  const v_MU6L6_MU1L1 = { x: c.x - b.x, y: c.y - b.y }

  // 计算向量ab和向量bc的长度
  const lengthAB = Math.sqrt(vectorAB.x * vectorAB.x + vectorAB.y * vectorAB.y)
  const lengthBC = Math.sqrt(v_MU6L6_MU1L1.x * v_MU6L6_MU1L1.x + v_MU6L6_MU1L1.y * v_MU6L6_MU1L1.y)

  // 计算向量ab和向量bc的点积
  const dotProduct = vectorAB.x * v_MU6L6_MU1L1.x + vectorAB.y * v_MU6L6_MU1L1.y

  // 计算夹角的弧度值
  const angleInRadians = Math.acos(dotProduct / (lengthAB * lengthBC))

  // 将弧度值转换为角度值
  const angleInDegrees = (angleInRadians * 180) / Math.PI

  return 180 - angleInDegrees
}
export function calculateDistanceRatio(str, coordinates) {
  // 提取距离
  const arr = str.split('/')
  const str1 = arr[0]
  const str2 = arr[1]
  const distance1 = calculateDistance(str1, coordinates)
  const distance2 = calculateDistance(str2, coordinates)

  // 计算距离比例
  const ratio = distance1 / (distance2 !== 0 ? distance2 : 1.0)
  return ratio * 100
}
export function calculateDistance(str, coordinates) {
  let arr
  if (str.includes('-')) {
    arr = str.split('-').filter((a) => a !== '-')
  } else {
    arr = str.split('')
  }

  const a = coordinates.find((a) => a.label == arr[0])
  const b = coordinates.find((a) => a.label == arr[1])
  const deltaX = b.x - a.x
  const deltaY = b.y - a.y
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  return distance
}

export function calculateFourPointsAngle(str, coordinates) {
  let a, b, c, d
  if (str == 'U1-SN') {
    a = coordinates.find((cor) => cor.label == 'UI')
    b = coordinates.find((cor) => cor.label == 'UI_1')
    c = coordinates.find((cor) => cor.label == 'S')
    d = coordinates.find((cor) => cor.label == 'N')
  }
  if (str == 'SN-MP') {
    a = coordinates.find((cor) => cor.label == 'S')
    b = coordinates.find((cor) => cor.label == 'N')
    c = coordinates.find((cor) => cor.label == 'Go_1')
    d = coordinates.find((cor) => cor.label == 'Me')
  }
  if (str == 'L1-MP') {
    a = coordinates.find((cor) => cor.label == 'LI')
    b = coordinates.find((cor) => cor.label == 'LI_1')
    c = coordinates.find((cor) => cor.label == 'Go_1')
    d = coordinates.find((cor) => cor.label == 'Me')
  }
  if (str == 'FH-MP') {
    a = coordinates.find((cor) => cor.label == 'P')
    b = coordinates.find((cor) => cor.label == 'Or')
    c = coordinates.find((cor) => cor.label == 'Go_1')
    d = coordinates.find((cor) => cor.label == 'Me')
  }
  if (str == 'ODI') {
    a = coordinates.find((cor) => a.label == 'A')
    b = coordinates.find((cor) => a.label == 'B')
    c = coordinates.find((cor) => a.label == 'Go')
    d = coordinates.find((cor) => a.label == 'Gn')
  }
  if (str == 'APDIAngle1') {
    a = coordinates.find((cor) => a.label == 'N')
    b = coordinates.find((cor) => a.label == 'P')
    c = coordinates.find((cor) => a.label == 'P')
    d = coordinates.find((cor) => a.label == 'Or')
  }
  if (str == 'APDIAngle2') {
    a = coordinates.find((cor) => cor.label == 'A')
    b = coordinates.find((cor) => cor.label == 'B')
    c = coordinates.find((cor) => cor.label == 'N')
    d = coordinates.find((cor) => cor.label == 'P')
  }
  // 计算UN向量
  const vectorUN = { x: b.x - a.x, y: b.y - a.y }

  // 计算MP向量
  const vectorMP = { x: d.x - c.x, y: d.y - c.y }

  // 计算UN和MP向量的点积
  const dotProduct = vectorUN.x * vectorMP.x + vectorUN.y * vectorMP.y

  // 计算UN和MP向量的模长
  const magnitudeUN = Math.sqrt(vectorUN.x ** 2 + vectorUN.y ** 2)
  const magnitudeMP = Math.sqrt(vectorMP.x ** 2 + vectorMP.y ** 2)

  // 计算夹角（弧度）
  const angleRad = Math.acos(dotProduct / (magnitudeUN * magnitudeMP))

  // 将弧度转换为角度
  const angleDeg = angleRad * (180 / Math.PI)

  return angleDeg
}
// 计算垂足点
function findFootPointCoordinates(A, B, C) {
  // 向量 BC
  const BC = { x: C.x - B.x, y: C.y - B.y }

  // 向量 BA
  const BA = { x: A.x - B.x, y: A.y - B.y }

  // 计算投影向量的长度
  const projectionLength = (BA.x * BC.x + BA.y * BC.y) / (BC.x * BC.x + BC.y * BC.y)

  // 计算垂足点的坐标
  const footPointX = B.x + projectionLength * BC.x
  const footPointY = B.y + projectionLength * BC.y

  return { x: footPointX, y: footPointY }
}
export function calculateWits(A, B, U1, L1, U6, L6, standardDistance) {
  const M_U6L6 = {
    x: (U6.x + L6.x) / 2,
    y: (U6.y + L6.y) / 2
  }
  const M_U1L1 = {
    x: (U1.x + L1.x) / 2,
    y: (U1.y + L1.y) / 2
  }
  // 计算U6L6中点到U1L1中点的方向向量
  const v_MU6L6_MU1L1 = {
    x: M_U1L1.x - M_U6L6.x,
    y: M_U1L1.y - M_U6L6.y
  }
  const A_foot = findFootPointCoordinates(A, M_U6L6, M_U1L1)
  const B_foot = findFootPointCoordinates(B, M_U6L6, M_U1L1)
  const deltaX = B_foot.x - A_foot.x
  const deltaY = B_foot.y - A_foot.y
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  if (B_foot.x > A_foot.x) {
    return (distance * 20) / standardDistance
  } else {
    return (-distance * 20) / standardDistance
  }

  // const vectorAtoLine = { x: A.x - M_U6L6.x, y: A.y - M_U6L6.y }

  // // 计算投影长度
  // const dotProduct = vectorAtoLine.x * v_MU6L6_MU1L1.x + vectorAtoLine.y * v_MU6L6_MU1L1.y
  // const projectionLength = dotProduct / (v_MU6L6_MU1L1.x * v_MU6L6_MU1L1.x + v_MU6L6_MU1L1.y * v_MU6L6_MU1L1.y)

  // const xFoot = A.x + projectionLength * v_MU6L6_MU1L1.x;
  // const yFoot = A.y + projectionLength * v_MU6L6_MU1L1.y;

  // const A_foot = { x: xFoot, y: yFoot }
  // const vectorBtoLine = [B.x - M_U6L6.x, B.y - M_U6L6.y];
  // // 计算投影长度
  // const dotProduct1 = vectorBtoLine[0] * v_MU6L6_MU1L1.x + vectorBtoLine[1] * v_MU6L6_MU1L1.y;
  // const projectionLength1 = dotProduct1 / (v_MU6L6_MU1L1.x * v_MU6L6_MU1L1.x + v_MU6L6_MU1L1.y * v_MU6L6_MU1L1.y);

  // const xFoot1 = B.x + projectionLength1 * v_MU6L6_MU1L1.x;
  // const yFoot1 = B.y + projectionLength1 * v_MU6L6_MU1L1.y;

  // const B_foot = { x: xFoot1, y: yFoot1 }
  // const deltaX = B_foot.x - A_foot.x;
  // const deltaY = B_foot.y - A_foot.y;
  // const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  // if (B_foot.x > A_foot.x) {
  //   return distance
  // } else {
  //   return -distance
  // }
}
calculateWits(
  { x: 1, y: 2 },
  { x: -1, y: -2 },
  { x: 2, y: 1 },
  { x: 2, y: -1 },
  { x: -2, y: -1 },
  { x: -2, y: 1 }
)
// 计算垂足距离
export function perpendicularDistance(pointA, pointB, pointC) {
  // 计算线段BC的长度
  const lengthBC = Math.sqrt(Math.pow(pointB.x - pointC.x, 2) + Math.pow(pointB.y - pointC.y, 2))

  // 计算点A到点B的向量
  const vectorAB = { x: pointB.x - pointA.x, y: pointB.y - pointA.y }

  // 计算点A到点C的向量
  const vectorAC = { x: pointC.x - pointA.x, y: pointC.y - pointA.y }

  // 计算点A到线段BC的垂线的长度
  const distance = Math.abs((vectorAB.x * vectorAC.y - vectorAB.y * vectorAC.x) / lengthBC)

  return distance
}

//
export function calculateDistanceEffect(a, b) {
  const deltaX = b.x - a.x
  const deltaY = b.y - a.y
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  return distance
}
// 计算五眼

export function faceLeft() {}
export function faceRight() {}
// 计算三庭距离
export function averageThreeCourts(faceSet) {
  const foreHead = faceSet.find((point) => point.label == 'forehead_center')
  const chin = faceSet.find((point) => point.label == 'chin_2')
  return calculateDistanceEffect(foreHead, chin) / 3
}
