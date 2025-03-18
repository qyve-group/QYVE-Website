"use client";

import LoginForm from "@/components/LoginForm";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react"; 

const LoginPage = () => {

  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!auth.loading) {
      router.push("/home");  // Redirect to home if logged in
    }
  }, [auth.loading, router]);

  // Prevent rendering LoginForm if user is logged in
  if (!auth.loading) return null;

  return <LoginForm />;
}

export default LoginPage;

