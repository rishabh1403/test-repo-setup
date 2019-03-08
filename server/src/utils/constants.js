export default Object.freeze({
  HTTP_SUCCESS_OK: 200,
  HTTP_CREATED: 201,
  HTTP_INTERNAL_SERVER_ERROR: 500,
});

export const httpMethods = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  delete: 'DELETE',
};

export const httpStatuses = {
  SUCCESS_OK_200: 200,
  CREATED_201: 201,
  BAD_REQUEST_400: 400,
  UNAUTHORIZED_401: 401,
  INTERNAL_SERVER_ERROR_500: 500,
};

export const gameConstants = {
  ROWS: 26,
  COLS: 26,
  EMPTY: 0,
  SNAKE: 1,
  FOOD: 2,
  LEFT: 0,
  UP: 1,
  RIGHT: 2,
  DOWN: 3,
  KEY_LEFT: 37,
  KEY_UP: 38,
  KEY_RIGHT: 39,
  KEY_DOWN: 40,
}
