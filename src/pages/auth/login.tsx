"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input, Button, Label } from "@/components";
import { logger, useGetTokenMutation } from "@/global/service";
import { useAppDispatch } from "@/hooks/store";
import { useNavigate } from "react-router-dom";
import { setSampleState } from "@/global/reducers";
import { tokenManager } from "@/utils/token.utils";
import incedeLogo from "@/assets/indel-money-logo-round.png";
import { useState } from "react";

const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

type LoginFormData = yup.InferType<typeof schema>;
type ManualLoginFormData = {
  accessToken: string;
  refreshToken?: string;
};

export function LoginForm() {
  const [getToken, { isLoading }] = useGetTokenMutation();
  const navigate = useNavigate();
  const [isManualMode, setIsManualMode] = useState(false);

  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const {
    register: registerManual,
    handleSubmit: handleSubmitManual,
    formState: { errors: manualErrors },
  } = useForm<ManualLoginFormData>({
    defaultValues: {
      accessToken: "",
      refreshToken: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      const tokenResponse = await getToken({
        grant_type: "password",
        client_id: "incede-frontend",
        username: data.username,
        password: data.password,
      }).unwrap();

      dispatch(
        setSampleState({
          val: "user success fully login",
        })
      );

      if (tokenResponse.access_token) {
        // Store tokens using token manager
        tokenManager.storeTokens({
          access_token: tokenResponse.access_token,
          refresh_token: tokenResponse.refresh_token,
          expires_in: tokenResponse.expires_in,
          token_type: tokenResponse.token_type,
        });

        navigate("/customer/management/onboarding/kyc-document");
      }
    } catch (err: unknown) {
      logger.error(err);
    }
  }

  async function onManualSubmit(data: ManualLoginFormData) {
    try {
      // Clear existing tokens first
      tokenManager.clearTokens();

      // Manually store tokens
      tokenManager.storeTokens({
        access_token: data.accessToken,
        refresh_token: data.refreshToken || "",
        expires_in: 3600, // 1 hour default
        token_type: "Bearer",
      });

      dispatch(
        setSampleState({
          val: "user success fully login (manual)",
        })
      );

      navigate("/customer/management/onboarding/kyc-document");
    } catch (err: unknown) {
      logger.error(err);
    }
  }

  return (
    <div className="bg-card border-border relative mt-28 min-w-[350px] rounded-md border p-6 shadow-xs md:min-w-[250px] md:p-3 lg:min-w-[350px] lg:p-6 ">
      <img
        src={incedeLogo}
        alt="Incede Logo"
        className="absolute -top-[80px] left-1/2 w-[110px] -translate-x-1/2 md:-top-[60px]  md:w-[80px]  lg:-top-[80px] lg:w-[110px]"
      />
      <div className="mb-4 flex justify-center pt-5 md:pt-3 lg:pt-5">
        <div className="border-border bg-muted flex rounded-full border p-1">
          <button
            type="button"
            onClick={() => setIsManualMode(false)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              !isManualMode
                ? "bg-theme-primary text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsManualMode(true)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              isManualMode
                ? "bg-theme-primary text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Manual
          </button>
        </div>
      </div>

      {!isManualMode ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-1">
              <Label
                htmlFor="username"
                className="text-foreground text-xs font-medium"
              >
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                size="md"
                width="full"
                variant="default"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-destructive text-xs">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="password"
                className="text-foreground text-xs font-medium"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                size="md"
                width="full"
                variant="default"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-destructive text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            variant="default"
            size="default"
            disabled={isLoading}
            className="mt-4 flex w-full items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-3 w-3 animate-spin rounded-full border-b border-white"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      ) : (
        <form
          onSubmit={handleSubmitManual(onManualSubmit)}
          className="space-y-4"
        >
          <div className="space-y-3">
            <div className="space-y-1">
              <Label
                htmlFor="accessToken"
                className="text-foreground text-xs font-medium"
              >
                Access Token
              </Label>
              <input
                id="accessToken"
                type="text"
                placeholder="Paste your access token here"
                className="border-input bg-background focus:border-ring focus:ring-ring/50 w-full rounded-md border px-3 py-2 text-sm transition-colors focus:ring-2"
                {...registerManual("accessToken")}
              />
              {manualErrors.accessToken && (
                <p className="text-destructive text-xs">
                  {manualErrors.accessToken.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="refreshToken"
                className="text-foreground text-xs font-medium"
              >
                Refresh Token (Optional)
              </Label>
              <input
                id="refreshToken"
                type="text"
                placeholder="Paste your refresh token here (optional)"
                className="border-input bg-background focus:border-ring focus:ring-ring/50 w-full rounded-md border px-3 py-2 text-sm transition-colors focus:ring-2"
                {...registerManual("refreshToken")}
              />
              {manualErrors.refreshToken && (
                <p className="text-destructive text-xs">
                  {manualErrors.refreshToken.message}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" variant="default" size="full" className="mt-4">
            Set Token & Login
          </Button>
        </form>
      )}

      {/* Footer */}
      <div className="border-border mt-4 border-t pt-4">
        <div className="text-center">
          {isManualMode ? (
            <p className="text-muted-foreground text-xs">
              Paste your access token and refresh token manually
            </p>
          ) : (
            <p className="text-muted-foreground text-xs">
              Need help? Contact your system administrator
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
