import { NotFoundException } from '@nestjs/common';

export const checkIfExistsAndReturn = (
  model: any,
  message: string,
  actual?: any,
) => {
  if (model) {
    return actual ?? model;
  } else {
    throw new NotFoundException(message);
  }
};

export const isPointInsidePolygon = (point, polygon) => {
  const x = point.lat;
  const y = point.lng;

  let isInside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat;
    const yi = polygon[i].lng;
    const xj = polygon[j].lat;
    const yj = polygon[j].lng;

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) isInside = !isInside;
  }

  return isInside;
};
