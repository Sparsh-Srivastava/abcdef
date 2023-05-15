import React, { useContext, useEffect, useState } from "react";
import { FaFacebookF, FaGoogle, FaLinkedinIn } from "react-icons/fa";
import { MdPerson, MdLock, MdMailOutline } from "react-icons/md";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import "./Onboard.scss";
import { APIService } from "../../shared/services/apiService";
import { LoginInDetails, SignUpDetails } from "../../shared/models";
import { Loading } from "../../shared/components";
import { toast } from "react-toastify";
import { AuthStore as AuthStoreContext } from "../../shared/stores";
import { observer } from "mobx-react-lite";

const Onboard = () => {
  const [onBoardType, setOnBoardType] = useState<"signin" | "signup">("signup");
  const [loading, setLoading] = useState<boolean>(true);
  const authStore = useContext(AuthStoreContext);
  const [signUpDetails, setSignUpDetails] = useState<SignUpDetails>({
    email: "",
    name: "",
    password: "",
  });
  const [logInDetails, setlogInDetails] = useState<LoginInDetails>({
    email: "",
    password: "",
  });
  const [forgotPasswordModal, setForgotPasswordModal] =
    useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    console.log("Loading..", loading);
    if (authStore.authenticated) {
      history.push("/home");
    }
    setLoading(false);
  }, [history, authStore.authenticated]);

  const onBoardUser = async () => {
    setLoading(true);
    let accessToken = "";
    try {
      if (onBoardType === "signup") {
        await APIService.getInstance().signUpUser(signUpDetails);
        const {
          data: { token },
        } = await APIService.getInstance().logInUser({
          email: signUpDetails.email,
          password: signUpDetails.password,
        });
        accessToken = token;
      } else {
        const {
          data: { token },
        } = await APIService.getInstance().logInUser(logInDetails);
        accessToken = token;
      }
      authStore.setAuthorization({ access_token: accessToken });
      authStore.setAuthenticated(true);
      history.push("/home");
      toast.success("Signed In Successfully");
    } catch (error) {
      toast.error(error.response?.data.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="srm-onboard">
      {loading ? (
        <Loading />
      ) : (
        <div
          className={classNames("board", { alter: onBoardType === "signin" })}
        >
          {forgotPasswordModal && (
            <div className="forgot-password">
              <form>
                <div>
                  <MdMailOutline />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    required
                  />
                </div>
                <button type="submit">Get Reset Link</button>
              </form>
            </div>
          )}
          <div className="asset">
            {/* <img src={Assets.ONBOARD_BG} alt="img" /> */}
          </div>
          <div className="slider"></div>
          <div className="content">
            <h2>
              {onBoardType === "signup" ? "Welcome Back!" : "Hello Friend!"}
            </h2>
            <p>
              {onBoardType === "signup"
                ? "To keep connected with us please login your personal info"
                : "Enter your personal details and start your journey with us"}
            </p>
            <button
              onClick={() => {
                setOnBoardType(onBoardType === "signin" ? "signup" : "signin");
              }}
            >
              {onBoardType === "signin" ? "Sign Up" : "Sign In"}
            </button>
          </div>
          <div className="onboard-form">
            <h2>
              {onBoardType === "signup"
                ? "Create Account"
                : "Sign In to AdBlink"}
            </h2>
            {/* <div className="social-sign-in">
							<div>
								<FaFacebookF />
							</div>
							<div>
								<FaGoogle />
							</div>
							<div>
								<FaLinkedinIn />
							</div>
						</div> */}
            <p>or use your email for registration</p>
            <form>
              {onBoardType === "signup" && (
                <div>
                  <MdPerson />
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={signUpDetails?.name}
                    placeholder="Name"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setSignUpDetails({
                        ...signUpDetails,
                        name: e.target.value,
                      });
                    }}
                    required
                  />
                </div>
              )}
              <div>
                <MdMailOutline />
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={
                    onBoardType === "signup"
                      ? signUpDetails.email
                      : logInDetails.email
                  }
                  placeholder="Email"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (onBoardType === "signup") {
                      setSignUpDetails({
                        ...signUpDetails,
                        email: e.target.value,
                      });
                    } else {
                      setlogInDetails({
                        ...logInDetails,
                        email: e.target.value,
                      });
                    }
                  }}
                  required
                />
              </div>
              <div>
                <MdLock />
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={
                    onBoardType === "signup"
                      ? signUpDetails.password
                      : logInDetails.password
                  }
                  placeholder="Password"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (onBoardType === "signup") {
                      setSignUpDetails({
                        ...signUpDetails,
                        password: e.target.value,
                      });
                    } else {
                      setlogInDetails({
                        ...logInDetails,
                        password: e.target.value,
                      });
                    }
                  }}
                  required
                />
              </div>
              {/* {onBoardType === "signin" && (
							<p
								className="forgot-password"
								onClick={() => {
									setForgotPasswordModal(true);
								}}
							>
								Forgot your Password?
							</p>
						)} */}
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  onBoardUser();
                }}
              >
                {onBoardType === "signup" ? "Sign Up" : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default observer(Onboard);
