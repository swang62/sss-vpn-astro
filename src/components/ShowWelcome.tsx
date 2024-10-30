import { useEffect } from "react";
import { useCookies } from "react-cookie";

interface Props {}

function ShowWelcome(_props: Props) {
  const [cookies, setCookie] = useCookies(["showedWelcome"]);
  console.debug(cookies);
  const shouldShowWelcome = !cookies?.showedWelcome;

  useEffect(() => {
    return () => {
      setCookie("showedWelcome", "true", { maxAge: 2147483647, path: "/dashboard", sameSite: "strict" });
    };
  }, []);

  return shouldShowWelcome && (
    <p className="w-full px-4 py-3 rounded-lg bg-muted">
      Welcome! Looks like it's your first time here. This is your homepage which
      contains important information about your current usage. Visit this
      {" "}
      <a href="/dashboard/install" className="text-secondary-link underline">link</a>
      {" "}
      for instructions on how to get connected to the VPN.
    </p>
  )
  ;
}

export default ShowWelcome;
