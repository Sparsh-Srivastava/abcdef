import { makeAutoObservable } from "mobx";
import { createContext } from "react";

interface Authorization {
	access_token: string;
}

class AuthStore {
	authorization: Authorization | undefined = {
		access_token: localStorage.getItem("access_token") || "",
	};
	authenticated: boolean = false;

	constructor() {
		makeAutoObservable(this);
	}

	setAuthorization = (authorization: Authorization) => {
		this.authorization = authorization;
		localStorage.setItem("access_token", authorization.access_token);
		console.log("Set_token: ", authorization);
	};
	setAuthenticated = (val: boolean) => {
		this.authenticated = val;
		console.log("Set Authenticate: ", val);
	};
	removeAuthorization = () => {
		this.authorization = undefined;
		this.authenticated = false;
		localStorage.removeItem("access_token");
		console.log("Log: Removed authorization");
	};
}

export default createContext(new AuthStore());
