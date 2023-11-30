const handleErrorCodeMessage = (errorCode, errorMsg) => {
  let message = '';
  switch (errorCode) {
    case 400:
      message = 'Bad Request';
      break;
    case 401:
      message = 'Unauthorized';
      break;
    case 403:
      message = 'Forbidden';
      break;
    case 404:
      message = 'Not Found';
  }
}