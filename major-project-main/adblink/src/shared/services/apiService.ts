import axios, { AxiosInstance } from "axios";
import { API } from "../../constants";
import { LoginInDetails, Post, SignUpDetails } from "../models";

export class APIService {
	private static _instance: APIService;
	private instance: AxiosInstance;

	constructor() {
		this.instance = axios.create({
			baseURL: API.BASE_URL,
			headers: {
				"Content-Type": "application/json",
			},
		});

		this.instance.interceptors.request.use(
			(config) => {
				const token = localStorage.getItem("access_token");
				if (token) {
					config.headers.Authorization = token;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);
	}

	public static getInstance(): APIService {
		if (!APIService._instance) {
			APIService._instance = new APIService();
		}
		return APIService._instance;
	}

	async logInUser(logInDetails: LoginInDetails) {
		return this.instance.post(API.ENDPOINTS.AUTH.SIGNIN(), logInDetails);
	}

	async signUpUser(signUpDetails: SignUpDetails) {
		return this.instance.post(API.ENDPOINTS.AUTH.SIGNUP(), signUpDetails);
	}

	async getUser() {
		return this.instance.get(API.ENDPOINTS.USER.GET_USER());
	}

	async postFileUpload(file: any) {
		return this.instance.post(API.ENDPOINTS.POST.UPLOAD(), file);
	}

	async createPost(post: Post) {
		return this.instance.post(API.ENDPOINTS.POST.CREATE_POST(), post);
	}

	async getPosts() {
		return this.instance.get(API.ENDPOINTS.POST.GET_ALL_POSTS());
	}
}
