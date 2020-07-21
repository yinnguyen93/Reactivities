import { IActivity } from "./../models/activity";
import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = "http://localhost:5000/api";

const responseBody = (response: AxiosResponse) => response.data;

/////////////////////////////////////////////////////////////////////////////
////////// Add function to delay request for delevelopment purpose //////////
const sleep = (milisecond: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) => setTimeout(() => resolve(response), milisecond)
  );

const delayTime = 1000;
const delay = sleep(delayTime);
/////////////////////////////////////////////////////////////////////////////

const requests = {
  get: (url: string) => axios.get(url).then(delay).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(delay).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(delay).then(responseBody),
  delete: (url: string) => axios.delete(url).then(delay).then(responseBody),
};

const Activities = {
  list: (): Promise<IActivity[]> => requests.get("/activities"),
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post("/activities", activity),
  update: (activity: IActivity) =>
    requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.delete(`/activities/${id}`),
};

export default {
  Activities,
};
