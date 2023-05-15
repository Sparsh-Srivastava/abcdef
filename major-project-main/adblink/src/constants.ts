// @ts-ignore
import ONBOARD_BG from "./assets/onboard.svg";
// @ts-ignore
import LOGO from "./assets/logo.svg";
// @ts-ignore
import IMG_UPLOAD from "./assets/imgupload.png";

const Assets = {
  ICONS: {
    LOGO,
  },
  ONBOARD_BG,
  IMG_UPLOAD,
};

const API = {
  BASE_URL: "http://localhost:5050/api",
  ENDPOINTS: {
    AUTH: {
      SIGNUP: () => `/users`,
      SIGNIN: () => `/users/login`,
    },
    USER: {
      GET_USER: () => `/users`,
    },
    POST: {
      GET_ALL_POSTS: () => `/posts`,
      UPLOAD: () => `/posts/upload`,
      CREATE_POST: () => `/posts`,
    },
  },
};

export { Assets, API };
