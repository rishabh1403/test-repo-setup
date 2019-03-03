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
