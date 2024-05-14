export const API_KEY = "4c35a7c6-44b8-4208-93e1-67e4a791137a";

export const API_BASE = "https://v2.api.noroff.dev";
export const API_AUTH = "/auth";
export const API_REGISTER = "/register";
export const API_LOGIN = "/login";
export const API_KEY_URL = "/create-api-key";
const BIDS_BY_PROFILE_ENDPOINT = "/auction/profiles/";
export const API_ALL_PROFILES = API_BASE + "/auction/profiles"; //get
export const API_MY_PROFILE = (name) => `${API_BASE}/auction/profiles/${name}`;
export const API_MY_LISTINGS = (name) =>
  `${API_BASE}/auction/profiles/${name}/listings`;
export const API_LISTINGS = API_BASE + "/auction/listings"; //get
export const API_SINGLE_LISTING = (postId) =>
  `${API_BASE}/auction/listings/${postId}?_bids=true`;
export const API_CREATE_LISTING = "/auction/listings"; //post
export const API_BID = (postId) =>
  `${API_BASE}/auction/listings/${postId}/bids?_bids=true`;
export const API_SEARCH = "/auction/listings/search?q=<query>"; //search listing title or descrtiption
export const API_BID_PROFILE = (profileName) => {
  return `${API_BASE}${BIDS_BY_PROFILE_ENDPOINT}${profileName}/bids`;
};
