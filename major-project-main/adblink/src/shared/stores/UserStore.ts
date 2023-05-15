import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { User } from "../models/UserModel";

class UserStore {
	user: User | undefined = undefined;

	constructor() {
		makeAutoObservable(this);
	}

	setUser = (user: User | undefined) => {
		this.user = user;
	};

	get updateUserDetails() {
		return this.user;
	}
}

export default createContext(new UserStore());
