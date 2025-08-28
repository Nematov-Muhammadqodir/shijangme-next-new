import { useReactiveVar } from "@apollo/client";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { userVar } from "../../apollo/store";
import { logIn, signUp } from "../../libs/auth";
import { MemberType } from "../../libs/enums/member.enum";
import { sweetMixinErrorAlert } from "../../libs/types/sweetAlert";
import withLayoutMain from "../../libs/components/layout/LayoutHome";

const Join = () => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [input, setInput] = useState({
    nick: "",
    password: "",
    phone: "",
    type: "USER",
  });
  const [loginView, setLoginView] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState(false);
  /** HANDLERS **/
  const viewChangeHandler = (state: boolean) => {
    setIsAnimating(true); // Start fade-out
    setTimeout(() => {
      setLoginView(state); // Change view after fade-out
      setIsAnimating(false); // Fade-in new content
    }, 300); // 300ms fade duration (must match CSS)
  };

  const checkUserTypeHandler = (e: any) => {
    const checked = e.target.checked;
    if (checked) {
      const value = e.target.name;
      handleInput("type", value);
    } else {
      handleInput("type", "USER");
    }
  };

  const handleInput = useCallback((name: any, value: any) => {
    setInput((prev) => {
      return { ...prev, [name]: value };
    });
  }, []);

  const doLogin = useCallback(async () => {
    console.warn(input);
    try {
      await logIn(input.nick, input.password);
      if (user?.memberType === MemberType.ADMIN) {
        await router.push(`${"/_admin/users"}`);
      } else {
        await router.push(`${router.query.referrer ?? "/"}`);
      }
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    }
  }, [input]);

  const doSignUp = useCallback(async () => {
    console.log("signup", input);
    try {
      await signUp(input.nick, input.password, input.phone, input.type);
      await router.push(`${router.query.referrer ?? "/"}`);
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    }
  }, [input]);
  return (
    <div className="join-main-container">
      <Stack className="container">
        <Stack className="login-form-main">
          <Stack className="left-config">
            <div className={"info"}>
              <span>{loginView ? "login" : "signup"}</span>
              <p>
                {loginView ? "Login" : "Sign"} in with this account across the
                following sites.
              </p>
            </div>
            <Box
              className={`input-content-wrapper ${isAnimating ? "hidden" : ""}`}
            >
              <Box className={"input-wrap"}>
                <div className={"input-box"}>
                  <span>Nickname</span>
                  <input
                    type="text"
                    placeholder={"Enter Nickname"}
                    onChange={(e) => handleInput("nick", e.target.value)}
                    required={true}
                    onKeyDown={(event) => {
                      if (event.key == "Enter" && loginView) doLogin();
                      if (event.key == "Enter" && !loginView) doSignUp();
                    }}
                  />
                </div>
                <div className={"input-box"}>
                  <span>Password</span>
                  <input
                    type="text"
                    placeholder={"Enter Password"}
                    onChange={(e) => handleInput("password", e.target.value)}
                    required={true}
                    onKeyDown={(event) => {
                      if (event.key == "Enter" && loginView) doLogin();
                      if (event.key == "Enter" && !loginView) doSignUp();
                    }}
                  />
                </div>
                {!loginView && (
                  <div className={"input-box"}>
                    <span>Phone</span>
                    <input
                      type="text"
                      placeholder={"Enter Phone"}
                      onChange={(e) => handleInput("phone", e.target.value)}
                      required={true}
                      onKeyDown={(event) => {
                        if (event.key == "Enter") doSignUp();
                      }}
                    />
                  </div>
                )}
              </Box>
            </Box>

            <Box className={"register"}>
              {!loginView && (
                <div className={"type-option"}>
                  <span className={"text"}>I want to be registered as:</span>
                  <div>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            name={"USER"}
                            onChange={checkUserTypeHandler}
                            checked={input?.type == "USER"}
                          />
                        }
                        label="User"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            name={"VENDOR"}
                            onChange={checkUserTypeHandler}
                            checked={input?.type == "VENDOR"}
                          />
                        }
                        label="Vendor"
                      />
                    </FormGroup>
                  </div>
                </div>
              )}

              {loginView && (
                <div className={"remember-info"}>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox defaultChecked size="small" />}
                      label="Remember me"
                    />
                  </FormGroup>
                  <a>Lost your password?</a>
                </div>
              )}

              {loginView ? (
                <Button
                  variant="contained"
                  disabled={input.nick == "" || input.password == ""}
                  onClick={doLogin}
                >
                  LOGIN
                </Button>
              ) : (
                <Button
                  variant="contained"
                  disabled={
                    input.nick == "" ||
                    input.password == "" ||
                    input.phone == "" ||
                    input.type == ""
                  }
                  onClick={doSignUp}
                >
                  SIGNUP
                </Button>
              )}
            </Box>
            <Box className={"ask-info"}>
              {loginView ? (
                <p>
                  Not registered yet?
                  <b
                    onClick={() => {
                      viewChangeHandler(false);
                    }}
                  >
                    SIGNUP
                  </b>
                </p>
              ) : (
                <p>
                  Have account?
                  <b onClick={() => viewChangeHandler(true)}> LOGIN</b>
                </p>
              )}
            </Box>
          </Stack>
          <Stack className="right-config">
            <img src="/img/general/green.jpg" alt="" className="green" />
            <Stack className="right-config-layout">
              <span className="login-intro">
                Start your journey by <br /> one click, explore <br /> beautiful
                world!
              </span>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default withLayoutMain(Join);
